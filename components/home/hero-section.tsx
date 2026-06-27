"use client";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { ScrollIndicator } from "@/components/scroll-indicator";

interface HeroSectionProps {
  headingText?: string;
  avatarUrl?: string;
  avatarAlt: string;
  paragraphs: Array<{ children?: Array<{ text?: string }> }>;
}

export function HeroSection({ headingText, avatarUrl, avatarAlt, paragraphs }: HeroSectionProps) {
  return (
    <Section as="header" className="relative">
      {avatarUrl && (
        <ImageWithFallback
          src={avatarUrl}
          alt={avatarAlt}
          width={128}
          height={128}
          className="size-32 rounded-full mx-auto object-cover select-none"
          draggable={false}
          priority
          fetchPriority="high"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
        />
      )}
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
      <Skeleton className="size-32 rounded-full" />
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-96" />
      <Skeleton className="h-6 w-80" />
    </Section>
  );
}
