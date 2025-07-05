"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { Bell, Plane, Calendar, DollarSign, MapPin, Check, X, Settings } from "lucide-react"

const mockNotifications = [
  {
    id: 1,
    type: "FLIGHT_REMINDER",
    title: "Flight Reminder",
    message: "Your flight to Tokyo departs in 24 hours. Check-in is now available.",
    scheduledFor: "2024-04-09T10:00:00",
    isRead: false,
    tripName: "Tokyo Explorer",
  },
  {
    id: 2,
    type: "CHECK_IN_REMINDER",
    title: "Hotel Check-in",
    message: "Hotel check-in reminder for Belmond Hotel Monasterio in Cusco.",
    scheduledFor: "2024-04-15T14:00:00",
    isRead: false,
    tripName: "Peru Adventure",
  },
  {
    id: 3,
    type: "ACTIVITY_REMINDER",
    title: "Activity Reminder",
    message: "Machu Picchu tour starts at 6:00 AM tomorrow. Don't forget your camera!",
    scheduledFor: "2024-04-16T05:30:00",
    isRead: true,
    tripName: "Peru Adventure",
  },
  {
    id: 4,
    type: "BUDGET_ALERT",
    title: "Budget Alert",
    message: "You've spent 80% of your budget for Tokyo Explorer trip.",
    scheduledFor: "2024-04-12T09:00:00",
    isRead: false,
    tripName: "Tokyo Explorer",
  },
]

const notificationSettings = [
  {
    id: "flight_reminders",
    label: "Flight Reminders",
    description: "Get notified about upcoming flights and check-in times",
    enabled: true,
    icon: Plane,
  },
  {
    id: "activity_reminders",
    label: "Activity Reminders",
    description: "Reminders for booked activities and tours",
    enabled: true,
    icon: Calendar,
  },
  {
    id: "budget_alerts",
    label: "Budget Alerts",
    description: "Notifications when you approach your budget limits",
    enabled: true,
    icon: DollarSign,
  },
  {
    id: "location_updates",
    label: "Location Updates",
    description: "Updates about your destinations and local recommendations",
    enabled: false,
    icon: MapPin,
  },
]

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [settings, setSettings] = useState(notificationSettings)
  const [activeTab, setActiveTab] = useState("notifications")

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification,
      ),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const deleteNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  const toggleSetting = (settingId) => {
    setSettings((prev) =>
      prev.map((setting) => (setting.id === settingId ? { ...setting, enabled: !setting.enabled } : setting)),
    )
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "FLIGHT_REMINDER":
        return Plane
      case "CHECK_IN_REMINDER":
        return Calendar
      case "ACTIVITY_REMINDER":
        return Calendar
      case "BUDGET_ALERT":
        return DollarSign
      default:
        return Bell
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "FLIGHT_REMINDER":
        return "text-blue-600 bg-blue-100"
      case "CHECK_IN_REMINDER":
        return "text-green-600 bg-green-100"
      case "ACTIVITY_REMINDER":
        return "text-purple-600 bg-purple-100"
      case "BUDGET_ALERT":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.abs(now - date) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Notifications</h2>
          <p className="text-muted-foreground">Stay updated on your travel plans</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={activeTab === "notifications" ? "default" : "outline"}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>
          <Button variant={activeTab === "settings" ? "default" : "outline"} onClick={() => setActiveTab("settings")}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {activeTab === "notifications" && (
        <div className="space-y-4">
          {unreadCount > 0 && (
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-semibold">You have {unreadCount} unread notifications</h3>
                <p className="text-sm text-muted-foreground">Stay on top of your travel plans</p>
              </div>
              <Button onClick={markAllAsRead} variant="outline" size="sm">
                Mark all as read
              </Button>
            </div>
          )}

          <div className="space-y-3">
            {notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type)
              const colorClasses = getNotificationColor(notification.type)

              return (
                <Card
                  key={notification.id}
                  className={`${!notification.isRead ? "border-blue-200 bg-blue-50/30" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${colorClasses}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{notification.title}</h4>
                          <div className="flex items-center space-x-2">
                            {!notification.isRead && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatTime(notification.scheduledFor)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="outline" className="text-xs">
                            {notification.tripName}
                          </Badge>
                          <div className="flex space-x-1">
                            {!notification.isRead && (
                              <Button size="sm" variant="ghost" onClick={() => markAsRead(notification.id)}>
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button size="sm" variant="ghost" onClick={() => deleteNotification(notification.id)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Customize when and how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {settings.map((setting) => {
              const IconComponent = setting.icon
              return (
                <div key={setting.id} className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <Label htmlFor={setting.id} className="font-medium">
                        {setting.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                  <Switch id={setting.id} checked={setting.enabled} onCheckedChange={() => toggleSetting(setting.id)} />
                </div>
              )
            })}

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-3">Notification Timing</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Flight reminders</Label>
                  <select className="px-3 py-1 border rounded text-sm">
                    <option>24 hours before</option>
                    <option>12 hours before</option>
                    <option>6 hours before</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Activity reminders</Label>
                  <select className="px-3 py-1 border rounded text-sm">
                    <option>1 day before</option>
                    <option>2 hours before</option>
                    <option>1 hour before</option>
                  </select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
