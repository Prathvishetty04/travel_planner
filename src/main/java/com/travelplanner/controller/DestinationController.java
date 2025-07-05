package com.travelplanner.controller;

import com.travelplanner.dto.DestinationRequest;
import com.travelplanner.dto.DestinationResponse;
import com.travelplanner.entity.Destination;
import com.travelplanner.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@CrossOrigin(origins = "*")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @GetMapping
    public ResponseEntity<List<DestinationResponse>> getAllDestinations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        List<DestinationResponse> destinations = destinationService.searchDestinations(search, category);
        return ResponseEntity.ok(destinations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DestinationResponse> getDestinationById(@PathVariable Long id) {
        DestinationResponse destination = destinationService.getDestinationById(id);
        return ResponseEntity.ok(destination);
    }

    @PostMapping
    public ResponseEntity<DestinationResponse> createDestination(@RequestBody DestinationRequest request) {
        DestinationResponse destination = destinationService.createDestination(request);
        return ResponseEntity.ok(destination);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DestinationResponse> updateDestination(@PathVariable Long id, @RequestBody DestinationRequest request) {
        DestinationResponse destination = destinationService.updateDestination(id, request);
        return ResponseEntity.ok(destination);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDestination(@PathVariable Long id) {
        destinationService.deleteDestination(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> categories = List.of("BEACH", "ADVENTURE", "HISTORY", "CULTURE", "NATURE", "URBAN");
        return ResponseEntity.ok(categories);
    }
}
