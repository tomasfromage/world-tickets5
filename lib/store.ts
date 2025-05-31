"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

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
}

interface Ticket {
  id: string
  eventId: string
  price: number
  purchaseDate: string
  buyerName: string
  buyerEmail: string
}

interface ResaleTicket {
  id: string
  eventId: string
  originalPrice: number
  price: number
  sellerName: string
  listedAt: string
}

interface TicketStore {
  events: Event[]
  userTickets: Ticket[]
  resaleTickets: ResaleTicket[]
  addEvent: (event: Event) => void
  purchaseTickets: (eventId: string, quantity: number) => boolean
  addResaleTicket: (ticket: ResaleTicket) => void
  searchEvents: (term: string) => Event[]
}

const initialEvents: Event[] = [
  {
    id: "1",
    title: "Summer Music Festival 2024",
    description: "Join us for an unforgettable night of music featuring top artists from around the world.",
    category: "Music",
    date: "2024-07-15",
    time: "18:00",
    venue: "Central Park, New York",
    price: 89.99,
    totalTickets: 5000,
    availableTickets: 3247,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Tech Conference 2024",
    description: "Discover the latest innovations in technology with industry leaders and networking opportunities.",
    category: "Conference",
    date: "2024-06-20",
    time: "09:00",
    venue: "Convention Center, San Francisco",
    price: 299.99,
    totalTickets: 1000,
    availableTickets: 234,
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "3",
    title: "Broadway Musical: The Lion King",
    description: "Experience the magic of Disney's The Lion King live on Broadway with stunning visuals and music.",
    category: "Theater",
    date: "2024-08-05",
    time: "19:30",
    venue: "Minskoff Theatre, New York",
    price: 125.0,
    totalTickets: 1600,
    availableTickets: 892,
    createdAt: "2024-01-20T14:00:00Z",
  },
  {
    id: "4",
    title: "NBA Finals Game 7",
    description: "Witness history in the making at the most anticipated basketball game of the year.",
    category: "Sports",
    date: "2024-06-18",
    time: "20:00",
    venue: "Madison Square Garden, New York",
    price: 450.0,
    totalTickets: 20000,
    availableTickets: 5678,
    createdAt: "2024-01-05T12:00:00Z",
  },
  {
    id: "5",
    title: "Comedy Night with Dave Chappelle",
    description: "An evening of laughter with one of the greatest comedians of our time.",
    category: "Comedy",
    date: "2024-07-30",
    time: "21:00",
    venue: "Comedy Club, Los Angeles",
    price: 75.0,
    totalTickets: 500,
    availableTickets: 123,
    createdAt: "2024-01-25T16:00:00Z",
  },
]

const initialResaleTickets: ResaleTicket[] = [
  {
    id: "r1",
    eventId: "1",
    originalPrice: 89.99,
    price: 75.0,
    sellerName: "Sarah M.",
    listedAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "r2",
    eventId: "2",
    originalPrice: 299.99,
    price: 250.0,
    sellerName: "John D.",
    listedAt: "2024-02-02T14:30:00Z",
  },
  {
    id: "r3",
    eventId: "4",
    originalPrice: 450.0,
    price: 400.0,
    sellerName: "Mike R.",
    listedAt: "2024-02-03T09:15:00Z",
  },
]

export const useTicketStore = create<TicketStore>()(
  persist(
    (set, get) => ({
      events: initialEvents,
      userTickets: [],
      resaleTickets: initialResaleTickets,

      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, createdBy: "user" }],
        })),

      purchaseTickets: (eventId, quantity) => {
        const state = get()
        const event = state.events.find((e) => e.id === eventId)

        if (!event || event.availableTickets < quantity) {
          return false
        }

        const newTickets = Array.from({ length: quantity }, (_, i) => ({
          id: `${Date.now()}-${i}`,
          eventId,
          price: event.price,
          purchaseDate: new Date().toISOString(),
          buyerName: "Current User",
          buyerEmail: "user@example.com",
        }))

        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId ? { ...e, availableTickets: e.availableTickets - quantity } : e,
          ),
          userTickets: [...state.userTickets, ...newTickets],
        }))

        return true
      },

      addResaleTicket: (ticket) =>
        set((state) => ({
          resaleTickets: [...state.resaleTickets, ticket],
        })),

      searchEvents: (term) => {
        const state = get()
        return state.events.filter(
          (event) =>
            event.title.toLowerCase().includes(term.toLowerCase()) ||
            event.description.toLowerCase().includes(term.toLowerCase()) ||
            event.venue.toLowerCase().includes(term.toLowerCase()) ||
            event.category.toLowerCase().includes(term.toLowerCase()),
        )
      },
    }),
    {
      name: "ticket-store",
    },
  ),
)
