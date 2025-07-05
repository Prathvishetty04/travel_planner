"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Separator } from "../components/ui/separator"
import { Plane } from "lucide-react"

const API_BASE_URL = "http://localhost:8080"

export default function LoginForm({ onLogin, onAdminLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const validateForm = () => {
    setError(null)
    setSuccess(null)

    if (!formData.email) return setError("Email is required"), false
    if (!formData.password) return setError("Password is required"), false
    if (!isLogin && (!formData.firstName || !formData.lastName)) {
      return setError("First and last name required"), false
    }
    if (formData.password.length < 6) return setError("Password must be 6+ characters"), false

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) return setError("Enter a valid email"), false

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const endpoint = isLogin
        ? `${API_BASE_URL}/api/auth/login`
        : `${API_BASE_URL}/api/auth/register`

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          ...(!isLogin && {
            firstName: formData.firstName,
            lastName: formData.lastName,
          }),
        }),
      })

      const contentType = response.headers.get("content-type")
      const data = contentType?.includes("application/json")
        ? await response.json()
        : await response.text()

      if (!response.ok) {
        const errorMessage = data?.message || "Something went wrong"
        throw new Error(errorMessage)
      }

      if (isLogin) {
        onLogin(data)
      } else {
        setSuccess("Account created! Please sign in.")
        setIsLogin(true)
        setFormData({
          email: formData.email,
          password: "",
          firstName: "",
          lastName: "",
        })
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: "mock-google-token" }),
      })

      const user = await response.json()
      if (!response.ok) throw new Error(user.message || "Google login failed")
      onLogin(user)
    } catch (err) {
      console.error("Google login failed:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://freedesignfile.com/upload/2014/08/Travel-summer-beach-background-set-vector-01.jpg")',
      }}
    >
      <div className="w-full max-w-md space-y-6 bg-white/80 backdrop-blur p-6 rounded-xl shadow-xl">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
           <img
  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Blue_plane_icon.svg/512px-Blue_plane_icon.svg.png"
  alt="Logo"
  className="h-16 w-16"
/>

          </div>
          <h1 className="text-3xl font-bold">TravelPlanner</h1>
          <p className="text-gray-700">Plan your perfect journey</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? "Sign In" : "Create Account"}</CardTitle>
            <CardDescription>
              {isLogin ? "Log in to your account" : "Register to start planning"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {success && (
              <div className="text-green-600 text-sm p-3 bg-green-50 rounded-md border border-green-200">
                {success}
              </div>
            )}
            {error && (
              <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading
                  ? "Processing..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </Button>
            </form>

            <Separator />

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              Continue with Google
            </Button>

            <div className="text-center text-sm mt-2">
              <Button
                variant="link"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError(null)
                  setSuccess(null)
                }}
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </Button>
              <br />
              <Button
                variant="link"
                onClick={onAdminLogin}
                className="text-xs text-red-600"
              >
                Admin Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
