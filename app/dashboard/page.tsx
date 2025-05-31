"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, MapPin, Ticket, Plus, DollarSign, Users, TrendingUp, Menu, X } from "lucide-react"
import { useTicketStore } from "@/lib/store"

export default function DashboardPage() {
  const { events, userTickets, resaleTickets, addResaleTicket } = useTicketStore()
  const [resalePrice, setResalePrice] = useState("")
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const userEvents = events.filter((event) => event.createdBy === "user")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
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

  const handleListForResale = () => {
    if (selectedTicket && resalePrice) {
      addResaleTicket({
        id: Date.now().toString(),
        eventId: selectedTicket.eventId,
        originalPrice: selectedTicket.price,
        price: Number.parseFloat(resalePrice),
        sellerName: "You",
        listedAt: new Date().toISOString(),
      })
      setResalePrice("")
      setSelectedTicket(null)
    }
  }

  const totalRevenue = userEvents.reduce(
    (sum, event) => sum + event.price * (event.totalTickets - event.availableTickets),
    0,
  )

  const totalTicketsSold = userEvents.reduce((sum, event) => sum + (event.totalTickets - event.availableTickets), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <span className="text-lg sm:text-2xl font-bold text-gray-900">Tickets</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-purple-600">
                Events
              </Link>
              <Link href="/marketplace" className="text-gray-600 hover:text-purple-600">
                Marketplace
              </Link>
              <Link href="/dashboard" className="text-gray-900 hover:text-purple-600 font-medium">
                Dashboard
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2">
              <Link href="/events/create" className="hidden sm:block">
                <Button className="bg-purple-600 hover:bg-purple-700 text-sm">
                  <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Create Event</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </Link>
              <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white py-4 space-y-3">
              <Link href="/" className="block px-4 py-2 text-gray-600" onClick={() => setMobileMenuOpen(false)}>
                Events
              </Link>
              <Link
                href="/marketplace"
                className="block px-4 py-2 text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-gray-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="px-4">
                <Link href="/events/create" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your events and tickets</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Events Created</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{userEvents.length}</p>
                </div>
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Tickets Sold</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{totalTicketsSold}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="text-center sm:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">My Tickets</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{userTickets.length}</p>
                </div>
                <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my-events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="my-events" className="text-xs sm:text-sm py-2 sm:py-3">
              My Events
            </TabsTrigger>
            <TabsTrigger value="my-tickets" className="text-xs sm:text-sm py-2 sm:py-3">
              My Tickets
            </TabsTrigger>
            <TabsTrigger value="resale" className="text-xs sm:text-sm py-2 sm:py-3">
              Resale Listings
            </TabsTrigger>
          </TabsList>

          {/* My Events Tab */}
          <TabsContent value="my-events" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Events</h2>
              <Link href="/events/create">
                <Button className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Event
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {userEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-r from-purple-400 to-blue-500 relative">
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4">
                      <h3 className="text-white text-lg sm:text-xl font-bold text-center leading-tight">
                        {event.title}
                      </h3>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start space-x-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg truncate">{event.title}</CardTitle>
                        <CardDescription className="mt-1 text-sm line-clamp-2">{event.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {event.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
                        <span className="truncate">
                          {formatDate(event.date)} at {formatTime(event.time)}
                        </span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-600">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-600">Sold:</span>
                        <span className="font-medium ml-1">
                          {event.totalTickets - event.availableTickets}/{event.totalTickets}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-medium ml-1 text-green-600">
                          ${(event.price * (event.totalTickets - event.availableTickets)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {userEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No events yet</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">
                  Create your first event to start selling tickets
                </p>
                <Link href="/events/create">
                  <Button>Create Event</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* My Tickets Tab */}
          <TabsContent value="my-tickets" className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Tickets</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {userTickets.map((ticket) => {
                const event = events.find((e) => e.id === ticket.eventId)
                if (!event) return null

                return (
                  <Card key={ticket.id} className="overflow-hidden">
                    <div className="aspect-video bg-gradient-to-r from-green-400 to-blue-500 relative">
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4">
                        <h3 className="text-white text-lg sm:text-xl font-bold text-center leading-tight">
                          {event.title}
                        </h3>
                      </div>
                      <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-xs">Owned</Badge>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg truncate">{event.title}</CardTitle>
                      <CardDescription className="text-sm">
                        Purchased on {formatDate(ticket.purchaseDate)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
                          <span className="truncate">
                            {formatDate(event.date)} at {formatTime(event.time)}
                          </span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                        <div>
                          <span className="text-base sm:text-lg font-bold text-gray-900">${ticket.price}</span>
                          <span className="text-xs sm:text-sm text-gray-500 ml-1">paid</span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTicket(ticket)}
                              className="w-full sm:w-auto text-xs sm:text-sm"
                            >
                              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Resell
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-lg sm:text-xl">List Ticket for Resale</DialogTitle>
                              <DialogDescription className="text-sm sm:text-base">
                                Set your price for this ticket. The original price was ${ticket.price}.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="resale-price" className="text-sm sm:text-base">
                                  Resale Price ($)
                                </Label>
                                <Input
                                  id="resale-price"
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="Enter price"
                                  value={resalePrice}
                                  onChange={(e) => setResalePrice(e.target.value)}
                                  className="text-sm sm:text-base"
                                />
                              </div>
                              <Button onClick={handleListForResale} className="w-full text-sm sm:text-base">
                                List for Resale
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {userTickets.length === 0 && (
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No tickets yet</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">Purchase tickets to see them here</p>
                <Link href="/">
                  <Button>Browse Events</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Resale Listings Tab */}
          <TabsContent value="resale" className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Resale Listings</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {resaleTickets
                .filter((ticket) => ticket.sellerName === "You")
                .map((ticket) => {
                  const event = events.find((e) => e.id === ticket.eventId)
                  if (!event) return null

                  return (
                    <Card key={ticket.id} className="overflow-hidden">
                      <div className="aspect-video bg-gradient-to-r from-orange-400 to-red-500 relative">
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4">
                          <h3 className="text-white text-lg sm:text-xl font-bold text-center leading-tight">
                            {event.title}
                          </h3>
                        </div>
                        <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600 text-xs">
                          Listed
                        </Badge>
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg truncate">{event.title}</CardTitle>
                        <CardDescription className="text-sm">Listed on {formatDate(ticket.listedAt)}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-xs sm:text-sm text-gray-600">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
                            <span className="truncate">
                              {formatDate(event.date)} at {formatTime(event.time)}
                            </span>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-600">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Original Price:</span>
                            <span>${ticket.originalPrice}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 text-xs sm:text-sm">Listed Price:</span>
                            <span className="font-bold text-base sm:text-lg text-purple-600">${ticket.price}</span>
                          </div>
                          {ticket.price !== ticket.originalPrice && (
                            <div className="flex justify-between text-xs sm:text-sm">
                              <span className="text-gray-600">
                                {ticket.price > ticket.originalPrice ? "Markup:" : "Discount:"}
                              </span>
                              <span className={ticket.price > ticket.originalPrice ? "text-red-600" : "text-green-600"}>
                                {ticket.price > ticket.originalPrice ? "+" : ""}$
                                {(ticket.price - ticket.originalPrice).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>

            {resaleTickets.filter((ticket) => ticket.sellerName === "You").length === 0 && (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No resale listings</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4">List your tickets for resale to see them here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
