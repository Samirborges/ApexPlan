"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/app/components/ui/Modal";
import { Input } from "@/app/components/ui/Input";
import { goalSchema, type GoalFormValues } from "@/app/lib/validations/goal";
import { createGoal } from "@/app/services/goals.service";

interface CreateGoalModalProps {
  isOpen: boolean;
  objectiveId: number;
  objectiveTitle: string;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateGoalModal({ isOpen, objectiveId, objectiveTitle, onClose, onCreated }: CreateGoalModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: { title: "", description: "", estimated_days: 1, extra_days: 0 },
  });

  const onSubmit = async (data: GoalFormValues) => {
    try {
      await createGoal({ ...data, objective: objectiveId });
      toast.success("Goal created!");
      reset();
      onCreated();
      onClose();
    } catch {
      toast.error("Could not create goal.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-xl font-bold text-gray-900">Nome da Meta</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Objective</label>
          <input value={objectiveTitle} disabled className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Goal name</label>
          <Input placeholder="Type here" {...register("title")} error={errors.title?.message} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            placeholder="Value"
            rows={3}
            {...register("description")}
            className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Days</label>
          <Input type="number" min={1} placeholder="Type here" {...register("estimated_days", { valueAsNumber: true })} error={errors.estimated_days?.message} />
        </div>

        {/* extra_days não aparece na criação — só existe sentido após a meta já estar em andamento */}
        <input type="hidden" {...register("extra_days", { valueAsNumber: true })} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full cursor-pointer rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </form>
    </Modal>
  );
}
