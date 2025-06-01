import { useState, useEffect } from 'react';
import { Event } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { isSameDay } from 'date-fns';

// Key for storing events in localStorage
const STORAGE_KEY = 'scheduleWizard_events';

// Sample events for demo purposes
const sampleEvents: Event[] = [
  {
    id: uuidv4(),
    title: 'Team Meeting',
    description: 'Weekly sprint planning with the development team',
    startTime: new Date(new Date().setHours(10, 0, 0, 0)),
    endTime: new Date(new Date().setHours(11, 0, 0, 0)),
    participants: ['Alex', 'Sarah', 'Michael'],
    color: '#0A84FF',
  },
  {
    id: uuidv4(),
    title: 'Lunch with Sarah',
    description: 'Discuss the new project proposal',
    startTime: new Date(new Date().setHours(12, 30, 0, 0)),
    endTime: new Date(new Date().setHours(13, 30, 0, 0)),
    location: 'Bistro Garden',
    participants: ['Sarah'],
    color: '#FF9500',
  },
  {
    id: uuidv4(),
    title: 'Doctor Appointment',
    description: 'Annual checkup',
    startTime: new Date(new Date().setDate(new Date().getDate() + 2)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(new Date().getHours() + 1)),
    location: 'Health Center',
    color: '#34C759',
  },
];

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  // Load events from localStorage on initial render
  useEffect(() => {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    if (storedEvents) {
      try {
        // Parse the stored JSON and convert date strings back to Date objects
        const parsedEvents = JSON.parse(storedEvents, (key, value) => {
          if (key === 'startTime' || key === 'endTime') {
            return new Date(value);
          }
          return value;
        });
        setEvents(parsedEvents);
      } catch (error) {
        console.error('Failed to parse stored events:', error);
        setEvents(sampleEvents);
      }
    } else {
      // If no events are stored, use sample events for demo
      setEvents(sampleEvents);
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  // Add a new event
  const addEvent = (event: Event) => {
    const newEvent = {
      ...event,
      id: event.id || uuidv4(),
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
    return newEvent;
  };

  // Update an existing event
  const updateEvent = (updatedEvent: Event) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  // Delete an event
  const deleteEvent = (eventId: string) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  // Get events for a specific date
  const getEventsByDate = (date: Date) => {
    return events.filter(event => isSameDay(event.startTime, date));
  };

  // Check for scheduling conflicts
  const hasConflict = (newEvent: Event) => {
    return events.some(event => {
      if (event.id === newEvent.id) return false; // Skip the event itself when checking for conflicts
      
      const newStart = newEvent.startTime.getTime();
      const newEnd = newEvent.endTime.getTime();
      const existingStart = event.startTime.getTime();
      const existingEnd = event.endTime.getTime();
      
      // Check if the new event overlaps with an existing event
      return (
        (newStart >= existingStart && newStart < existingEnd) || // New event starts during existing event
        (newEnd > existingStart && newEnd <= existingEnd) || // New event ends during existing event
        (newStart <= existingStart && newEnd >= existingEnd) // New event completely contains existing event
      );
    });
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
    hasConflict,
  };
}