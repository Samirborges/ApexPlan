import Link from "next/link";
import { RequestPasswordResetForm } from "@/app/components/auth/RequestPasswordResetForm";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900">Forgot your password?</h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter your email and we&apos;ll send you a link to reset it.
        </p>

        <div className="mt-8">
          <RequestPasswordResetForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          <Link href="/login" className="font-medium  text-indigo-600 underline">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}