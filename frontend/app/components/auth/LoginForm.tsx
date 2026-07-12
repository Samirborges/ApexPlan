"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/app/lib/validations/auth";
import { useAuth } from "@/app/context/AuthContext";
import { Input } from "@/app/components/ui/Input";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await login(data);
      router.push("/home");
    } catch (error) {
      // Mensagem genérica: não revele se foi "email não existe" vs "senha errada",
      // isso evita enumeration attack.
      setFormError("Invalid email or password.");
      resetField("password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        {formError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {formError}
          </div>
        )}

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
          autoComplete="current-password"
          {...register("password")}
          error={errors.password?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full cursor-pointer rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}