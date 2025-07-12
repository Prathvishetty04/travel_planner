"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import DestinationSearch from "./components/destination-search"
import TripPlanner from "./components/trip-planner"
import BudgetTracker from "./components/budget-tracker"
import AdminPanel from "./components/admin-panel"
import Notifications from "./components/notifications"
import LoginForm from "./components/login-form"
import HotelRecommendations from "./components/hotel-recommendations"
import clsx from "clsx"

export default function TravelPlannerApp() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("search")
  const [initialTripId, setInitialTripId] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }

    const storedTripId = localStorage.getItem("selectedTripId")
    if (storedTripId) {
      setActiveTab("hotels")
      setInitialTripId(storedTripId)
      localStorage.removeItem("selectedTripId")
    }
  }, [])

  // Add event listener for switching to hotels tab
  useEffect(() => {
    const handleSwitchToHotels = (event) => {
      const { tripId } = event.detail
      setActiveTab("hotels")
      setInitialTripId(tripId)
      // Store the tripId in localStorage so HotelRecommendations can pick it up
      localStorage.setItem("selectedTripId", tripId)
    }

    window.addEventListener('switchToHotels', handleSwitchToHotels)
    return () => window.removeEventListener('switchToHotels', handleSwitchToHotels)
  }, [])

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
    localStorage.setItem("user", JSON.stringify(loggedInUser))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  if (!user) return <LoginForm onLogin={handleLogin} />

  return (
    <main className="min-h-screen bg-[#dedcdc] font-sans pt-4">
      {/* Hero Banner */}
      <header className="relative h-64 sm:h-72 lg:h-80 overflow-hidden rounded-2xl ml-8 mr-8 mb-3">
        <img
          src="https://i.pinimg.com/736x/a1/47/4f/a1474f75337f01d16565ee759c6381af.jpg"
          alt="Travel Banner"
          className="absolute inset-0 object-cover w-full h-full filter brightness-75 saturate-150 rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20 rounded-lg" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold tracking-wide text-white drop-shadow-lg">
                Welcome, <span className="whitespace-nowrap">{user.firstName} {user.lastName}</span>
              </h1>
              <p className="text-sm sm:text-base text-white/90 mt-2 drop-shadow-md">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/30 hover:border-white/50"
            >
              Logout
            </button>
          </div>
          <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 mt-6 font-semibold text-lg sm:text-xl text-white max-w-max">
            {user.role}
          </div>
        </div>
      </header>

      {/* Main Content Tabs */}
      <section className="w-7xl mx-auto px-4 py-4 space-y-6">
        <div className="bg-[#eff1f1] shadow-xl rounded-xl p-6 ml-2 mr-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap gap-8 bg-black rounded-full">
              {["search", "plan", "budget", "notifications", "hotels"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className={clsx(
                    "bg-[#151515] font-bold text-white pl-4 pr-4 rounded-md text-sm hover:scale-105 hover:shadow-md hover:bg-[#d2d6d5] hover:text-gray-800",
                    activeTab === tab && "bg-white text-green"
                  )}
                >
                  {tab.toUpperCase()}
                </TabsTrigger>
              ))}
              {user.role === "ADMIN" && (
                <TabsTrigger
                  value="admin"
                  className={clsx(
                    "bg-[#151515] font-bold text-white pl-4 pr-4 rounded-md text-sm hover:scale-105 hover:shadow-md hover:bg-[#d2d6d5] hover:text-gray-800",
                    activeTab === "admin" && "bg-white text-green"
                  )}
                >
                  ADMIN
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="search"><DestinationSearch user={user} /></TabsContent>
            <TabsContent value="plan"><TripPlanner user={user} /></TabsContent>
            <TabsContent value="budget"><BudgetTracker user={user} /></TabsContent>
            <TabsContent value="notifications"><Notifications user={user} /></TabsContent>
            <TabsContent value="hotels"><HotelRecommendations user={user} tripId={initialTripId} /></TabsContent>
            {user.role === "ADMIN" && (
              <TabsContent value="admin"><AdminPanel user={user} /></TabsContent>
            )}
          </Tabs>
        </div>
      </section>
    </main>
  )
}