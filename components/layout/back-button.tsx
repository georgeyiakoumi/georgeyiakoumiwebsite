"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, type ArrowLeftIconHandle } from "@/components/ui/arrow-left";
import { cn } from "@/lib/utils";

export function BackButton({ className }: { className?: string }) {
  const arrowLeftRef = useRef<ArrowLeftIconHandle>(null);

  return (
    <Button
      onClick={() => window.history.back()}
      variant="ghost"
      className={cn("lg:fixed cursor-pointer lg:bottom-16 lg:left-16", className)}
      onMouseEnter={() => arrowLeftRef.current?.startAnimation()}
      onMouseLeave={() => arrowLeftRef.current?.stopAnimation()}
    >
      <ArrowLeftIcon ref={arrowLeftRef} />
      Back
    </Button>
  );
}
