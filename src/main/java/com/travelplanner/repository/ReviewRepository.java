package com.travelplanner.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.travelplanner.entity.Review;
import com.travelplanner.entity.User;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByStatus(Review.ReviewStatus status);
    List<Review> findByUserOrderByCreatedAtDesc(User user);
    long countByStatus(Review.ReviewStatus status);
}
