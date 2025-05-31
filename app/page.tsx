"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Search, Ticket, Plus, TrendingUp, Menu, X } from "lucide-react"
import { useTicketStore } from "@/lib/store"

export default function HomePage() {
  const { events, searchEvents } = useTicketStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (searchTerm) {
      setFilteredEvents(searchEvents(searchTerm))
    } else {
      setFilteredEvents(events)
    }
  }, [searchTerm, events, searchEvents])

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
              <Link href="/" className="text-gray-900 hover:text-purple-600 font-medium">
                Events
              </Link>
              <Link href="/marketplace" className="text-gray-600 hover:text-purple-600">
                Marketplace
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-purple-600">
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
              <Link
                href="/"
                className="block px-4 py-2 text-gray-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
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
                className="block px-4 py-2 text-gray-600"
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

      {/* Mobile-Optimized Hero Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Discover Amazing Events
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            Find, buy, and sell tickets for concerts, sports, theater, and more
          </p>

          {/* Mobile-Optimized Search Bar */}
          <div className="relative max-w-2xl mx-auto px-4">
            <Search className="absolute left-6 sm:left-7 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Stats Section */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
            <div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">{events.length}+</div>
              <div className="text-sm sm:text-base text-gray-600">Live Events</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">50K+</div>
              <div className="text-sm sm:text-base text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm sm:text-base text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-Optimized Events Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <Link href="/marketplace">
              <Button variant="outline" className="flex items-center space-x-2 w-full sm:w-auto">
                <TrendingUp className="h-4 w-4" />
                <span>View Marketplace</span>
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video bg-gradient-to-r from-purple-400 to-blue-500 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4">
                    <h3 className="text-white text-lg sm:text-xl font-bold text-center leading-tight">{event.title}</h3>
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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                    <div>
                      <span className="text-xl sm:text-2xl font-bold text-purple-600">${event.price}</span>
                      <span className="text-xs sm:text-sm text-gray-500 ml-1">per ticket</span>
                    </div>
                    <Link href={`/events/${event.id}`} className="w-full sm:w-auto">
                      <Button className="w-full sm:w-auto text-sm">Buy Tickets</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-base sm:text-lg">No events found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
