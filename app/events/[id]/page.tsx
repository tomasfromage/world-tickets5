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
import { MiniKit, tokenToDecimals, Tokens, PayCommandInput, ResponseEvent, type MiniAppPaymentPayload, VerificationLevel } from '@worldcoin/minikit-js'

// Define Event type based on the store interface
interface Event {
  id: string
  title: string
  description: string
  category: string
  date: string
  time: string
  venue: string
  price: number
  totalTickets: number
  availableTickets: number
  createdAt: string
  createdBy?: string
  imageUrl?: string
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { events, purchaseTickets } = useTicketStore()
  const [event, setEvent] = useState<Event | undefined>(undefined)
  const [quantity, setQuantity] = useState(1)
  const [purchaseComplete, setPurchaseComplete] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const foundEvent = events.find((e) => e.id === params.id)
    setEvent(foundEvent)
  }, [events, params.id])

  // Setup MiniKit event listener
  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit is not installed")
      return
    }

    console.log('Setting up MiniKit payment event listener...')

    const handlePaymentResponse = async (response: MiniAppPaymentPayload) => {
      console.log('MiniKit payment response received:', response)
      
      if (response.status === "success") {
        console.log('Payment was successful, confirming on backend...')
        try {
          const res = await fetch('/api/confirm-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          })
          
          const payment = await res.json()
          console.log('Payment confirmation response:', payment)
          
          if (payment.success) {
            console.log('Payment confirmed! Updating ticket store...')
            // Successful payment - update store
            const success = purchaseTickets(event!.id, quantity)
            if (success) {
              console.log('Tickets purchased successfully! Redirecting...')
              setPurchaseComplete(true)
              setTimeout(() => {
                router.push("/dashboard")
              }, 3000)
            }
          } else {
            console.error('Payment not confirmed:', payment)
            alert('Payment failed. Please try again.')
            // Reset states on payment failure
            setIsProcessingPayment(false)
          }
        } catch (error) {
          console.error('Error confirming payment:', error)
          alert('An error occurred while processing payment.')
          // Reset states on error
          setIsProcessingPayment(false)
        }
      } else {
        // Handle all non-success cases (cancelled, error, etc.)
        console.log('Payment was not successful:', response)
        
        if (response.status === "error") {
          alert('Payment error occurred. Please try again.')
        }
        // For cancelled status, we don't show alert (user intentionally cancelled)
        
        // Reset all processing states
        setIsProcessingPayment(false)
        setIsVerifying(false)
        // Keep isVerified status - user is still verified for future attempts
      }
    }

    MiniKit.subscribe(ResponseEvent.MiniAppPayment, handlePaymentResponse)

    return () => {
      console.log('Unsubscribing from MiniKit events')
      MiniKit.unsubscribe(ResponseEvent.MiniAppPayment)
    }
  }, [events, params.id, quantity, purchaseTickets, router, event])

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

  const handleVerification = async () => {
    if (!MiniKit.isInstalled()) {
      alert('World App is not installed. World App is required for verification.')
      return false
    }

    console.log('Starting verification process...')
    setIsVerifying(true)

    try {
      const result = await MiniKit.commandsAsync.verify({
        action: 'verification',
        verification_level: VerificationLevel.Device,
      })

      console.log('Verification result received:', result)

      // Check if verification was cancelled or failed in the async response
      if (result.finalPayload.status === 'error') {
        console.log('Verification was cancelled or failed')
        setIsVerifying(false)
        return false
      }

      console.log('Sending proof to backend for verification...')
      console.log('Payload being sent:', {
        payload: result.finalPayload,
        action: 'verification',
      })

      // Verify the proof on backend
      const response = await fetch('/api/verify-proof', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: result.finalPayload,
          action: 'verification',
        }),
      })

      console.log('Backend response status:', response.status)
      console.log('Backend response ok:', response.ok)

      const data = await response.json()
      console.log('Backend verification response full data:', data)
      console.log('data.verifyRes:', data.verifyRes)
      console.log('data.verifyRes.success:', data.verifyRes?.success)
      
      if (data.verifyRes && data.verifyRes.success) {
        console.log('Verification successful! Setting isVerified to true')
        setIsVerified(true)
        setIsVerifying(false)
        console.log('isVerified should now be true')
        return true
      } else {
        console.error('Verification failed:', data)
        console.error('verifyRes.success is:', data.verifyRes?.success)
        alert('Verification failed. Please try again.')
        setIsVerifying(false)
        return false
      }
    } catch (error) {
      console.error('Error during verification:', error)
      alert('An error occurred during verification.')
      setIsVerifying(false)
      return false
    }
  }

  const proceedWithPayment = async () => {
    setIsProcessingPayment(true)

    try {
      // Iniciate payment on backend
      const res = await fetch('/api/initiate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          quantity: quantity,
          totalAmount: totalPrice * 1.03 // including service fee
        })
      })

      const { id } = await res.json()

      // Convert price to USDC (assuming price is in USD)
      const totalAmountInUSDC = totalPrice * 1.03

      const payload: PayCommandInput = {
        reference: id,
        to: "0x18D65F587BeCE576291FEced4feb6F2f8C47579e", 
        tokens: [
          {
            symbol: Tokens.USDCE,
            token_amount: tokenToDecimals(totalAmountInUSDC, Tokens.USDCE).toString(),
          },
        ],
        description: `Purchase ${quantity}x tickets for ${event.title}`,
      }

      console.log('Iniciating MiniKit payment:', payload)
      
      // Send payment command
      MiniKit.commands.pay(payload)
      
    } catch (error) {
      console.error('Error initiating payment:', error)
      alert('An error occurred while initiating payment.')
      setIsProcessingPayment(false)
    }
  }

  const handleMiniKitPayment = async () => {
    if (!MiniKit.isInstalled()) {
      alert('World App is not installed. World App is required for payment.')
      return
    }

    if (!isVerified) {
      alert('Please verify your identity first.')
      return
    }

    await proceedWithPayment()
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

  console.log('Rendering with isVerified:', isVerified, 'isVerifying:', isVerifying, 'isProcessingPayment:', isProcessingPayment)

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
                <span className="text-lg sm:text-2xl font-bold text-gray-900">Tickets</span>
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

                  {!isVerified ? (
                    <Button
                      onClick={handleVerification}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-sm sm:text-base"
                      disabled={event.availableTickets === 0 || isVerifying}
                    >
                      {event.availableTickets === 0 
                        ? "Sold Out" 
                        : isVerifying
                          ? "Verifying Identity..."
                          : "Verify with World ID"
                      }
                    </Button>
                  ) : (
                    <Button
                      onClick={handleMiniKitPayment}
                      className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base"
                      disabled={event.availableTickets === 0 || isProcessingPayment}
                    >
                      {event.availableTickets === 0 
                        ? "Sold Out" 
                        : isProcessingPayment 
                          ? "Processing Payment..." 
                          : "Pay with World App"
                      }
                    </Button>
                  )}

                  {!MiniKit.isInstalled() && (
                    <p className="text-xs text-gray-500 text-center">
                      World App is required for verification and payment
                    </p>
                  )}

                  {!isVerified && isVerifying && (
                    <p className="text-xs text-blue-600 text-center">
                      Please complete verification in World App
                    </p>
                  )}

                  {isVerified && !isProcessingPayment && (
                    <p className="text-xs text-green-600 text-center flex items-center justify-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Identity verified - ready to pay
                    </p>
                  )}

                  {isProcessingPayment && (
                    <p className="text-xs text-blue-600 text-center">
                      Please confirm payment in World App (you can cancel anytime)
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
