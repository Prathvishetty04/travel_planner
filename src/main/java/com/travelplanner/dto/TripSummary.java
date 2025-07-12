package com.travelplanner.dto;

import com.travelplanner.entity.Trip;
import com.travelplanner.entity.TripDestination;
import com.travelplanner.entity.Destination;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class TripSummary {
    private Long id;
    private String title;
    private String description;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal budget;
    private List<DestinationResponse> destinations;

    public static TripSummary fromEntity(Trip trip) {
        TripSummary dto = new TripSummary();
        dto.setId(trip.getId());
        dto.setTitle(trip.getTitle());
        dto.setDescription(trip.getDescription());
        dto.setStatus(trip.getStatus() != null ? trip.getStatus().name() : null);
        dto.setStartDate(trip.getStartDate());
        dto.setEndDate(trip.getEndDate());
        dto.setBudget(trip.getBudget());

        if (trip.getTripDestinations() != null) {
            List<DestinationResponse> destinationDTOs = trip.getTripDestinations().stream()
                    .map(TripDestination::getDestination)
                    .map(dest -> {
                        DestinationResponse d = new DestinationResponse();
                        d.setId(dest.getId());
                        d.setName(dest.getName());
                        d.setCity(dest.getCity());
                        d.setCountry(dest.getCountry());
                        d.setDescription(dest.getDescription());
                        d.setCategory(dest.getCategory()); // ✅ enum is passed directly
                        d.setLatitude(dest.getLatitude());
                        d.setLongitude(dest.getLongitude());
                        d.setImageUrl(dest.getImageUrl());
                        d.setAverageRating(dest.getAverageRating());
                        return d;
                    })
                    .collect(Collectors.toList());

            dto.setDestinations(destinationDTOs);
        }

        return dto;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public List<DestinationResponse> getDestinations() { return destinations; }
    public void setDestinations(List<DestinationResponse> destinations) { this.destinations = destinations; }
}
