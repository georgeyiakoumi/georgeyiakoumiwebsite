import { cn } from "@/lib/utils";

interface BlockFigureProps {
  children: React.ReactNode;
  className?: string;
}

export function BlockFigure({ children, className }: BlockFigureProps) {
  return (
    <figure
      className={cn(
        "flex flex-col gap-4 items-center w-full mx-auto px-8",
        "md:max-w-xl md:px-0",
        "xl:max-w-2xl",
        className
      )}
    >
      {children}
    </figure>
  );
}
