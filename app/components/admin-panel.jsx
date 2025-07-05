"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Plus, Edit, Trash2, Star } from "lucide-react"
import { fetchWikipediaImage } from "../utils/wikipedia"

const API_BASE_URL = "http://localhost:8080"

export default function AdminPanel() {
  const [destinations, setDestinations] = useState([])
  const [isAddDestinationOpen, setIsAddDestinationOpen] = useState(false)
  const [newDestination, setNewDestination] = useState({
    name: "",
    country: "",
    city: "",
    description: "",
    category: "",
    latitude: "",
    longitude: "",
  })

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/destinations`)
      .then((res) => res.json())
      .then(setDestinations)
      .catch(console.error)
  }, [])

  const handleAddDestination = async () => {
    const imageUrl = await fetchWikipediaImage(newDestination.name)

    const payload = {
      ...newDestination,
      imageUrl: imageUrl || "/fallback.jpg",
    }

    const res = await fetch(`${API_BASE_URL}/api/destinations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      const saved = await res.json()
      setDestinations([...destinations, saved])
      setNewDestination({
        name: "",
        country: "",
        city: "",
        description: "",
        category: "",
        latitude: "",
        longitude: "",
      })
      setIsAddDestinationOpen(false)
    } else {
      alert("Failed to add destination")
    }
  }

  const deleteDestination = async (id) => {
    await fetch(`${API_BASE_URL}/api/destinations/${id}`, { method: "DELETE" })
    setDestinations(destinations.filter((d) => d.id !== id))
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Admin Panel</h2>
        <Dialog open={isAddDestinationOpen} onOpenChange={setIsAddDestinationOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Destination
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Destination</DialogTitle>
              <DialogDescription>Auto fetches image from Wikipedia</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={newDestination.name} onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newDestination.category} onValueChange={(val) => setNewDestination({ ...newDestination, category: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEACH">Beach</SelectItem>
                    <SelectItem value="ADVENTURE">Adventure</SelectItem>
                    <SelectItem value="HISTORY">History</SelectItem>
                    <SelectItem value="CULTURE">Culture</SelectItem>
                    <SelectItem value="NATURE">Nature</SelectItem>
                    <SelectItem value="URBAN">Urban</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input value={newDestination.country} onChange={(e) => setNewDestination({ ...newDestination, country: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={newDestination.city} onChange={(e) => setNewDestination({ ...newDestination, city: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input value={newDestination.latitude} onChange={(e) => setNewDestination({ ...newDestination, latitude: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input value={newDestination.longitude} onChange={(e) => setNewDestination({ ...newDestination, longitude: e.target.value })} />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Description</Label>
                <Textarea value={newDestination.description} onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })} />
              </div>
            </div>
            <Button className="w-full mt-4" onClick={handleAddDestination}>Save Destination</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <Card key={dest.id}>
            <img src={dest.imageUrl || "/fallback.jpg"} alt={dest.name} className="w-full h-40 object-cover" />
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{dest.name}</CardTitle>
                  <CardDescription>{dest.city}, {dest.country}</CardDescription>
                </div>
                <Badge>{dest.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{dest.description}</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteDestination(dest.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
