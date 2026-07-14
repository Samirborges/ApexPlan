"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  requestPasswordResetSchema,
  type RequestPasswordResetFormValues,
} from "@/app/lib/validations/auth";
import { requestPasswordReset } from "@/app/services/auth.service";
import { Input } from "@/app/components/ui/Input";

export function RequestPasswordResetForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestPasswordResetFormValues>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: RequestPasswordResetFormValues) => {
    setIsSubmitting(true);
    try {
      await requestPasswordReset(data);
    } catch {
      // Silenciado de propósito: o backend sempre retorna 200 OK
      // independente do e-mail existir, por segurança (evita enumeration).
      
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-600">
        If an account exists with that email, we&apos;ve sent instructions to reset your password.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        placeholder="Email"
        type="email"
        autoComplete="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}