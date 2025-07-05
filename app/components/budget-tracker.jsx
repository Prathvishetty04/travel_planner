"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Progress } from "../components/ui/progress"
import { Badge } from "../components/ui/badge"
import { DollarSign, Plus, TrendingUp, Receipt, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "../components/ui/alert"

const expenseCategories = [
  { value: "ACCOMMODATION", label: "Accommodation", icon: "🏨" },
  { value: "FOOD", label: "Food & Dining", icon: "🍽️" },
  { value: "TRANSPORT", label: "Transportation", icon: "🚗" },
  { value: "ACTIVITIES", label: "Activities", icon: "🎯" },
  { value: "SHOPPING", label: "Shopping", icon: "🛍️" },
  { value: "OTHER", label: "Other", icon: "📝" },
]

export default function BudgetTracker({ user }) {
  const [expenses, setExpenses] = useState([])
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState("all")
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newExpense, setNewExpense] = useState({
    tripId: "",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  // ✅ Fetch trips and their expenses
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError("")
        
        // Fetch trips
        const tripsResponse = await fetch(`http://localhost:8080/api/trips/user/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        })
        
        if (!tripsResponse.ok) {
          throw new Error(`Failed to fetch trips: ${tripsResponse.status}`)
        }
        
        const tripData = await tripsResponse.json()
        setTrips(tripData)

        // Fetch expenses for each trip
        const expensePromises = tripData.map(async (trip) => {
          try {
            const expenseResponse = await fetch(`http://localhost:8080/api/expenses/trip/${trip.id}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
            })
            
            if (!expenseResponse.ok) {
              console.warn(`Failed to fetch expenses for trip ${trip.id}`)
              return []
            }
            
            const tripExpenses = await expenseResponse.json()
            return tripExpenses.map((e) => ({ ...e, tripTitle: trip.title }))
          } catch (err) {
            console.warn(`Error fetching expenses for trip ${trip.id}:`, err)
            return []
          }
        })

        const allExpenses = await Promise.all(expensePromises)
        setExpenses(allExpenses.flat())
      } catch (err) {
        console.error("Failed to load data:", err)
        setError("Failed to load trips and expenses. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) {
      fetchData()
    }
  }, [user?.id])

  const filteredExpenses =
    selectedTrip === "all"
      ? expenses
      : expenses.filter((e) => e.tripId === Number(selectedTrip))

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
  const totalBudget =
    selectedTrip === "all"
      ? trips.reduce((sum, t) => sum + (parseFloat(t.budget) || 0), 0)
      : trips.find((t) => t.id === Number(selectedTrip))?.budget || 0

  const budgetUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const getBudgetStatus = () => {
    if (budgetUsed < 50) return { color: "text-green-600", status: "On Track" }
    if (budgetUsed < 80) return { color: "text-yellow-600", status: "Watch Spending" }
    if (budgetUsed < 100) return { color: "text-orange-600", status: "Near Limit" }
    return { color: "text-red-600", status: "Over Budget" }
  }

  const budgetStatus = getBudgetStatus()

  const handleAddExpense = async () => {
    if (!newExpense.tripId || !newExpense.category || !newExpense.amount || !newExpense.description) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setLoading(true)
      setError("")

      const expenseData = {
        tripId: parseInt(newExpense.tripId),
        category: newExpense.category,
        amount: parseFloat(newExpense.amount),
        description: newExpense.description.trim(),
        expenseDate: newExpense.date,
        currency: "USD",
      }

      const response = await fetch("http://localhost:8080/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(expenseData),
      })

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`
        try {
          const errorData = await response.text()
          if (errorData) {
            errorMessage = errorData
          }
        } catch (parseError) {
          console.warn("Could not parse error response")
        }
        throw new Error(errorMessage)
      }

      const savedExpense = await response.json()
      const trip = trips.find((t) => t.id === savedExpense.tripId)
      
      setExpenses([...expenses, { ...savedExpense, tripTitle: trip?.title || "Trip" }])
      setIsAddExpenseOpen(false)
      setNewExpense({
        tripId: "",
        category: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
    } catch (err) {
      console.error("Failed to add expense:", err)
      setError(`Failed to add expense: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const expensesByCategory = expenseCategories
    .map((cat) => {
      const items = filteredExpenses.filter((e) => e.category === cat.value)
      const total = items.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
      return { ...cat, total, count: items.length }
    })
    .filter((c) => c.total > 0)

  const validateForm = () => {
    return newExpense.tripId && newExpense.category && newExpense.amount && newExpense.description.trim()
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">💸 Budget Tracker</h2>
          <p className="text-muted-foreground">Track and manage your travel expenses</p>
        </div>
        <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
          <DialogTrigger asChild>
            <Button disabled={loading || trips.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
              <DialogDescription>Log a new cost for your trip</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="trip-select">Trip *</Label>
                <Select 
                  value={newExpense.tripId} 
                  onValueChange={(val) => setNewExpense({ ...newExpense, tripId: val })}
                >
                  <SelectTrigger id="trip-select">
                    <SelectValue placeholder="Select trip" />
                  </SelectTrigger>
                  <SelectContent>
                    {trips.length > 0 ? (
                      trips.map((trip) => (
                        <SelectItem key={trip.id} value={trip.id.toString()}>
                          {trip.title || `Trip #${trip.id}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>No trips available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category-select">Category *</Label>
                <Select 
                  value={newExpense.category} 
                  onValueChange={(val) => setNewExpense({ ...newExpense, category: val })}
                >
                  <SelectTrigger id="category-select">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount-input">Amount ($) *</Label>
                  <Input 
                    id="amount-input"
                    type="number" 
                    step="0.01"
                    min="0"
                    value={newExpense.amount} 
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="date-input">Date *</Label>
                  <Input 
                    id="date-input"
                    type="date" 
                    value={newExpense.date} 
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })} 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description-input">Description *</Label>
                <Input 
                  id="description-input"
                  value={newExpense.description} 
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="Enter expense description"
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleAddExpense}
                disabled={loading || !validateForm()}
              >
                {loading ? "Saving..." : "Save Expense"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      )}

      {/* Trip Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <Label htmlFor="trip-filter">Filter by trip:</Label>
        <Select value={selectedTrip} onValueChange={setSelectedTrip}>
          <SelectTrigger className="w-48" id="trip-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Trips</SelectItem>
            {trips.map((trip) => (
              <SelectItem key={trip.id} value={trip.id.toString()}>
                {trip.title || `Trip #${trip.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${budgetStatus.color}`}>
              ${(totalBudget - totalSpent).toFixed(2)}
            </div>
            <p className={`text-xs ${budgetStatus.color}`}>
              {budgetStatus.status}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={budgetUsed} className="h-2" />
          <div className="flex justify-between text-sm">
            <span>{budgetUsed.toFixed(1)}%</span>
            <span className={budgetStatus.color}>{budgetStatus.status}</span>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {expensesByCategory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expensesByCategory.map((cat) => (
              <div key={cat.value} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <div className="font-medium">{cat.label}</div>
                    <div className="text-sm text-muted-foreground">{cat.count} items</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${cat.total.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">
                    {totalSpent > 0 ? ((cat.total / totalSpent) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Data State */}
      {!loading && trips.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No trips found. Create a trip first to start tracking expenses.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}