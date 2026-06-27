import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "header" | "footer" | "article" | "aside" | "nav";
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ children, className, as: Tag = "section" }, ref) => {
    return (
      <Tag
        ref={ref as React.Ref<HTMLElement>}
        className={cn("gap-8 lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl min-h-dvh flex flex-col mx-auto items-center justify-center px-8 lg:px-0 py-32", className)}
      >
        {children}
      </Tag>
    );
  }
);

Section.displayName = "Section";
