package com.travelplanner.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travelplanner.dto.ExpenseRequest;
import com.travelplanner.dto.ExpenseResponse;
import com.travelplanner.entity.Expense;
import com.travelplanner.entity.Trip;
import com.travelplanner.entity.User;
import com.travelplanner.repository.ExpenseRepository;
import com.travelplanner.repository.TripRepository;
import com.travelplanner.repository.UserRepository;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ExpenseResponse> getTripExpenses(Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        List<Expense> expenses = expenseRepository.findByTripOrderByExpenseDateDesc(trip);
        return expenses.stream()
                .map(this::convertToExpenseResponse)
                .collect(Collectors.toList());
    }

    public List<ExpenseResponse> getExpensesByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Trip> userTrips = tripRepository.findByUserOrderByCreatedAtDesc(user);

        List<Expense> expenses = expenseRepository.findByTripInOrderByExpenseDateDesc(userTrips);
        return expenses.stream()
                .map(this::convertToExpenseResponse)
                .collect(Collectors.toList());
    }

    public ExpenseResponse createExpense(ExpenseRequest request) {
        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        Expense expense = new Expense();
        expense.setTrip(trip);
        expense.setCategory(Expense.ExpenseCategory.valueOf(request.getCategory()));
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setCurrency(request.getCurrency());

        expense = expenseRepository.save(expense);
        return convertToExpenseResponse(expense);
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expense.setCategory(Expense.ExpenseCategory.valueOf(request.getCategory()));
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setCurrency(request.getCurrency());

        expense = expenseRepository.save(expense);
        return convertToExpenseResponse(expense);
    }

    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new RuntimeException("Expense not found");
        }
        expenseRepository.deleteById(id);
    }

    private ExpenseResponse convertToExpenseResponse(Expense expense) {
        ExpenseResponse response = new ExpenseResponse();
        response.setId(expense.getId());
        response.setTripId(expense.getTrip().getId());
        response.setCategory(expense.getCategory().toString());
        response.setAmount(expense.getAmount());
        response.setDescription(expense.getDescription());
        response.setExpenseDate(expense.getExpenseDate());
        response.setCurrency(expense.getCurrency());
        return response;
    }
}
