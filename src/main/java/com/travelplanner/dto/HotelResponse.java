package com.travelplanner.dto;

import java.util.Map;

public class HotelResponse {
    private String name;
    private String location;
    private double rating;
    private double averageDistance;
    private String imageUrl;
    private Map<String, Double> distancesFromDestinations;
    private String mapUrl;

    public HotelResponse() {}

    public HotelResponse(
            String name,
            String location,
            double rating,
            double averageDistance,
            String imageUrl,
            Map<String, Double> distancesFromDestinations,
            String mapUrl
    ) {
        this.name = name;
        this.location = location;
        this.rating = rating;
        this.averageDistance = averageDistance;
        this.imageUrl = imageUrl;
        this.distancesFromDestinations = distancesFromDestinations;
        this.mapUrl = mapUrl;
    }

    // Getters & Setters

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

    public double getAverageDistance() {
        return averageDistance;
    }

    public void setAverageDistance(double averageDistance) {
        this.averageDistance = averageDistance;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Map<String, Double> getDistancesFromDestinations() {
        return distancesFromDestinations;
    }

    public void setDistancesFromDestinations(Map<String, Double> distancesFromDestinations) {
        this.distancesFromDestinations = distancesFromDestinations;
    }

    public String getMapUrl() {
        return mapUrl;
    }

    public void setMapUrl(String mapUrl) {
        this.mapUrl = mapUrl;
    }
}
