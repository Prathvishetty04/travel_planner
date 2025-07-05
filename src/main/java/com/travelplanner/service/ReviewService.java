package com.travelplanner.service;

import com.travelplanner.dto.ReviewRequest;
import com.travelplanner.dto.ReviewResponse;
import com.travelplanner.entity.Destination;
import com.travelplanner.entity.Review;
import com.travelplanner.entity.User;
import com.travelplanner.repository.DestinationRepository;
import com.travelplanner.repository.ReviewRepository;
import com.travelplanner.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    public List<ReviewResponse> getPendingReviews() {
        List<Review> reviews = reviewRepository.findByStatus(Review.ReviewStatus.PENDING);
        return reviews.stream().map(this::convertToReviewResponse).collect(Collectors.toList());
    }

    public ReviewResponse createReview(ReviewRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Destination destination = destinationRepository.findById(request.getDestinationId())
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        Review review = new Review();
        review.setUser(user);
        review.setDestination(destination);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setStatus(Review.ReviewStatus.PENDING);

        review = reviewRepository.save(review);
        return convertToReviewResponse(review);
    }

    public ReviewResponse approveReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        review.setStatus(Review.ReviewStatus.APPROVED);
        review = reviewRepository.save(review);
        return convertToReviewResponse(review);
    }

    public ReviewResponse rejectReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        review.setStatus(Review.ReviewStatus.REJECTED);
        review = reviewRepository.save(review);
        return convertToReviewResponse(review);
    }

    private ReviewResponse convertToReviewResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setUserId(review.getUser().getId());
        response.setUserName(review.getUser().getFirstName() + " " + review.getUser().getLastName());
        response.setDestinationId(review.getDestination().getId());
        response.setDestinationName(review.getDestination().getName());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setStatus(review.getStatus().toString());
        response.setCreatedAt(review.getCreatedAt());
        return response;
    }
}
