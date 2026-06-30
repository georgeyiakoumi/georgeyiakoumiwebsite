"use client";

import { getStrapiMediaURL } from "@/lib/strapi";
import { ProjectHero } from "@/components/project/slug/project-hero";
import { ProjectDescription } from "@/components/project/slug/project-description";
import { OtherProjects } from "@/components/project/slug/other-projects";
import { ProjectBlockRenderer } from "@/components/project/project-blocks";
import { SnapshotBlock } from "@/components/project/project-blocks/snapshot-block";
import { ShareBar } from "@/components/project/slug/share-bar";
import type { ProjectData, SnapshotItem } from "@/lib/strapi-queries";

interface ProjectClientProps {
  project: ProjectData;
  otherProjects: ProjectData[];
}

export function ProjectClient({ project, otherProjects }: ProjectClientProps) {
  const heroImageUrl = project.project_thumb
    ? getStrapiMediaURL(project.project_thumb.url)
    : null;

  const snapshotItems: SnapshotItem[] = (() => {
    const items: SnapshotItem[] = [];
    let id = 1;
    if (project.project_client || project.date) {
      let dateText = '';
      if (project.date) {
        const startDate = new Date(project.date);
        const dateFormat: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "short",
          ...(project.type === "article" && { day: "numeric" as const }),
        };
        dateText = startDate.toLocaleDateString("en-US", dateFormat);
        if (project.end_date) {
          const endDate = new Date(project.end_date);
          dateText += ` – ${endDate.toLocaleDateString("en-US", dateFormat)}`;
          const totalMonths =
            (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth()) + 1;
          if (totalMonths > 0) {
            dateText += ` (${totalMonths}mo)`;
          }
        }
      }
      items.push({
        id: id++,
        label: 'Who',
        content: [{ __component: 'project-blocks.string-value', id: 0, text: project.project_client ?? '', subtext: dateText }],
      });
    }
    if (project.snapshot_items) {
      for (const item of project.snapshot_items) {
        items.push(item);
      }
    }
    return items;
  })();

  return (
    <section className="place-items-center relative">
      <ProjectHero
        title={project.title}
        heroImageUrl={heroImageUrl}
        heroAlt={project.project_thumb?.alternativeText || project.title || ''}
      />

      <ProjectDescription description={project.description} />

      <article className="flex flex-col w-full space-y-12">
        {snapshotItems.length > 0 && (
          <SnapshotBlock
            items={snapshotItems}
            projectRole={project.project_role}
            tools={project.tools}
            websiteUrl={project.website_url}
            githubUrl={project.github_url}
          />
        )}
        {project.body && (
          <ProjectBlockRenderer
            blocks={project.body}
            projectTitle={project.title}
          />
        )}
        <ShareBar type={project.type} />
      </article>

      <OtherProjects projects={otherProjects} type={project.type} />
    </section>
  );
}
