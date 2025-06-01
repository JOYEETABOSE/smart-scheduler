import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { X, User, MapPin, Trash2 } from 'lucide-react';
import { Event } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface EventModalProps {
  mode: 'view' | 'create' | 'edit';
  event: Event | null;
  onSave: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({
  mode,
  event,
  onSave,
  onDelete,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    description: '',
    startTime: new Date(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    location: '',
    participants: [],
    color: '#0A84FF',
  });

  useEffect(() => {
    if (mode === 'edit' || mode === 'view') {
      if (event) {
        setFormData({
          ...event,
          participants: event.participants || [],
        });
      }
    } else if (mode === 'create') {
      // Set default times for new events
      const now = new Date();
      const roundedHour = new Date(now.setMinutes(0, 0, 0));
      
      setFormData({
        title: '',
        description: '',
        startTime: roundedHour,
        endTime: new Date(new Date(roundedHour).setHours(roundedHour.getHours() + 1)),
        location: '',
        participants: [],
        color: getRandomEventColor(),
      });
    }
  }, [mode, event]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    const date = new Date(value);
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const participants = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, participants }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startTime || !formData.endTime) return;

    const completeEvent: Event = {
      id: formData.id || uuidv4(),
      title: formData.title!,
      description: formData.description || '',
      startTime: formData.startTime!,
      endTime: formData.endTime!,
      location: formData.location,
      participants: formData.participants,
      color: formData.color || getRandomEventColor(),
    };

    onSave(completeEvent);
  };

  // Generate a random color for the event
  const getRandomEventColor = () => {
    const colors = [
      '#0A84FF', // primary blue
      '#5E5CE6', // secondary purple
      '#FF9500', // accent orange
      '#34C759', // success green
      '#FF3B30', // error red
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const formatDateTimeForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>
        
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-lg animate-scale-in">
          <div className="absolute right-0 top-0 p-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>
          
          {mode === 'view' ? (
            <div className="p-6">
              <div 
                className="h-2 w-full absolute top-0 left-0 right-0"
                style={{ backgroundColor: formData.color }}
              ></div>
              <h3 className="text-xl font-semibold mb-4">{formData.title}</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Date & Time</div>
                  <p className="text-gray-900">
                    {formData.startTime && (
                      <>
                        {format(formData.startTime, 'EEEE, MMMM d, yyyy')}
                        <br />
                        {format(formData.startTime, 'h:mm a')} - {format(formData.endTime!, 'h:mm a')}
                      </>
                    )}
                  </p>
                </div>
                
                {formData.description && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Description</div>
                    <p className="text-gray-900 whitespace-pre-wrap">{formData.description}</p>
                  </div>
                )}
                
                {formData.location && (
                  <div className="flex items-start">
                    <MapPin size={16} className="mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Location</div>
                      <p className="text-gray-900">{formData.location}</p>
                    </div>
                  </div>
                )}
                
                {formData.participants && formData.participants.length > 0 && (
                  <div className="flex items-start">
                    <User size={16} className="mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Participants</div>
                      <p className="text-gray-900">{formData.participants.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    if (event) onDelete(event.id);
                  }}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                >
                  <Trash2 size={16} className="mr-2 text-error-500" />
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="inline-flex items-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (event) {
                      setFormData(event);
                      onClose();
                      // In a real app, this would open the edit mode
                    }
                  }}
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none"
                >
                  Edit
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {mode === 'create' ? 'Create New Event' : 'Edit Event'}
              </h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Event Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 input"
                    placeholder="Enter event title"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                      Start Time*
                    </label>
                    <input
                      type="datetime-local"
                      name="startTime"
                      id="startTime"
                      required
                      value={formatDateTimeForInput(formData.startTime!)}
                      onChange={(e) => handleDateTimeChange('startTime', e.target.value)}
                      className="mt-1 input"
                    />
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                      End Time*
                    </label>
                    <input
                      type="datetime-local"
                      name="endTime"
                      id="endTime"
                      required
                      value={formatDateTimeForInput(formData.endTime!)}
                      onChange={(e) => handleDateTimeChange('endTime', e.target.value)}
                      className="mt-1 input"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 input"
                    placeholder="Add details about this event"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    className="mt-1 input"
                    placeholder="Add location"
                  />
                </div>
                
                <div>
                  <label htmlFor="participants" className="block text-sm font-medium text-gray-700">
                    Participants
                  </label>
                  <input
                    type="text"
                    name="participants"
                    id="participants"
                    value={formData.participants?.join(', ') || ''}
                    onChange={handleParticipantsChange}
                    className="mt-1 input"
                    placeholder="Enter names separated by commas"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separate multiple participants with commas
                  </p>
                </div>
                
                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                    Event Color
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <input
                      type="color"
                      name="color"
                      id="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="h-8 w-8 rounded cursor-pointer border-0"
                    />
                    <span className="text-sm text-gray-500">
                      Choose a color for this event
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                {mode === 'edit' && event && (
                  <button
                    type="button"
                    onClick={() => onDelete(event.id)}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                  >
                    <Trash2 size={16} className="mr-2 text-error-500" />
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 focus:outline-none"
                >
                  {mode === 'create' ? 'Create Event' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;