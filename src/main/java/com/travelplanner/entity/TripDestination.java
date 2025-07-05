package com.travelplanner.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "trip_destinations")
public class TripDestination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Column(name = "visit_date")
    private LocalDate visitDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "order_index")
    private Integer orderIndex = 0;

    // Constructors
    public TripDestination() {}

    public TripDestination(Trip trip, Destination destination, LocalDate visitDate) {
        this.trip = trip;
        this.destination = destination;
        this.visitDate = visitDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Trip getTrip() { return trip; }
    public void setTrip(Trip trip) { this.trip = trip; }

    public Destination getDestination() { return destination; }
    public void setDestination(Destination destination) { this.destination = destination; }

    public LocalDate getVisitDate() { return visitDate; }
    public void setVisitDate(LocalDate visitDate) { this.visitDate = visitDate; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
}
