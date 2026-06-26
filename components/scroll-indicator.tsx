"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownIcon, type ArrowDownIconHandle } from "@/components/ui/arrow-down";

export function ScrollIndicator() {
  const [visible, setVisible] = useState(true);
  const arrowDownRef = useRef<ArrowDownIconHandle>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      arrowDownRef.current?.startAnimation();
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;

    const handleScroll = () => {
      setVisible(scrollContainer.scrollTop < 100);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`absolute bottom-32 lg:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground transition-opacity duration-300 motion-reduce:hidden ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <ArrowDownIcon ref={arrowDownRef} size={20} />
    </div>
  );
}
