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
import { Calendar, MapPin, Plus, DollarSign, Landmark } from "lucide-react"

const API_BASE_URL = 'http://localhost:8080'

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
      const created = await res.json()
      setTrips([...trips, created])
      setNewTrip({ title: "", description: "", startDate: "", endDate: "", budget: "" })
      setIsCreateDialogOpen(false)
    } catch (err) {
      console.error("Failed to create trip:", err)
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
          <Card key={trip.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedTrip(trip)}>
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
                  <div key={dest.id} className="flex justify-between p-2 border rounded items-center">
                    <div className="flex items-center space-x-2">
                      <Landmark className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="font-medium">{dest.name}</div>
                        <div className="text-sm text-muted-foreground">{dest.city}, {dest.country}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold mb-3">Activities</h4>
                <p className="text-muted-foreground text-sm">No activities yet.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
