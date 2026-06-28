"use client";

import { useId, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface AnimatedTab {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface AnimatedTabsProps {
  tabs: AnimatedTab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
  fades?: boolean;
}

export function AnimatedTabsSticky({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("sticky top-0 z-10 -mt-24 pt-24 bg-background w-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function AnimatedTabs({ tabs, activeTab, onTabChange, ariaLabel, className, fades = true }: AnimatedTabsProps) {
  const layoutId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view on change
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const activeButton = scrollEl.querySelector<HTMLElement>(`[data-value="${activeTab}"]`);
    if (!activeButton) return;

    const buttonRect = activeButton.getBoundingClientRect();
    const scrollRect = scrollEl.getBoundingClientRect();

    if (buttonRect.left < scrollRect.left || buttonRect.right > scrollRect.right) {
      activeButton.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeTab]);

  return (
    <div className={cn("relative", className)}>
      {/* Left fade */}
      {fades && <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-background to-transparent lg:hidden" aria-hidden="true" />}

      <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide flex justify-center bg-background rounded-xl overflow-hidden"
        >
        <div 
          className={cn("relative inline-flex h-9 items-center justify-center rounded-lg p-1 text-muted-foreground gap-1", fades && "mx-8 lg:mx-0")}
          role="group"
          aria-label={ariaLabel}
        >
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              variant="ghost"
              size="sm"
              data-value={tab.value}
              onClick={() => onTabChange(tab.value)}
              aria-pressed={activeTab === tab.value}
              aria-label={tab.icon ? (tab.label ?? tab.value) : undefined}
              className={cn(
                "h-7 cursor-pointer relative hover:bg-transparent gap-1.5 z-1 whitespace-nowrap",
                activeTab === tab.value && "text-foreground"
              )}
            >
              {activeTab === tab.value && (
                <motion.div
                  layoutId={`tab-highlight-${layoutId}`}
                  className="absolute inset-0 bg-muted rounded-lg"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                />
              )}
              {tab.icon}
              {tab.label}
              {tab.badge !== undefined && (
                <Badge variant="secondary" className={cn("h-4 px-1 text-xs", activeTab === tab.value && "bg-background")}>{tab.badge}</Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Right fade */}
      {fades && <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-background to-transparent lg:hidden" aria-hidden="true" />}
    </div>
  );
}
