package com.travelplanner.service;

import com.travelplanner.entity.Trip;
import com.travelplanner.entity.TripHotel;
import com.travelplanner.repository.TripHotelRepository;
import com.travelplanner.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripHotelService {

    @Autowired
    private TripHotelRepository tripHotelRepository;

    @Autowired
    private TripRepository tripRepository;

    public TripHotel addHotelToTrip(Long tripId, TripHotel hotel) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));
        hotel.setTrip(trip);
        return tripHotelRepository.save(hotel);
    }

    public List<TripHotel> getHotelsForTrip(Long tripId) {
        return tripHotelRepository.findByTripId(tripId);
    }
}
