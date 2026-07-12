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
      <FeatureCards key="features" />
      <RevenueArc key="revenue" />
      <ChaosFunnel key="chaos-funnel" />
    </div>
  );
}
