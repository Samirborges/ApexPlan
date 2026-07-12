import Link from "next/link";
import { RegisterForm } from "@/app/components/auth/RegisterForm";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-12 py-16 lg:w-1/2">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to ApexPlan
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Start now by creating a free account
          </p>

          <div className="mt-10">
            <RegisterForm />
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-indigo-600">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative">
        <Image src="/images/apexplan-image.png" alt="" fill className="object-cover" />
      </div>
    </main>
  );
}