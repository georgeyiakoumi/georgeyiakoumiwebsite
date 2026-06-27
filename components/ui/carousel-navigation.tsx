"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, type ChevronLeftIconHandle } from "@/components/ui/chevron-left";
import { ChevronRightIcon, type ChevronRightIconHandle } from "@/components/ui/chevron-right";
import { useCarousel } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface CarouselNavigationProps {
  className?: string;
}

function useCarouselCounter() {
  const { api } = useCarousel();
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!api) return;

    setTotal(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    const onReInit = () => {
      setTotal(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onReInit);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onReInit);
    };
  }, [api]);

  return { current, total };
}

export function CarouselCounter({ className }: { className?: string }) {
  const { current, total } = useCarouselCounter();

  if (total <= 1) return null;

  return (
    <span className={cn("text-xs font-mono text-muted-foreground tracking-tighter tabular-nums select-none", className)}>
      {current + 1} / {total}
    </span>
  );
}

export function CarouselNavigation({ className }: CarouselNavigationProps) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();
  const { current, total } = useCarouselCounter();
  const leftRef = useRef<ChevronLeftIconHandle>(null);
  const rightRef = useRef<ChevronRightIconHandle>(null);

  if (total <= 1) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-card rounded-lg will-change-transform transition-all duration-200 origin-top-right xl:hover:scale-[1.1] xl:hover:bg-background",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={scrollPrev}
        onMouseEnter={() => leftRef.current?.startAnimation()}
        onMouseLeave={() => leftRef.current?.stopAnimation()}
        disabled={!canScrollPrev}
        className="rounded-lg cursor-pointer dark:hover:bg-white/15"
      >
        <ChevronLeftIcon ref={leftRef} />
        <span className="sr-only">Previous slide</span>
      </Button>
      <span className="text-xs font-mono text-muted-foreground tracking-tighter tabular-nums select-none">
        {current + 1} / {total}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={scrollNext}
        onMouseEnter={() => rightRef.current?.startAnimation()}
        onMouseLeave={() => rightRef.current?.stopAnimation()}
        disabled={!canScrollNext}
        className="rounded-lg cursor-pointer dark:hover:bg-white/15"
      >
        <ChevronRightIcon ref={rightRef}/>
        <span className="sr-only">Next slide</span>
      </Button>
    </div>
  );
}
