import { Suspense } from "react";
import { ResetPasswordContent } from "@/app/reset-password/ResetPasswordContent";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-400">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}