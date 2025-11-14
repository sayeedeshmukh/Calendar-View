export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  color: string;
}

export type CalendarView = 'month' | 'week';