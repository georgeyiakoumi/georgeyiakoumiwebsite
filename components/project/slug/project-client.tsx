"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon, type ArrowLeftIconHandle } from "@/components/ui/arrow-left";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { LinkIcon, type LinkIconHandle } from "@/components/ui/link";
import { GithubIcon, type GithubIconHandle } from "@/components/ui/github";

import { getStrapiMediaURL } from "@/lib/strapi";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { Typography } from "@/components/ui/typography";
import { OtherProjects } from "@/components/project/slug/other-projects";
import { ProjectBlockRenderer } from "@/components/project/project-blocks";
import { SnapshotBlock } from "@/components/project/project-blocks/snapshot-block";
import { BlockFigure } from "@/components/project/project-blocks/block-figure";
import { BlockCaption } from "@/components/project/project-blocks/block-caption";
import { ShareBar } from "@/components/project/slug/share-bar";
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
  const arrowLeftRef = useRef<ArrowLeftIconHandle>(null);
  const linkIconRef = useRef<LinkIconHandle>(null);
  const githubIconRef = useRef<GithubIconHandle>(null);
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
      <Button onClick={handleBack} variant="ghost" style={{ transform: scrollVisible ? 'translateY(0)' : 'translateY(-120%)' }} className={`fixed cursor-pointer top-8 left-8 lg:bottom-8 lg:top-auto lg:left-16 lg:bottom-16 z-20 transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none lg:!transform-none ${scrollVisible ? 'opacity-100' : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto'}`} onMouseEnter={() => arrowLeftRef.current?.startAnimation()} onMouseLeave={() => arrowLeftRef.current?.stopAnimation()}>
        <ArrowLeftIcon ref={arrowLeftRef} />
        Back
      </Button>

      <header className="relative flex flex-col gap-8 px-8 items-center justify-center w-full lg:max-w-2xl xl:max-w-3xl min-h-dvh mx-auto">
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
                  onMouseEnter={() => linkIconRef.current?.startAnimation()}
                  onMouseLeave={() => linkIconRef.current?.stopAnimation()}
                >
                  <LinkIcon ref={linkIconRef} size={16} />
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
                  onMouseEnter={() => githubIconRef.current?.startAnimation()}
                  onMouseLeave={() => githubIconRef.current?.stopAnimation()}
                >
                  <GithubIcon ref={githubIconRef} size={16} />
                  GitHub Repo
                </a>
              </Button>
            )}
          </div>
        )}

        <ScrollIndicator />
      </header>

      {heroImageUrl && (
        <BlockFigure className="xl:max-w-3xl">
          <ImageWithFallback
            src={heroImageUrl}
            alt={project.project_thumb?.alternativeText || project.title || ''}
            width={1920}
            height={1080}
            priority
            fetchPriority="high"
            sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 42rem, 48rem"
            className="h-auto border-border border rounded-lg select-none"
            wrapperClassName="w-full flex justify-center"
            skeletonClassName="rounded-lg"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9IiNlZWUiLz48L3N2Zz4="
            draggable={false}
          />
          {project.hero_caption && (
            <BlockCaption>{project.hero_caption}</BlockCaption>
          )}
        </BlockFigure>
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

      <OtherProjects projects={otherProjects} type={project.type} />
    </section>
  );
}
