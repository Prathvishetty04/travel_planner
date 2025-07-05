"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import DestinationSearch from "./components/destination-search"
import TripPlanner from "./components/trip-planner"
import BudgetTracker from "./components/budget-tracker"
import AdminPanel from "./components/admin-panel"
import Notifications from "./components/notifications"
import LoginForm from "./components/login-form"

export default function TravelPlannerApp() {
  const [user, setUser] = useState(null)

  if (!user) {
    return <LoginForm onLogin={setUser} />
  }

  const handleLogout = () => {
    setUser(null)
  }

  return (
    <main className="min-h-screen bg-gray-100 font-sans">
      {/* Hero Banner */}
      <header className="relative h-64 sm:h-72 lg:h-80 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1"
          alt="Travel Banner"
          className="absolute inset-0 object-cover w-full h-full filter brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-600/60" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-serif font-extrabold tracking-wide drop-shadow-md">
                Welcome, <span className="whitespace-nowrap">{user.firstName} {user.lastName}</span>
              </h1>
              <p className="text-sm sm:text-base text-blue-100 mt-1">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
          <div className="mt-4 inline-block bg-white/20 border border-white/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wider">
            {user.role}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="bg-white shadow-xl rounded-xl p-6">
          <Tabs defaultValue="search" className="space-y-6">
            <TabsList className="flex flex-wrap gap-3 justify-center">
              {[
                { value: "search", label: "🌍 Search", color: "bg-blue-600" },
                { value: "plan", label: "🧭 Plan", color: "bg-green-600" },
                { value: "budget", label: "💰 Budget", color: "bg-yellow-500" },
                { value: "notifications", label: "🔔 Notifications", color: "bg-pink-500" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`data-[state=active]:${tab.color} data-[state=active]:text-white 
                    transition-all rounded-full px-5 py-2 text-sm font-medium hover:scale-105 hover:shadow-md`}
                >
                  {tab.label}
                </TabsTrigger>
              ))}

              {user.role === "ADMIN" && (
                <TabsTrigger
                  value="admin"
                  className="data-[state=active]:bg-purple-600 data-[state=active]:text-white 
                    transition-all rounded-full px-5 py-2 text-sm font-medium hover:scale-105 hover:shadow-md"
                >
                  🔒 Admin
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="search" className="animate-fade-in">
              <DestinationSearch user={user} />
            </TabsContent>
            <TabsContent value="plan" className="animate-fade-in">
              <TripPlanner user={user} />
            </TabsContent>
            <TabsContent value="budget" className="animate-fade-in">
              <BudgetTracker user={user} />
            </TabsContent>
            <TabsContent value="notifications" className="animate-fade-in">
              <Notifications user={user} />
            </TabsContent>
            {user.role === "ADMIN" && (
              <TabsContent value="admin" className="animate-fade-in">
                <AdminPanel user={user} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>
    </main>
  )
}
