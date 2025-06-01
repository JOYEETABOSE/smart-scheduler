import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import { Event } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  events: Event[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  selectedDate,
  onDateChange,
  onEventClick,
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.startTime, date));
  };

  // Custom tile content to show event indicators
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const dateEvents = getEventsForDate(date);
    
    if (dateEvents.length === 0) return null;
    
    return (
      <div className="flex justify-center mt-1">
        {dateEvents.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1 max-w-full">
            {dateEvents.slice(0, 3).map((event, i) => (
              <div 
                key={i} 
                className="h-1.5 w-1.5 rounded-full" 
                style={{ backgroundColor: event.color || '#0A84FF' }}
              />
            ))}
            {dateEvents.length > 3 && (
              <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            )}
          </div>
        )}
      </div>
    );
  };

  const handleDateClick = (date: Date) => {
    onDateChange(date);
    setViewMode('day');
  };

  const handleViewChange = (mode: 'month' | 'day') => {
    setViewMode(mode);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewChange('month')}
            className={`px-3 py-1 text-sm rounded-md ${
              viewMode === 'month'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => handleViewChange('day')}
            className={`px-3 py-1 text-sm rounded-md ${
              viewMode === 'day'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Day
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {format(selectedDate, 'MMMM yyyy')}
        </div>
      </div>

      {viewMode === 'month' ? (
        <Calendar
          value={selectedDate}
          onChange={handleDateClick}
          tileContent={tileContent}
          prevLabel={<ChevronLeft size={16} />}
          nextLabel={<ChevronRight size={16} />}
          prev2Label={null}
          next2Label={null}
        />
      ) : (
        <DayView 
          date={selectedDate} 
          events={getEventsForDate(selectedDate)}
          onEventClick={onEventClick}
        />
      )}
    </div>
  );
};

interface DayViewProps {
  date: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, events, onEventClick }) => {
  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => 
    a.startTime.getTime() - b.startTime.getTime()
  );
  
  // Hours to display (7am to 9pm)
  const hours = Array.from({ length: 15 }, (_, i) => i + 7);
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {hours.map(hour => {
          const hourDate = new Date(date);
          hourDate.setHours(hour, 0, 0, 0);
          
          // Find events that occur during this hour
          const hourEvents = sortedEvents.filter(event => {
            const eventStart = event.startTime.getHours();
            return eventStart === hour;
          });
          
          return (
            <div key={hour} className="flex py-2 px-4 min-h-[60px] group hover:bg-gray-50">
              <div className="w-16 flex-shrink-0 text-right pr-4 text-sm text-gray-500">
                {format(hourDate, 'h:mm a')}
              </div>
              
              <div className="flex-1">
                {hourEvents.length === 0 ? (
                  <div className="h-full w-full rounded-md border border-dashed border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="space-y-2">
                    {hourEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className="px-3 py-2 rounded-md cursor-pointer transition-all hover:shadow-md"
                        style={{ 
                          backgroundColor: `${event.color}15`,
                          borderLeft: `3px solid ${event.color}` 
                        }}
                      >
                        <div className="font-medium text-gray-900 mb-0.5">
                          {event.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;