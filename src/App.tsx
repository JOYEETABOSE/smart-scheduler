import React, { useState } from 'react';
import Header from './components/Header';
import ScheduleInput from './components/ScheduleInput';
import CalendarView from './components/CalendarView';
import EventList from './components/EventList';
import EventModal from './components/EventModal';
import { useEvents } from './hooks/useEvents';
import { Event } from './types';

function App() {
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    getEventsByDate 
  } = useEvents();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'create' | 'edit'>('create');

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: Event) => {
    if (modalMode === 'create') {
      addEvent(event);
    } else if (modalMode === 'edit' && selectedEvent) {
      updateEvent(event);
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ScheduleInput onEventCreated={addEvent} />
            
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Your Calendar</h2>
              <CalendarView 
                events={events} 
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                onEventClick={handleViewEvent}
              />
            </div>
          </div>
          
          <div>
            <div className="card p-6 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Events</h2>
                <button 
                  onClick={handleCreateEvent}
                  className="btn btn-primary text-sm"
                >
                  Add Event
                </button>
              </div>
              <EventList 
                events={getEventsByDate(selectedDate)} 
                onEventClick={handleViewEvent}
              />
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <EventModal
          mode={modalMode}
          event={selectedEvent}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;