package com.travelplanner.repository;

import com.travelplanner.entity.SavedTrip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedTripRepository extends JpaRepository<SavedTrip, Long> {

   
    List<SavedTrip> findByUserId(@Param("userId") Long userId);

    Optional<SavedTrip> findByUserIdAndTripId(@Param("userId") Long userId, @Param("tripId") Long tripId);
}
