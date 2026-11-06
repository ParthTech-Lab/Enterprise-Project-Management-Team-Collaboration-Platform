export type EventType = 'meeting' | 'deadline' | 'milestone' | 'review' | 'release' | 'workshop';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  startDate: string; // ISO string or YYYY-MM-DDTHH:mm
  endDate: string;
  allDay: boolean;
  projectId?: string;
  projectName?: string;
  teamId?: string;
  attendeeIds: string[];
  location?: string;
  meetingLink?: string;
  color?: string;
}

