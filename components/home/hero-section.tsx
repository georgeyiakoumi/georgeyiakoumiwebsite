"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { ScrollIndicator } from "@/components/scroll-indicator";

gsap.registerPlugin(useGSAP, SplitText);

interface HeroSectionProps {
  headingText?: string;
  paragraphs: Array<{ children?: Array<{ text?: string }> }>;
}

export function HeroSection({ headingText, paragraphs }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const heading = sectionRef.current.querySelector("[data-hero-heading]");
    const body = sectionRef.current.querySelector("[data-hero-body]");
    if (!heading && !body) return;

    const tl = gsap.timeline({ delay: 0.5 });

    if (heading) {
      const headingSplit = SplitText.create(heading, { type: "words" });
      tl.from(headingSplit.words, {
        autoAlpha: 0,
        y: 15,
        stagger: 0.04,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    if (body) {
      const bodySplit = SplitText.create(body, { type: "words" });
      tl.from(bodySplit.words, {
        autoAlpha: 0,
        y: 10,
        stagger: 0.03,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.2");
    }
  }, { scope: sectionRef });

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
      <Skeleton className="h-6 w-96" />
    </Section>
  );
}
