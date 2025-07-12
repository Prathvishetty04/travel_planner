package com.travelplanner.dto;

public class TripHotelRequest {
    private Long tripId;
    private String name;
    private String location;
    private double rating;
    private double distance;
    private String imageUrl;
    private String mapUrl;

    public TripHotelRequest() {}

    public TripHotelRequest(Long tripId, String name, String location, double rating, double distance, String imageUrl, String mapUrl) {
        this.tripId = tripId;
        this.name = name;
        this.location = location;
        this.rating = rating;
        this.distance = distance;
        this.imageUrl = imageUrl;
        this.mapUrl = mapUrl;
    }

    // Getters and setters
    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getMapUrl() {
        return mapUrl;
    }

    public void setMapUrl(String mapUrl) {
        this.mapUrl = mapUrl;
    }
}
