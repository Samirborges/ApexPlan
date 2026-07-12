export interface CalendarEvent {
  id: number;
  goal: number | null;
  title: string;
  start: string; // ISO 8601 with timezone, ex: 2026-07-12T14:00:00-03:00
  end: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEventPayload {
  title: string;
  start: string;
  end: string;
  color: string;
  goal?: number | null;
}

export type UpdateEventPayload = Partial<CreateEventPayload>;