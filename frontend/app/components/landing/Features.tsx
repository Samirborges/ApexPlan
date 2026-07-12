import { features } from "@/app/constants/site";
import { FeatureCard } from "@/app/components/landing/FeatureCard";
import Image from "next/image";

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="max-w-2xl text-3xl font-light text-gray-900">
        Achieve your goals clearly and directly with ApexPlan in simple steps.
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
        <Image
        src="/images/goals-screen.png"
        alt="ApexPlan dashboard preview"
        width={1000}
        height={400}
        className="mt-12 w-auto h-auto rounded-3xl"
      />
      </div>
    </section>
  );
}