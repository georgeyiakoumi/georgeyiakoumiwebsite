"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/layout/section";
import { ProjectCardSkeleton, ProjectCardList, ProjectCardGrid } from "@/components/project/project-card";
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
        <ProjectCardGrid className="lg:hidden">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="thumb" />
          ))}
        </ProjectCardGrid>
        <ProjectCardList className="hidden lg:flex">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} variant="list" />
          ))}
        </ProjectCardList>
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
        <ProjectCardGrid className="lg:hidden">
          <ProjectCardSkeleton variant="thumb" />
        </ProjectCardGrid>
        <ProjectCardList className="hidden lg:flex">
          <ProjectCardSkeleton variant="list" />
          <ProjectCardSkeleton variant="list" />
        </ProjectCardList>
      </div>
      <Skeleton className="h-10 w-32" />
    </Section>
  );
}
