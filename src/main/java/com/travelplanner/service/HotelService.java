package com.travelplanner.service;

import com.travelplanner.dto.HotelResponse;
import com.travelplanner.entity.Destination;
import com.travelplanner.entity.Trip;
import com.travelplanner.entity.TripDestination;
import com.travelplanner.repository.TripRepository;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.*;

@Service
public class HotelService {

    @Autowired
    private TripRepository tripRepository;

    private final String OPEN_TRIPMAP_KEY = "5ae2e3f221c38a28845f05b6479e5b543bc57757bbe58690c3e64236";
    private final String UNSPLASH_KEY = "TnRwUjj4rJiXqRFekOHnoFhRkYd-M70z1ZZl4K7IpzM";

    public List<HotelResponse> getRecommendationsByTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        List<TripDestination> destinations = trip.getTripDestinations();
        if (destinations == null || destinations.isEmpty()) return Collections.emptyList();

        double avgLat = destinations.stream()
                .mapToDouble(d -> d.getDestination().getLatitude().doubleValue())
                .average().orElse(0);
        double avgLon = destinations.stream()
                .mapToDouble(d -> d.getDestination().getLongitude().doubleValue())
                .average().orElse(0);

        return fetchNearbyHotels(avgLat, avgLon, destinations);
    }

    private List<HotelResponse> fetchNearbyHotels(double lat, double lon, List<TripDestination> tripDestinations) {
        List<HotelResponse> hotels = new ArrayList<>();
        HttpClient client = HttpClient.newHttpClient();

        try {
            String radiusUrl = String.format(
                "https://api.opentripmap.com/0.1/en/places/radius?radius=7000&lon=%f&lat=%f&kinds=accomodations&format=json&limit=15&apikey=%s",
                lon, lat, OPEN_TRIPMAP_KEY);

            HttpResponse<String> radiusRes = client.send(
                HttpRequest.newBuilder().uri(URI.create(radiusUrl)).build(),
                HttpResponse.BodyHandlers.ofString());

            JSONArray places = new JSONArray(radiusRes.body());

            for (int i = 0; i < places.length(); i++) {
                JSONObject place = places.getJSONObject(i);
                String xid = place.getString("xid");

                Thread.sleep(500); // avoid rate limit

                HttpResponse<String> detailRes = client.send(
                    HttpRequest.newBuilder()
                        .uri(URI.create("https://api.opentripmap.com/0.1/en/places/xid/" + xid + "?apikey=" + OPEN_TRIPMAP_KEY))
                        .build(),
                    HttpResponse.BodyHandlers.ofString());

                JSONObject detail = new JSONObject(detailRes.body());

                String name = detail.optString("name", "Unnamed Hotel");
                String address = Optional.ofNullable(detail.optJSONObject("address"))
                        .map(a -> a.optString("road", "No address")).orElse("No address");

                String imageUrl = Optional.ofNullable(detail.optJSONObject("preview"))
                        .map(p -> p.optString("source"))
                        .orElse(fetchUnsplashImage(name));

                JSONObject point = detail.optJSONObject("point");
                double hotelLat = point != null ? point.optDouble("lat", lat) : lat;
                double hotelLon = point != null ? point.optDouble("lon", lon) : lon;

                Map<String, Double> distances = new LinkedHashMap<>();
                double total = 0;

                for (TripDestination td : tripDestinations) {
                    Destination dest = td.getDestination();
                    double d = calculateDistance(hotelLat, hotelLon,
                            dest.getLatitude().doubleValue(), dest.getLongitude().doubleValue());
                    distances.put(dest.getName(), d);
                    total += d;
                }

                double avg = total / distances.size();
                double rating = detail.optDouble("rate", 0);

                String mapUrl = "https://www.google.com/maps/search/?api=1&query=" + hotelLat + "," + hotelLon;

                hotels.add(new HotelResponse(name, address, rating, avg, imageUrl, distances, mapUrl));
            }

            hotels.sort(Comparator.comparingDouble(HotelResponse::getAverageDistance));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return hotels;
    }

    private String fetchUnsplashImage(String name) {
        try {
            String query = URI.create(name).toASCIIString();
            String url = "https://api.unsplash.com/search/photos?query=" + query +
                    "&client_id=" + UNSPLASH_KEY;

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> res = client.send(
                    HttpRequest.newBuilder().uri(URI.create(url)).build(),
                    HttpResponse.BodyHandlers.ofString());

            JSONObject json = new JSONObject(res.body());
            JSONArray results = json.getJSONArray("results");

            if (results.length() > 0) {
                return results.getJSONObject(0)
                        .getJSONObject("urls")
                        .getString("small");
            }
        } catch (Exception e) {
            return "https://via.placeholder.com/400x200?text=Hotel";
        }

        return "https://via.placeholder.com/400x200?text=Hotel";
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }
}


