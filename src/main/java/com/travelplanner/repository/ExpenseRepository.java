package com.travelplanner.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.travelplanner.entity.Expense;
import com.travelplanner.entity.Trip;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Existing
    List<Expense> findByTripOrderByExpenseDateDesc(Trip trip);

    // ✅ NEW: Support fetching for multiple trips (used in getExpensesByUser)
    List<Expense> findByTripInOrderByExpenseDateDesc(List<Trip> trips);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.trip = :trip")
    BigDecimal getTotalExpensesByTrip(@Param("trip") Trip trip);

    @Query("SELECT e.category, SUM(e.amount) FROM Expense e WHERE e.trip = :trip GROUP BY e.category")
    List<Object[]> getExpensesByCategory(@Param("trip") Trip trip);
}
