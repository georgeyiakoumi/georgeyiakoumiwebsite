import { Metadata } from "next";
import { getProjects, getProjectBySlug } from "@/lib/strapi-queries";
import { getStrapiMediaURL } from "@/lib/strapi";
import { generatePageMetadata, generateProjectJsonLd, SITE_CONFIG } from "@/lib/metadata";
import { ProjectClient } from "@/components/project/slug/project-client";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project || project.type !== "article") {
    return generatePageMetadata({
      title: "Article Not Found",
      description: "The article you're looking for could not be found.",
      path: `/article/${slug}`,
      noIndex: true,
    });
  }

  const projectImageUrl = project.project_thumb
    ? getStrapiMediaURL(project.project_thumb.url)
    : undefined;

  return generatePageMetadata({
    title: project.title,
    description: project.description || `Read ${project.title} by George Yiakoumi`,
    path: `/article/${slug}`,
    image: projectImageUrl || SITE_CONFIG.ogImage,
  });
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects
    .filter((p) => p.type === "article")
    .map((project) => ({
      slug: project.slug,
    }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project || project.type !== "article") {
    notFound();
  }

  const projects = await getProjects();
  const otherProjects = projects.filter((p) => p.slug !== slug && p.type === project.type);

  const projectImageUrl = project.project_thumb
    ? getStrapiMediaURL(project.project_thumb.url)
    : undefined;

  const projectJsonLd = await generateProjectJsonLd({
    title: project.title,
    description: project.description || `Read ${project.title} by George Yiakoumi`,
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
