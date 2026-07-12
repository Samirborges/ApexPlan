"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { clsx } from "clsx";
import { Trash2 } from "lucide-react";
import { Modal } from "@/app/components/ui/Modal";
import { Input } from "@/app/components/ui/Input";
import { eventSchema, type EventFormValues } from "@/app/lib/validations/calendar";
import { colorPalette } from "@/app/constants/calendar";
import { createEvent, updateEvent, deleteEvent } from "@/app/services/calendar.service";
import { fetchGoals } from "@/app/services/goals.service";
import { fetchObjectives } from "@/app/services/objectives.service";
import type { CalendarEvent } from "@/app/types/calendar";
import type { Goal } from "@/app/types/goal";
import type { Objective } from "@/app/types/objective";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
  event?: CalendarEvent | null;
  initialDate?: string;
}

function splitIso(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

export function EventModal({ isOpen, onClose, onSaved, onDeleted, event, initialDate }: EventModalProps) {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const isEditing = Boolean(event);

  const defaultDate = initialDate ? splitIso(initialDate) : splitIso(new Date().toISOString());
  const start = event ? splitIso(event.start) : defaultDate;
  const end = event ? splitIso(event.end) : defaultDate;

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title ?? "",
      objective: "",
      goal: event?.goal ? String(event.goal) : "",
      startDate: start.date,
      startTime: start.time,
      endDate: end.date,
      endTime: end.time,
      color: event?.color ?? colorPalette[0].value,
    },
  });

  const selectedColor = useWatch({ control, name: "color" });
  const selectedObjective = useWatch({ control, name: "objective" });

  useEffect(() => {
    Promise.all([fetchObjectives(), fetchGoals()])
      .then(([objectivesData, goalsData]) => {
        setObjectives(objectivesData);
        setGoals(goalsData);
      })
      .catch(() => toast.error("Could not load objectives and goals."));
  }, []);

  // Reseta o formulário quando o modal abre para um evento diferente
  useEffect(() => {
    reset({
      title: event?.title ?? "",
      objective: "",
      goal: event?.goal ? String(event.goal) : "",
      startDate: start.date,
      startTime: start.time,
      endDate: end.date,
      endTime: end.time,
      color: event?.color ?? colorPalette[0].value,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, isOpen]);

  // Ao editar um evento com goal já vinculada, descobre o objective dela
  // assim que a lista de goals carregar, e preenche o seletor automaticamente.
  useEffect(() => {
    if (event?.goal && goals.length > 0) {
      const linkedGoal = goals.find((g) => g.id === event.goal);
      if (linkedGoal) {
        setValue("objective", String(linkedGoal.objective));
      }
    }
  }, [event, goals, setValue]);

  const filteredGoals = useMemo(() => {
    if (!selectedObjective) return [];
    return goals.filter((g) => g.objective === Number(selectedObjective));
  }, [goals, selectedObjective]);

  const onSubmit = async (data: EventFormValues) => {
    const payload = {
      title: data.title,
      start: `${data.startDate}T${data.startTime}:00`,
      end: `${data.endDate}T${data.endTime}:00`,
      color: data.color,
      goal: data.goal ? Number(data.goal) : null,
    };

    try {
      if (isEditing && event) {
        await updateEvent(event.id, payload);
        toast.success("Event updated!");
      } else {
        await createEvent(payload);
        toast.success("Event created!");
      }
      onSaved();
      onClose();
    } catch {
      toast.error("Could not save event. Check the dates and try again.");
    }
  };

  const handleDelete = async () => {
    if (!event) return;
    try {
      await deleteEvent(event.id);
      toast.success("Event deleted.");
      onDeleted();
      onClose();
    } catch {
      toast.error("Could not delete event.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold text-gray-900">
        {isEditing ? "Edit event" : "Create event"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Title</label>
          <Input placeholder="Value" {...register("title")} error={errors.title?.message} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Objective (optional)</label>
          <select
            {...register("objective")}
            onChange={(e) => {
              setValue("objective", e.target.value);
              setValue("goal", ""); // troca de objective invalida a goal selecionada antes
            }}
            className="w-full rounded-lg cursor-pointer border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">No objective</option>
            {objectives.map((objective) => (
              <option key={objective.id} value={objective.id}>
                {objective.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Goal (optional)</label>
          <select
            {...register("goal")}
            disabled={!selectedObjective}
            className="w-full rounded-lg cursor-pointer border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <option value="">No goal</option>
            {filteredGoals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
          {!selectedObjective && (
            <p className="mt-1 text-xs text-gray-400">Select an objective first to list its goals.</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Start date</label>
            <input type="date" {...register("startDate")} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Start time</label>
            <input type="time" {...register("startTime")} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">End date</label>
            <input type="date" {...register("endDate")} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">End time</label>
            <input type="time" {...register("endTime")} className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        {errors.endTime && <p className="-mt-3 text-xs text-red-500">{errors.endTime.message}</p>}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Color</label>
          <div className="flex flex-wrap gap-2">
            {colorPalette.map((c) => (
              <label key={c.value} title={c.label} className="cursor-pointer">
                <input type="radio" value={c.value} {...register("color")} className="peer sr-only" />
                <span
                  style={{ backgroundColor: c.value }}
                  className={clsx(
                    "block h-8 w-8 rounded-full border-2 transition-all",
                    selectedColor === c.value ? "border-gray-900 scale-110" : "border-transparent"
                  )}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3">
          {isEditing && (
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete event"
              className="rounded-lg cursor-pointer border border-gray-200 p-3 text-gray-400 transition-colors hover:border-red-200 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 rounded-lg cursor-pointer  bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </Modal>
  );
}