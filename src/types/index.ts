export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  participants?: string[];
  color?: string;
  isAllDay?: boolean;
}

export interface ParsedSchedule {
  title: string;
  startTime: Date;
  endTime: Date;
  participants?: string[];
  location?: string;
}