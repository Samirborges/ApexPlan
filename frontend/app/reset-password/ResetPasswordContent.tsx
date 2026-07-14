"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ResetPasswordForm } from "@/app/components/auth/ResetPasswordForm";

export function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  if (!uid || !token) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900">Invalid reset link</h1>
          <p className="mt-2 text-sm text-gray-500">
            This link is missing required information. Please request a new password reset.
          </p>
          <Link
            href="/forgot-password"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Request new link
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
        <p className="mt-2 text-sm text-gray-500">Choose a new password for your account.</p>

        <div className="mt-8">
          <ResetPasswordForm uid={uid} token={token} />
        </div>
      </div>
    </main>
  );
}