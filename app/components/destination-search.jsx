"use client"

import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Search, MapPin, Star, Heart, Plus, Filter } from "lucide-react"
import { fetchWikipediaImage } from "../utils/wiki-image"  
const API_BASE_URL = "http://localhost:8080"

const categories = [
  { value: "ALL", label: "All Categories" },
  { value: "BEACH", label: "Beach" },
  { value: "ADVENTURE", label: "Adventure" },
  { value: "HISTORY", label: "History" },
  { value: "CULTURE", label: "Culture" },
  { value: "NATURE", label: "Nature" },
  { value: "URBAN", label: "Urban" },
]

export default function DestinationSearch({ user }) {
  const [destinations, setDestinations] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [favorites, setFavorites] = useState([])
  const [userTrips, setUserTrips] = useState([])
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/destinations`)
      .then((res) => res.json())
      .then(async (data) => {
        const enriched = await Promise.all(
          data.map(async (dest) => {
            if (!dest.imageUrl || dest.imageUrl.trim() === "") {
              const wikiImg = await fetchWikipediaImage(dest.name)
              return { ...dest, imageUrl: wikiImg || "/fallback.jpg" }
            }
            return dest
          })
        )
        setDestinations(enriched)
      })
      .catch((err) => console.error("Failed to fetch destinations:", err))

    fetch(`${API_BASE_URL}/api/trips/user/${user.id}`)
      .then((res) => res.json())
      .then(setUserTrips)
      .catch((err) => console.error("Failed to load trips", err))
  }, [user.id])

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "ALL" || dest.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (destId) => {
    setFavorites((prev) =>
      prev.includes(destId) ? prev.filter((id) => id !== destId) : [...prev, destId]
    )
  }

  const getCategoryColor = (category) => {
    const colors = {
      BEACH: "bg-blue-100 text-blue-800",
      ADVENTURE: "bg-green-100 text-green-800",
      HISTORY: "bg-amber-100 text-amber-800",
      CULTURE: "bg-purple-100 text-purple-800",
      NATURE: "bg-emerald-100 text-emerald-800",
      URBAN: "bg-gray-100 text-gray-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const handleAddDestinationToTrip = async (tripId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/trips/${tripId}/destinations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationId: selectedDestination }),
      })
      if (!res.ok) throw new Error("Failed to add destination")
      setIsDialogOpen(false)
      alert("Destination added to trip!")
    } catch (err) {
      console.error(err)
      alert("Error adding destination")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Explore Destinations</h2>
        <p className="text-muted-foreground">Discover amazing places that match your interests</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations, cities, or countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((destination) => (
          <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={destination.imageUrl || "/fallback.jpg"}
                alt={destination.name}
                className="w-full h-48 object-cover"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => toggleFavorite(destination.id)}
              >
                <Heart className={`h-4 w-4 ${favorites.includes(destination.id) ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{destination.name}</CardTitle>
                  <CardDescription>
                    {destination.city}, {destination.country}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{destination.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{destination.description}</p>
              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(destination.category)}>{destination.category}</Badge>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedDestination(destination.id)
                    setIsDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add to Trip
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No destinations found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Trip</DialogTitle>
            <DialogDescription>Choose a trip to add this destination</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {userTrips.map((trip) => (
              <Button
                key={trip.id}
                className="w-full justify-between"
                onClick={() => handleAddDestinationToTrip(trip.id)}
              >
                {trip.title}
                <MapPin className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
