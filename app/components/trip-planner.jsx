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
import { Calendar, MapPin, Plus, DollarSign, Trash, Hotel } from "lucide-react"
import { useRouter } from "next/navigation"

const API_BASE_URL = "http://localhost:8080"

export default function TripPlanner({ user }) {
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTrip, setNewTrip] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
  })

  const router = useRouter()

  const fetchTrips = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/user/${user.id}`)
      const data = await res.json()
      setTrips(data)
    } catch (err) {
      console.error("Failed to fetch trips:", err)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [])

  const handleCreateTrip = async () => {
    const trip = {
      ...newTrip,
      budget: Number(newTrip.budget),
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
    }
  }

  const handleTripClick = async (tripId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}`)
      const fullTrip = await res.json()
      setSelectedTrip(fullTrip)
    } catch (err) {
      console.error("Failed to load full trip details", err)
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
      if (selectedTrip?.id === tripId) {
        setSelectedTrip(null)
      }
    } catch (err) {
      console.error("Error deleting trip:", err)
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

  const handleFindHotels = () => {
  if (!selectedTrip?.id) return
  localStorage.setItem("selectedTripId", selectedTrip.id)
  location.hash = "#hotels" // optional scroll
  location.reload()         // triggers the tab switch effect
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
              <Label>Trip Title</Label>
              <Input
                value={newTrip.title}
                onChange={(e) => setNewTrip({ ...newTrip, title: e.target.value })}
                placeholder="My Trip"
              />
              <Label>Description</Label>
              <Textarea
                value={newTrip.description}
                onChange={(e) => setNewTrip({ ...newTrip, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={newTrip.startDate}
                    onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={newTrip.endDate}
                    onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                  />
                </div>
              </div>
              <Label>Budget ($)</Label>
              <Input
                type="number"
                value={newTrip.budget}
                onChange={(e) => setNewTrip({ ...newTrip, budget: e.target.value })}
              />
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
                <Badge variant={getStatusColor(trip.status)}>{trip.status}</Badge>
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
            <CardTitle>Trip Details: {selectedTrip.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Destinations</h4>
                {(selectedTrip.destinations || []).map((dest) => (
                  <div key={dest.id} className="flex justify-between p-2 border rounded">
                    <span>{dest.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {dest.city}, {dest.country}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-3">Actions</h4>
                <Button onClick={handleFindHotels} variant="default">
                  <Hotel className="h-4 w-4 mr-2" />
                  Find Hotels
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
