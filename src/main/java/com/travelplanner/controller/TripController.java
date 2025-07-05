package com.travelplanner.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travelplanner.dto.DestinationResponse;
import com.travelplanner.dto.TripRequest;
import com.travelplanner.dto.TripResponse;
import com.travelplanner.service.TripService;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin(origins = "*")
public class TripController {

    @Autowired
    private TripService tripService;

    // Get all trips for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TripResponse>> getUserTrips(@PathVariable Long userId) {
        List<TripResponse> trips = tripService.getUserTrips(userId);
        return ResponseEntity.ok(trips);
    }

    // Get a single trip by ID
    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> getTripById(@PathVariable Long id) {
        TripResponse trip = tripService.getTripById(id);
        return ResponseEntity.ok(trip);
    }

    // Create a new trip
    @PostMapping
    public ResponseEntity<TripResponse> createTrip(@RequestBody TripRequest request) {
        TripResponse trip = tripService.createTrip(request);
        return ResponseEntity.ok(trip);
    }

    // Update an existing trip
    @PutMapping("/{id}")
    public ResponseEntity<TripResponse> updateTrip(@PathVariable Long id, @RequestBody TripRequest request) {
        TripResponse trip = tripService.updateTrip(id, request);
        return ResponseEntity.ok(trip);
    }

    // Delete a trip
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Add a destination to a trip
    @PostMapping("/{tripId}/destinations")
    public ResponseEntity<String> addDestinationToTrip(
            @PathVariable Long tripId,
            @RequestBody Map<String, Long> requestBody) {
        Long destinationId = requestBody.get("destinationId");
        tripService.addDestinationToTrip(tripId, destinationId);
        return ResponseEntity.ok("Destination added to trip");
    }

    // ✅ Get all destinations for a trip
    @GetMapping("/{tripId}/destinations")
    public ResponseEntity<List<DestinationResponse>> getTripDestinations(@PathVariable Long tripId) {
        List<DestinationResponse> destinations = tripService.getDestinationsForTrip(tripId);
        return ResponseEntity.ok(destinations);
    }
}
