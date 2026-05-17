"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselPagination } from "@/components/ui/carousel";
import { ItemGroup } from "@/components/ui/item";

import { ArrowLeft } from "@/components/animate-ui/icons/arrow-left";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import { ArrowDown, ExternalLink, Github } from "lucide-react";

import { getStrapiMediaURL } from "@/lib/strapi";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { Typography } from "@/components/ui/typography";
import { ProjectCard } from "@/components/project-card";
import { ProjectBlockRenderer } from "@/components/project-blocks";
import { SnapshotBlock } from "@/components/project-blocks/snapshot-block";
import { ShareBar } from "@/components/share-bar";
import type { ProjectData, ToolData, SnapshotItem } from "@/lib/strapi-queries";

interface ProjectClientProps {
  project: ProjectData;
  otherProjects: ProjectData[];
}

function ToolBadge({ tool }: { tool: ToolData }) {
  const { resolvedTheme } = useTheme();
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const imageUrl = tool.image?.url ? getStrapiMediaURL(tool.image.url) : null;
  const isSvg = tool.image?.ext === '.svg';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSvg && imageUrl) {
      fetch(imageUrl)
        .then((res) => res.text())
        .then((svg) => setSvgContent(svg))
        .catch((err) => console.error('Failed to fetch SVG:', err));
    }
  }, [isSvg, imageUrl]);

  // Merge CSS variables based on current theme
  // Only apply theme-specific variables after mounting to prevent hydration mismatch
  const cssVariables = {
    ...(tool.cssVariables || {}),
    ...(mounted && resolvedTheme === 'dark' && tool.cssVariablesDark ? tool.cssVariablesDark : {}),
  } as React.CSSProperties;

  return (
    <Badge
      variant="secondary"
      className={`gap-2 ${tool.classes || ""}`}
      style={cssVariables}
    >
      {tool.image && (
        <>
          {isSvg && svgContent ? (
            <span
              className="size-4 [&>svg]:size-full [&>svg]:object-contain"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <Image
              src={tool.image.url}
              alt={tool.image.alternativeText || tool.name}
              width={16}
              height={16}
              className="object-contain"
            />
          )}
        </>
      )}
      {tool.name}
    </Badge>
  );
}

