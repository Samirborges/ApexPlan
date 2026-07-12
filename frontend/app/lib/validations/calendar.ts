import { z } from "zod";

export const eventSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(255),
    objective: z.string(), // "" significa sem objective selecionado
    goal: z.string(), // "" significa sem meta vinculada
    startDate: z.string().min(1, "Start date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endDate: z.string().min(1, "End date is required"),
    endTime: z.string().min(1, "End time is required"),
    color: z.string().min(1),
  })
  .refine(
    (data) => {
      const start = new Date(`${data.startDate}T${data.startTime}`);
      const end = new Date(`${data.endDate}T${data.endTime}`);
      return end > start;
    },
    { message: "End must be after start", path: ["endTime"] }
  );

export type EventFormValues = z.infer<typeof eventSchema>;