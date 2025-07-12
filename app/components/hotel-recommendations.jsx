"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

const API_BASE_URL = "http://localhost:8080"
const FALLBACK_IMAGE = "/defaultHotel.jpg"

export default function HotelRecommendations({ user, tripId }) {
  const [trips, setTrips] = useState([])
  const [selectedTripId, setSelectedTripId] = useState(tripId || null)
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTrips = async () => {
    if (!user?.id) return
    try {
      setError(null)
      const res = await fetch(`${API_BASE_URL}/api/trips/user/${user.id}`)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      console.log("Fetched trips for hotel recommendations:", data)
      setTrips(data)
    } catch (err) {
      console.error("Failed to fetch trips:", err)
      setError("Failed to load trips. Please try again.")
    }
  }

  const fetchRecommendedHotels = async (id = selectedTripId) => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching hotels for trip ID:", id)
      const res = await fetch(`${API_BASE_URL}/api/hotels/recommendations?tripId=${id}`)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      console.log("Fetched hotels:", data)
      setHotels(data)
    } catch (err) {
      console.error("Error fetching recommended hotels:", err)
      setError("Failed to load hotel recommendations. Please try again.")
      setHotels([])
    } finally {
      setLoading(false)
    }
  }

  const addHotelToPlan = async (hotel) => {
    if (!selectedTripId) return
    try {
      setError(null)
      const res = await fetch(`${API_BASE_URL}/api/trips/${selectedTripId}/hotels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: hotel.name,
          location: hotel.location,
          rating: hotel.rating,
          imageUrl: hotel.imageUrl,
          distance: hotel.averageDistance || 0,
          mapUrl: hotel.mapUrl,
        }),
      })
      if (!res.ok) throw new Error("Failed to add hotel")
      alert("Hotel added to trip plan!")
    } catch (err) {
      console.error("Failed to add hotel:", err)
      setError("Failed to add hotel to trip. Please try again.")
    }
  }

  // Fetch trips when component mounts or user changes
  useEffect(() => {
    fetchTrips()
  }, [user])

  // Handle initial trip ID from props
  useEffect(() => {
    if (tripId) {
      setSelectedTripId(tripId)
      fetchRecommendedHotels(tripId)
    }
  }, [tripId])

  // Handle trip ID from localStorage (when coming from Find Hotels button)
  useEffect(() => {
    const storedTripId = localStorage.getItem("selectedTripId")
    if (storedTripId && storedTripId !== selectedTripId) {
      setSelectedTripId(storedTripId)
      fetchRecommendedHotels(storedTripId)
      localStorage.removeItem("selectedTripId") // Clean up
    }
  }, [])

  // Listen for custom events from TripPlanner
  useEffect(() => {
    const handleSwitchToHotels = (event) => {
      const { tripId: newTripId } = event.detail
      setSelectedTripId(newTripId)
      fetchRecommendedHotels(newTripId)
    }

    window.addEventListener('switchToHotels', handleSwitchToHotels)
    return () => window.removeEventListener('switchToHotels', handleSwitchToHotels)
  }, [])

  const handleTripSelection = (value) => {
    setSelectedTripId(value)
    setHotels([]) // Clear existing hotels when changing trip
    setError(null) // Clear any previous errors
  }

  const handleRetry = () => {
    setError(null)
    if (selectedTripId) {
      fetchRecommendedHotels(selectedTripId)
    } else {
      fetchTrips()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Hotel Recommendations</h2>
        {error && (
          <Button onClick={handleRetry} variant="outline" size="sm">
            Retry
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Trip Selector */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedTripId || ""} onValueChange={handleTripSelection}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select a Trip" />
          </SelectTrigger>
          <SelectContent>
            {trips.map((trip) => (
              <SelectItem key={trip.id} value={trip.id.toString()}>
                {trip.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={() => fetchRecommendedHotels(selectedTripId)} 
          disabled={!selectedTripId || loading}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Loading...
            </>
          ) : (
            "Get Recommendations"
          )}
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4 h-8 w-8 text-blue-600" />
            <p className="text-muted-foreground">Finding the best hotels for your trip...</p>
          </div>
        </div>
      )}

      {/* No Hotels State */}
      {!loading && hotels.length === 0 && selectedTripId && !error && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Hotels Found</h3>
            <p className="text-muted-foreground mb-4">
              No hotels found for this trip. Make sure your trip has destinations added.
            </p>
            <Button 
              onClick={() => fetchRecommendedHotels(selectedTripId)} 
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Select Trip State */}
      {!loading && hotels.length === 0 && !selectedTripId && !error && (
        <div className="text-center py-12">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Select a Trip</h3>
            <p className="text-blue-700">
              Choose a trip from the dropdown above to see personalized hotel recommendations.
            </p>
          </div>
        </div>
      )}

      {/* Hotel Cards */}
      {!loading && hotels.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel, idx) => (
            <Card key={idx} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold line-clamp-2">{hotel.name}</CardTitle>
                <p className="text-sm text-muted-foreground flex items-center">
                  <span className="mr-1">📍</span>
                  {hotel.location}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4">
                  <img
                    src={hotel.imageUrl || FALLBACK_IMAGE}
                    alt={hotel.name}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = FALLBACK_IMAGE
                    }}
                  />
                </div>
                
                <div className="space-y-3">
                  {/* Rating */}
                  {hotel.rating && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rating:</span>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span className="text-sm font-medium">{hotel.rating}/5</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Average Distance */}
                  {hotel.averageDistance && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Avg. Distance:</span>
                      <span className="text-sm text-muted-foreground">
                        {hotel.averageDistance.toFixed(1)} km
                      </span>
                    </div>
                  )}
                  
                  {/* Distance from Each Destination */}
                  {hotel.distancesFromDestinations && Object.keys(hotel.distancesFromDestinations).length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Distances:</span>
                      <div className="space-y-1">
                        {Object.entries(hotel.distancesFromDestinations).map(([dest, dist]) => (
                          <div key={dest} className="flex justify-between text-xs">
                            <span className="text-muted-foreground truncate mr-2">{dest}</span>
                            <span className="text-muted-foreground whitespace-nowrap">
                              {dist.toFixed(1)} km
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Map Link */}
                  {hotel.mapUrl && (
                    <div className="pt-2">
                      <a
                        href={hotel.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm underline hover:text-blue-800 transition-colors"
                      >
                        📍 View on Map
                      </a>
                    </div>
                  )}
                </div>
                
                <Button 
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700" 
                  onClick={() => addHotelToPlan(hotel)}
                  disabled={!selectedTripId}
                >
                  Add to Trip Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Results Summary */}
      {!loading && hotels.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Showing {hotels.length} hotel recommendation{hotels.length !== 1 ? 's' : ''} for your trip
        </div>
      )}
    </div>
  )
}