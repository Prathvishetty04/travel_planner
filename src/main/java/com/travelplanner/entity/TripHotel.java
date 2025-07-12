package com.travelplanner.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "trip_hotels")
public class TripHotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    


    // Many hotels can be selected per trip
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private String hotelName;

    @Column(nullable = false)
    private String address;

    private double rating;

    private double averageDistance;

    private String imageUrl;

    private String mapUrl;

    private LocalDateTime selectedAt = LocalDateTime.now();

    public TripHotel() {}

    public TripHotel(Trip trip, String hotelName, String address, double rating,
                     double averageDistance, String imageUrl, String mapUrl) {
        this.trip = trip;
        this.hotelName = hotelName;
        this.address = address;
        this.rating = rating;
        this.averageDistance = averageDistance;
        this.imageUrl = imageUrl;
        this.mapUrl = mapUrl;
    }

    // Getters and Setters

    public Long getId() { return id; }

    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }

    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public double getAverageDistance() { return averageDistance; }
    public void setAverageDistance(double averageDistance) { this.averageDistance = averageDistance; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getMapUrl() { return mapUrl; }
    public void setMapUrl(String mapUrl) { this.mapUrl = mapUrl; }

    public LocalDateTime getSelectedAt() { return selectedAt; }
    public void setSelectedAt(LocalDateTime selectedAt) { this.selectedAt = selectedAt; }
}
