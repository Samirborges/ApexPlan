"use client";

import { Menu, Search } from "lucide-react";

export function Topbar() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
      <Menu className="h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Hinted search text"
        className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
      />
      <Search className="h-5 w-5 text-gray-400" />
    </div>
  );
}