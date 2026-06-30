"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Button } from "@/components/ui/button";
import { LinkIcon, type LinkIconHandle } from "@/components/ui/link";
import { GithubIcon, type GithubIconHandle } from "@/components/ui/github";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { BlockFigure } from "@/components/project/project-blocks/block-figure";
import { Typography } from "@/components/ui/typography";

function ensureProtocol(url: string) {
  return url.match(/^https?:\/\//) ? url : `https://${url}`;
}

interface ProjectHeroProps {
  title: string;
  heroImageUrl: string | null;
  heroAlt: string;
  websiteUrl?: string | null;
  githubUrl?: string | null;
}

export function ProjectHero({ title, heroImageUrl, heroAlt, websiteUrl, githubUrl }: ProjectHeroProps) {
  const linkIconRef = useRef<LinkIconHandle>(null);
  const githubIconRef = useRef<GithubIconHandle>(null);

  return (
    <header className={cn(
      "relative flex flex-col justify-start items-center min-h-dvh w-full",
      "gap-8 mx-auto px-8 pt-24",
      "md:pt-0 md:justify-center md:max-w-2xl",
      "lg:px-0",
      "xl:max-w-3xl",
    )}>
      <Typography variant="h1" className="text-center max-w-xl">
        {title}
      </Typography>

      {(websiteUrl || githubUrl) && (
        <div className="flex items-center gap-3">
          {websiteUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={ensureProtocol(websiteUrl)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit website"
                onMouseEnter={() => linkIconRef.current?.startAnimation()}
                onMouseLeave={() => linkIconRef.current?.stopAnimation()}
              >
                <LinkIcon ref={linkIconRef}/>
                View project
              </a>
            </Button>
          )}
          {githubUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={ensureProtocol(githubUrl)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on GitHub"
                onMouseEnter={() => githubIconRef.current?.startAnimation()}
                onMouseLeave={() => githubIconRef.current?.stopAnimation()}
              >
                <GithubIcon ref={githubIconRef}/>
                GitHub Repo
              </a>
            </Button>
          )}
        </div>
      )}

      {heroImageUrl && (
        <BlockFigure className="xl:max-w-3xl px-0 my-0">
          <ImageWithFallback
            src={heroImageUrl}
            alt={heroAlt}
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
        </BlockFigure>
      )}

      <ScrollIndicator />
    </header>
  );
}
