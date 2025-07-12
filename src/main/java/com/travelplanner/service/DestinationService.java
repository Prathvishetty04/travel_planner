package com.travelplanner.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelplanner.dto.DestinationRequest;
import com.travelplanner.dto.DestinationResponse;
import com.travelplanner.entity.Destination;
import com.travelplanner.repository.DestinationRepository;

@Service
public class DestinationService {

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private WikipediaImageService wikipediaImageService;

    public List<DestinationResponse> searchDestinations(String search, String category) {
        List<Destination> destinations;

        if (search != null && !search.isEmpty() && category != null && !category.isEmpty() && !category.equals("ALL")) {
            destinations = destinationRepository.findByCategoryAndSearchTerm(
                    Destination.Category.valueOf(category), search);
        } else if (search != null && !search.isEmpty()) {
            destinations = destinationRepository.findBySearchTerm(search);
        } else if (category != null && !category.isEmpty() && !category.equals("ALL")) {
            destinations = destinationRepository.findByCategory(Destination.Category.valueOf(category));
        } else {
            destinations = destinationRepository.findAll();
        }

        return destinations.stream().map(this::convertToDestinationResponse).collect(Collectors.toList());
    }

    public DestinationResponse getDestinationById(Long id) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));
        return convertToDestinationResponse(destination);
    }

    public DestinationResponse createDestination(DestinationRequest request) {
        Destination destination = new Destination();
        destination.setName(request.getName());
        destination.setCountry(request.getCountry());
        destination.setCity(request.getCity());
        destination.setDescription(request.getDescription());
        destination.setCategory(Destination.Category.valueOf(request.getCategory()));
        destination.setLatitude(request.getLatitude());
        destination.setLongitude(request.getLongitude());

        // Wikimedia fallback if imageUrl not provided
        if (request.getImageUrl() == null || request.getImageUrl().isEmpty()) {
            String wikiImage = wikipediaImageService.getImageUrl(request.getName());
            destination.setImageUrl(wikiImage);
        } else {
            destination.setImageUrl(request.getImageUrl());
        }

        destination = destinationRepository.save(destination);
        return convertToDestinationResponse(destination);
    }

    public DestinationResponse updateDestination(Long id, DestinationRequest request) {
        Destination destination = destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destination not found"));

        destination.setName(request.getName());
        destination.setCountry(request.getCountry());
        destination.setCity(request.getCity());
        destination.setDescription(request.getDescription());
        destination.setCategory(Destination.Category.valueOf(request.getCategory()));
        destination.setLatitude(request.getLatitude());
        destination.setLongitude(request.getLongitude());

        if (request.getImageUrl() == null || request.getImageUrl().isEmpty()) {
            String wikiImage = wikipediaImageService.getImageUrl(request.getName());
            destination.setImageUrl(wikiImage);
        } else {
            destination.setImageUrl(request.getImageUrl());
        }

        destination = destinationRepository.save(destination);
        return convertToDestinationResponse(destination);
    }

    public void deleteDestination(Long id) {
        if (!destinationRepository.existsById(id)) {
            throw new RuntimeException("Destination not found");
        }
        destinationRepository.deleteById(id);
    }

    private DestinationResponse convertToDestinationResponse(Destination destination) {
        DestinationResponse response = new DestinationResponse();
        response.setId(destination.getId());
        response.setName(destination.getName());
        response.setCountry(destination.getCountry());
        response.setCity(destination.getCity());
        response.setDescription(destination.getDescription());
        response.setCategory(destination.getCategory()); // ✅ use enum directly

        response.setLatitude(destination.getLatitude());
        response.setLongitude(destination.getLongitude());
        response.setImageUrl(destination.getImageUrl());
        response.setAverageRating(destination.getAverageRating());
        return response;
    }
}
