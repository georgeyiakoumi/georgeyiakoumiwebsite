"use client";

import { useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { useHeroAnimation } from "@/hooks/use-hero-animation";

interface HeroSectionProps {
  headingText?: string;
  paragraphs: Array<{ children?: Array<{ text?: string }> }>;
}

export function HeroSection({ headingText, paragraphs }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useHeroAnimation(sectionRef);

  return (
    <Section as="header" ref={sectionRef} className="relative">
      <Typography variant="h1" data-hero-heading>
        {headingText}
      </Typography>
      {paragraphs.map((para, index) => (
        <Typography key={index} variant="lead" align="center" className="max-w-xl" data-hero-body>
          {para.children?.[0]?.text || ''}
        </Typography>
      ))}

      <ScrollIndicator />
    </Section>
  );
}

export function HeroSectionSkeleton() {
  return (
    <Section as="header">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-96 max-w-xl" />
      <Skeleton className="h-6 w-80 max-w-xl" />
    </Section>
  );
}
