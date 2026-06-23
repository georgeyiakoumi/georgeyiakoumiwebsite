import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";

interface BlockCaptionProps {
  children: React.ReactNode;
  className?: string;
}

export function BlockCaption({ children, className }: BlockCaptionProps) {
  return (
    <Typography variant="figcaption" className={cn("order-first md:order-last", className)}>
      {children}
    </Typography>
  );
}
