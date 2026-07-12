"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/app/components/ui/Modal";
import { Input } from "@/app/components/ui/Input";
import { goalSchema, type GoalFormValues } from "@/app/lib/validations/goal";
import { updateGoal } from "@/app/services/goals.service";
import type { Goal } from "@/app/types/goal";

interface EditGoalModalProps {
  isOpen: boolean;
  goal: Goal;
  objectiveTitle: string;
  onClose: () => void;
  onSaved: () => void;
}

export function EditGoalModal({ isOpen, goal, objectiveTitle, onClose, onSaved }: EditGoalModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: goal.title,
      description: goal.description,
      estimated_days: goal.estimated_days,
      extra_days: goal.extra_days,
    },
  });

  const onSubmit = async (data: GoalFormValues) => {
    try {
      await updateGoal(goal.id, {
        ...data,
        objective: goal.objective,
        status: goal.status,
        is_completed: goal.is_completed,
      });
      toast.success("Goal updated!");
      onSaved();
      onClose();
    } catch {
      toast.error("Could not update goal.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold text-gray-900">Nome da Meta</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Objective</label>
          <input value={objectiveTitle} disabled className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Goal name</label>
          <Input {...register("title")} error={errors.title?.message} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
          <textarea rows={3} {...register("description")} className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Days</label>
          <Input type="number" min={1} {...register("estimated_days", { valueAsNumber: true })} error={errors.estimated_days?.message} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Extra Days</label>
          <Input type="number" min={0} {...register("extra_days", { valueAsNumber: true })} error={errors.extra_days?.message} />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full cursor-pointer rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </form>
    </Modal>
  );
}
