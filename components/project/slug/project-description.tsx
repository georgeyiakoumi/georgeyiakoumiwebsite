"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Typography } from "@/components/ui/typography";
import { Section } from "@/components/layout/section";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

interface ProjectDescriptionProps {
  description?: string | null;
}

export function ProjectDescription({ description }: ProjectDescriptionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!description || !sectionRef.current) return;

    const splitEl = sectionRef.current.querySelector("[data-split]");
    if (!splitEl) return;

    const split = SplitText.create(splitEl, { type: "words", autoSplit: true });

    gsap.from(split.words, {
      autoAlpha: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        scroller: document.querySelector("main"),
        start: "top center",
        toggleActions: "play none none none",
      },
    });
  }, { scope: sectionRef, dependencies: [description] });

  if (!description) return null;

  return (
    <Section ref={sectionRef}>
      <Typography variant="display" align="center" className="max-w-xl lg:max-w-2xl" data-split>
        {description}
      </Typography>
    </Section>
  );
}
