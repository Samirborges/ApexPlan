import { api } from "@/app/lib/api/axios";
import type { CalendarEvent, CreateEventPayload, UpdateEventPayload } from "@/app/types/calendar";

export async function fetchEvents() {
  const { data } = await api.get<CalendarEvent[]>("/calendar/");
  return data;
}

export async function createEvent(payload: CreateEventPayload) {
  const { data } = await api.post<CalendarEvent>("/calendar/", payload);
  return data;
}

export async function updateEvent(id: number, payload: UpdateEventPayload) {
  const { data } = await api.patch<CalendarEvent>(`/calendar/${id}/`, payload);
  return data;
}

export async function deleteEvent(id: number) {
  await api.delete(`/calendar/${id}/`);
}