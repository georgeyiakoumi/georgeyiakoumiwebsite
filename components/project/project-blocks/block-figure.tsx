import { cn } from "@/lib/utils";

interface BlockFigureProps {
  children: React.ReactNode;
  className?: string;
}

export function BlockFigure({ children, className }: BlockFigureProps) {
  return (
    <figure
      className={cn(
        "flex flex-col gap-4 items-center w-full md:max-w-xl xl:max-w-2xl mx-auto",
        className
      )}
    >
      {children}
    </figure>
  );
}
