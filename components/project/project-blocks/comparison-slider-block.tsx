"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { getStrapiMediaURL } from "@/lib/strapi";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { BlockFigure } from "./block-figure";
import { BlockCaption } from "./block-caption";
import type { ComparisonSliderBlock as ComparisonSliderBlockType } from "@/lib/strapi-queries";

interface ComparisonSliderBlockProps {
  block: ComparisonSliderBlockType;
  projectTitle: string;
}

export function ComparisonSliderBlock({ block, projectTitle }: ComparisonSliderBlockProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTrackMove = useCallback((clientX: number) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  }, []);

  const handleTrackStart = useCallback((clientX: number) => {
    setIsDragging(true);
    handleTrackMove(clientX);
  }, [handleTrackMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    handleTrackStart(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleTrackStart(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleTrackMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches[0]) {
        handleTrackMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleTrackMove]);

  if (!block.before_image || !block.after_image) return null;

  const beforeImageUrl = getStrapiMediaURL(block.before_image.url);
  const afterImageUrl = getStrapiMediaURL(block.after_image.url);

  return (
    <BlockFigure>
      {block.caption && (
        <BlockCaption>{block.caption}</BlockCaption>
      )}

      {/* Image container */}
      <div
        ref={trackRef}
        className="relative w-full aspect-video select-none xl:cursor-ew-resize touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-label="Comparison slider"
        aria-valuenow={Math.round(sliderPosition)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setSliderPosition((p) => Math.max(p - 2, 0));
          if (e.key === 'ArrowRight') setSliderPosition((p) => Math.min(p + 2, 100));
        }}
      >
        <div className="absolute inset-0 rounded-lg overflow-hidden border-border border">
          {/* Before Image (full) */}
          <ImageWithFallback
            src={beforeImageUrl || ''}
            alt={`${projectTitle} — before`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 32rem, 48rem"
            className="object-cover pointer-events-none select-none"
            draggable={false}
          />

          {/* After Image (clipped) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
            }}
          >
            <ImageWithFallback
              src={afterImageUrl || ''}
              alt={`${projectTitle} — after`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 32rem, 48rem"
              className="object-cover select-none"
              draggable={false}
            />
          </div>
        </div>

        {/* Divider line on image */}
        <div
          className="absolute top-0 bottom-0 w-px bg-foreground/10 pointer-events-none z-10"
          style={{ left: `${sliderPosition}%` }}
        />

        {/* Desktop: handle on canvas */}
        <div
          className="hidden xl:flex absolute size-8 rounded-full bg-primary border-1 border-border shadow-sm items-center justify-center pointer-events-none z-10"
          style={{ left: `${sliderPosition}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <ChevronsLeftRight className="size-4 text-primary-foreground" />
        </div>
      </div>

      {/* Mobile: track and handle below image */}
      <div
        className="relative w-full h-12 cursor-ew-resize select-none flex items-center touch-none xl:hidden"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Track background */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 rounded-full bg-muted" />

        {/* Filled track */}
        <div
          className="absolute top-1/2 -translate-y-1/2 left-0 h-0.5 rounded-full bg-foreground"
          style={{ width: `${sliderPosition}%` }}
        />

        {/* Handle */}
        <div
          className="absolute size-8 rounded-full bg-primary border-1 border-border shadow-sm flex items-center justify-center"
          style={{ left: `${sliderPosition}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <ChevronsLeftRight className="size-4 text-primary-foreground" />
        </div>
      </div>
    </BlockFigure>
  );
}
