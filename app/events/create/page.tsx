"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Ticket,
  DollarSign,
  Eye,
  Music,
  Trophy,
  Theater,
  Mic,
  Users,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react"
import { useTicketStore } from "@/lib/store"

const categoryIcons = {
  Music: Music,
  Sport: Trophy,
  Theater: Theater,
  Comedy: Mic,
  Conference: Briefcase,
  Hackathon: Users,
  Other: Users,
}

const categoryTranslations = {
  Music: 'Music',
  Sport: 'Sport', 
  Theater: 'Theater',
  Comedy: 'Comedy',
  Conference: 'Conference',
  Hackathon: 'Hackathon',
  Other: 'Other'
}

export default function CreateEventPage() {
  const router = useRouter()
  const { addEvent, isLoading } = useTicketStore()
  const [showPreview, setShowPreview] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    venue: "",
    price: "",
    totalTickets: "",
    imageUrl: "",
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required"
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    }

    if (!formData.category) {
      newErrors.category = "Please select a category"
    }

    if (!formData.date) {
      newErrors.date = "Event date is required"
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.date = "Event date cannot be in the past"
      }
    }

    if (!formData.time) {
      newErrors.time = "Event time is required"
    }

    if (!formData.venue.trim()) {
      newErrors.venue = "Venue is required"
    }

    if (!formData.price) {
      newErrors.price = "Ticket price is required"
    } else {
      const price = Number.parseFloat(formData.price)
      if (isNaN(price) || price < 0) {
        newErrors.price = "Price must be a valid positive number"
      } else if (price > 50000) {
        newErrors.price = "Price cannot exceed 50,000"
      }
    }

    if (!formData.totalTickets) {
      newErrors.totalTickets = "Number of tickets is required"
    } else {
      const tickets = Number.parseInt(formData.totalTickets)
      if (isNaN(tickets) || tickets < 1) {
        newErrors.totalTickets = "Must have at least 1 ticket"
      } else if (tickets > 100000) {
        newErrors.totalTickets = "Cannot exceed 100,000 tickets"
      }
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Please enter a valid URL address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitError("")

    const eventData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      date: formData.date,
      time: formData.time,
      venue: formData.venue.trim(),
      price: Number.parseFloat(formData.price),
      totalTickets: Number.parseInt(formData.totalTickets),
      imageUrl: formData.imageUrl.trim() || undefined,
    }

    console.log('Submitting event:', eventData)

    const success = await addEvent(eventData)

    if (success) {
      router.push('/')
    } else {
      setSubmitError("Failed to create event. Please try again.")
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (submitError) {
      setSubmitError("")
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return ""
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split("T")[0]
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back to editing</span>
                  <span className="sm:hidden">Back</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                  <span className="text-lg sm:text-2xl font-bold text-gray-900">Tickets</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4">
              Preview Mode
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Event Preview</h1>
            <p className="text-sm sm:text-base text-gray-600">
              This is how your event will appear to potential attendees
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-r from-purple-400 to-blue-500 relative">
              {formData.imageUrl ? (
                <img 
                  src={formData.imageUrl} 
                  alt={formData.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center p-6">
                  <h1 className="text-white text-2xl sm:text-4xl font-bold text-center">{formData.title || "Event Preview"}</h1>
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                <div>
                  <CardTitle className="text-2xl sm:text-3xl">{formData.title || "Event title"}</CardTitle>
                  <CardDescription className="mt-2 text-lg">{formData.description || "Event description"}</CardDescription>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {formData.category ? categoryTranslations[formData.category as keyof typeof categoryTranslations] : "Category"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Date and time</div>
                      <div className="text-gray-600">
                        {formData.date ? formatDate(formData.date) : "Date not selected"}
                        {formData.time && ` at ${formatTime(formData.time)}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Venue</div>
                      <div className="text-gray-600">{formData.venue || "Venue not specified"}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Ticket price</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {formData.price ? `$${Number(formData.price).toLocaleString('en-US')}` : "Price not specified"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Ticket className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Available tickets</div>
                      <div className="text-gray-600">{formData.totalTickets || "0"} tickets</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button onClick={() => setShowPreview(false)} variant="outline" className="flex-1">
              Continue Editing
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading} className="flex-1 bg-purple-600 hover:bg-purple-700">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Event...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Publish Event
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back to main</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                <span className="text-lg sm:text-2xl font-bold text-gray-900">Tickets</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              Create New Event
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Fill in your event details and start selling tickets
            </p>
          </div>

          <Card className="shadow-lg">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Event Information</CardTitle>
                <CardDescription>
                  All fields marked with * are required
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 sm:space-y-8">
                {/* Error Alert */}
                {submitError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">
                      {submitError}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Basic Info */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Basic information</span>
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm sm:text-base">
                      Event Title *
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter your event title"
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      className={`text-sm sm:text-base ${errors.title ? "border-red-500" : ""}`}
                    />
                    {errors.title && (
                      <p className="text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{errors.title}</span>
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500">
                      Choose a clear and catchy title that will attract attendees
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm sm:text-base">
                      Description *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your event in detail - what attendees can expect, special features, etc."
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className={`min-h-[100px] sm:min-h-[120px] text-sm sm:text-base ${errors.description ? "border-red-500" : ""}`}
                    />
                    {errors.description && (
                      <p className="text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{errors.description}</span>
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500">
                      {formData.description.length}/500 characters - Include key details and highlights
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm sm:text-base">
                      Category *
                    </Label>
                    <Select onValueChange={(value) => handleChange("category", value)}>
                      <SelectTrigger className={`text-sm sm:text-base ${errors.category ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select event category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryIcons).map(([category, Icon]) => (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center space-x-2">
                              <Icon className="h-4 w-4" />
                              <span>{categoryTranslations[category as keyof typeof categoryTranslations]}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{errors.category}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl" className="text-sm sm:text-base">
                      Image URL (optional)
                    </Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) => handleChange("imageUrl", e.target.value)}
                      className={`text-sm sm:text-base ${errors.imageUrl ? "border-red-500" : ""}`}
                    />
                    {errors.imageUrl && (
                      <p className="text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{errors.imageUrl}</span>
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500">
                      Add an image that represents your event
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Date & Time */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Date and Time</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm sm:text-base">
                        Event Date *
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="date"
                          type="date"
                          min={getTomorrowDate()}
                          value={formData.date}
                          onChange={(e) => handleChange("date", e.target.value)}
                          className={`pl-10 text-sm sm:text-base ${errors.date ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.date && (
                        <p className="text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{errors.date}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-sm sm:text-base">
                        Start Time *
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => handleChange("time", e.target.value)}
                        className={`text-sm sm:text-base ${errors.time ? "border-red-500" : ""}`}
                      />
                      {errors.time && (
                        <p className="text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{errors.time}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Location */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Venue</span>
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="venue" className="text-sm sm:text-base">
                      Venue *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="venue"
                        placeholder="Enter venue name and full address"
                        value={formData.venue}
                        onChange={(e) => handleChange("venue", e.target.value)}
                        className={`pl-10 text-sm sm:text-base ${errors.venue ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.venue && (
                      <p className="text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{errors.venue}</span>
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500">Provide full address for easy navigation</p>
                  </div>
                </div>

                <Separator />

                {/* Ticketing */}
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Ticket className="h-5 w-5" />
                    <span>Tickets</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm sm:text-base">
                        Ticket Price ($) *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          min="0"
                          max="50000"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => handleChange("price", e.target.value)}
                          className={`pl-10 text-sm sm:text-base ${errors.price ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.price && (
                        <p className="text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{errors.price}</span>
                        </p>
                      )}
                      <p className="text-xs sm:text-sm text-gray-500">Set a competitive price</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalTickets" className="text-sm sm:text-base">
                        Number of Tickets *
                      </Label>
                      <div className="relative">
                        <Ticket className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="totalTickets"
                          type="number"
                          min="1"
                          max="100000"
                          placeholder="100"
                          value={formData.totalTickets}
                          onChange={(e) => handleChange("totalTickets", e.target.value)}
                          className={`pl-10 text-sm sm:text-base ${errors.totalTickets ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.totalTickets && (
                        <p className="text-xs sm:text-sm text-red-600 flex items-center space-x-1">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{errors.totalTickets}</span>
                        </p>
                      )}
                      <p className="text-xs sm:text-sm text-gray-500">Total number of tickets for sale</p>
                    </div>
                  </div>

                  {formData.price && formData.totalTickets && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Total potential revenue:</strong>{" "}
                        ${(Number(formData.price) * Number(formData.totalTickets)).toLocaleString("en-US")}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>

              <div className="px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Creating event...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Publish Event
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
