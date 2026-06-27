"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";

const AtSignIcon = dynamic(() => import("@/components/ui/at-sign").then(mod => ({ default: mod.AtSignIcon })), { ssr: false });
type AtSignIconHandle = import("@/components/ui/at-sign").AtSignIconHandle;

interface AboutSectionProps {
  heading?: string;
  paragraphs: Array<{ children?: Array<{ text?: string }> }>;
  email?: string;
}

export function AboutSection({ heading, paragraphs, email }: AboutSectionProps) {
  const atSignRef = useRef<AtSignIconHandle>(null);

  return (
    <Section>
      <Typography variant="h2" align="center">
        {heading}
      </Typography>
      <div className="flex flex-col gap-4 max-w-xl lg:max-w-xl">
        {paragraphs.map((para, index) => (
          <Typography key={index} variant="lead" align="left">
            {para.children?.[0]?.text || ''}
          </Typography>
        ))}
      </div>
      {email && (
        <Button
          size="lg"
          asChild
          onMouseEnter={() => atSignRef.current?.startAnimation()}
          onMouseLeave={() => atSignRef.current?.stopAnimation()}
        >
          <a href={`mailto:${email}`}>
            <AtSignIcon ref={atSignRef} />
            Email me
          </a>
        </Button>
      )}
    </Section>
  );
}

export function AboutSectionSkeleton() {
  return (
    <Section>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-6 w-96" />
      <Skeleton className="h-6 w-80" />
      <Skeleton className="h-12 w-40" />
    </Section>
  );
}
