package com.travelplanner.controller;

import com.travelplanner.dto.SavedTripRequest;
import com.travelplanner.dto.SavedTripResponse;
import com.travelplanner.entity.SavedTrip;
import com.travelplanner.service.SavedTripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/saved-trips")
public class SavedTripController {

    @Autowired
    private SavedTripService savedTripService;

    // ✅ GET /api/saved-trips/user/{userId}
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavedTripResponse>> getSavedTrips(@PathVariable Long userId) {
        List<SavedTrip> savedTrips = savedTripService.getSavedTripsByUserId(userId);
        List<SavedTripResponse> response = savedTrips.stream()
                .map(SavedTripResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ✅ POST /api/saved-trips
    @PostMapping
    public ResponseEntity<?> saveTrip(@RequestBody SavedTripRequest request) {
        try {
            SavedTrip saved = savedTripService.saveTrip(
                    request.getUserId(),
                    request.getTripId(),
                    request.getNotes() != null ? request.getNotes() : ""
            );
            return ResponseEntity.ok(SavedTripResponse.fromEntity(saved));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ DELETE /api/saved-trips/user/{userId}/trip/{tripId}
    @DeleteMapping("/user/{userId}/trip/{tripId}")
    public ResponseEntity<?> unsaveTrip(@PathVariable Long userId, @PathVariable Long tripId) {
        try {
            savedTripService.unsaveTripByUserAndTrip(userId, tripId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ PUT /api/saved-trips/{savedTripId}/notes
    @PutMapping("/{savedTripId}/notes")
    public ResponseEntity<?> updateNotes(
            @PathVariable Long savedTripId,
            @RequestBody SavedTripRequest request) {

        try {
            SavedTrip updated = savedTripService.updateNotes(savedTripId, request.getNotes());
            return ResponseEntity.ok(SavedTripResponse.fromEntity(updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Optional: DELETE /api/saved-trips/{savedTripId}
    @DeleteMapping("/{savedTripId}")
    public ResponseEntity<?> deleteById(@PathVariable Long savedTripId) {
        try {
            savedTripService.unsaveTrip(savedTripId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
