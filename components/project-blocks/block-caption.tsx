import { Typography } from "@/components/ui/typography";

interface BlockCaptionProps {
  children: React.ReactNode;
}

export function BlockCaption({ children }: BlockCaptionProps) {
  return (
    <Typography variant="figcaption" className="order-first md:order-last">
      {children}
    </Typography>
  );
}
