"use client";

import { type ToolData, type BusinessData, type ProjectData } from "@/lib/strapi-queries";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedWorkSection } from "@/components/home/featured-work-section";
import { CompaniesSection } from "@/components/home/companies-section";
import { StackSection } from "@/components/home/stack-section";
import { AboutSection } from "@/components/home/about-section";

interface AboutData {
  hero: Array<{
    type: string;
    children?: Array<{ text?: string }>;
    image?: {
      url: string;
      alternativeText?: string;
    };
  }>;
  heading_businesses: string;
  heading_tools: string;
  contact: Array<{
    type: string;
    children?: Array<{ text?: string }>;
  }>;
  email?: string;
}

interface HomeContentProps {
  aboutData: AboutData | null;
  tools: ToolData[];
  businesses: BusinessData[];
  featuredProjects: ProjectData[];
}

export function HomeContent({ aboutData, tools, businesses, featuredProjects }: HomeContentProps) {
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

      <StackSection
        heading={aboutData.heading_tools}
        tools={tools}
      />

      <AboutSection
        heading={contactHeading?.children?.[0]?.text}
        paragraphs={contactParagraphs}
        email={aboutData.email}
      />
    </>
  );
}
