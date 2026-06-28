"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useStickyTrigger(stickyRef: React.RefObject<HTMLDivElement | null>, enabled = true) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!enabled) return;
    if (!stickyRef.current || !sentinelRef.current) return;
    const scroller = document.querySelector("main");
    if (!scroller) return;

    const mm = gsap.matchMedia();
    mm.add({
      isMobile: "(max-width: 767px)",
      isTablet: "(min-width: 768px) and (max-width: 1023px)",
      isDesktop: "(min-width: 1024px)",
    }, (context) => {
      const { isDesktop } = context.conditions!;
      const start = "top top";
      const enterClasses = isDesktop ? ["-mt-16", "pt-16"] : [];

      ScrollTrigger.create({
        trigger: sentinelRef.current,
        scroller,
        start,
        onEnter: () => stickyRef.current?.classList.add(...enterClasses),
        onLeaveBack: () => stickyRef.current?.classList.remove(...enterClasses),
      });
    });
  }, { scope: sentinelRef, dependencies: [enabled] });

  return sentinelRef;
}
