import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
}

export function FeatureCard({ title, subtitle, description, icon: Icon }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-indigo-600" />
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500">{description}</p>
      <Link href="#" className="mt-4 inline-block text-sm font-medium text-gray-900">
        Learn more
      </Link>
    </div>
  );
}