package com.travelplanner.service;

import com.travelplanner.dto.DestinationResponse;
import com.travelplanner.dto.TripHotelRequest;
import com.travelplanner.dto.TripHotelResponse;
import com.travelplanner.dto.TripRequest;
import com.travelplanner.dto.TripResponse;
import com.travelplanner.entity.*;
import com.travelplanner.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {

    @Autowired private TripRepository tripRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private DestinationRepository destinationRepository;
    @Autowired private TripDestinationRepository tripDestinationRepository;
    @Autowired private TripHotelRepository tripHotelRepository;

    // ---------------- BASIC TRIP LOGIC ---------------- //

    public List<TripResponse> getUserTrips(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Trip> trips = tripRepository.findByUserOrderByCreatedAtDesc(user);
        return trips.stream().map(this::convertToTripResponse).collect(Collectors.toList());
    }

    public TripResponse getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        return convertToTripResponse(trip);
    }

    public TripResponse createTrip(TripRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = new Trip();
        trip.setUser(user);
        trip.setTitle(request.getTitle());
        trip.setDescription(request.getDescription());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setBudget(request.getBudget());
        trip.setStatus(Trip.TripStatus.PLANNING);

        trip = tripRepository.save(trip);
        return convertToTripResponse(trip);
    }

    public TripResponse updateTrip(Long id, TripRequest request) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        trip.setTitle(request.getTitle());
        trip.setDescription(request.getDescription());
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setBudget(request.getBudget());

        trip = tripRepository.save(trip);
        return convertToTripResponse(trip);
    }

    public void deleteTrip(Long id) {
        if (!tripRepository.existsById(id)) throw new RuntimeException("Trip not found");
        tripRepository.deleteById(id);
    }

    // ---------------- DESTINATION LOGIC ---------------- //

    public void addDestinationToTrip(Long tripId, Long destinationId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        boolean alreadyAdded = trip.getTripDestinations().stream()
                .anyMatch(td -> td.getDestination().getId().equals(destinationId));
        if (alreadyAdded) throw new RuntimeException("Destination already added to this trip");

        TripDestination td = new TripDestination();
        td.setTrip(trip);
        td.setDestination(destination);
        tripDestinationRepository.save(td);
    }

    public List<DestinationResponse> getDestinationsForTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        return trip.getTripDestinations().stream().map(td -> {
            Destination d = td.getDestination();
            DestinationResponse dr = new DestinationResponse();
            dr.setId(d.getId());
            dr.setName(d.getName());
            dr.setCity(d.getCity());
            dr.setCountry(d.getCountry());
            dr.setDescription(d.getDescription());
            dr.setCategory(d.getCategory());

            dr.setLatitude(d.getLatitude());
            dr.setLongitude(d.getLongitude());
            dr.setImageUrl(d.getImageUrl());
            dr.setAverageRating(d.getAverageRating());
            return dr;
        }).collect(Collectors.toList());
    }

    // ---------------- ✅ HOTEL LOGIC ---------------- //

    public void addHotelToTrip(Long tripId, TripHotelRequest request) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        TripHotel hotel = new TripHotel();
        hotel.setTrip(trip);
        hotel.setHotelName(request.getName());
        hotel.setAddress(request.getLocation());
        hotel.setImageUrl(request.getImageUrl());
        hotel.setRating(request.getRating());
        hotel.setAverageDistance(request.getDistance());

        tripHotelRepository.save(hotel);
    }

    public List<TripHotelResponse> getHotelsForTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        return trip.getTripHotels().stream().map(h -> {
            TripHotelResponse r = new TripHotelResponse();
            r.setId(h.getId());
            r.setName(h.getHotelName());
            r.setLocation(h.getAddress());
            r.setImageUrl(h.getImageUrl());
            r.setRating(h.getRating());
            r.setDistance(h.getAverageDistance());
            return r;
        }).collect(Collectors.toList());
    }

    // ---------------- CONVERSION ---------------- //

    private TripResponse convertToTripResponse(Trip trip) {
        TripResponse response = new TripResponse();
        response.setId(trip.getId());
        response.setTitle(trip.getTitle());
        response.setDescription(trip.getDescription());
        response.setStartDate(trip.getStartDate());
        response.setEndDate(trip.getEndDate());
        response.setBudget(trip.getBudget());
        response.setStatus(trip.getStatus().toString());
        //response.setUserId(trip.getUser().getId()); // ✅ Fixed: Set userId instead of overwriting id

        // Destinations
        List<DestinationResponse> destinationResponses = trip.getTripDestinations().stream()
                .map(td -> {
                    Destination d = td.getDestination();
                    DestinationResponse dr = new DestinationResponse();
                    dr.setId(d.getId());
                    dr.setName(d.getName());
                    dr.setCity(d.getCity());
                    dr.setCountry(d.getCountry());
                    dr.setDescription(d.getDescription());
                   dr.setCategory(d.getCategory());

                    dr.setLatitude(d.getLatitude());
                    dr.setLongitude(d.getLongitude());
                    dr.setImageUrl(d.getImageUrl());
                    dr.setAverageRating(d.getAverageRating());
                    return dr;
                })
                .collect(Collectors.toList());

        response.setDestinations(destinationResponses);

        // ✅ Trip Hotels
        List<TripHotelResponse> hotelResponses = trip.getTripHotels().stream().map(h -> {
            TripHotelResponse hr = new TripHotelResponse();
            hr.setId(h.getId());
            hr.setName(h.getHotelName());
            hr.setLocation(h.getAddress());
            hr.setImageUrl(h.getImageUrl());
            hr.setRating(h.getRating());
            hr.setDistance(h.getAverageDistance());
            return hr;
        }).collect(Collectors.toList());

        response.setHotels(hotelResponses);

        return response;
    }
}