"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface AnimatedTab {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface AnimatedTabsProps {
  tabs: AnimatedTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  ariaLabel: string;
}

export function AnimatedTabs({ tabs, activeTab, onTabChange, ariaLabel }: AnimatedTabsProps) {
  const [clipPath, setClipPath] = useState<string>("");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateClipPath = useCallback(() => {
    const container = containerRef.current;
    const activeButton = buttonRefs.current[activeTab];

    if (!container || !activeButton) return;

    setIsAnimating(true);

    requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      const left = buttonRect.left - containerRect.left;
      const right = containerRect.width - (buttonRect.right - containerRect.left);
      const top = buttonRect.top - containerRect.top;
      const bottom = containerRect.height - (buttonRect.bottom - containerRect.top);

      setClipPath(`inset(${top}px ${right}px ${bottom}px ${left}px round 0.375rem)`);

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
      }, 200);
    });
  }, [activeTab]);

  useEffect(() => {
    updateClipPath();

    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = setTimeout(() => {
        updateClipPath();
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [updateClipPath]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground gap-1"
      role="group"
      aria-label={ariaLabel}
    >
      <div
        className="absolute inset-0 bg-background shadow-sm transition-[clip-path] duration-200 ease-out motion-reduce:transition-none"
        style={{
          clipPath,
          willChange: isAnimating ? 'clip-path' : 'auto'
        }}
        aria-hidden="true"
      />

      {tabs.map((tab) => (
        <Button
          key={tab.value}
          ref={(el) => { buttonRefs.current[tab.value] = el; }}
          variant="ghost"
          size="sm"
          onClick={() => onTabChange(tab.value)}
          aria-pressed={activeTab === tab.value}
          aria-label={tab.icon ? tab.label : undefined}
          className="h-7 cursor-pointer relative z-10 hover:bg-transparent gap-1.5"
        >
          {tab.icon ?? tab.label}
          {tab.badge !== undefined && (
            <Badge variant="secondary" className="h-4 px-1 text-xs">{tab.badge}</Badge>
          )}
        </Button>
      ))}
    </div>
  );
}
