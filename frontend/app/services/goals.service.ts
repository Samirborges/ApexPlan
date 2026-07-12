import { api } from "@/app/lib/api/axios";
import type { Goal, CreateGoalPayload, UpdateGoalPayload } from "@/app/types/goal";

export async function fetchGoals(objectiveId?: number) {
  const { data } = await api.get<Goal[]>("/goals/");
  return objectiveId ? data.filter((g) => g.objective === objectiveId) : data;
}

export async function createGoal(payload: CreateGoalPayload) {
  const { data } = await api.post<Goal>("/goals/", payload);
  return data;
}

export async function updateGoal(id: number, payload: UpdateGoalPayload) {
  const { data } = await api.put<Goal>(`/goals/${id}/`, payload);
  return data;
}

export async function deleteGoal(id: number) {
  await api.delete(`/goals/${id}/`);
}