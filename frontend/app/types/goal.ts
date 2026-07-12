export type GoalStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface Goal {
  id: number;
  objective: number;
  title: string;
  description: string;
  status: GoalStatus;
  order_index: number;
  estimated_days: number;
  extra_days: number;
  start_date: string;
  end_date: string;
  is_completed: boolean;
}

export interface CreateGoalPayload {
  objective: number;
  title: string;
  description: string;
  estimated_days: number;
  extra_days: number;
}


export interface UpdateGoalPayload extends CreateGoalPayload {
  status?: GoalStatus;
  is_completed?: boolean;
}