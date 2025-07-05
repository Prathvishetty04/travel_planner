package com.travelplanner.repository;

import com.travelplanner.entity.Trip;
import com.travelplanner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByUserOrderByCreatedAtDesc(User user);
    List<Trip> findByUserAndStatus(User user, Trip.TripStatus status);
    long countByUser(User user);
}
