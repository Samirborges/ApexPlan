"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Calendar, ArrowRight, Target } from "lucide-react";
import { EditableField } from "@/app/components/ui/EditableField";
import { GoalColumn } from "@/app/components/dashboard/GoalColumn";
import { CreateGoalModal } from "@/app/components/dashboard/CreateGoalModal";
import { EditGoalModal } from "@/app/components/dashboard/EditGoalModal";
import { fetchObjectiveById, updateObjective } from "@/app/services/objectives.service";
import { fetchGoals, updateGoal, deleteGoal } from "@/app/services/goals.service";
import { formatDate } from "@/app/lib/utils/date";
import type { Objective } from "@/app/types/objective";
import type { Goal, GoalStatus } from "@/app/types/goal";
import { ObjectiveStatusBadge } from "@/app/components/dashboard/ObjectiveStatusBadge";
import { ConfirmDialog } from "@/app/components/ui/ConfirmDialog";

const columns: { status: GoalStatus; label: string }[] = [
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "PENDING", label: "Pending" },
  { status: "COMPLETED", label: "Completed" },
];



export default function ObjectiveDetailPage() {
  const params = useParams();
  const objectiveId = Number(params.id);

  const [objective, setObjective] = useState<Objective | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

  const loadData = async () => {
    const [objectiveData, goalsData] = await Promise.all([
      fetchObjectiveById(objectiveId),
      fetchGoals(objectiveId),
    ]);
    setObjective(objectiveData);
    setGoals(goalsData);
  };

  useEffect(() => {
  let isMounted = true;

  async function load() {
    setIsLoading(true);
    try {
      const [objectiveData, goalsData] = await Promise.all([
        fetchObjectiveById(objectiveId),
        fetchGoals(objectiveId),
      ]);
      if (!isMounted) return;
      setObjective(objectiveData);
      setGoals(goalsData);
    } catch {
      if (isMounted) toast.error("Could not load objective.");
    } finally {
      if (isMounted) setIsLoading(false);
    }
  }

  load();

  return () => {
    isMounted = false;
  };
}, [objectiveId]);

  const handleSaveField = async (field: "title" | "description" | "start_date", value: string) => {
    if (!objective) return;
    try {
      const updated = await updateObjective(objective.id, { [field]: value });
      setObjective(updated);
      toast.success("Saved.");
    } catch {
      toast.error("Could not save changes.");
    }
  };

  const handleChangeObjectiveStatus  = async (status: Objective["status"]) => {
    
    if (!objective) return;
    try {
      const updated = await updateObjective(objective.id, { status });
      setObjective(updated);
      toast.success("Status updated.");
    } catch {
      toast.error("Could not update status.");
    }
  };

  const buildFullPayload = (goal: Goal, overrides: Partial<Goal> = {}) => ({
    objective: goal.objective,
    title: goal.title,
    description: goal.description,
    estimated_days: goal.estimated_days,
    extra_days: goal.extra_days,
    status: goal.status,
    is_completed: goal.is_completed,
    ...overrides,
  });

  const handleToggleComplete = async (goal: Goal) => {
    const newCompleted = !goal.is_completed;
    try {
      const updated = await updateGoal(
        goal.id,
        buildFullPayload(goal, {
          is_completed: newCompleted,
          status: newCompleted ? "COMPLETED" : "PENDING",
        })
      );
      setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    } catch {
      toast.error("Could not update goal.");
    }
  };

  const handleChangeStatus = async (goal: Goal, status: GoalStatus) => {
    try {
      const updated = await updateGoal(
        goal.id,
        buildFullPayload(goal, { status, is_completed: status === "COMPLETED" })
      );
      setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    } catch {
      toast.error("Could not update goal.");
    }
  };

  const handleConfirmDeleteGoal = async () => {
    if(!goalToDelete) return;
    try {
      await deleteGoal(goalToDelete.id);
      await loadData();
      toast.success("Goal deleted.");
      setGoalToDelete(null);
    } catch {
      toast.error("Could not delete goal.");
    }
  }

  const handleGoalChanged = () => {
    // Criação/edição pode disparar recálculo de cronograma no backend,
    // então sempre buscamos tudo de novo em vez de fazer merge local.
    loadData().catch(() => toast.error("Could not refresh data."));
  };

  if (isLoading || !objective) {
    return <div className="text-sm text-gray-400">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
          <Target className="h-5 w-5 text-indigo-600" />
        </div>
        <EditableField
          value={objective.title}
          onSave={(value) => handleSaveField("title", value)}
          className="text-2xl font-bold text-gray-900"
        />
      </div>

      <div className="mt-3">
        <ObjectiveStatusBadge status={objective.status} onChange={handleChangeObjectiveStatus} />
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="h-4 w-4" />
        <EditableField
          value={objective.start_date}
          onSave={(value) => handleSaveField("start_date", value)}
          type="date"
          className="w-40 cursor-pointer"
        />
        <ArrowRight className="h-4 w-4" />
        <span className="font-medium text-gray-700">{formatDate(objective.end_date)}</span>
      </div>

      <div className="mt-6">
        <p className="mb-1.5 text-sm font-medium text-gray-700">Description</p>
        <EditableField
          value={objective.description}
          onSave={(value) => handleSaveField("description", value)}
          type="textarea"
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Goals</h2>
            <button
                onClick={() => setIsCreateOpen(true)}
                className="rounded-lg cursor-pointer bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
                Add goal
            </button>
        </div>

    <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
    {columns.map((col) => (
        <GoalColumn
        key={col.status}
        status={col.status}
        label={col.label}
        goals={goals.filter((g) => g.status === col.status)}
        onToggleComplete={handleToggleComplete}
        onChangeStatus={handleChangeStatus}
        onEdit={setEditingGoal}
        onDelete={setGoalToDelete}
        />
    ))}
    </div>

      <CreateGoalModal
        isOpen={isCreateOpen}
        objectiveId={objective.id}
        objectiveTitle={objective.title}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleGoalChanged}
      />

      <ConfirmDialog
        isOpen={!!goalToDelete}
        title="Delete this goal?"
        description={`This will permanently delete "${goalToDelete?.title}" and recalculate the schedule of the remaining goals.`}
        onConfirm={handleConfirmDeleteGoal}
        onClose={() => setGoalToDelete(null)}
      />

      {editingGoal && (
        <EditGoalModal
          isOpen={!!editingGoal}
          goal={editingGoal}
          objectiveTitle={objective.title}
          onClose={() => setEditingGoal(null)}
          onSaved={handleGoalChanged}
        />
      )}
    </div>
  );
}