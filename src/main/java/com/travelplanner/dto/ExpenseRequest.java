package com.travelplanner.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ExpenseRequest {
    private Long tripId;
    private String category;
    private BigDecimal amount;
    private String description;
    private LocalDate expenseDate;
    private String currency;

    // Constructors
    public ExpenseRequest() {}

    // Getters and Setters
    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
