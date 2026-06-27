"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { ProjectCard } from "@/components/project/project-card";
import { GalleryVerticalEndIcon, type GalleryVerticalEndIconHandle } from "@/components/ui/gallery-vertical-end";
import type { ProjectData } from "@/lib/strapi-queries";

interface FeaturedWorkSectionProps {
  projects: ProjectData[];
}

export function FeaturedWorkSection({ projects }: FeaturedWorkSectionProps) {
  const galleryIconRef = useRef<GalleryVerticalEndIconHandle>(null);

  if (projects.length === 0) return null;

  return (
    <Section className="space-y-8">
      <Typography variant="h2" align="center">
        Featured work
      </Typography>
      <div className="w-full max-w-3xl">
        <div className="lg:hidden gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="thumb" />
          ))}
        </div>
        <div className="hidden lg:flex flex-col gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="list" />
          ))}
        </div>
      </div>
      <Button variant="outline" asChild>
        <Link
          href="/projects"
          onMouseEnter={() => galleryIconRef.current?.startAnimation()}
          onMouseLeave={() => galleryIconRef.current?.stopAnimation()}
        >
          <GalleryVerticalEndIcon ref={galleryIconRef} size={16} />
          All projects
        </Link>
      </Button>
    </Section>
  );
}

export function FeaturedWorkSectionSkeleton() {
  return (
    <Section>
      <Skeleton className="h-8 w-48" />
      <div className="w-full max-w-3xl">
        <div className="lg:hidden">
          <Skeleton className="w-full aspect-video rounded-xl" />
          <div className="flex flex-col gap-2 mt-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="hidden lg:flex flex-col gap-4">
          <div className="flex gap-4 items-center rounded-xl border border-border p-px">
            <Skeleton className="size-32 rounded-l-xl shrink-0" />
            <div className="flex flex-col gap-2 flex-1 py-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
      <Skeleton className="h-10 w-32" />
    </Section>
  );
}
