"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, MapPin, Ticket, Users, CreditCard, CheckCircle } from "lucide-react"
import { useTicketStore } from "@/lib/store"

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { events, purchaseTickets } = useTicketStore()
  const [event, setEvent] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [purchaseComplete, setPurchaseComplete] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  useEffect(() => {
    const foundEvent = events.find((e) => e.id === params.id)
    setEvent(foundEvent)
  }, [events, params.id])

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <Link href="/">
            <Button>Back to Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault()

    const success = purchaseTickets(event.id, quantity)
    if (success) {
      setPurchaseComplete(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    }
  }

  const totalPrice = event.price * quantity

  if (purchaseComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto w-full">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Purchase Successful!</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              You've successfully purchased {quantity} ticket{quantity > 1 ? "s" : ""} for {event.title}.
            </p>
            <p className="text-xs sm:text-sm text-gray-500">Redirecting to your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Events</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                <span className="text-lg sm:text-2xl font-bold text-gray-900">TicketHub</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Event Details */}
          <div className="lg:col-span-2">
            <Card>
              <div className="aspect-video bg-gradient-to-r from-purple-400 to-blue-500 relative rounded-t-lg">
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-t-lg p-4">
                  <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold text-center">{event.title}</h1>
                </div>
              </div>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start space-y-2 sm:space-y-0">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-xl sm:text-2xl">{event.title}</CardTitle>
                    <CardDescription className="mt-2 text-sm sm:text-base">{event.description}</CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm shrink-0">
                    {event.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">Date & Time</p>
                        <p className="text-sm sm:text-base text-gray-600">{formatDate(event.date)}</p>
                        <p className="text-sm sm:text-base text-gray-600">{formatTime(event.time)}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm sm:text-base">Venue</p>
                        <p className="text-sm sm:text-base text-gray-600 break-words">{event.venue}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Ticket className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">Ticket Price</p>
                        <p className="text-xl sm:text-2xl font-bold text-purple-600">${event.price}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm sm:text-base">Availability</p>
                        <p className="text-sm sm:text-base text-gray-600">{event.availableTickets} tickets left</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Purchase Section */}
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Purchase Tickets</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Secure your spot at this amazing event
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showPurchaseForm ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="quantity" className="text-sm sm:text-base">
                        Number of Tickets
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={event.availableTickets}
                        value={quantity}
                        onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm sm:text-base">
                        <span>Tickets ({quantity}x)</span>
                        <span>${(event.price * quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm sm:text-base">
                        <span>Service Fee</span>
                        <span>${(totalPrice * 0.1).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-base sm:text-lg">
                        <span>Total</span>
                        <span>${(totalPrice * 1.1).toFixed(2)}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowPurchaseForm(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-sm sm:text-base"
                      disabled={event.availableTickets === 0}
                    >
                      {event.availableTickets === 0 ? "Sold Out" : "Continue to Payment"}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handlePurchase} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm sm:text-base">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className="text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm sm:text-base">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        className="text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardNumber" className="text-sm sm:text-base">
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData((prev) => ({ ...prev, cardNumber: e.target.value }))}
                        className="text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiryDate" className="text-sm sm:text-base">
                          Expiry
                        </Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={formData.expiryDate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                          className="text-sm sm:text-base"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm sm:text-base">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => setFormData((prev) => ({ ...prev, cvv: e.target.value }))}
                          className="text-sm sm:text-base"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPurchaseForm(false)}
                        className="flex-1 text-sm sm:text-base"
                      >
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-sm sm:text-base">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay ${(totalPrice * 1.1).toFixed(2)}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
