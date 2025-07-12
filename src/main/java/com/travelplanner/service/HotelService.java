package com.travelplanner.service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelplanner.dto.HotelResponse;
import com.travelplanner.entity.Destination;
import com.travelplanner.entity.Trip;
import com.travelplanner.entity.TripDestination;
import com.travelplanner.repository.TripRepository;

@Service
public class HotelService {

    @Autowired
    private TripRepository tripRepository;

    private final String OPEN_TRIPMAP_KEY = "5ae2e3f221c38a28845f05b6479e5b543bc57757bbe58690c3e64236";
    private final String UNSPLASH_KEY = "TnRwUjj4rJiXqRFekOHnoFhRkYd-M70z1ZZl4K7IpzM";
    private final String UNSPLASH_FALLBACK = "deaultHotel.jpg";

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
                "https://api.opentripmap.com/0.1/en/places/radius?radius=8000&lon=%f&lat=%f&kinds=accomodations&format=json&limit=20&apikey=%s",
                lon, lat, OPEN_TRIPMAP_KEY);

            HttpResponse<String> radiusRes = client.send(
                HttpRequest.newBuilder().uri(URI.create(radiusUrl)).build(),
                HttpResponse.BodyHandlers.ofString());

            JSONArray places = new JSONArray(radiusRes.body());

            for (int i = 0; i < places.length(); i++) {
                JSONObject place = places.getJSONObject(i);
                String xid = place.getString("xid");

                Thread.sleep(500); // OpenTripMap rate limit

                HttpResponse<String> detailRes = client.send(
                    HttpRequest.newBuilder()
                        .uri(URI.create("https://api.opentripmap.com/0.1/en/places/xid/" + xid + "?apikey=" + OPEN_TRIPMAP_KEY))
                        .build(),
                    HttpResponse.BodyHandlers.ofString());

                JSONObject detail = new JSONObject(detailRes.body());

                String name = detail.optString("name", "Unnamed Hotel");
                String address = Optional.ofNullable(detail.optJSONObject("address"))
                        .map(a -> a.optString("road", "No address")).orElse("No address");

                JSONObject point = detail.optJSONObject("point");
                double hotelLat = point != null ? point.optDouble("lat", lat) : lat;
                double hotelLon = point != null ? point.optDouble("lon", lon) : lon;

                // Distance to each destination
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

                // Use OpenTripMap preview image if available, else fetch from Unsplash
                String imageUrl = Optional.ofNullable(detail.optJSONObject("preview"))
                        .map(p -> p.optString("source"))
                        .orElse(fetchUnsplashImage(name, address));

                hotels.add(new HotelResponse(name, address, rating, avg, imageUrl, distances, mapUrl));
            }

            hotels.sort(Comparator.comparingDouble(HotelResponse::getAverageDistance));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return hotels;
    }

    private String fetchUnsplashImage(String name, String location) {
        try {
            String query = (name + " " + location).replaceAll(" ", "+");
            String url = "https://api.unsplash.com/search/photos?query=" + query +
                    "&client_id=" + UNSPLASH_KEY + "&per_page=1";

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> res = client.send(
                    HttpRequest.newBuilder().uri(URI.create(url)).build(),
                    HttpResponse.BodyHandlers.ofString());

            if (res.statusCode() == 429) {
                Thread.sleep(1500); // simple backoff if rate limited
                return UNSPLASH_FALLBACK;
            }

            JSONObject json = new JSONObject(res.body());
            JSONArray results = json.getJSONArray("results");

            if (results.length() > 0) {
                return results.getJSONObject(0)
                        .getJSONObject("urls")
                        .getString("small");
            }
        } catch (Exception e) {
            // Logging omitted for brevity
        }

        return UNSPLASH_FALLBACK;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // Earth radius
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    }
}
