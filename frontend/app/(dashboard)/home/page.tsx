"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs } from "@/app/components/ui/Tabs";
import { ObjectivesTable } from "@/app/components/dashboard/ObjectivesTable";
import { fetchObjectives, deleteObjective } from "@/app/services/objectives.service";
import type { Objective, ObjectiveStatus } from "@/app/types/objective";

const statusTabs = [
  { label: "A fazer", value: "ACTIVE" },
  { label: "Cancelados", value: "CANCELED" },
  { label: "Concluídos", value: "COMPLETED" },
];

export default function HomePage() {
  const [activeStatus, setActiveStatus] = useState<ObjectiveStatus>("ACTIVE");
  const [allObjectives, setAllObjectives] = useState<Objective[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchObjectives()
      .then((data) => {
        if (isMounted) setAllObjectives(data);
      })
      .catch(() => {
        if (isMounted) toast.error("Could not load objectives.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleObjectives = allObjectives.filter((o) => o.status === activeStatus);

  const handleEdit = (id: number) => {
    console.log("edit", id);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteObjective(id);
      setAllObjectives((prev) => prev.filter((o) => o.id !== id));
      toast.success("Objective deleted.");
    } catch {
      toast.error("Could not delete objective.");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Seus Objetivos</h1>

      <div className="mt-6 flex items-center justify-between ">
        <Tabs
          tabs={statusTabs}
          active={activeStatus}
          onChange={(value) => setActiveStatus(value as ObjectiveStatus)}
        />
        <button className="rounded-lg cursor-pointer bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">
          Create new objective
        </button>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="rounded-xl border border-gray-200 py-16 text-center text-sm text-gray-400">
            Loading...
          </div>
        ) : visibleObjectives.length > 0 ? (
          <ObjectivesTable
            objectives={visibleObjectives}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-sm text-gray-400">
            No objectives found in this category.
          </div>
        )}
      </div>
    </div>
  );
}