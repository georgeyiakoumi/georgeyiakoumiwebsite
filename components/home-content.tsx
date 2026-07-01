"use client";

import { type ToolData, type BusinessData, type ProjectData, type TestimonialData, type AboutData } from "@/lib/strapi-queries";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedWorkSection } from "@/components/home/featured-work-section";
import { CompaniesSection } from "@/components/home/companies-section";
import { StackSection } from "@/components/home/stack-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { AboutSection } from "@/components/home/about-section";

interface HomeContentProps {
  aboutData: AboutData | null;
  tools: ToolData[];
  businesses: BusinessData[];
  featuredProjects: ProjectData[];
  testimonials: TestimonialData[];
}

export function HomeContent({ aboutData, tools, businesses, featuredProjects, testimonials }: HomeContentProps) {
  if (!aboutData) return null;

  const heading = aboutData.hero.find(block => block.type === 'heading');
  const paragraphs = aboutData.hero.filter(block => block.type === 'paragraph');
  const headingText = heading?.children?.[0]?.text;

  const contactHeading = aboutData.contact.find(block => block.type === 'heading');
  const contactParagraphs = aboutData.contact.filter(block => block.type === 'paragraph');

  return (
    <>
      <HeroSection
        headingText={headingText}
        paragraphs={paragraphs}
      />

      <FeaturedWorkSection projects={featuredProjects} />

      <CompaniesSection
        heading={aboutData.heading_businesses}
        businesses={businesses}
      />

      <TestimonialsSection testimonials={testimonials} />

      <AboutSection
        heading={contactHeading?.children?.[0]?.text}
        paragraphs={contactParagraphs}
        email={aboutData.email}
        cvUrl={aboutData.cvUrl}
      />

      <StackSection
        heading={aboutData.heading_tools}
        tools={tools}
      />
    </>
  );
}
