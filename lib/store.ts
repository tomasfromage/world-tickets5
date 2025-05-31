"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { supabase, type SupabaseEvent, type SupabaseEventInsert } from "./supabase"

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
  isLoading: boolean
  error: string | null
  loadEvents: () => Promise<void>
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'availableTickets'>) => Promise<boolean>
  purchaseTickets: (eventId: string, quantity: number) => boolean
  addResaleTicket: (ticket: ResaleTicket) => void
  searchEvents: (term: string) => Event[]
}

// Helper function to convert Supabase event to local Event format
const convertSupabaseEvent = (supabaseEvent: SupabaseEvent): Event => {
  // Zpětné mapování kategorií z databáze do UI
  const categoryReverseMapping: { [key: string]: string } = {
    'Concert': 'Music',
    'Sport': 'Sport',
    'Conference': 'Conference',
    'Hackathon': 'Hackathon',
    'Other': 'Other'
  }
  
  return {
    id: supabaseEvent.id.toString(),
    title: supabaseEvent.name,
    description: supabaseEvent.description,
    category: categoryReverseMapping[supabaseEvent.event_type] || 'Other',
    date: new Date(supabaseEvent.date).toISOString().split('T')[0],
    time: new Date(supabaseEvent.date).toTimeString().split(' ')[0].slice(0, 5),
    venue: supabaseEvent.location,
    price: Number(supabaseEvent.ticket_price),
    totalTickets: supabaseEvent.total_tickets,
    availableTickets: supabaseEvent.total_tickets - supabaseEvent.sold_tickets,
    createdAt: supabaseEvent.created_at,
    imageUrl: supabaseEvent.image_url || undefined
  }
}

// Helper function to convert local Event to Supabase format
const convertToSupabaseEvent = (event: Omit<Event, 'id' | 'createdAt' | 'availableTickets'>): SupabaseEventInsert => {
  const eventDate = new Date(`${event.date}T${event.time}:00`)
  
  // Mapování kategorií mezi UI a databází
  const categoryMapping: { [key: string]: string } = {
    'Music': 'Concert',
    'Sport': 'Sport',
    'Theater': 'Other',
    'Comedy': 'Other',
    'Conference': 'Conference',
    'Hackathon': 'Hackathon',
    'Other': 'Other'
  }
  
  return {
    name: event.title,
    description: event.description,
    date: eventDate.toISOString(),
    location: event.venue,
    ticket_price: event.price,
    total_tickets: event.totalTickets,
    sold_tickets: 0,
    vendor: "Platform User", // TODO: Později propojit s uživatelským systémem
    event_type: categoryMapping[event.category] as any,
    image_url: event.imageUrl || null
  }
}

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
      events: [],
      userTickets: [],
      resaleTickets: initialResaleTickets,
      isLoading: false,
      error: null,

      loadEvents: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true })

          if (error) {
            console.error('Supabase error:', error)
            set({ error: error.message, isLoading: false })
            return
          }

          const events = data?.map(convertSupabaseEvent) || []
          console.log('Loaded events from Supabase:', events.length)
          set({ events, isLoading: false })
        } catch (error) {
          console.error('Error loading events:', error)
          set({ error: 'Failed to load events', isLoading: false })
        }
      },

      addEvent: async (event) => {
        set({ isLoading: true, error: null })
        
        try {
          const supabaseEvent = convertToSupabaseEvent(event)
          console.log('Inserting event:', supabaseEvent)
          console.log('Original event data:', event)
          
          const { data, error } = await supabase
            .from('events')
            .insert(supabaseEvent)
            .select()
            .single()

          if (error) {
            console.error('Supabase insert error:', error)
            console.error('Error details:', JSON.stringify(error, null, 2))
            set({ error: `Chyba při vytváření eventu: ${error.message}`, isLoading: false })
            return false
          }

          if (data) {
            const newEvent = convertSupabaseEvent(data)
            set((state) => ({
              events: [...state.events, newEvent],
              isLoading: false
            }))
            console.log('Event created successfully:', newEvent)
            return true
          }

          console.error('No data returned from Supabase insert')
          set({ error: 'Nepodařilo se vytvořit event - žádná data', isLoading: false })
          return false
        } catch (error) {
          console.error('Error creating event:', error)
          console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error')
          set({ error: `Neočekávaná chyba: ${error instanceof Error ? error.message : 'Neznámá chyba'}`, isLoading: false })
          return false
        }
      },

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

        // TODO: Později přidat update do Supabase pro sold_tickets

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
      partialize: (state) => ({
        // Pouze ukládáme userTickets a resaleTickets, eventy načítáme ze Supabase
        userTickets: state.userTickets,
        resaleTickets: state.resaleTickets,
      })
    },
  ),
)
