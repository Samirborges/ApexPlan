"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, DateSelectArg, EventDropArg } from "@fullcalendar/core";
import type { EventResizeDoneArg } from "@fullcalendar/interaction";
import { EventModal } from "@/app/components/dashboard/EventModal";
import { fetchEvents, updateEvent } from "@/app/services/calendar.service";
import type { CalendarEvent } from "@/app/types/calendar";

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [clickedDate, setClickedDate] = useState<string | undefined>(undefined);

  const loadEvents = () => {
    fetchEvents()
      .then(setEvents)
      .catch(() => toast.error("Could not load events."));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDateClick = (arg: DateSelectArg | { dateStr: string }) => {
    setSelectedEvent(null);
    setClickedDate("dateStr" in arg ? arg.dateStr : undefined);
    setIsModalOpen(true);
  };

  const handleEventClick = (arg: EventClickArg) => {
    const original = events.find((e) => String(e.id) === arg.event.id);
    if (!original) return;
    setSelectedEvent(original);
    setClickedDate(undefined);
    setIsModalOpen(true);
  };

  // Drag para outra data/horário
  const handleEventDrop = async (arg: EventDropArg) => {
    const id = Number(arg.event.id);
    try {
      await updateEvent(id, {
        start: arg.event.start?.toISOString(),
        end: arg.event.end?.toISOString(),
      });
      loadEvents();
    } catch {
      toast.error("Could not move event.");
      arg.revert();
    }
  };

  // Redimensionar alterando o horário final
  const handleEventResize = async (arg: EventResizeDoneArg) => {
    const id = Number(arg.event.id);
    try {
      await updateEvent(id, { end: arg.event.end?.toISOString() });
      loadEvents();
    } catch {
      toast.error("Could not resize event.");
      arg.revert();
    }
  };

  return (
    <div>
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          locale="pt-br"
          selectable
          editable
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          height="auto"
          events={events.map((event) => ({
            id: String(event.id),
            title: event.title,
            start: event.start,
            end: event.end,
            backgroundColor: event.color,
            borderColor: event.color,
          }))}
        />
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadEvents}
        onDeleted={loadEvents}
        event={selectedEvent}
        initialDate={clickedDate}
      />
    </div>
  );
}