import { cn } from "@/lib/utils";
import type { BrandIcon as BrandIconData } from "@/lib/brand-icons";

interface BrandIconProps {
  icon: BrandIconData;
  className?: string;
}

const svgFill = "[&>svg]:size-full [&>svg]:object-contain";

export function BrandIcon({ icon, className }: BrandIconProps) {
  if (!icon.dark) {
    return (
      <span
        className={cn("block", svgFill, className)}
        dangerouslySetInnerHTML={{ __html: icon.light }}
      />
    );
  }

  return (
    <>
      <span
        className={cn("block dark:hidden", svgFill, className)}
        dangerouslySetInnerHTML={{ __html: icon.light }}
      />
      <span
        className={cn("hidden dark:block", svgFill, className)}
        dangerouslySetInnerHTML={{ __html: icon.dark }}
      />
    </>
  );
}
