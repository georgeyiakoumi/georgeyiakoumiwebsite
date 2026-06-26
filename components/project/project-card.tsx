"use client";

import * as React from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "@/components/ui/chevron-right";
import { cn, getEntryPath } from "@/lib/utils";
import type { ProjectData } from "@/lib/strapi-queries";

// --- Primitives ---

function ProjectCardRoot({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="project-card"
      className={cn("group rounded-xl overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ProjectCardLink({
  project,
  className,
  children,
}: {
  project: ProjectData;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={getEntryPath(project.type, project.slug)} className={cn("h-full", className)}>
      {children}
    </Link>
  );
}

function ProjectCardThumb({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 768px",
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <div data-slot="project-card-thumb" className={cn("relative overflow-hidden", className)}>
      {src ? (
        <ImageWithFallback
          src={src} alt={alt} fill
          className="object-cover xl:opacity-80 xl:transition-all xl:duration-300 xl:ease-out xl:group-hover:opacity-100 xl:group-hover:scale-110"
          sizes={sizes}
        />
      ) : (
        <Skeleton className="size-full" />
      )}
    </div>
  );
}

function ProjectCardContent({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="project-card-content"
      className={cn("flex items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ProjectCardHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="project-card-header"
      className={cn("relative flex flex-col justify-center p-6 gap-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ProjectCardTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="project-card-title"
      className={cn("font-medium line-clamp-2", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

function ProjectCardTags({ tags }: { tags?: { id: number; name: string }[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div data-slot="project-card-tags" className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <Badge key={tag.id} variant="outline">
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}

function ProjectCardActions({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="project-card-actions"
      className={cn("flex items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// --- Composed ---

interface ProjectCardProps {
  project: ProjectData;
  variant?: "thumb" | "list";
  className?: string;
}

function ProjectCard({ project, variant = "thumb", className }: ProjectCardProps) {
  const thumbSrc = project.project_thumb?.url;
  const thumbAlt = project.project_thumb?.alternativeText || project.title;

  if (variant === "list") {
    return (
      <ProjectCardRoot
        data-variant="list"
        className={cn(
          "transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none xl:hover:scale-[1.02] active:scale-[0.97]",
          className
        )}
      >
        <ProjectCardLink
          project={project}
          className="relative z-10 grid grid-cols-[3fr_4fr_auto] items-stretch"
        >
          <ProjectCardThumb
            src={thumbSrc}
            alt={thumbAlt}
            className="aspect-video w-full h-full rounded-xl transition-[border-radius] duration-300 ease-out xl:group-hover:rounded-r-none"
          />
          <ProjectCardContent className="flex-1">
            <ProjectCardHeader className="before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-muted/70 before:transition-transform before:duration-500 before:ease-out before:-z-10 xl:group-hover:before:scale-x-100 xl:group-hover:before:delay-300">
              <ProjectCardTitle className="text-2xl">{project.title}</ProjectCardTitle>
              <ProjectCardTags tags={project.project_tags} />
              <ProjectCardActions className="opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                <Button variant="outline" size="sm" tabIndex={-1} className="pointer-events-none">
                  {project.type === "article" ? "Read article" : "Read case study"}
                  <ChevronRightIcon size={14} />
                </Button>
              </ProjectCardActions>
            </ProjectCardHeader>
          </ProjectCardContent>
        </ProjectCardLink>
      </ProjectCardRoot>
    );
  }

  return (
    <ProjectCardRoot
      data-variant="thumb"
      className={cn(
        "transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none xl:hover:scale-[1.02] active:scale-[0.97]",
        className
      )}
    >
      <ProjectCardLink project={project} className="flex flex-col">
        <ProjectCardThumb
          src={thumbSrc}
          alt={thumbAlt}
          className="aspect-video w-full rounded-xl"
        />
        <ProjectCardHeader>
          <ProjectCardTitle className="text-lg">{project.title}</ProjectCardTitle>
          <ProjectCardTags tags={project.project_tags} />
        </ProjectCardHeader>
      </ProjectCardLink>
    </ProjectCardRoot>
  );
}

export {
  ProjectCard,
  ProjectCardRoot,
  ProjectCardLink,
  ProjectCardThumb,
  ProjectCardContent,
  ProjectCardHeader,
  ProjectCardTitle,
  ProjectCardTags,
  ProjectCardActions,
};
