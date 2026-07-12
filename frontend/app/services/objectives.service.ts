import { api } from "@/app/lib/api/axios";
import type {
  Objective,
  CreateObjectivePayload,
  UpdateObjectivePayload,
} from "@/app/types/objective";

export async function fetchObjectives() {
  const { data } = await api.get<Objective[]>("/objectives/");
  return data;
}

export async function fetchObjectiveById(id: number) {
  const { data } = await api.get<Objective>(`/objectives/${id}/`);
  return data;
}

export async function createObjective(payload: CreateObjectivePayload) {
  const { data } = await api.post<Objective>("/objectives/", payload);
  return data;
}

export async function updateObjective(id: number, payload: UpdateObjectivePayload) {
  const { data } = await api.patch<Objective>(`/objectives/${id}/`, payload);
  return data;
}

export async function deleteObjective(id: number) {
  await api.delete(`/objectives/${id}/`);
}