import Link from "next/link";
import { ImagePlaceholder } from "@/app/components/ui/ImagePlaceholder";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  description: string;
}

export function FeatureCard({ title, subtitle, description }: FeatureCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3">
        <ImagePlaceholder className="h-10 w-10 shrink-0 rounded-sm" />
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