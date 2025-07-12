package com.travelplanner.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class TripRequest {
    private Long userId;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal budget;
    private String status;

    private List<Long> destinationIds; // Optional
    private List<Long> hotelIds;       // Optional, for adding hotels during creation or update

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

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

    public List<Long> getDestinationIds() { return destinationIds; }
    public void setDestinationIds(List<Long> destinationIds) { this.destinationIds = destinationIds; }

    public List<Long> getHotelIds() { return hotelIds; }
    public void setHotelIds(List<Long> hotelIds) { this.hotelIds = hotelIds; }
}
