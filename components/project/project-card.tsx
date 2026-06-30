"use client";

import * as React from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, type ChevronRightIconHandle } from "@/components/ui/chevron-right";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { CarouselCounter } from "@/components/ui/carousel-navigation";
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
      className={cn("group overflow-hidden rounded-3xl", className)}
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
  children,
  hoverEffects = true,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  children?: React.ReactNode;
  hoverEffects?: boolean;
}) {
  return (
    <div data-slot="project-card-thumb" className={cn("relative overflow-hidden", className)}>
      {src ? (
        <ImageWithFallback
          src={src} alt={alt} fill
          className={cn(
            "object-cover",
            hoverEffects && "xl:opacity-80 xl:transition-all xl:duration-200 xl:ease-out xl:group-hover:opacity-100 xl:group-hover:scale-110"
          )}
          sizes={sizes}
        />
      ) : (
        <Skeleton className="size-full" />
      )}
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
      className={cn("relative flex flex-col justify-start p-6 gap-3", className)}
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
      className={cn("font-medium line-clamp-3", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

function ProjectCardTags({ tags }: { tags?: { id: number; name: string }[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <p data-slot="project-card-tags" className="text-xs text-muted-foreground">
      {tags.map((tag) => tag.name).join(" · ")}
    </p>
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
  showActions?: boolean;
}

function ProjectCard({ project, variant = "thumb", className, showActions = true }: ProjectCardProps) {
  const thumbSrc = project.project_thumb?.url;
  const thumbAlt = project.project_thumb?.alternativeText || project.title;
  const chevronRef = React.useRef<ChevronRightIconHandle>(null);

  if (variant === "list") {
    return (
      <ProjectCardRoot
        data-variant="list"
        className={cn(
          "transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none xl:hover:scale-[1.02] active:scale-[0.97]",
          className
        )}
        onMouseEnter={() => chevronRef.current?.startAnimation()}
        onMouseLeave={() => chevronRef.current?.stopAnimation()}
      >
        <ProjectCardLink
          project={project}
          className="relative z-10 grid grid-cols-[4fr_3fr_auto] items-stretch"
        >
          <ProjectCardThumb
            src={thumbSrc}
            alt={thumbAlt}
            hoverEffects={showActions}
            className="aspect-video border border-border w-full h-full rounded-3xl transition-[border-radius,border-right-color] duration-200 ease-out delay-200 xl:group-hover:rounded-r-none xl:group-hover:border-r-transparent xl:group-hover:delay-0"
          >
          </ProjectCardThumb>
          <ProjectCardHeader className="flex-1 rounded-r-3xl border-t border-r border-b border-transparent transition-[border-color] duration-200 ease-out xl:group-hover:border-border xl:group-hover:delay-350 before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-muted/70 before:transition-transform before:duration-200 before:ease-out before:-z-10 xl:group-hover:before:scale-x-100 xl:group-hover:before:delay-200">
            <ProjectCardTags tags={project.project_tags} />
            <ProjectCardTitle className="text-xl">{project.title}</ProjectCardTitle>
            {showActions && (
              <ProjectCardActions className="absolute bottom-4 left-4 z-10 flex items-end justify-start opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
                <Button variant="outline" size="sm" tabIndex={-1} className="pointer-events-none">
                  {project.type === "article" ? "Read article" : "Read case study"}
                  <ChevronRightIcon ref={chevronRef} />
                </Button>
              </ProjectCardActions>
            )}
          </ProjectCardHeader>
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
      onMouseEnter={() => chevronRef.current?.startAnimation()}
      onMouseLeave={() => chevronRef.current?.stopAnimation()}
    >
      <ProjectCardLink project={project} className="flex flex-col">
        <ProjectCardThumb
          src={thumbSrc}
          alt={thumbAlt}
          hoverEffects={showActions}
          className="aspect-video w-full rounded-3xl border border-border transition-[border-radius,border-bottom-color] duration-200 ease-out delay-200 xl:group-hover:rounded-b-none xl:group-hover:border-b-transparent xl:group-hover:delay-0"
        >
          {showActions && (
            <ProjectCardActions className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
              <Button variant="outline" size="sm" tabIndex={-1} className="pointer-events-none">
                {project.type === "article" ? "Read article" : "Read case study"}
                <ChevronRightIcon />
              </Button>
            </ProjectCardActions>
          )}
        </ProjectCardThumb>
        <ProjectCardHeader className="flex-1 rounded-b-3xl border-l border-r border-b border-transparent transition-[border-color] duration-200 ease-out xl:group-hover:border-border xl:group-hover:delay-350 before:absolute before:inset-0 before:origin-top before:scale-y-0 before:bg-muted/70 before:transition-transform before:duration-200 before:ease-out before:-z-10 xl:group-hover:before:scale-y-100 xl:group-hover:before:delay-200">
          <ProjectCardTags tags={project.project_tags} />
          <ProjectCardTitle className="text-lg">{project.title}</ProjectCardTitle>
        </ProjectCardHeader>
      </ProjectCardLink>
    </ProjectCardRoot>
  );
}

function ProjectCardSkeleton({ variant = "thumb" }: { variant?: "thumb" | "list" }) {
  if (variant === "list") {
    return (
      <div className="rounded-3xl grid grid-cols-[3fr_4fr_auto] items-stretch">
        <Skeleton className="aspect-video w-full h-full rounded-3xl" />
        <div className="flex flex-col gap-3 justify-center p-6">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex gap-1">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl">
      <Skeleton className="aspect-video w-full rounded-3xl" />
      <div className="flex flex-col gap-3 p-6">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-1">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function ProjectCardList({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="project-card-list"
      className={cn("flex flex-col gap-10", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ProjectCardGrid({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="project-card-grid"
      className={cn("grid md:grid-cols-2 xl:grid-cols-2 gap-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ProjectCardCarousel({
  projects,
  className,
  contentClassName,
  cardClassName,
}: {
  projects: ProjectData[];
  className?: string;
  contentClassName?: string;
  cardClassName?: string;
}) {
  return (
    <Carousel
      opts={{ align: "center", loop: true, containScroll: false }}
      className={cn("w-full", className)}
      style={{ "--carousel-slide-size": "100%", "--carousel-peek": "2rem", "--carousel-gap": "0.75rem" } as React.CSSProperties}
    >
      <CarouselContent className={contentClassName}>
        {projects.map((project) => (
          <CarouselItem key={project.id}>
            <ProjectCard project={project} variant="thumb" showActions={false} className={cardClassName} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {projects.length > 1 && (
        <div className="flex items-center justify-between mt-4 px-8 md:px-24">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselCounter />
          <CarouselNext className="static translate-y-0" />
        </div>
      )}
    </Carousel>
  );
}

export {
  ProjectCard,
  ProjectCardSkeleton,
  ProjectCardCarousel,
  ProjectCardList,
  ProjectCardGrid,
  ProjectCardRoot,
  ProjectCardLink,
  ProjectCardThumb,
  ProjectCardHeader,
  ProjectCardTitle,
  ProjectCardTags,
  ProjectCardActions,
};
