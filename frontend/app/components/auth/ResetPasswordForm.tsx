"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/app/lib/validations/auth";
import { confirmPasswordReset } from "@/app/services/auth.service";
import { Input } from "@/app/components/ui/Input";

interface ResetPasswordFormProps {
  uid: string;
  token: string;
}

export function ResetPasswordForm({ uid, token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await confirmPasswordReset({ uid, token, password: data.password });
      router.push("/login?reset=success");
    } catch {
      // Cobre tanto token expirado quanto inválido — o backend não
      // diferencia isso na prática de UX.
      setFormError("This reset link is invalid or has expired. Please request a new one.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {formError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {formError}
        </div>
      )}

      <Input
        placeholder="New password"
        type="password"
        autoComplete="new-password"
        {...register("password")}
        error={errors.password?.message}
      />
      <Input
        placeholder="Confirm new password"
        type="password"
        autoComplete="new-password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full cursor-pointer rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}