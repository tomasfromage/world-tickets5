"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Search, Ticket, Plus, TrendingUp, Menu, X, Loader2 } from "lucide-react"
import { useTicketStore } from "@/lib/store"
import { VerificationLevel } from "@worldcoin/minikit-js"
import { MiniKit } from "@worldcoin/minikit-js"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function HomePage() {
  const { events, searchEvents, loadEvents, isLoading, error } = useTicketStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEvents, setFilteredEvents] = useState(events)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showVerification, setShowVerification] = useState(true);
  const [verificationState, setVerificationState] = useState<'pending' | 'success' | 'failed' | undefined>(undefined);
  const [userData, setUserData] = useState<any>(null)

  // Načtení eventů ze Supabase při prvním načítání
  useEffect(() => {
    console.log('Loading events from Supabase...')
    loadEvents()
  }, [loadEvents])

  useEffect(() => {
    if (searchTerm) {
      setFilteredEvents(searchEvents(searchTerm))
    } else {
      setFilteredEvents(events)
    }
  }, [searchTerm, events, searchEvents])

  const handleVerification = useCallback(async () => {
    setVerificationState('pending');
    
    try {
      const result = await MiniKit.commandsAsync.verify({
        action: 'verification',
        verification_level: VerificationLevel.Device,
      });

      // Verify the proof
      const response = await fetch('/api/verify-proof', {
        method: 'POST',
        body: JSON.stringify({
          payload: result.finalPayload,
          action: 'verification',
        }),
      });

      const data = await response.json();
      if (data.verifyRes.success) {
        setVerificationState('success');
        setIsVerified(true);
        setTimeout(() => {
          setShowVerification(false);
        }, 1500);
      } else {
        setVerificationState('failed');
        setTimeout(() => {
          setVerificationState(undefined);
        }, 2000);
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationState('failed');
      setTimeout(() => {
        setVerificationState(undefined);
      }, 2000);
    }
  }, []);

  // Automatically open verification dialog after loading
  useEffect(() => {
    // Small delay to let the page load
    const timer = setTimeout(() => {
      if (!isVerified && showVerification) {
        handleVerification();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isVerified, showVerification, handleVerification]);

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
              <span className="text-lg sm:text-2xl font-bold text-gray-900">Tickets</span>
            </div>

            {/* User info */}
            {userData && (
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <span>Vítej, {userData.username || userData.address?.slice(0, 8) || 'Uživatel'}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-purple-600 font-medium">
                Eventy
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
              {userData && (
                <div className="px-4 py-2 text-sm text-gray-600 border-b">
                  Vítej, {userData.username || userData.address?.slice(0, 8) || 'Uživatel'}
                </div>
              )}
              <Link
                href="/"
                className="block px-4 py-2 text-gray-900 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Eventy
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
            Objevte Úžasné Eventy
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            Najděte, kupte a prodávejte lístky na koncerty, sport, divadlo a mnoho dalšího
          </p>

          {/* Mobile-Optimized Search Bar */}
          <div className="relative max-w-2xl mx-auto px-4">
            <Search className="absolute left-6 sm:left-7 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
            <Input
              type="text"
              placeholder="Hledat eventy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Error Alert */}
      {error && (
        <section className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                Chyba při načítání eventů: {error}
              </AlertDescription>
            </Alert>
          </div>
        </section>
      )}

      {/* Mobile-Optimized Events Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <Link href="/marketplace">
              <Button variant="outline" className="flex items-center space-x-2 w-full sm:w-auto">
                <TrendingUp className="h-4 w-4" />
                <span>Show Marketplace</span>
              </Button>
            </Link>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Načítání eventů...</span>
            </div>
          )}

          {/* Events Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredEvents.length === 0 && !isLoading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? 'Nenalezeny žádné eventy odpovídající vyhledávání.' : 'Zatím nebyly přidány žádné eventy.'}
                  </p>
                  {!searchTerm && (
                    <Link href="/events/create" className="mt-4 inline-block">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Vytvořit první event
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-video bg-gradient-to-r from-purple-400 to-blue-500 relative">
                      {event.imageUrl ? (
                        <img 
                          src={event.imageUrl} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center p-4">
                          <h3 className="text-white text-lg sm:text-xl font-bold text-center leading-tight">{event.title}</h3>
                        </div>
                      )}
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
                            {formatDate(event.date)} v {formatTime(event.time)}
                          </span>
                        </div>
                        <div className="flex items-center text-xs sm:text-sm text-gray-600">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg sm:text-xl font-bold text-purple-600">
                          {event.price.toLocaleString('en-US')} $
                        </div>
                        <Link href={`/events/${event.id}`}>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm">
                            Purchase
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
