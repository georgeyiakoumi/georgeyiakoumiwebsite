"use client";

import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/section";
import { Typography } from "@/components/ui/typography";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { MessageCircleMore } from "@/components/animate-ui/icons/message-circle-more";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { getAboutPage, getTools, getBusinesses, type ToolData, type BusinessData } from "@/lib/strapi-queries";
import { ThemedLogo } from "@/components/themed-logo";
import { useEffect, useState } from "react";
import HomeLoading from "@/app/loading";

export function HomeClient() {
  const [aboutData, setAboutData] = useState<Awaited<ReturnType<typeof getAboutPage>>>(null);
  const [tools, setTools] = useState<ToolData[]>([]);
  const [businesses, setBusinesses] = useState<BusinessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    Promise.all([
      getAboutPage(),
      getTools(),
      getBusinesses()
    ])
      .then(([about, toolsData, businessesData]) => {
        setAboutData(about);
        setTools(toolsData);
        setBusinesses(businessesData);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <HomeLoading />;
  }

  if (error || !aboutData) {
    return (
      <Section>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle />
            </EmptyMedia>
            <EmptyTitle>Unable to load page</EmptyTitle>
            <EmptyDescription>Please try again later.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Section>
    );
  }

  const heading = aboutData.hero.find(block => block.type === 'heading');
  const avatarBlock = aboutData.hero.find(block => block.type === 'image');
  const paragraphs = aboutData.hero.filter(block => block.type === 'paragraph');

  const headingText = heading?.children?.[0]?.text;
  const avatarUrl = avatarBlock?.image?.url;
  const avatarAlt = avatarBlock?.image?.alternativeText || "Profile photo";

  const contactHeading = aboutData.contact.find(block => block.type === 'heading');
  const contactParagraph = aboutData.contact.find(block => block.type === 'paragraph');

  const contactHeadingText = contactHeading?.children?.[0]?.text;
  const contactDescription = contactParagraph?.children?.[0]?.text;

  return (
    <>
      <Section as="header">
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt={avatarAlt}
            width={128}
            height={128}
            className="size-32 rounded-full mx-auto object-cover select-none"
            draggable={false}
            priority
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
      </Section>

      <Section>
        <Typography variant="h2" align="center">
          {aboutData.heading_businesses}
        </Typography>

          <div className="w-full grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {businesses.map((business) => (
              <ThemedLogo key={business.id} data={business} />
            ))}
          </div>

      </Section>

      <Section>
        <Typography variant="h2" align="center">
          {aboutData.heading_tools}
        </Typography>

        <div className="flex flex-col items-center gap-8 w-full">
          <div
            className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 gap-1"
            role="group"
            aria-label="Filter tools by category"
          >
            <Button
              variant={activeCategory === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory("all")}
              aria-pressed={activeCategory === "all"}
              className="h-7 xl:cursor-pointer"
            >
              All
            </Button>
            <Button
              variant={activeCategory === "design" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory("design")}
              aria-pressed={activeCategory === "design"}
              className="h-7 xl:cursor-pointer"
            >
              Design
            </Button>
            <Button
              variant={activeCategory === "development" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory("development")}
              aria-pressed={activeCategory === "development"}
              className="h-7 xl:cursor-pointer"
            >
              Development
            </Button>
            <Button
              variant={activeCategory === "tools" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveCategory("tools")}
              aria-pressed={activeCategory === "tools"}
              className="h-7 xl:cursor-pointer"
            >
              Tools
            </Button>
          </div>

          <div className="w-full grid gap-8 grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8">
            {tools.map((tool) => {
              const isActive = activeCategory === "all" || tool.category === activeCategory;
              return (
                <div
                  key={tool.id}
                  className={`transition-all duration-300 ease-out motion-reduce:transition-none ${
                    !isActive ? "opacity-50 blur-sm pointer-events-none scale-90 saturate-50" : "scale-100 saturate-100"
                  }`}
                >
                  <ThemedLogo data={tool} />
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <Section>
        <Typography variant="h2" align="center">
          {contactHeadingText}
        </Typography>
        <Typography variant="lead" align="center">
          {contactDescription}
        </Typography>
        <AnimateIcon animateOnHover asChild>
          <Button size="lg" href="/contact">
            <MessageCircleMore />
            Get in touch
          </Button>
        </AnimateIcon>
      </Section>
    </>
  );
}
