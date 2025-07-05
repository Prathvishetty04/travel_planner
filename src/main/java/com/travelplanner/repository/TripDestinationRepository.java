package com.travelplanner.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.travelplanner.entity.TripDestination;

public interface TripDestinationRepository extends JpaRepository<TripDestination, Long> {
}
