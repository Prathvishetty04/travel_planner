package com.travelplanner.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.travelplanner.dto.HotelResponse;
import com.travelplanner.service.HotelService;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    

    @GetMapping("/recommendations")
    public ResponseEntity<List<HotelResponse>> getHotelRecommendationsByTrip(@RequestParam Long tripId) {
        List<HotelResponse> hotels = hotelService.getRecommendationsByTrip(tripId);
        return ResponseEntity.ok(hotels);
    }
}
