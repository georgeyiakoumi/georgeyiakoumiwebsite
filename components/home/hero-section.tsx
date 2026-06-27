import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { ScrollIndicator } from "@/components/scroll-indicator";

interface HeroSectionProps {
  headingText?: string;
  paragraphs: Array<{ children?: Array<{ text?: string }> }>;
}

export function HeroSection({ headingText, paragraphs }: HeroSectionProps) {
  return (
    <Section as="header" className="relative">
      <Typography variant="h1">
        {headingText}
      </Typography>
      {paragraphs.map((para, index) => (
        <Typography key={index} variant="lead" align="center" className="max-w-xl">
          {para.children?.[0]?.text || ''}
        </Typography>
      ))}

      <ScrollIndicator />
    </Section>
  );
}

export function HeroSectionSkeleton() {
  return (
    <Section as="header">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-96" />
    </Section>
  );
}
