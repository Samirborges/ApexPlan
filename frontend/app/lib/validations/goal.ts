import { z } from "zod";

export const goalSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  description: z.string(),
  estimated_days: z.number({ error: "Days is required" }).int().min(1, "Must be at least 1 day"),
  extra_days: z.number({ error: "Extra days is required" }).int().min(0, "Cannot be negative"),
});

export type GoalFormValues = z.infer<typeof goalSchema>;