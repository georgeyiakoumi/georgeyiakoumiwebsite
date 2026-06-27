"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
