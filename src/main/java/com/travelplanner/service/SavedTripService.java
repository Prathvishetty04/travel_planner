package com.travelplanner.service;

import com.travelplanner.entity.SavedTrip;
import com.travelplanner.entity.Trip;
import com.travelplanner.entity.User;
import com.travelplanner.repository.SavedTripRepository;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class SavedTripService {
    
    @Autowired
    private SavedTripRepository savedTripRepository;
    
    @Autowired
    private TripRepository tripRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<SavedTrip> getSavedTripsByUserId(Long userId) {
        return savedTripRepository.findByUserId(userId);
    }
    
    public SavedTrip saveTrip(Long userId, Long tripId, String notes) {
        // Check if already saved
        Optional<SavedTrip> existing = savedTripRepository.findByUserIdAndTripId(userId, tripId);
        if (existing.isPresent()) {
            throw new RuntimeException("Trip already saved");
        }
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        
        SavedTrip savedTrip = new SavedTrip();
        savedTrip.setUser(user);
        savedTrip.setTrip(trip);
        savedTrip.setNotes(notes);
        savedTrip.setSavedAt(LocalDateTime.now());
        
        return savedTripRepository.save(savedTrip);
    }
    
    public void unsaveTrip(Long savedTripId) {
        if (!savedTripRepository.existsById(savedTripId)) {
            throw new RuntimeException("Saved trip not found");
        }
        savedTripRepository.deleteById(savedTripId);
    }
    
    public void unsaveTripByUserAndTrip(Long userId, Long tripId) {
        Optional<SavedTrip> savedTrip = savedTripRepository.findByUserIdAndTripId(userId, tripId);
        if (savedTrip.isPresent()) {
            savedTripRepository.delete(savedTrip.get());
        } else {
            throw new RuntimeException("Saved trip not found");
        }
    }
    
    public SavedTrip updateNotes(Long savedTripId, String notes) {
        SavedTrip savedTrip = savedTripRepository.findById(savedTripId)
            .orElseThrow(() -> new RuntimeException("Saved trip not found"));
        
        savedTrip.setNotes(notes);
        return savedTripRepository.save(savedTrip);
    }
}