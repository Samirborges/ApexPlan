import Link from "next/link";
import { LoginForm } from "@/app/components/auth/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <div className="relative h-24 w-full">
        <Image src="/images/apexplan-image.png" alt="" fill className="object-cover" />
      </div>

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