function ensureProtocol(url: string) {
  return url.match(/^https?:\/\//) ? url : `https://${url}`;
}

export function ProjectClient({ project, otherProjects }: ProjectClientProps) {

  const heroImageUrl = project.project_thumb
    ? getStrapiMediaURL(project.project_thumb.url)
    : null;

  const scrollVisible = useScrollVisibility();
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;

    const handleScroll = () => {
      setShowScrollIndicator(scrollContainer.scrollTop < 100);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  // Build snapshot items: always start from project fields, then append CMS extras
  const snapshotItems: SnapshotItem[] = (() => {
    const items: SnapshotItem[] = [];
    let id = 1;
    if (project.project_role) items.push({ id: id++, label: 'Role', value: project.project_role });
    if (project.project_client) items.push({ id: id++, label: 'Client', value: project.project_client });
    if (project.date) {
      const startDate = new Date(project.date);
      const dateFormat: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        ...(project.type === "article" && { day: "numeric" as const }),
      };
      let dateValue = startDate.toLocaleDateString("en-US", dateFormat);

      if (project.end_date) {
        const endDate = new Date(project.end_date);
        dateValue += ` – ${endDate.toLocaleDateString("en-US", dateFormat)}`;

        const totalMonths =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth()) + 1;

        if (totalMonths > 0) {
          dateValue += ` (${totalMonths} month${totalMonths !== 1 ? "s" : ""})`;
        }
      }

      items.push({ id: id++, label: 'Date', value: dateValue });
    }
    // Append any extra CMS-authored snapshot items
    if (project.snapshot_items) {
      for (const item of project.snapshot_items) {
        items.push({ id: id++, label: item.label, value: item.value });
      }
    }
    return items;
  })();

  return (
    <section className="place-items-center relative">
      <AnimateIcon animateOnHover asChild>
        <Button onClick={handleBack} variant="secondary" style={{ transform: scrollVisible ? 'translateY(0)' : 'translateY(-120%)' }} className={`bg-background fixed cursor-pointer top-8 left-8 md:bottom-8 md:top-auto md:left-8 lg:left-16 z-20 transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none md:!transform-none ${scrollVisible ? 'opacity-100' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}`}>
          <ArrowLeft />
          Back
        </Button>
      </AnimateIcon>

      <header className="relative flex flex-col gap-8 px-8 items-center justify-center w-full md:max-w-lg lg:max-w-2xl xl:max-w-3xl h-screen mx-auto">
        <Typography variant="h1" className="text-center">
          {project.title}
        </Typography>

        {project.description && (
          <Typography variant="lead" className="text-center">
            {project.description}
          </Typography>
        )}

        {(project.website_url || project.github_url) && (
          <div className="flex items-center gap-3">
            {project.website_url && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={ensureProtocol(project.website_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit website"
                >
                  <ExternalLink className="size-4" />
                  View project
                </a>
              </Button>
            )}
            {project.github_url && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={ensureProtocol(project.github_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source on GitHub"
                >
                  <Github className="size-4" />
                  GitHub Repo
                </a>
              </Button>
            )}
          </div>
        )}

        <div
          className={`absolute animate-bounce bottom-32 md:bottom-8 lg:bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground transition-opacity duration-300 motion-reduce:hidden ${
            showScrollIndicator ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <ArrowDown className="size-5" />
        </div>
      </header>

      {heroImageUrl && (
        <figure className="flex flex-col gap-4 items-center w-full px-8">
          <ImageWithFallback
            src={heroImageUrl}
            alt={project.project_thumb?.alternativeText || project.title || ''}
            width={1920}
            height={1080}
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 32rem, 48rem"
            className="h-auto md:max-w-md lg:max-w-xl xl:max-w-3xl mx-auto md:border-border md:border md:rounded-lg select-none"
            wrapperClassName="w-full flex justify-center"
            skeletonClassName="md:rounded-lg"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9IiNlZWUiLz48L3N2Zz4="
            draggable={false}
          />
          {project.hero_caption && (
            <Typography variant="figcaption" className="max-w-3xl md:max-w-md lg:max-w-xl xl:max-w-3xl order-first md:order-last">
              {project.hero_caption}
            </Typography>
          )}
        </figure>
      )}

      <article className="flex flex-col w-full py-16">
        {snapshotItems.length > 0 && (
          <SnapshotBlock
            items={snapshotItems}
            toolsContent={project.tools && project.tools.length > 0
              ? project.tools.map((tool) => <ToolBadge key={tool.id} tool={tool} />)
              : undefined
            }
          />
        )}
        {project.body && (
          <ProjectBlockRenderer
            blocks={project.body}
            projectTitle={project.title}
          />
        )}
        <ShareBar type={project.type} />
      </article>

      {otherProjects.length > 0 && (
        <section className="flex flex-col gap-8 h-screen md:h-auto md:py-16 items-center justify-center w-full bg-muted px-0 md:px-8">
          <Typography variant="h2" align="center">
            Other projects
          </Typography>

          {/* Mobile Carousel */}
          <Carousel className="w-full md:hidden">
            <CarouselContent className="mx-4">
              {otherProjects.map((otherProject) => (
                <CarouselItem key={otherProject.id} className="px-4">
                  <ProjectCard project={otherProject} background="background" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPagination className="mt-4" />
          </Carousel>

          {/* Desktop List */}
          <ItemGroup className="hidden md:flex w-full md:max-w-md lg:max-w-xl xl:max-w-3xl gap-4">
            {otherProjects.map((otherProject) => (
              <ProjectCard key={otherProject.id} project={otherProject} scenario="list" background="background" />
            ))}
          </ItemGroup>
        </section>
      )}
    </section>
  );
}
