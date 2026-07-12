"use client";

import { Pencil, Trash2 } from "lucide-react";
import { ImagePlaceholder } from "@/app/components/ui/ImagePlaceholder";
import { formatDate } from "@/app/lib/utils/date";
import type { Objective } from "@/app/types/objective";

interface ObjectivesTableProps {
  objectives: Objective[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ObjectivesTable({ objectives, onEdit, onDelete }: ObjectivesTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white cursor-pointer">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-gray-500">
            <th className="px-6 py-3 font-medium">Name objective</th>
            <th className="px-6 py-3 font-medium">Description objective</th>
            <th className="px-6 py-3 font-medium">Dates objectives</th>
            <th className="px-6 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {objectives.map((objective) => (
            <tr
              key={objective.id}
              className="group border-b border-gray-100 text-gray-900 transition-colors last:border-0 hover:bg-indigo-600 hover:text-white"
            >
              <td className="flex items-center gap-3 px-6 py-4 font-medium">
                <ImagePlaceholder label="Status" className="h-6 w-6 shrink-0 rounded-full" />
                {objective.title}
              </td>
              <td className="max-w-xs truncate px-6 py-4 text-gray-500 group-hover:text-white/90">
                {objective.description}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-medium">{formatDate(objective.start_date)}</span>
                <span className="mx-2 text-gray-400 group-hover:text-white/70">→</span>
                <span className="font-medium">{formatDate(objective.end_date)}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onEdit(objective.id)}
                    aria-label="Edit objective"
                    className="text-gray-400 transition-colors cursor-pointer hover:text-yellow-500 group-hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(objective.id)}
                    aria-label="Delete objective"
                    className="text-gray-400 transition-colors cursor-pointer hover:text-red-500 group-hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}