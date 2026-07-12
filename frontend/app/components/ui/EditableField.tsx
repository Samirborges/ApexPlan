"use client";

import { useState } from "react";
import { clsx } from "clsx";

interface EditableFieldProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: "text" | "textarea" | "date";
  className?: string;
}

export function EditableField({ value, onSave, type = "text", className }: EditableFieldProps) {
  const [draft, setDraft] = useState(value);
  const [isSaving, setIsSaving] = useState(false);
  const isDirty = draft !== value;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(draft);
    } finally {
      setIsSaving(false);
    }
  };

  const sharedClasses =
    "rounded-lg border border-transparent bg-transparent px-2 py-1 focus:border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500";

  return (
    <div className="flex items-start gap-3">
      {type === "textarea" ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          className={clsx(sharedClasses, "w-full resize-none", className)}
        />
      ) : (
        <input
          type={type}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className={clsx(sharedClasses, className)}
        />
      )}

      {isDirty && (
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="shrink-0 cursor-pointer rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      )}
    </div>
  );
}