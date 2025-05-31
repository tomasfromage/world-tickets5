import { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types/events';
import { supabase } from '@/lib/supabase';
import { supabaseEventsToEvents } from '@/lib/eventUtils';

export function useSupabaseEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Načte eventy z Supabase
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Loading events from Supabase...');
      
      const { data, error: supabaseError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      if (!data) {
        throw new Error('No data received from Supabase');
      }

      console.log('Raw Supabase events:', data);
      
      // Převede Supabase eventy na aplikační typ
      const convertedEvents = supabaseEventsToEvents(data);
      console.log('Converted events:', convertedEvents);
      
      setEvents(convertedEvents);
    } catch (err) {
      console.error('Error loading events from Supabase:', err);
      
      let errorMessage = 'Failed to load events from database';
      
      if (err && typeof err === 'object' && 'message' in err) {
        const errorWithMessage = err as { message: string };
        errorMessage = `Database error: ${errorWithMessage.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Přidá nový event do lokálního stavu
  const addEvent = useCallback((newEvent: Event) => {
    setEvents(prevEvents => [...prevEvents, newEvent]);
  }, []);

  // Aktualizuje event v lokálním stavu
  const updateEvent = useCallback((eventId: number, updatedEvent: Partial<Event>) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId ? { ...event, ...updatedEvent } : event
      )
    );
  }, []);

  // Vytvoří nový event v Supabase
  const createEvent = useCallback(async (eventData: Omit<Event, 'id'>) => {
    try {
      console.log('Creating event with data:', eventData);
      
      const { data, error: supabaseError } = await supabase
        .from('events')
        .insert({
          name: eventData.name,
          description: eventData.description,
          date: new Date(eventData.date).toISOString(),
          location: eventData.location,
          ticket_price: parseFloat(eventData.ticketPrice),
          total_tickets: eventData.totalTickets,
          sold_tickets: eventData.soldTickets,
          vendor: eventData.vendor,
          event_type: eventData.eventType,
          image_url: eventData.imageUrl || null,
        })
        .select()
        .single();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw supabaseError;
      }

      if (data) {
        console.log('Event created successfully:', data);
        const newEvent = supabaseEventsToEvents([data])[0];
        addEvent(newEvent);
        return newEvent;
      }
    } catch (err) {
      console.error('Error creating event:', err);
      throw err;
    }
  }, [addEvent]);

  // Načte eventy při prvním načtení
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    isLoading,
    error,
    refreshEvents: loadEvents,
    addEvent,
    updateEvent,
    createEvent,
  };
} 