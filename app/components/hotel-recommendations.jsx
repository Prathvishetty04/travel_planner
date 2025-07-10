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
const FALLBACK_IMAGE = "deaultHotel.jpg"

export default function HotelRecommendations({ user,tripId }) {

  const [trips, setTrips] = useState([])
  const [selectedTripId, setSelectedTripId] = useState(null)
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchTrips = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/user/${user.id}`)
      const data = await res.json()
      setTrips(data)
    } catch (err) {
      console.error("Failed to fetch trips:", err)
    }
  }

 const fetchRecommendedHotels = async (id = selectedTripId) => {
  if (!id) return
  try {
    setLoading(true)
    const res = await fetch(`${API_BASE_URL}/api/hotels/recommendations?tripId=${id}`)
    const data = await res.json()
    setHotels(data)
  } catch (err) {
    console.error("Error fetching recommended hotels:", err)
    setHotels([])
  } finally {
    setLoading(false)
  }
}

useEffect(() => {
  if (tripId) {
    setSelectedTripId(tripId)
    fetchRecommendedHotels(tripId)
  }
}, [tripId])

  useEffect(() => {
    fetchTrips()
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">AI Hotel Recommendations</h2>

      {/* Trip selector + trigger */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select onValueChange={(value) => setSelectedTripId(value)}>
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

        <Button onClick={fetchRecommendedHotels} disabled={!selectedTripId}>
          Get Recommendations
        </Button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="animate-spin mr-2" />
          Loading hotels...
        </div>
      ) : hotels.length === 0 ? (
        <p className="text-muted-foreground">No hotels found near your trip destinations.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hotels.map((hotel, idx) => (
            <Card key={idx} className="bg-white shadow-md">
              <CardHeader>
                <CardTitle>{hotel.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{hotel.location}</p>
              </CardHeader>
              <CardContent>
                <img
                  src={hotel.imageUrl || FALLBACK_IMAGE}
                  alt={hotel.name}
                  className="w-full h-40 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = FALLBACK_IMAGE
                  }}
                />

                <div className="mt-2 space-y-1 text-sm">
                  {hotel.distancesFromDestinations &&
                    Object.entries(hotel.distancesFromDestinations).map(
                      ([destName, dist]) => (
                        <p key={destName} className="text-muted-foreground">
                          📍 {dist.toFixed(2)} km from {destName}
                        </p>
                      )
                    )}

                  {hotel.mapUrl && (
                    <a
                      href={hotel.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm underline mt-1 block"
                    >
                      View on Map
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
