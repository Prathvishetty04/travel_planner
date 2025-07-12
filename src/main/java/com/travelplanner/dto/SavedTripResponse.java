package com.travelplanner.dto;

import com.travelplanner.entity.SavedTrip;

import java.time.LocalDateTime;

public class SavedTripResponse {
    private Long id;
    private String notes;
    private LocalDateTime savedAt;
    private TripSummary trip;

    public SavedTripResponse() {}

    public static SavedTripResponse fromEntity(SavedTrip savedTrip) {
        SavedTripResponse dto = new SavedTripResponse();
        dto.setId(savedTrip.getId());
        dto.setNotes(savedTrip.getNotes());
        dto.setSavedAt(savedTrip.getSavedAt());

        if (savedTrip.getTrip() != null) {
            dto.setTrip(TripSummary.fromEntity(savedTrip.getTrip()));
        }

        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getSavedAt() {
        return savedAt;
    }

    public void setSavedAt(LocalDateTime savedAt) {
        this.savedAt = savedAt;
    }

    public TripSummary getTrip() {
        return trip;
    }

    public void setTrip(TripSummary trip) {
        this.trip = trip;
    }
}
