import { Navbar } from "@/app/components/landing/Navbar";
import { Hero } from "@/app/components/landing/Hero";
import { Features } from "@/app/components/landing/Features";
import { Footer } from "./components/landing/Footer";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}