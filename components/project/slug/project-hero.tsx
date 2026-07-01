"use client";

import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { ScrollIndicator } from "@/components/scroll-indicator";
import { BlockFigure } from "@/components/project/project-blocks/blocks/block-figure";
import { Typography } from "@/components/ui/typography";

interface ProjectHeroProps {
  title: string;
  heroImageUrl: string | null;
  heroAlt: string;
}

export function ProjectHero({ title, heroImageUrl, heroAlt }: ProjectHeroProps) {
  return (
    <header className={cn(
      "relative flex flex-col justify-center items-center min-h-dvh w-full",
      "gap-8 mx-auto px-8",
      "md:pt-0 md:max-w-2xl",
      "lg:px-0",
      "xl:max-w-3xl",
    )}>
      <Typography variant="h1" className="text-center max-w-xl">
        {title}
      </Typography>

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
