package com.travelplanner.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class TripResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal budget;
    private String status;

    private List<DestinationResponse> destinations;
    private List<TripHotelResponse> hotels;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<DestinationResponse> getDestinations() { return destinations; }
    public void setDestinations(List<DestinationResponse> destinations) { this.destinations = destinations; }

    public List<TripHotelResponse> getHotels() { return hotels; }
    public void setHotels(List<TripHotelResponse> hotels) { this.hotels = hotels; }
}
