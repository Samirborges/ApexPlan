"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/app/components/ui/Modal";
import { Input } from "@/app/components/ui/Input";
import { createObjectiveSchema, type CreateObjectiveFormValues } from "@/app/lib/validations/objective";
import { createObjective } from "@/app/services/objectives.service";
import type { Objective } from "@/app/types/objective";

interface CreateObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (objective: Objective) => void;
}

export function CreateObjectiveModal({ isOpen, onClose, onCreated }: CreateObjectiveModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateObjectiveFormValues>({ 
    resolver: zodResolver(createObjectiveSchema), 
    defaultValues: { title: "", description: "", start_date: "" }, 
});

  const onSubmit = async (data: CreateObjectiveFormValues) => {
    try {
      const objective = await createObjective(data);
      toast.success("Objective created!");
      reset();
      onCreated(objective);
      onClose();
    } catch {
      toast.error("Could not create objective.");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <h2 className="text-xl font-bold text-gray-900">Create new Objective</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Objective Name</label>
          <Input placeholder="Value" {...register("title")} error={errors.title?.message} />
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
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Start Day</label>
          <input
            type="date"
            {...register("start_date")}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.start_date && <p className="mt-1 text-xs text-red-500">{errors.start_date.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 cursor-pointer w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </form>
    </Modal>
  );
}