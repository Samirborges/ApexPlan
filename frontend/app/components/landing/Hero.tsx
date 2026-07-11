import { ArrowRight } from "lucide-react";
import { siteConfig, hero } from "@/app/constants/site";
import { ImagePlaceholder } from "@/app/components/ui/ImagePlaceholder";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-6">
      <div className="rounded-3xl bg-indigo-50/60 px-6 py-16 text-center">
        <span className="text-sm font-bold text-gray-900">{siteConfig.name}</span>
        <h1 className="mx-auto mt-4 max-w-3xl text-5xl font-normal leading-tight text-gray-900">
          {hero.title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-gray-500">{hero.subtitle}</p>
        <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 cursor-pointer">
          {hero.cta}
          <ArrowRight className="h-4 w-4" />
        </button>
        <ImagePlaceholder label="Hero" className="mx-auto mt-12 h-[500px] w-full" />
      </div>
    </section>
  );
}