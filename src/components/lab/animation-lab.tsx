"use client";

import { HeroMrr } from "@/components/lab/hero-mrr";
import { FeatureCards } from "@/components/lab/feature-cards";
import { RevenueArc } from "@/components/lab/revenue-arc";
import { ChaosFunnel } from "@/components/lab/chaos-funnel";

export function AnimationLab() {
  return (
    // block layout on purpose: a flex parent makes ScrollTrigger default
    // pinSpacing to false, which removes the scroll room for pinned sections
    <div>
      <HeroMrr key="hero" />
      {/* breathing room so the finished scene clears before the next pins */}
      <div aria-hidden className="h-[20vh]" />
      <FeatureCards key="features" />
      <div aria-hidden className="h-[40vh]" />
      <div className="story-three-four relative ml-[calc(50%-50vw)] w-screen bg-[#801919]">
        <RevenueArc key="revenue" />
        <div aria-hidden className="h-[40vh]" />
        <ChaosFunnel key="chaos-funnel" />
      </div>
    </div>
  );
}
