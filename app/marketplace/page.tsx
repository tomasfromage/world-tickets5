"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, MapPin, Search, Ticket, TrendingUp, Filter, Menu, X } from "lucide-react"
import { useTicketStore } from "@/lib/store"

export default function MarketplacePage() {
  const { resaleTickets, events } = useTicketStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("price-low")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getEventDetails = (eventId: string) => {
    return events.find((event) => event.id === eventId)
  }

  const filteredAndSortedTickets = resaleTickets
    .filter((ticket) => {
      const event = getEventDetails(ticket.eventId)
      if (!event) return false

      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || event.category === categoryFilter

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "date":
          const eventA = getEventDetails(a.eventId)
          const eventB = getEventDetails(b.eventId)
          return new Date(eventA?.date || "").getTime() - new Date(eventB?.date || "").getTime()
        default:
          return 0
      }
    })

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <span className="text-lg sm:text-2xl font-bold text-gray-900">TicketHub</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-purple-600">
                Events
              </Link>
              <Link href="/marketplace" className="text-gray-900 hover:text-purple-600 font-medium">
                Marketplace
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-purple-600">
                Dashboard
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-2">
              <Link href="/events/create" className="hidden sm:block">
                <Button className="bg-purple-600 hover:bg-purple-700 text-sm">Create Event</Button>
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
                className="block px-4 py-2 text-gray-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="px-4">
                <Link href="/events/create" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Create Event</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Ticket Marketplace</h1>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            Buy and sell tickets from other fans at fair prices
          </p>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                type="text"
                placeholder="Search marketplace..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="date">Event Date</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Theater">Theater</SelectItem>
                  <SelectItem value="Comedy">Comedy</SelectItem>
                  <SelectItem value="Conference">Conference</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8 sm:mb-12">
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-gray-900">{resaleTickets.length}</div>
              <div className="text-xs sm:text-base text-gray-600">Tickets Available</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <Ticket className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-gray-900">
                ${resaleTickets.length > 0 ? Math.min(...resaleTickets.map((t) => t.price)) : 0}
              </div>
              <div className="text-xs sm:text-base text-gray-600">Lowest Price</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-6 text-center">
              <Filter className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-gray-900">
                {new Set(resaleTickets.map((t) => getEventDetails(t.eventId)?.category)).size}
              </div>
              <div className="text-xs sm:text-base text-gray-600">Categories</div>
            </CardContent>
          </Card>
        </div>

        {/* Marketplace Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAndSortedTickets.map((ticket) => {
            const event = getEventDetails(ticket.eventId)
            if (!event) return null

            return (
              <Card key={ticket.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video bg-gradient-to-r from-purple-400 to-blue-500 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4">
                    <h3 className="text-white text-lg sm:text-xl font-bold text-center leading-tight">{event.title}</h3>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-xs">Resale</Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start space-x-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg truncate">{event.title}</CardTitle>
                      <CardDescription className="mt-1 text-sm">Sold by: {ticket.sellerName}</CardDescription>
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                    <div>
                      <span className="text-xl sm:text-2xl font-bold text-purple-600">${ticket.price}</span>
                      <span className="text-xs sm:text-sm text-gray-500 ml-1">per ticket</span>
                      {ticket.price < event.price && (
                        <div className="text-xs sm:text-sm text-green-600 font-medium">
                          Save ${(event.price - ticket.price).toFixed(2)}
                        </div>
                      )}
                    </div>
                    <Button className="w-full sm:w-auto text-sm">Buy Now</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredAndSortedTickets.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-sm sm:text-base text-gray-500">
              Try adjusting your search or filters to find more tickets.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
