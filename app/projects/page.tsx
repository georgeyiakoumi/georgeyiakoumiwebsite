import { getProjects } from "@/lib/strapi-queries";
import { generatePageMetadata } from "@/lib/metadata";

import { SquareLibrary } from "lucide-react";

import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Section } from "@/components/section";
import { ProjectsContent } from "@/components/projects-content";

export const generateMetadata = async () => {
  return generatePageMetadata({
    title: "Projects",
    description: "Explore my portfolio of design projects, case studies, and UX/UI work. See how I solve complex problems through thoughtful design and user-centered solutions.",
    path: "/projects",
  });
};

export default async function Portfolio() {
  const projects = await getProjects();

  if (!projects || projects.length === 0) {
    return (
      <Section>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="default">
              <SquareLibrary />
            </EmptyMedia>
            <EmptyTitle>
              No projects found
            </EmptyTitle>
            <EmptyDescription>
              Check back soon for updates!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Section>
    );
  }

  return (
    <Section className="px-0 py-32 lg:py-16 justify-center lg:justify-start">
      <h1 className="hidden">
        Projects
      </h1>
      <ProjectsContent projects={projects} />
    </Section>
  );
}

export const revalidate = 3600;