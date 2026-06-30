"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";

export interface CalendarDaysIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CalendarDaysIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

const RECT_VARIANTS: Variants = {
  normal: { opacity: 1, pathLength: 1 },
  animate: { opacity: 1, pathLength: 1 },
};

const LINE_VARIANTS: Variants = {
  normal: { pathLength: 1, opacity: 1 },
  animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.2 },
  },
};

const DOT_VARIANTS: Variants = {
  normal: { scale: 1, opacity: 1 },
  animate: (i: number) => ({
    scale: [0, 1],
    opacity: [0, 1],
    transition: { delay: 0.15 + i * 0.05, duration: 0.2 },
  }),
};

const dots = [
  { cx: 8, cy: 14 },
  { cx: 12, cy: 14 },
  { cx: 16, cy: 14 },
  { cx: 8, cy: 18 },
  { cx: 12, cy: 18 },
  { cx: 16, cy: 18 },
];

const CalendarDaysIcon = forwardRef<CalendarDaysIconHandle, CalendarDaysIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 16, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          controls.start("animate");
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          controls.start("normal");
        }
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Outer rect */}
          <motion.rect
            x="3" y="4" width="18" height="18" rx="2"
            variants={RECT_VARIANTS}
            animate={controls}
          />
          {/* Top lines */}
          <motion.line x1="16" y1="2" x2="16" y2="6" variants={LINE_VARIANTS} animate={controls} />
          <motion.line x1="8" y1="2" x2="8" y2="6" variants={LINE_VARIANTS} animate={controls} />
          <motion.line x1="3" y1="10" x2="21" y2="10" variants={LINE_VARIANTS} animate={controls} />
          {/* Dots */}
          {dots.map((dot, i) => (
            <motion.circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r="1"
              fill="currentColor"
              stroke="none"
              custom={i}
              variants={DOT_VARIANTS}
              animate={controls}
            />
          ))}
        </svg>
      </div>
    );
  }
);

CalendarDaysIcon.displayName = "CalendarDaysIcon";

export { CalendarDaysIcon };
