"use client";

import { type RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, SplitText);

export function useHeroAnimation(sectionRef: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    if (!sectionRef.current) return;

    const heading = sectionRef.current.querySelector("[data-hero-heading]");
    const bodies = sectionRef.current.querySelectorAll("[data-hero-body]");
    if (!heading && !bodies.length) return;

    const tl = gsap.timeline({ delay: 0.5 });

    if (heading) {
      const headingSplit = SplitText.create(heading, { type: "words" });
      // Hide words immediately to prevent flash before animation
      gsap.set(headingSplit.words, { autoAlpha: 0, y: 15 });
      tl.to(headingSplit.words, {
        autoAlpha: 1,
        y: 0,
        stagger: 0.04,
        duration: 0.5,
        ease: "power2.out",
      });
    }

    if (bodies.length) {
      bodies.forEach((body) => {
        const bodySplit = SplitText.create(body, { type: "words" });
        gsap.set(bodySplit.words, { autoAlpha: 0, y: 10 });
        tl.to(bodySplit.words, {
          autoAlpha: 1,
          y: 0,
          stagger: 0.03,
          duration: 0.4,
          ease: "power2.out",
        }, "-=0.2");
      });
    }
  }, { scope: sectionRef });
}
