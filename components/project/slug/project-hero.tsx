"use client";

import { useRef } from "react";
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
    <header className="relative flex flex-col space-y-8 px-8 lg:px-0 items-center justify-start pt-32 lg:pt-0 lg:justify-center w-full lg:max-w-2xl xl:max-w-3xl min-h-dvh mx-auto">
      <Typography variant="h1" className="text-center max-w-2xl">
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
