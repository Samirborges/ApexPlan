"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerSchema, type RegisterFormValues } from "@/app/lib/validations/auth";
import { registerUser } from "@/app/services/auth.service";
import { Input } from "@/app/components/ui/Input";

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await  registerUser(data);
      toast.success("Account created successfully!");
      reset();
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      toast.error("Could not create account. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <Input
          placeholder="Username"
          autoComplete="username"
          {...register("username")}
          error={errors.username?.message}
        />
        <Input
          placeholder="Email"
          type="email"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          placeholder="Password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
        />
        <Input
          placeholder="Confirm Password"
          type="password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className="mt-2 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="cursor-pointer w-full text-sm font-medium px-8 py-3 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition duration-300  "
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer w-full rounded-md bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}