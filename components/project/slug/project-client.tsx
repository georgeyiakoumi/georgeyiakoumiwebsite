"use client";

import { getStrapiMediaURL } from "@/lib/strapi";
import { BackButton } from "@/components/project/slug/back-button";
import { ProjectHero } from "@/components/project/slug/project-hero";
import { ProjectDescription } from "@/components/project/slug/project-description";
import { ToolBadge } from "@/components/project/slug/tool-badge";
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
    if (project.project_role) items.push({ id: id++, label: 'Role', value: project.project_role });
    if (project.project_client) items.push({ id: id++, label: 'Client', value: project.project_client });
    if (project.date) {
      const startDate = new Date(project.date);
      const dateFormat: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        ...(project.type === "article" && { day: "numeric" as const }),
      };
      let dateValue = startDate.toLocaleDateString("en-US", dateFormat);

      if (project.end_date) {
        const endDate = new Date(project.end_date);
        dateValue += ` – ${endDate.toLocaleDateString("en-US", dateFormat)}`;

        const totalMonths =
          (endDate.getFullYear() - startDate.getFullYear()) * 12 +
          (endDate.getMonth() - startDate.getMonth()) + 1;

        if (totalMonths > 0) {
          dateValue += ` (${totalMonths} month${totalMonths !== 1 ? "s" : ""})`;
        }
      }

      items.push({ id: id++, label: 'Date', value: dateValue });
    }
    if (project.snapshot_items) {
      for (const item of project.snapshot_items) {
        items.push({ id: id++, label: item.label, value: item.value });
      }
    }
    return items;
  })();

  return (
    <section className="place-items-center relative">
      <BackButton className="z-30" />

      <ProjectHero
        title={project.title}
        heroImageUrl={heroImageUrl}
        heroAlt={project.project_thumb?.alternativeText || project.title || ''}
        websiteUrl={project.website_url}
        githubUrl={project.github_url}
      />

      <ProjectDescription description={project.description} />

      <article className="flex flex-col w-full">
        {snapshotItems.length > 0 && (
          <SnapshotBlock
            items={snapshotItems}
            toolsContent={project.tools && project.tools.length > 0
              ? project.tools.map((tool) => <ToolBadge key={tool.id} tool={tool} />)
              : undefined
            }
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
