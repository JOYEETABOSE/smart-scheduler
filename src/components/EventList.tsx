import React from 'react';
import { format } from 'date-fns';
import { Event } from '../types';
import { User, MapPin, Clock } from 'lucide-react';

interface EventListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEventClick }) => {
  const sortedEvents = [...events].sort((a, b) => 
    a.startTime.getTime() - b.startTime.getTime()
  );

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 text-gray-400 mb-3">
          <Calendar size={24} />
        </div>
        <p className="text-gray-500 mb-1">No events scheduled for this day</p>
        <p className="text-sm text-gray-400">
          Use the input above to schedule something
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedEvents.map(event => (
        <div
          key={event.id}
          onClick={() => onEventClick(event)}
          className="rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="mb-2 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{event.title}</h3>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <Clock size={12} className="mr-1" />
                <span>
                  {format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}
                </span>
              </div>
            </div>
            <div 
              className="h-3 w-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: event.color || '#0A84FF' }}
            />
          </div>
          
          {(event.location || (event.participants && event.participants.length > 0)) && (
            <div className="mt-2 space-y-1 text-xs">
              {event.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin size={12} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}
              
              {event.participants && event.participants.length > 0 && (
                <div className="flex items-center text-gray-600">
                  <User size={12} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{event.participants.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Calendar = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
    <line x1="16" x2="16" y1="2" y2="6"></line>
    <line x1="8" x2="8" y1="2" y2="6"></line>
    <line x1="3" x2="21" y1="10" y2="10"></line>
  </svg>
);

export default EventList;