"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, type ChevronLeftIconHandle } from "@/components/ui/chevron-left";
import { cn } from "@/lib/utils";

export function BackButton({ className }: { className?: string }) {
  const chevronRef = useRef<ChevronLeftIconHandle>(null);

  return (
    <Button
      onClick={() => window.history.back()}
      variant="ghost"
      className={cn("lg:fixed cursor-pointer lg:bottom-16 lg:left-16", className)}
      onMouseEnter={() => chevronRef.current?.startAnimation()}
      onMouseLeave={() => chevronRef.current?.stopAnimation()}
    >
      <ChevronLeftIcon ref={chevronRef} />
      Back
    </Button>
  );
}
