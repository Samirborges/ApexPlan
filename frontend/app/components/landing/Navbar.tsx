import Link from "next/link";
import { siteConfig } from "@/app/constants/site";

export function Navbar() {
  return (
    <header className="w-full">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900">
          {siteConfig.name}
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="rounded-full border border-indigo-600 px-5 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
          >
            Sign in
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}