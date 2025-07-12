package com.travelplanner.repository;

import com.travelplanner.entity.TripHotel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripHotelRepository extends JpaRepository<TripHotel, Long> {
    List<TripHotel> findByTripId(Long tripId);
}

