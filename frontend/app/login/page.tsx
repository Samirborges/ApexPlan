import Link from "next/link";
import { LoginForm } from "@/app/components/auth/LoginForm";
import { ImagePlaceholder } from "@/app/components/ui/ImagePlaceholder";

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <ImagePlaceholder label="Banner" className="h-24 w-full rounded-none" />

      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-center text-3xl font-bold text-gray-900">
          Welcome back
        </h1>

        <div className="mt-10">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-indigo-600">
            Create one here
          </Link>
        </p>
      </div>
    </main>
  );
}