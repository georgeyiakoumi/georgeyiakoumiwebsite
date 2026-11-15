import { MetadataRoute } from 'next';
import { getProjects } from '@/lib/strapi-queries';
import { SITE_CONFIG } from '@/lib/metadata';
import { getEntryPath } from '@/lib/utils';
import { PRIVACY_LAST_UPDATED } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;

  // Fetch all projects for dynamic routes
  const projects = await getProjects();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(PRIVACY_LAST_UPDATED),
      changeFrequency: 'yearly',
      priority: 0.1,
    },
  ];

  // Dynamic project/article routes
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}${getEntryPath(project.type, project.slug)}`,
    lastModified: new Date(project.updatedAt || project.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
