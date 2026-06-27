import { Metadata } from "next";
import { getProjects, getProjectBySlug } from "@/lib/strapi-queries";
import { getStrapiMediaURL } from "@/lib/strapi";
import { generatePageMetadata, generateProjectJsonLd, SITE_CONFIG } from "@/lib/metadata";
import { ProjectClient } from "@/components/project/slug/project-client";
import { notFound } from "next/navigation";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return generatePageMetadata({
      title: "Project Not Found",
      description: "The project you're looking for could not be found.",
      path: `/project/${slug}`,
      noIndex: true,
    });
  }

  const projectImageUrl = project.project_thumb
    ? getStrapiMediaURL(project.project_thumb.url)
    : undefined;

  return generatePageMetadata({
    title: project.title,
    description: project.description || `View ${project.title} - a design project by George Yiakoumi`,
    path: `/project/${slug}`,
    image: projectImageUrl || SITE_CONFIG.ogImage,
  });
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projects = await getProjects();
  const otherProjects = projects.filter((p) => p.slug !== slug && p.type !== "article");

  // Generate structured data for SEO
  const projectImageUrl = project.project_thumb
    ? getStrapiMediaURL(project.project_thumb.url)
    : undefined;

  const projectJsonLd = await generateProjectJsonLd({
    title: project.title,
    description: project.description || `View ${project.title} - a design project by George Yiakoumi`,
    slug: project.slug,
    type: project.type,
    image: projectImageUrl ?? undefined,
    datePublished: project.publishedAt,
    dateModified: project.updatedAt,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
      />
      <ProjectClient project={project} otherProjects={otherProjects} />
    </>
  );
}

export const revalidate = 3600;