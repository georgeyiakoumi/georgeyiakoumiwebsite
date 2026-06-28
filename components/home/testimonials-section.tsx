"use client";

import { useRef } from "react";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { LinkedinIcon, type LinkedinIconHandle } from "@/components/ui/linkedin";
import { MessageGroup, Message, MessageAvatar, MessageContent, MessageHeader } from "@/components/ui/message";
import { Bubble, BubbleContent, BubbleReactions } from "@/components/ui/bubble";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip";
import type { TestimonialData } from "@/lib/strapi-queries";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialData }) {
  const subtitle = [testimonial.role, testimonial.business].filter(Boolean).join(", ");

  return (
    <Message align="start">
      <MessageAvatar>
        <ResponsiveTooltip
          title={testimonial.name}
          content={subtitle}
        >
          <Avatar className="size-8 cursor-pointer">
            <AvatarFallback className="text-xs">{getInitials(testimonial.name)}</AvatarFallback>
          </Avatar>
        </ResponsiveTooltip>
      </MessageAvatar>
      <MessageContent>
        <Bubble variant="muted">
          <BubbleContent>{testimonial.message}</BubbleContent>
          {testimonial.reaction && (
            <BubbleReactions role="img" aria-label={testimonial.reactionLabel || `Reaction: ${testimonial.reaction}`}>
              <span>{testimonial.reaction}</span>
            </BubbleReactions>
          )}
        </Bubble>
      </MessageContent>
    </Message>
  );
}

interface TestimonialsSectionProps {
  testimonials: TestimonialData[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const linkedinRef = useRef<LinkedinIconHandle>(null);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <Section>
      <Typography variant="h2" align="center">
        What people say
      </Typography>

      <div className="w-full max-w-2xl">
        <MessageGroup className=" gap-8">
          <Message align="end">
            <MessageContent>
              <Bubble variant="default">
                <BubbleContent className="!bg-blue-500">Tell me about George...</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>

          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </MessageGroup>
      </div>

      <Button
        variant="outline"
        asChild
        onMouseEnter={() => linkedinRef.current?.startAnimation()}
        onMouseLeave={() => linkedinRef.current?.stopAnimation()}
      >
        <a href="https://www.linkedin.com/in/georgeyiakoumi" target="_blank" rel="noopener noreferrer">
          <LinkedinIcon ref={linkedinRef} size={16} />
          View all on LinkedIn
        </a>
      </Button>
    </Section>
  );
}
