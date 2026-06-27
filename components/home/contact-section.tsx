"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";

const AtSignIcon = dynamic(() => import("@/components/ui/at-sign").then(mod => ({ default: mod.AtSignIcon })), { ssr: false });
type AtSignIconHandle = import("@/components/ui/at-sign").AtSignIconHandle;

interface ContactSectionProps {
  heading?: string;
  description?: string;
  email?: string;
}

export function ContactSection({ heading, description, email }: ContactSectionProps) {
  const atSignRef = useRef<AtSignIconHandle>(null);

  return (
    <Section>
      <Typography variant="h2" align="center">
        {heading}
      </Typography>
      <Typography variant="lead" align="center">
        {description}
      </Typography>
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
