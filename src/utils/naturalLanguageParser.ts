import * as chrono from 'chrono-node';
import { ParsedSchedule } from '../types';

interface CleanedExtraction<T> {
  value: T;
  cleanedInput: string;
}

export function parseScheduleInput(input: string): ParsedSchedule {
  // Parse date/time from original input first
  const parsedDate = chrono.parse(input);
  
  if (parsedDate.length === 0) {
    throw new Error('No date or time information found in the input');
  }
  
  const startTime = parsedDate[0].start.date();
  
  // If end time is specified, use it; otherwise, add 1 hour to start time
  let endTime;
  if (parsedDate[0].end) {
    endTime = parsedDate[0].end.date();
  } else {
    endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
  }

  // Extract participants and get cleaned input
  const { value: participants, cleanedInput: inputWithoutParticipants } = extractParticipants(input);
  
  // Then extract location from the cleaned input
  const { value: location } = extractLocation(inputWithoutParticipants);
  
  // Use original input for title extraction to maintain context
  const title = extractTitle(input, participants);
  
  return {
    title,
    startTime,
    endTime,
    participants,
    location,
  };
}

function extractParticipants(input: string): CleanedExtraction<string[]> {
  const prepositions = ['with', 'and', 'for'];
  const participants: string[] = [];
  let cleanedInput = input;
  
  for (const prep of prepositions) {
    const regex = new RegExp(`${prep}\\s+([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)?)`, 'g');
    let match;
    
    while ((match = regex.exec(input)) !== null) {
      const name = match[1].trim();
      if (!participants.includes(name)) {
        participants.push(name);
        // Remove the matched text from the cleaned input
        cleanedInput = cleanedInput.replace(`${prep} ${name}`, '');
      }
    }
  }
  
  return {
    value: participants,
    cleanedInput: cleanedInput.trim().replace(/\s+/g, ' ')
  };
}

function extractLocation(input: string): CleanedExtraction<string | undefined> {
  const locationPrepositions = ['at', 'in', 'on'];
  let location: string | undefined;
  let cleanedInput = input;
  
  for (const prep of locationPrepositions) {
    const regex = new RegExp(`${prep}\\s+([A-Za-z0-9\\s]+?)(?:\\s+on|\\s+at|\\s+from|\\s+to|$)`, 'i');
    const match = input.match(regex);
    
    if (match && match[1]) {
      location = match[1].trim();
      // Remove the matched location from the cleaned input
      cleanedInput = cleanedInput.replace(`${prep} ${location}`, '');
      break;
    }
  }
  
  return {
    value: location,
    cleanedInput: cleanedInput.trim().replace(/\s+/g, ' ')
  };
}

function extractTitle(input: string, participants: string[]): string {
  const eventTypes = [
    'meeting', 'call', 'conference', 'appointment', 'lunch', 'dinner', 
    'breakfast', 'coffee', 'interview', 'session', 'review', 'party',
    'celebration', 'event', 'presentation', 'webinar', 'workshop'
  ];
  
  let eventType = '';
  for (const type of eventTypes) {
    if (input.toLowerCase().includes(type)) {
      eventType = type;
      break;
    }
  }
  
  if (eventType) {
    const capitalizedEventType = eventType.charAt(0).toUpperCase() + eventType.slice(1);
    
    if (participants.length > 0) {
      return `${capitalizedEventType} with ${participants.join(', ')}`;
    } else {
      return capitalizedEventType;
    }
  }
  
  if (participants.length > 0) {
    return `Meeting with ${participants.join(', ')}`;
  } else {
    return 'Scheduled Event';
  }
}