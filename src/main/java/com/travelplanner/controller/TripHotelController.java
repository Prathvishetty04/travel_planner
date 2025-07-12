package com.travelplanner.controller;

import com.travelplanner.entity.TripHotel;
import com.travelplanner.service.TripHotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trip-hotels")
@CrossOrigin(origins = "*")
public class TripHotelController {

    @Autowired
    private TripHotelService tripHotelService;

    @PostMapping("/add")
    public ResponseEntity<TripHotel> addHotelToTrip(@RequestParam Long tripId, @RequestBody TripHotel hotel) {
        TripHotel saved = tripHotelService.addHotelToTrip(tripId, hotel);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<List<TripHotel>> getHotelsForTrip(@PathVariable Long tripId) {
        return ResponseEntity.ok(tripHotelService.getHotelsForTrip(tripId));
    }
}
