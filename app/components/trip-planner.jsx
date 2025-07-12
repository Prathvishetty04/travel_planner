"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Calendar, MapPin, Plus, DollarSign, Trash, Hotel, Heart, HeartOff } from "lucide-react"

const API_BASE_URL = "http://localhost:8080"

export default function TripPlanner({ user }) {
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [savedTrips, setSavedTrips] = useState([]) // Track saved trip IDs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTrip, setNewTrip] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
  })

  const fetchTrips = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/user/${user.id}`)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      console.log("Fetched trips:", data)
      setTrips(data)
    } catch (err) {
      console.error("Failed to fetch trips:", err)
    }
  }

  const fetchSavedTrips = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/saved-trips/user/${user.id}`)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      setSavedTrips(data.map(savedTrip => savedTrip.tripId))
    } catch (err) {
      console.error("Failed to fetch saved trips:", err)
      // Fallback to in-memory storage if API fails
      setSavedTrips([])
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchTrips()
      fetchSavedTrips()
    }
  }, [user])

  const handleCreateTrip = async () => {
    if (!newTrip.title || !newTrip.startDate || !newTrip.endDate) {
      alert("Please fill in all required fields")
      return
    }

    const trip = {
      ...newTrip,
      budget: Number(newTrip.budget) || 0,
      userId: user.id,
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trip),
      })
      if (!res.ok) throw new Error("Trip creation failed: " + res.status)
      const created = await res.json()
      setTrips([...trips, created])
      setNewTrip({ title: "", description: "", startDate: "", endDate: "", budget: "" })
      setIsCreateDialogOpen(false)
    } catch (err) {
      console.error("Failed to create trip:", err)
      alert("Failed to create trip. Please check your connection and try again.")
    }
  }

  const handleTripClick = async (tripId) => {
    try {
      console.log("Fetching trip details for ID:", tripId)
      const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}`)
      if (!res.ok) {
        console.error(`Backend error: ${res.status} ${res.statusText}`)
        alert(`Failed to load trip details. Backend error: ${res.status}`)
        return
      }
      const fullTrip = await res.json()
      console.log("Fetched trip details:", fullTrip)
      setSelectedTrip(fullTrip)
    } catch (err) {
      console.error("Failed to load full trip details", err)
      alert("Failed to load trip details. Please check your backend server.")
    }
  }

  const handleDeleteTrip = async (tripId) => {
    if (!confirm("Are you sure you want to delete this trip?")) return

    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete trip")

      setTrips(trips.filter((trip) => trip.id !== tripId))
      // Also remove from saved trips if it was saved
      setSavedTrips(savedTrips.filter(id => id !== tripId))
      if (selectedTrip?.id === tripId) {
        setSelectedTrip(null)
      }
    } catch (err) {
      console.error("Error deleting trip:", err)
      alert("Failed to delete trip. Please try again.")
    }
  }

  // Updated Save Trip Function - tries API first, falls back to memory
  const handleSaveTrip = async (trip) => {
    if (!user?.id) {
      console.error("User not logged in")
      alert("Please log in to save trips")
      return
    }

    if (!trip?.id) {
      console.error("Trip ID is missing")
      alert("Unable to save trip - trip data is incomplete")
      return
    }

    try {
      console.log("Saving trip:", trip.id, "for user:", user.id)
      
      // Prepare the request payload
      const requestPayload = {
        userId: user.id,
        tripId: trip.id,
        notes: "" // Default empty notes
      }
      
      console.log("Request payload:", requestPayload)
      
      const response = await fetch(`${API_BASE_URL}/api/saved-trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      })

      console.log("Save response status:", response.status)
      
      if (!response.ok) {
        // Try to get error details
        let errorMessage = `HTTP ${response.status}`
        try {
          const errorText = await response.text()
          console.error("Error response body:", errorText)
          
          // Try to parse as JSON for more details
          try {
            const errorJson = JSON.parse(errorText)
            errorMessage = errorJson.message || errorJson.error || errorMessage
          } catch (e) {
            // If not JSON, use the text as is
            errorMessage = errorText || errorMessage
          }
        } catch (e) {
          console.error("Could not read error response:", e)
        }
        
        throw new Error(`API save failed: ${errorMessage}`)
      }

      // Parse the successful response
      const savedTrip = await response.json()
      console.log("Successfully saved trip:", savedTrip)
      
      // Update the trip state to show it's saved
      setTrips(prevTrips => 
        prevTrips.map(t => 
          t.id === trip.id 
            ? { ...t, isSaved: true, savedTripId: savedTrip.id }
            : t
        )
      )

      alert("Trip saved successfully!")
      
    } catch (error) {
      console.error("Failed to save trip:", error)
      
      // Provide user-friendly error message
      if (error.message.includes("already saved")) {
        alert("This trip is already saved!")
      } else if (error.message.includes("User not found")) {
        alert("User account not found. Please log in again.")
      } else if (error.message.includes("Trip not found")) {
        alert("Trip not found. Please refresh and try again.")
      } else {
        alert("Failed to save trip. Please try again.")
      }
    }
  }

  const handleUnsaveTrip = async (tripId) => {
    try {
      // Try to unsave via API first
      const savedTrip = await fetch(`${API_BASE_URL}/api/saved-trips/user/${user.id}`)
        .then(res => res.json())
        .then(data => data.find(st => st.tripId === tripId))

      if (savedTrip) {
        const res = await fetch(`${API_BASE_URL}/api/saved-trips/${savedTrip.id}`, {
          method: "DELETE",
        })

        if (res.ok) {
          // Update the trips state to remove the saved status
          setTrips(prevTrips => 
            prevTrips.map(t => 
              t.id === tripId 
                ? { ...t, isSaved: false, savedTripId: null }
                : t
            )
          )
          setSavedTrips(savedTrips.filter(id => id !== tripId))
          alert("Trip removed from saved!")
          return
        }
      }
      
      throw new Error("API unsave failed")
    } catch (err) {
      console.error("Failed to unsave via API, using memory:", err)
      // Fallback to in-memory storage
      setTrips(prevTrips => 
        prevTrips.map(t => 
          t.id === tripId 
            ? { ...t, isSaved: false, savedTripId: null }
            : t
        )
      )
      setSavedTrips(savedTrips.filter(id => id !== tripId))
      alert("Trip removed locally!")
    }
  }

  // Helper function to check if a trip is already saved
  const isTripSaved = (tripId) => {
    return trips.some(trip => trip.id === tripId && trip.isSaved)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PLANNING": return "secondary"
      case "ACTIVE": return "default"
      case "COMPLETED": return "outline"
      default: return "secondary"
    }
  }

  const handleFindHotels = () => {
    if (!selectedTrip?.id) return
    const event = new CustomEvent('switchToHotels', { 
      detail: { tripId: selectedTrip.id } 
    })
    window.dispatchEvent(event)
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">My Trips</h2>
          <p className="text-muted-foreground">Plan and manage your travel itineraries</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Trip</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Trip</DialogTitle>
              <DialogDescription>Plan your next adventure</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Trip Title *</Label>
                <Input
                  value={newTrip.title}
                  onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
                  placeholder="My Amazing Trip"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newTrip.description}
                  onChange={(e) => setNewTrip({ ...newTrip, description: e.target.value })}
                  placeholder="Describe your trip..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={newTrip.startDate}
                    onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Date *</Label>
                  <Input
                    type="date"
                    value={newTrip.endDate}
                    onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Budget ($)</Label>
                <Input
                  type="number"
                  value={newTrip.budget}
                  onChange={(e) => setNewTrip({ ...newTrip, budget: e.target.value })}
                  placeholder="0"
                />
              </div>
              <Button onClick={handleCreateTrip} className="w-full">Create Trip</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <Card
            key={trip.id}
            className="cursor-pointer hover:shadow-lg transition-shadow relative"
            onClick={() => handleTripClick(trip.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{trip.title}</CardTitle>
                  <CardDescription>{trip.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(trip.status)}>{trip.status}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isTripSaved(trip.id)) {
                        handleUnsaveTrip(trip.id)
                      } else {
                        handleSaveTrip(trip)
                      }
                    }}
                    className="p-2"
                  >
                    {isTripSaved(trip.id) ? 
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" /> : 
                      <HeartOff className="h-4 w-4 text-gray-500" />
                    }
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{trip.startDate} - {trip.endDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Budget: ${trip.budget}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{trip.destinations?.length || 0} destinations</span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteTrip(trip.id)
                }}
              >
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTrip && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Trip Details: {selectedTrip.title}</CardTitle>
              <Button
                variant={isTripSaved(selectedTrip.id) ? "secondary" : "default"}
                onClick={() => {
                  if (isTripSaved(selectedTrip.id)) {
                    handleUnsaveTrip(selectedTrip.id)
                  } else {
                    handleSaveTrip(selectedTrip)
                  }
                }}
                className="flex items-center gap-2"
              >
                {isTripSaved(selectedTrip.id) ? (
                  <>
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    Saved
                  </>
                ) : (
                  <>
                    <HeartOff className="h-4 w-4" />
                    Save Trip
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Destinations</h4>
                {selectedTrip.destinations && selectedTrip.destinations.length > 0 ? (
                  <div className="space-y-2">
                    {selectedTrip.destinations.map((dest, index) => (
                      <div key={dest.id || index} className="flex justify-between p-2 border rounded">
                        <span>{dest.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {dest.city}, {dest.country}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No destinations added yet.</p>
                )}
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Hotels</h4>
                {selectedTrip.hotels && selectedTrip.hotels.length > 0 ? (
                  <div className="space-y-2">
                    {selectedTrip.hotels.map((hotel, index) => (
                      <div key={hotel.id || index} className="p-2 border rounded">
                        <div className="font-medium">{hotel.name}</div>
                        <div className="text-sm text-muted-foreground">{hotel.address}</div>
                        {hotel.rating && (
                          <div className="text-sm">Rating: {hotel.rating}/5</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No hotels added yet.</p>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Actions</h4>
              <Button onClick={handleFindHotels} variant="default">
                <Hotel className="h-4 w-4 mr-2" />
                Find Hotels
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}