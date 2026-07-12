"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";
import type { ObjectiveStatus } from "@/app/types/objective";

interface ObjectiveStatusBadgeProps {
  status: ObjectiveStatus;
  onChange: (status: ObjectiveStatus) => void;
}

const statusConfig: Record<ObjectiveStatus, { label: string; badge: string }> = {
  ACTIVE: { label: "Active", badge: "bg-blue-100 text-blue-700" },
  CANCELED: { label: "Canceled", badge: "bg-red-100 text-red-700" },
  COMPLETED: { label: "Completed", badge: "bg-emerald-100 text-emerald-700" },
};

const options: ObjectiveStatus[] = ["ACTIVE", "CANCELED", "COMPLETED"];

export function ObjectiveStatusBadge({ status, onChange }: ObjectiveStatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={clsx(
          "flex items-center gap-1.5 cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
          statusConfig[status].badge
        )}
      >
        {statusConfig[status].label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-2 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              disabled={option === status}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:text-gray-300"
            >
              <span className={clsx("h-2 w-2 rounded-full", statusConfig[option].badge.split(" ")[0])} />
              {statusConfig[option].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
