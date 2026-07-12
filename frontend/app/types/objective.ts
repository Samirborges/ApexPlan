export type ObjectiveStatus = "ACTIVE" | "COMPLETED" | "CANCELED";

export interface Objective {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  status: ObjectiveStatus;
}

// end_date e status são read-only no backend — nunca enviados pelo frontend
export interface CreateObjectivePayload {
  title: string;
  description: string;
  start_date: string;
}

export type UpdateObjectivePayload = Partial<CreateObjectivePayload>;