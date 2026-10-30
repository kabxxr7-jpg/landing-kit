import type { Metadata } from "next";
import { CtaBand } from "@/components/CtaBand";
import { Faq } from "@/components/Faq";
import { Features } from "@/components/Features";
import { Hero } from "@/components/Hero";
import { LogoStrip } from "@/components/LogoStrip";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";

export const metadata: Metadata = {
  title: { absolute: "Tidepool: scheduling that stays out of your inbox" },
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <Features />
      <Pricing />
      <Testimonials />
      <Faq />
      <CtaBand />
    </>
  );
}
