import { Event } from '@/types/events';
import { SupabaseEvent, SupabaseEventInsert } from './supabase';

/**
 * Převede Supabase event na aplikační Event typ
 */
export function supabaseEventToEvent(supabaseEvent: SupabaseEvent): Event {
  return {
    id: supabaseEvent.id,
    name: supabaseEvent.name,
    description: supabaseEvent.description,
    date: new Date(supabaseEvent.date).getTime(), // převod na timestamp
    location: supabaseEvent.location,
    ticketPrice: supabaseEvent.ticket_price.toString(),
    totalTickets: supabaseEvent.total_tickets,
    soldTickets: supabaseEvent.sold_tickets,
    vendor: supabaseEvent.vendor,
    eventType: supabaseEvent.event_type,
    imageUrl: supabaseEvent.image_url || undefined,
  };
}

/**
 * Převede aplikační Event na Supabase insert typ
 */
export function eventToSupabaseInsert(event: Omit<Event, 'id'>): SupabaseEventInsert {
  return {
    name: event.name,
    description: event.description,
    date: new Date(event.date).toISOString(),
    location: event.location,
    ticket_price: parseFloat(event.ticketPrice),
    total_tickets: event.totalTickets,
    sold_tickets: event.soldTickets,
    vendor: event.vendor,
    event_type: event.eventType,
    image_url: event.imageUrl || null,
  };
}

/**
 * Převede pole Supabase eventů na aplikační Event typy
 */
export function supabaseEventsToEvents(supabaseEvents: SupabaseEvent[]): Event[] {
  return supabaseEvents.map(supabaseEventToEvent);
} 