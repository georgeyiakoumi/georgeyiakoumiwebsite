"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useStickyTrigger(stickyRef: React.RefObject<HTMLDivElement | null>, enabled = true) {
  useGSAP(() => {
    if (!enabled) return;
    if (!stickyRef.current) return;
    const scroller = document.querySelector("main");
    if (!scroller) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({
        trigger: stickyRef.current,
        scroller,
        start: "top 15%",
        onEnter: () => stickyRef.current?.classList.add("pt-18"),
        onLeaveBack: () => stickyRef.current?.classList.remove("pt-18"),
      });
    });
  }, { scope: stickyRef, dependencies: [enabled] });
}
