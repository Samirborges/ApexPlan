import { z } from "zod";

export const createObjectiveSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string(),
  start_date: z.string().min(1, "Start date is required"),
});

export type CreateObjectiveFormValues = z.infer<typeof createObjectiveSchema>;
