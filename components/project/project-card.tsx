"use client";

import { useRef } from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRightIcon, type ChevronRightIconHandle } from "@/components/ui/chevron-right";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemHeader,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { cn, getEntryPath } from "@/lib/utils";
import type { ProjectData } from "@/lib/strapi-queries";

interface ProjectCardProps {
  project: ProjectData;
  scenario?: "carousel" | "list";
  background?: "muted" | "background";
}

export function ProjectCard({ project, scenario = "carousel", background = "muted" }: ProjectCardProps) {
  const chevronRef = useRef<ChevronRightIconHandle>(null);

  if (scenario === "list") {
    return (
      <div
        className="group transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none xl:hover:scale-[1.02] active:scale-[0.97]"
        onMouseEnter={() => chevronRef.current?.startAnimation()}
        onMouseLeave={() => chevronRef.current?.stopAnimation()}
      >
      <Item
        asChild
        variant="outline"
        className={cn(
          "!p-0 overflow-hidden",
          background === "background" && "xl:bg-background xl:hover:bg-background xl:hover:border-foreground"
        )}
      >
        <Link href={getEntryPath(project.type, project.slug)}>
          <ItemMedia variant="image" className="size-32 !rounded-none !translate-y-0 !self-center">
            {project.project_thumb ? (
              <ImageWithFallback
                src={project.project_thumb.url}
                alt={project.project_thumb.alternativeText || project.title}
                fill
                className="object-cover xl:opacity-80 xl:transition-all xl:duration-300 xl:ease-out xl:group-hover:opacity-100 xl:group-hover:scale-110"
                sizes="256px"
              />
            ) : (
              <Skeleton className="size-full !rounded-none" />
            )}
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="xl:text-foreground line-clamp-2">
              {project.title}
            </ItemTitle>
            {project.project_tags && project.project_tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {project.project_tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">{tag.name}</Badge>
                ))}
              </div>
            )}
          </ItemContent>
          <ItemActions className="xl:text-foreground pr-4 xl:opacity-0 xl:transition-opacity xl:duration-300 xl:ease-out xl:group-hover:opacity-100">
            <ChevronRightIcon ref={chevronRef} size={16} />
          </ItemActions>
        </Link>
      </Item>
      </div>
    );
  }

  return (
    <div className="group transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none xl:hover:scale-[1.02] active:scale-[0.97]">
    <Item
      variant="outline"
      asChild
      className={cn(
        "p-0 rounded-xl overflow-hidden",
        background === "background" && "bg-background",
      )}
    >
      <Link href={getEntryPath(project.type, project.slug)} className="pb-4 h-full">
        <ItemHeader className="relative aspect-video w-full overflow-hidden">
          {project.project_thumb ? (
            <ImageWithFallback
              src={project.project_thumb.url}
              alt={project.project_thumb.alternativeText || project.title}
              fill
              className="object-cover xl:opacity-80 xl:transition-all xl:duration-300 xl:ease-out xl:group-hover:opacity-100 xl:group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          ) : (
            <Skeleton className="size-full" />
          )}
        </ItemHeader>
        <ItemContent className="px-4 min-h-[5rem]">
          <ItemTitle className="line-clamp-2">
            {project.title}
          </ItemTitle>
          {project.project_tags && project.project_tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.project_tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-xs">{tag.name}</Badge>
              ))}
            </div>
          )}
        </ItemContent>
      </Link>
    </Item>
    </div>
  );
}
