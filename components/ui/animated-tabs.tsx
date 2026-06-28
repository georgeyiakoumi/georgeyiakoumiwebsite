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

function AnimatedTabBadge({
  children,
  isActive,
  className,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}) {
  return (
    <Badge
      data-slot="animated-tab-badge"
      variant="secondary"
      className={cn("h-4 px-1 !rounded-sm text-xs", isActive && "bg-background", className)}
    >
      {children}
    </Badge>
  );
}

function AnimatedTabButton({
  tab,
  isActive,
  onClick,
  layoutId,
}: {
  tab: AnimatedTab;
  isActive: boolean;
  onClick: () => void;
  layoutId: string;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      data-value={tab.value}
      onClick={onClick}
      aria-pressed={isActive}
      aria-label={tab.icon ? (tab.label ?? tab.value) : undefined}
      className={cn(
        "h-7 cursor-pointer relative hover:bg-transparent gap-1.5 z-1 whitespace-nowrap",
        isActive && "text-foreground",
        tab.badge !== undefined && "pr-1.5"
      )}
    >
      {isActive && (
        <motion.div
          layoutId={layoutId}
          className="absolute inset-0 bg-muted rounded-lg"
          style={{ zIndex: -1 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      )}
      {tab.icon}
      {tab.label}
      {tab.badge !== undefined && (
        <AnimatedTabBadge isActive={isActive}>{tab.badge}</AnimatedTabBadge>
      )}
    </Button>
  );
}

function AnimatedTabsRoot({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
    </div>
  );
}

function AnimatedTabsScroll({
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      className={cn("overflow-x-auto scrollbar-hide flex justify-center rounded-lg overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function AnimatedTabsGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("relative inline-flex h-auto items-center justify-center rounded-lg text-muted-foreground gap-1", className)}
      role="group"
      {...props}
    >
      {children}
    </div>
  );
}

function AnimatedTabsFade({ side, className }: { side: "left" | "right"; className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute top-0 bottom-0 w-8 z-10 lg:hidden",
        side === "left" && "left-0 bg-gradient-to-r from-background to-transparent",
        side === "right" && "right-0 bg-gradient-to-l from-background to-transparent",
        className
      )}
      aria-hidden="true"
    />
  );
}

export function AnimatedTabsSticky({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("sticky top-0 z-10 -mt-24 py-4 pt-24 bg-background pb-4 w-full", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function AnimatedTabs({ tabs, activeTab, onTabChange, ariaLabel, className, fades = true }: AnimatedTabsProps) {
  const layoutId = useId();
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <AnimatedTabsRoot className={className}>
      {fades && <AnimatedTabsFade side="left" />}

      <AnimatedTabsScroll ref={scrollRef}>
        <AnimatedTabsGroup className={cn(fades && "mx-8 lg:mx-0")} aria-label={ariaLabel}>
          {tabs.map((tab) => (
            <AnimatedTabButton
              key={tab.value}
              tab={tab}
              isActive={activeTab === tab.value}
              onClick={() => onTabChange(tab.value)}
              layoutId={`tab-highlight-${layoutId}`}
            />
          ))}
        </AnimatedTabsGroup>
      </AnimatedTabsScroll>

      {fades && <AnimatedTabsFade side="right" />}
    </AnimatedTabsRoot>
  );
}

export { AnimatedTabsRoot, AnimatedTabBadge, AnimatedTabButton, AnimatedTabsFade, AnimatedTabsScroll, AnimatedTabsGroup };