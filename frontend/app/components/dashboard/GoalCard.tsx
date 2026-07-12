"use client";

import { useState, useRef, useEffect } from "react";
import { Check, MoreVertical } from "lucide-react";
import { clsx } from "clsx";
import type { Goal, GoalStatus } from "@/app/types/goal";

interface GoalCardProps {
  goal: Goal;
  onToggleComplete: () => void;
  onChangeStatus: (status: GoalStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const statusOptions: { value: GoalStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export function GoalCard({ goal, onToggleComplete, onChangeStatus, onEdit, onDelete }: GoalCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [statusSubmenuOpen, setStatusSubmenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setStatusSubmenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2.5">
          <button
            onClick={onToggleComplete}
            aria-label={goal.is_completed ? "Mark as not completed" : "Mark as completed"}
            className={clsx(
              "mt-0.5 flex h-5 w-5 cursor-pointer shrink-0 items-center justify-center rounded-full border transition-colors",
              goal.is_completed ? "border-emerald-500 bg-emerald-500" : "border-gray-300 bg-white"
            )}
          >
            {goal.is_completed && <Check className="h-3 w-3 text-white" />}
          </button>
          <p className="text-sm font-semibold text-gray-900">{goal.title}</p>
        </div>

        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen((v) => !v)} aria-label="Goal options" className="text-gray-400 cursor-pointer hover:text-gray-600">
            <MoreVertical className="cursor-pointer h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-6 z-10 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <button
                onClick={() => setStatusSubmenuOpen((v) => !v)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Change status
              </button>
              {statusSubmenuOpen && (
                <div className="border-t border-gray-100">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onChangeStatus(option.value);
                        setMenuOpen(false);
                        setStatusSubmenuOpen(false);
                      }}
                      disabled={option.value === goal.status}
                      className="w-full px-3 py-2 pl-6 text-left text-sm text-gray-600 hover:bg-gray-50 disabled:text-gray-300"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => { onEdit(); setMenuOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                Edit
              </button>
              <button onClick={() => { onDelete(); setMenuOpen(false); }} className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 pl-7 text-xs text-gray-500">{goal.description}</p>
      <div className="mt-3 space-y-1 border-t border-gray-100 pl-7 pt-2 text-xs text-gray-400">
        <p>Estimated days: {goal.estimated_days}</p>
        <p>Extra days: {goal.extra_days}</p>
      </div>
    </div>
  );
}