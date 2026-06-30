"use client";

import * as React from "react";
import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, type ChevronRightIconHandle } from "@/components/ui/chevron-right";
import { Carousel, CarouselContent, CarouselItem, CarouselNavigation } from "@/components/ui/carousel";
import { cn, getEntryPath } from "@/lib/utils";
import type { ProjectData } from "@/lib/strapi-queries";

// --- Context ---

type CardVariant = "thumb" | "list";
const CardVariantContext = React.createContext<CardVariant>("thumb");
function useCardVariant() { return React.useContext(CardVariantContext); }

// --- Primitives ---

function ProjectCardRoot({
  variant = "thumb",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { variant?: CardVariant }) {
  return (
    <CardVariantContext.Provider value={variant}>
      <div
        data-slot="project-card"
        data-variant={variant}
        className={cn("group overflow-hidden rounded-3xl", className)}
        {...props}
      >
        {children}
      </div>
    </CardVariantContext.Provider>
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
  const variant = useCardVariant();
  const isList = variant === "list";

  return (
    <div
      data-slot="project-card-thumb"
      className={cn(
        "relative overflow-hidden aspect-video w-full border border-border rounded-3xl",
        "transition-[border-radius,border-right-color,border-bottom-color] duration-200 ease-out",
        isList
          ? "h-full delay-100 xl:group-hover:rounded-r-none xl:group-hover:border-r-transparent xl:group-hover:delay-0"
          : "xl:group-hover:rounded-b-none xl:group-hover:border-b-transparent xl:group-hover:delay-0",
        className
      )}
    >
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
  const variant = useCardVariant();
  const isList = variant === "list";

  return (
    <div
      data-slot="project-card-header"
      className={cn(
        "relative flex flex-col justify-start p-6 gap-3 flex-1 border-transparent",
        "transition-[border-color] duration-200 ease-out",
        "xl:group-hover:border-border xl:group-hover:delay-350",
        "before:absolute before:inset-0 before:bg-muted/70 before:-z-10",
        "before:transition-transform before:duration-100 before:ease-out",
        isList
          ? cn(
              "rounded-r-3xl border-t border-r border-b",
              "before:origin-left before:scale-x-0",
              "xl:group-hover:before:scale-x-100 xl:group-hover:before:delay-200"
            )
          : cn(
              "rounded-b-3xl border-l border-r border-b",
              "before:origin-top before:scale-y-0",
              "xl:group-hover:before:scale-y-100 xl:group-hover:before:delay-200"
            ),
        className
      )}
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

function ProjectCardActionButton({
  label,
  chevronRef,
}: {
  label: string;
  chevronRef?: React.RefObject<ChevronRightIconHandle | null>;
}) {
  return (
    <Button variant="outline" size="sm" tabIndex={-1} className="pointer-events-none">
      {label}
      <ChevronRightIcon ref={chevronRef} />
    </Button>
  );
}

function ProjectCardActions({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const variant = useCardVariant();
  const isList = variant === "list";

  return (
    <div
      data-slot="project-card-actions"
      className={cn(
        "absolute flex items-center opacity-0 transition-opacity ease-out group-hover:opacity-100 z-10 duration-100",
        isList
          ? "bottom-4 left-4 items-end justify-start"
          : "inset-0 justify-center",
        className
      )}
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
  const isList = variant === "list";
  const ctaLabel = project.type === "article" ? "Read article" : "Read case study";

  return (
    <ProjectCardRoot
      variant={variant}
      className={cn(
        "transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none",
        "motion-safe:xl:hover:scale-105 motion-safe:xl:hover:shadow-xl",
        className
      )}
      onMouseEnter={() => chevronRef.current?.startAnimation()}
      onMouseLeave={() => chevronRef.current?.stopAnimation()}
    >
      <ProjectCardLink
        project={project}
        className={isList
          ? "relative z-10 grid grid-cols-[4fr_3fr_auto] items-stretch"
          : "flex flex-col"
        }
      >
        <ProjectCardThumb src={thumbSrc} alt={thumbAlt} hoverEffects={showActions}>
          {showActions && !isList && (
            <ProjectCardActions>
              <ProjectCardActionButton label={ctaLabel} chevronRef={chevronRef} />
            </ProjectCardActions>
          )}
        </ProjectCardThumb>
        <ProjectCardHeader>
          <ProjectCardTags tags={project.project_tags} />
          <ProjectCardTitle className={isList ? "text-xl" : "text-lg"}>{project.title}</ProjectCardTitle>
          {showActions && isList && (
            <ProjectCardActions>
              <ProjectCardActionButton label={ctaLabel} chevronRef={chevronRef} />
            </ProjectCardActions>
          )}
        </ProjectCardHeader>
      </ProjectCardLink>
    </ProjectCardRoot>
  );
}

function ProjectCardSkeleton({ variant = "thumb" }: { variant?: "thumb" | "list" }) {
  if (variant === "list") {
    return (
      <div className="rounded-3xl grid grid-cols-[4fr_3fr_auto] items-stretch">
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
      className={cn("grid gap-8 md:grid-cols-2 xl:grid-cols-2", className)}
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
      className={cn("w-full [--carousel-slide-size:100%] [--carousel-peek:2rem]", className)}
    >
      <CarouselContent className={contentClassName}>
        {projects.map((project, i) => (
          <CarouselItem key={project.id} index={i}>
            <ProjectCard project={project} variant="thumb" showActions={false} className={cardClassName} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNavigation variant="inline" className="mt-4 px-8 md:px-24" />
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