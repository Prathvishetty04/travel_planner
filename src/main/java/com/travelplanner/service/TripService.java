package com.travelplanner.service;

import com.travelplanner.dto.DestinationResponse;
import com.travelplanner.dto.TripRequest;
import com.travelplanner.dto.TripResponse;
import com.travelplanner.entity.Destination;
import com.travelplanner.entity.Trip;
import com.travelplanner.entity.TripDestination;
import com.travelplanner.entity.User;
import com.travelplanner.repository.DestinationRepository;
import com.travelplanner.repository.TripDestinationRepository;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private TripDestinationRepository tripDestinationRepository;

    // Get all trips for a user
    public List<TripResponse> getUserTrips(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Trip> trips = tripRepository.findByUserOrderByCreatedAtDesc(user);
        return trips.stream()
                .map(this::convertToTripResponse)
                .collect(Collectors.toList());
    }

    // Get one trip by ID
    public TripResponse getTripById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        return convertToTripResponse(trip);
    }

    // Create a new trip
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

    // Update a trip
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

    // Delete a trip
    public void deleteTrip(Long id) {
        if (!tripRepository.existsById(id)) {
            throw new RuntimeException("Trip not found");
        }
        tripRepository.deleteById(id);
    }

    // Add destination to trip
    public void addDestinationToTrip(Long tripId, Long destinationId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        boolean alreadyAdded = trip.getTripDestinations().stream()
                .anyMatch(td -> td.getDestination().getId().equals(destinationId));
        if (alreadyAdded) {
            throw new RuntimeException("Destination already added to this trip");
        }

        TripDestination tripDestination = new TripDestination();
        tripDestination.setTrip(trip);
        tripDestination.setDestination(destination);
        tripDestinationRepository.save(tripDestination);
    }

    // Get destinations for a trip (optional endpoint)
    public List<DestinationResponse> getDestinationsForTrip(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        return trip.getTripDestinations().stream()
                .map(td -> {
                    Destination d = td.getDestination();
                    DestinationResponse dr = new DestinationResponse();
                    dr.setId(d.getId());
                    dr.setName(d.getName());
                    dr.setCity(d.getCity());
                    dr.setCountry(d.getCountry());
                    dr.setDescription(d.getDescription());
                    dr.setCategory(d.getCategory().toString());
                    dr.setLatitude(d.getLatitude());
                    dr.setLongitude(d.getLongitude());
                    dr.setImageUrl(d.getImageUrl());
                    dr.setAverageRating(d.getAverageRating());
                    return dr;
                })
                .collect(Collectors.toList());
    }

    // Convert Trip entity to TripResponse including destinations
    private TripResponse convertToTripResponse(Trip trip) {
        TripResponse response = new TripResponse();
        response.setId(trip.getId());
        response.setTitle(trip.getTitle());
        response.setDescription(trip.getDescription());
        response.setStartDate(trip.getStartDate());
        response.setEndDate(trip.getEndDate());
        response.setBudget(trip.getBudget());
        response.setStatus(trip.getStatus().toString());
        response.setUserId(trip.getUser().getId());

        List<DestinationResponse> destinationResponses = trip.getTripDestinations().stream()
                .map(td -> {
                    Destination d = td.getDestination();
                    DestinationResponse dr = new DestinationResponse();
                    dr.setId(d.getId());
                    dr.setName(d.getName());
                    dr.setCity(d.getCity());
                    dr.setCountry(d.getCountry());
                    dr.setDescription(d.getDescription());
                    dr.setCategory(d.getCategory().toString());
                    dr.setLatitude(d.getLatitude());
                    dr.setLongitude(d.getLongitude());
                    dr.setImageUrl(d.getImageUrl());
                    dr.setAverageRating(d.getAverageRating());
                    return dr;
                })
                .collect(Collectors.toList());

        response.setDestinations(destinationResponses);
        return response;
    }
}
