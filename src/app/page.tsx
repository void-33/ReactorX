"use client";	
import { Hero } from "@/components/homepage/Hero";
import { Features } from "@/components/homepage/Features";
import { AboutSection } from "@/components/homepage/AboutSection";
import { Testimonials } from "@/components/homepage/Testimonials";
import { CTA } from "@/components/homepage/CTA";
import { Header } from "@/components/homepage/Header";
import { Footer } from "@/components/homepage/Footer";

export default function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <AboutSection />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
