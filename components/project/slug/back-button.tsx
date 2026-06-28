"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, type ArrowLeftIconHandle } from "@/components/ui/arrow-left";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { cn } from "@/lib/utils";

export function BackButton({ className }: { className?: string }) {
  const scrollVisible = useScrollVisibility();
  const arrowLeftRef = useRef<ArrowLeftIconHandle>(null);

  return (
    <Button
      onClick={() => window.history.back()}
      variant="ghost"
      style={{ transform: scrollVisible ? 'translateY(0)' : 'translateY(-120%)' }}
      className={cn("fixed cursor-pointer top-8 left-8 lg:bottom-8 lg:top-auto lg:left-16 lg:bottom-16 transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none lg:!transform-none", scrollVisible ? "opacity-100" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto", className)}
      onMouseEnter={() => arrowLeftRef.current?.startAnimation()}
      onMouseLeave={() => arrowLeftRef.current?.stopAnimation()}
    >
      <ArrowLeftIcon ref={arrowLeftRef} />
      Back
    </Button>
  );
}
