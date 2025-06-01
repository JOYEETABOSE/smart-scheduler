import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, X } from 'lucide-react';
import { parseScheduleInput } from '../utils/naturalLanguageParser';
import { Event, ParsedSchedule } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ScheduleInputProps {
  onEventCreated: (event: Event) => void;
}

const ScheduleInput: React.FC<ScheduleInputProps> = ({ onEventCreated }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [parsedInput, setParsedInput] = useState<ParsedSchedule | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        parseInput(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError('Could not understand audio. Please try again or type your request.');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setError(null);
    if (parsedInput) {
      setParsedInput(null);
      setShowConfirmation(false);
    }
  };

  const parseInput = (text: string = input) => {
    if (!text.trim()) {
      setError('Please enter a scheduling request.');
      return;
    }

    try {
      const parsed = parseScheduleInput(text);
      setParsedInput(parsed);
      setShowConfirmation(true);
      setError(null);
    } catch (err) {
      console.error('Failed to parse input:', err);
      setError('Unable to understand. Try a more specific phrase like "Schedule a call with Jack on Thursday at 3pm".');
      setParsedInput(null);
      setShowConfirmation(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    parseInput();
  };

  const handleConfirm = () => {
    if (parsedInput) {
      const newEvent: Event = {
        id: uuidv4(),
        title: parsedInput.title,
        startTime: parsedInput.startTime,
        endTime: parsedInput.endTime,
        location: parsedInput.location,
        participants: parsedInput.participants,
        color: getRandomEventColor(),
      };
      
      onEventCreated(newEvent);
      setInput('');
      setParsedInput(null);
      setShowConfirmation(false);
      
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleCancel = () => {
    setParsedInput(null);
    setShowConfirmation(false);
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      setIsListening(true);
      recognitionRef.current.start();
    }
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

  return (
    <div className="card p-6 transition-all">
      <h2 className="text-xl font-semibold mb-4">Schedule an Event</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className={`input pr-20 ${isListening ? 'bg-primary-50 border-primary-300' : ''}`}
            placeholder="Type 'Schedule a call with Jack on Thursday at 3pm'"
            value={input}
            onChange={handleInputChange}
            disabled={isListening}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-full ${
                isListening 
                  ? 'bg-primary-500 text-white animate-pulse' 
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title={recognitionRef.current ? 'Use voice input' : 'Voice input not supported'}
            >
              <Mic size={18} />
            </button>
            <button
              type="submit"
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
              disabled={!input.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        
        {error && (
          <div className="text-error-500 text-sm flex items-center">
            <X size={16} className="mr-1 flex-shrink-0" />
            {error}
          </div>
        )}
        
        {showConfirmation && parsedInput && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 animate-slide-up">
            <h3 className="font-medium text-gray-900 mb-2">Is this correct?</h3>
            <div className="space-y-2 text-sm text-gray-700 mb-4">
              <p><span className="font-medium">Event:</span> {parsedInput.title}</p>
              <p>
                <span className="font-medium">When:</span> {' '}
                {parsedInput.startTime.toLocaleString([], {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {' to '}
                {parsedInput.endTime.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {parsedInput.participants && parsedInput.participants.length > 0 && (
                <p>
                  <span className="font-medium">With:</span> {parsedInput.participants.join(', ')}
                </p>
              )}
              {parsedInput.location && (
                <p>
                  <span className="font-medium">Location:</span> {parsedInput.location}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleConfirm}
                className="btn btn-primary flex-1 py-1.5"
              >
                Confirm & Schedule
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary flex-1 py-1.5"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </form>
      
      {!showConfirmation && (
        <div className="mt-4 text-xs text-gray-500">
          <p className="font-medium mb-1">Try saying:</p>
          <ul className="space-y-1">
            <li>• "Schedule a meeting with the design team tomorrow at 10am"</li>
            <li>• "Lunch with Sarah on Friday at noon at Bistro Garden"</li>
            <li>• "Call with John next Monday from 2-3pm"</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScheduleInput;