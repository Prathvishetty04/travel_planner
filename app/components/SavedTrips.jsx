"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Textarea } from "../components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Calendar, MapPin, DollarSign, Heart, Trash, Sparkles, UtensilsCrossed, MapIcon, AlertTriangle, RefreshCw } from "lucide-react"

const API_BASE_URL = "http://localhost:8080"

export default function SavedTrips({ user }) {
  const [savedTrips, setSavedTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [notes, setNotes] = useState("")
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchSavedTrips = async (showLoader = true) => {
    if (!user?.id) {
      console.error("User ID not available")
      setError("User not logged in")
      return
    }

    if (showLoader) setLoading(true)
    setError(null)

    try {
      console.log("Fetching saved trips for user:", user.id)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const res = await fetch(`${API_BASE_URL}/api/saved-trips/user/${user.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("Response status:", res.status)

      if (!res.ok) {
        if (res.status === 404) {
          setSavedTrips([])
          return
        } else {
          throw new Error(`HTTP error: ${res.status}`)
        }
      }

      const data = await res.json()
      console.log("Fetched saved trips:", data)
      setSavedTrips(Array.isArray(data) ? data : [])
      setRetryCount(0)
    } catch (err) {
      console.error("Failed to fetch saved trips:", err)
      setError("Failed to load saved trips.")
      setSavedTrips([])
    } finally {
      if (showLoader) setLoading(false)
    }
  }

  const handleTripClick = (savedTrip) => {
    setSelectedTrip(savedTrip)
    setNotes(savedTrip.notes || "")
    if (savedTrip.trip?.id) fetchRecommendations(savedTrip.trip.id)
  }

  const handleUnsaveTrip = async (tripId) => {
    if (!tripId || !user?.id) return

    if (!confirm("Are you sure you want to remove this trip from saved trips?")) return

    try {
      const res = await fetch(`${API_BASE_URL}/api/saved-trips/user/${user.id}/trip/${tripId}`, {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) throw new Error("Unsave failed")

      setSavedTrips(savedTrips.filter(t => t.trip?.id !== tripId))
      if (selectedTrip?.trip?.id === tripId) {
        setSelectedTrip(null)
        setRecommendations([])
      }
    } catch (err) {
      console.error("Error unsaving trip:", err)
    }
  }

  const updateNotes = async (savedTripId, newNotes) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/saved-trips/${savedTripId}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: newNotes }),
      })

      if (!res.ok) throw new Error("Update failed")

      const updatedTrip = await res.json()
      setSavedTrips(savedTrips.map(t => t.id === savedTripId ? { ...t, notes: newNotes } : t))
      setSelectedTrip(prev => ({ ...prev, notes: newNotes }))
      setIsNotesDialogOpen(false)
    } catch (err) {
      console.error("Failed to update notes:", err)
    }
  }

  const fetchRecommendations = async (tripId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/recommendations/trip/${tripId}`)
      if (!res.ok) return
      const data = await res.json()
      setRecommendations(data)
    } catch (err) {
      console.error("Failed to fetch recommendations:", err)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PLANNING": return "secondary"
      case "ACTIVE": return "default"
      case "COMPLETED": return "outline"
      default: return "secondary"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    fetchSavedTrips(true)
  }

  useEffect(() => {
    if (user?.id) fetchSavedTrips()
  }, [user])

  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => fetchSavedTrips(false), 30000)
      return () => clearTimeout(timer)
    }
  }, [error, retryCount])

  // 🔍 Log all trip titles to help debug
  console.log("Rendering trips:", savedTrips.map(t => ({
    id: t.id,
    title: t.trip?.title,
    destinations: t.trip?.destinations?.length
  })))

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 text-lg">
        <Sparkles className="animate-spin mr-2" />
        Loading saved trips...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
        <p>{error}</p>
        <Button onClick={handleRetry} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Saved Trips</h2>
          <p className="text-muted-foreground">Your favorite trips with AI-powered recommendations</p>
        </div>
        <Button variant="outline" onClick={() => fetchSavedTrips(true)}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {savedTrips.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No Saved Trips Yet</h3>
            <p className="text-muted-foreground">
              Start exploring and save your favorite trips to see them here!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTrips
            .filter(savedTrip => savedTrip.trip)
            .map((savedTrip) => (
              <Card
                key={savedTrip.id}
                className="cursor-pointer hover:shadow-lg transition-shadow relative"
                onClick={() => handleTripClick(savedTrip)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{savedTrip.trip.title || 'Untitled Trip'}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {savedTrip.trip.description || 'No description'}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(savedTrip.trip.status)}>
                        {savedTrip.trip.status || 'UNKNOWN'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUnsaveTrip(savedTrip.trip.id)
                        }}
                        className="p-2 hover:bg-red-50"
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(savedTrip.trip.startDate)} - {formatDate(savedTrip.trip.endDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Budget: ${savedTrip.trip.budget || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{savedTrip.trip.destinations?.length || 0} destinations</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Saved: {formatDate(savedTrip.savedAt)}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
