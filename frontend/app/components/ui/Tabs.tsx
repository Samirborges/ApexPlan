"use client";

import { clsx } from "clsx";

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex items-center gap-8 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={clsx(
            "-mb-px border-b-2 pb-3 text-sm font-medium transition-colors cursor-pointer",
            active === tab.value
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-400 hover:text-gray-600"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}