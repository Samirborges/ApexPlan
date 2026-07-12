"use client";

import { GoalCard } from "@/app/components/dashboard/GoalCard";
import type { Goal, GoalStatus } from "@/app/types/goal";

interface GoalColumnProps {
  status: GoalStatus;
  label: string;
  goals: Goal[];
  onToggleComplete: (goal: Goal) => void;
  onChangeStatus: (goal: Goal, status: GoalStatus) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
}

const dotColor: Record<GoalStatus, string> = {
  IN_PROGRESS: "bg-blue-500",
  PENDING: "bg-gray-300",
  COMPLETED: "bg-emerald-500",
};

export function GoalColumn({ status, label, goals, onToggleComplete, onChangeStatus, onEdit, onDelete }: GoalColumnProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <span className={`h-2.5 w-2.5 rounded-full ${dotColor[status]}`} />
        {label}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onToggleComplete={() => onToggleComplete(goal)}
            onChangeStatus={(newStatus) => onChangeStatus(goal, newStatus)}
            onEdit={() => onEdit(goal)}
            onDelete={() => onDelete(goal)}
          />
        ))}
      </div>
    </div>
  );
}