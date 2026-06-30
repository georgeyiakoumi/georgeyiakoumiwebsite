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
}
