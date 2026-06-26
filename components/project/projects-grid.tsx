import { ProjectCard } from "@/components/project/project-card";
import type { ProjectData } from "@/lib/strapi-queries";

interface ProjectsGridProps {
  projects: ProjectData[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="grid w-full lg:grid-cols-2 2xl:grid-cols-3 auto-rows-[16rem] gap-8">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-500 motion-safe:ease-out motion-reduce:opacity-100"
          style={{
            animationDelay: `${index * 50}ms`,
            animationFillMode: 'backwards'
          }}
        >
          <ProjectCard project={project} variant="thumb" />
        </div>
      ))}
    </div>
  );
}
