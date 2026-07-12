"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Star, Calendar, Settings, Headphones, PanelLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { ImagePlaceholder } from "@/app/components/ui/ImagePlaceholder";

const mainNav = [
  { label: "Objetivos", href: "/home", icon: Star },
  { label: "Calendário", href: "/calendar", icon: Calendar },
];

const secondaryNav = [
  { label: "Configurações", href: "/settings", icon: Settings },
  { label: "Suporte", href: "/support", icon: Headphones },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-gray-200 bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ImagePlaceholder label="Avatar" className="h-12 w-12 shrink-0 rounded-full" />
          <div>
            <p className="font-semibold text-gray-900">{user?.username ?? "Username"}</p>
            <Link
              href="/profile"
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
            >
              Editar Perfil
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
        <button aria-label="Toggle sidebar" className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-200">
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-8 flex flex-1 flex-col">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-gray-400">
          Principal
        </p>
        <ul className="flex flex-col gap-1">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:bg-white/60"
                  )}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <ul className="mt-auto flex flex-col gap-1">
          {secondaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-white/60"
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}