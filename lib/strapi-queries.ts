import { fetchAPI } from './strapi';

interface StrapiRichTextBlock {
  id: number;
  content: Array<{
    type: string;
    children?: Array<{
      type: string;
      text?: string;
      bold?: boolean;
    }>;
    format?: string;
  }>;
  Image?: {
    id: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  } | null;
}

// Dynamic Zone Block Types for Projects
export interface RichTextBlock {
  __component: 'project-blocks.rich-text';
  id: number;
  content: Array<{
    type: string;
    level?: number;
    children?: Array<{
      type: string;
      text?: string;
    }>;
  }>;
}

export interface ImageBlock {
  __component: 'project-blocks.image';
  id: number;
  image?: {
    id: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
    mime?: string;
  };
  caption?: string;
  size?: 'full' | 'contained' | 'small';
}

export interface CarouselBlock {
  __component: 'project-blocks.carousel';
  id: number;
  slides?: Array<{
    id: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
    mime?: string;
  }>;
  caption?: string;
}

export interface VideoBlock {
  __component: 'project-blocks.video';
  id: number;
  url?: string;
  file?: {
    id: number;
    url: string;
    alternativeText?: string;
    mime?: string;
  };
  caption?: string;
}

export interface ComparisonSliderBlock {
  __component: 'project-blocks.comparison-slider';
  id: number;
  before_image?: {
    id: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  after_image?: {
    id: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  caption?: string;
  legacy?: boolean;
}

export interface StatItem {
  id: number;
  label: string;
  value: number;
  suffix?: string;
  context?: string;
  description?: string; // Strapi uses 'description' field name
  group?: string;
}

export type AreaVariant = 'default' | 'linear' | 'step' | 'stacked' | 'gradient';
export type BarVariant = 'default' | 'horizontal' | 'multiple' | 'stacked' | 'negative';
export type LineVariant = 'default' | 'linear' | 'step' | 'multiple' | 'dots';
export type PieVariant = 'default' | 'donut' | 'donut-text' | 'donut-active';
export type RadarVariant = 'default' | 'dots' | 'lines-only' | 'circle' | 'filled';
export type RadialVariant = 'default' | 'stacked' | 'text';

export interface StatsBlock {
  __component: 'project-blocks.stats';
  id: number;
  items?: StatItem[];
  chart_type?: 'area' | 'bar' | 'line' | 'pie' | 'radar' | 'radial' | 'number-only';
  area_variant?: AreaVariant;
  bar_variant?: BarVariant;
  line_variant?: LineVariant;
  pie_variant?: PieVariant;
  radar_variant?: RadarVariant;
  radial_variant?: RadialVariant;
  show_legend?: boolean;
  show_grid?: boolean;
  show_axes?: boolean;
  show_dots?: boolean;
  show_labels?: boolean;
  description?: string;
}

export interface CodeBlockType {
  __component: 'project-blocks.code-block';
  id: number;
  code: string;
  language?: 'typescript' | 'javascript' | 'css' | 'html' | 'json' | 'bash' | 'python' | 'go' | 'rust' | 'sql' | 'yaml' | 'markdown' | 'diff';
  filename?: string;
  caption?: string;
}

export interface LottieBlock {
  __component: 'project-blocks.lottie';
  id: number;
  file?: {
    id: number;
    url: string;
    alternativeText?: string;
    mime?: string;
  };
  caption?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export interface SnapshotItem {
  id: number;
  label: string;
  value: string;
}

export type ProjectBlock =
  | RichTextBlock
  | ImageBlock
  | CarouselBlock
  | VideoBlock
  | ComparisonSliderBlock
  | StatsBlock
  | CodeBlockType
  | LottieBlock;

export interface ProjectData {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  slug: string;
  date: string;
  end_date?: string;
  project_thumb?: {
    id: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  type?: 'client' | 'personal' | 'article';
  hero_caption?: string;
  project_client?: string;
  project_role?: string;
  snapshot_items?: SnapshotItem[];
  website_url?: string;
  github_url?: string;
  order?: number | null;
  featured_position?: number | null;
  body?: ProjectBlock[];
  tools?: ToolData[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}


export interface AboutRichTextChild {
  text: string;
  type: string;
}

export interface AboutRichTextBlock {
  type: string;
  level?: number;
  children?: AboutRichTextChild[];
  image?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
}

export interface AboutBusiness {
  id: number;
  name: string;
  classes?: string | null;
  cssVariables?: Record<string, string> | null;
  cssVariablesDark?: Record<string, string> | null;
  image?: {
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
}

export interface AboutData {
  id: number;
  documentId: string;
  hero: AboutRichTextBlock[];
  heading_businesses: string;
  heading_tools: string;
  contact: AboutRichTextBlock[];
  businesses: AboutBusiness[];
  tools: AboutBusiness[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export async function getAboutPage() {
  try {
    const data = await fetchAPI<AboutData>({
      endpoint: '/about',
      tags: ['about'],
    });
    return data;
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}

export async function getProjects(options?: {
  limit?: number;
  type?: 'client' | 'personal' | 'article';
}) {
  try {
    const query: Record<string, string | number | boolean> = {
      'populate[body][populate]': '*',
      'populate[project_thumb][fields][0]': 'url',
      'populate[project_thumb][fields][1]': 'alternativeText',
      'populate[project_thumb][fields][2]': 'width',
      'populate[project_thumb][fields][3]': 'height',
      'sort[0]': 'order:asc',
      'sort[1]': 'date:desc',
    };

    if (options?.type) {
      query['filters[type][$eq]'] = options.type;
    }

    if (options?.limit) {
      query['pagination[pageSize]'] = options.limit;
    }

    const data = await fetchAPI<ProjectData[]>({
      endpoint: '/projects',
      query,
      tags: ['projects'],
    });
    return data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function getFeaturedProjects() {
  try {
    const data = await fetchAPI<ProjectData[]>({
      endpoint: '/projects',
      query: {
        'filters[featured_position][$notNull]': 'true',
        'populate[project_thumb][fields][0]': 'url',
        'populate[project_thumb][fields][1]': 'alternativeText',
        'populate[project_thumb][fields][2]': 'width',
        'populate[project_thumb][fields][3]': 'height',
        'sort[0]': 'featured_position:asc',
      },
      tags: ['projects', 'featured-projects'],
    });
    return data;
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const data = await fetchAPI<ProjectData[]>({
      endpoint: '/projects',
      query: {
        'filters[slug][$eq]': slug,
        'populate[body][populate]': '*',
        'populate[project_thumb][fields][0]': 'url',
        'populate[project_thumb][fields][1]': 'alternativeText',
        'populate[project_thumb][fields][2]': 'width',
        'populate[project_thumb][fields][3]': 'height',
        'populate[tools][populate]': '*',
        'populate[snapshot_items]': '*',
      },
      tags: ['projects', `project-${slug}`],
    });
    return data[0] || null;
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    return null;
  }
}


// Global SEO
export interface GlobalSEOData {
  id: number;
  documentId: string;
  siteName: string;
  siteTitle: string;
  siteDescription: string;
  keywords?: string;
  authorName?: string;
  authorJobTitle?: string;
  authorBio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterHandle?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: {
    id: number;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  twitterCard?: 'summary' | 'summary_large_image';
  gtagId?: string;
}

export async function getGlobalSEO() {
  try {
    const data = await fetchAPI<GlobalSEOData>({
      endpoint: '/global-seo',
      query: {
        'populate[ogImage][fields][0]': 'url',
        'populate[ogImage][fields][1]': 'alternativeText',
        'populate[ogImage][fields][2]': 'width',
        'populate[ogImage][fields][3]': 'height',
      },
      tags: ['global-seo'],
    });
    return data;
  } catch (error) {
    console.error('Error fetching global SEO:', error);
    return null;
  }
}

export interface ToolData {
  id: number;
  documentId: string;
  name: string;
  url?: string;
  description?: string;
  category?: 'design' | 'development' | 'tools';
  cssVariables?: Record<string, string> | null;
  cssVariablesDark?: Record<string, string> | null;
  classes?: string | null;
  image?: {
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
    ext?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export async function getTools() {
  try {
    const data = await fetchAPI<ToolData[]>({
      endpoint: '/tools',
      query: {
        'populate': '*',
        'pagination[pageSize]': 1000,
        'sort[0]': 'category:asc',
        'sort[1]': 'name:asc',
      },
      cache: 'force-cache',
      tags: ['tools'],
    });
    return data;
  } catch (error) {
    console.error('Error fetching tools:', error);
    return [];
  }
}

export interface BusinessData {
  id: number;
  documentId: string;
  name: string;
  classes?: string | null;
  cssVariables?: Record<string, string> | null;
  cssVariablesDark?: Record<string, string> | null;
  description?: string;
  url?: string;
  image?: {
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
    ext?: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export async function getBusinesses() {
  try {
    const data = await fetchAPI<BusinessData[]>({
      endpoint: '/businesses',
      query: {
        'populate': '*',
        'pagination[pageSize]': 1000,
      },
      cache: 'force-cache',
      tags: ['businesses'],
    });
    return data;
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return [];
  }
}

export interface CVPageData {
  id: number;
  documentId: string;
  heading: string;
  tagline: string;
  email: string;
  linkedin: string;
  website: string;
  description: Array<{
    type: string;
    children?: Array<{
      type: string;
      text?: string;
    }>;
  }>;
  avatar?: {
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
    formats?: {
      small?: { url: string };
      medium?: { url: string };
      thumbnail?: { url: string };
    };
  };
  language?: Array<{
    id: number;
    region: string;
    level: string;
  }>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface CareerChapterData {
  id: number;
  documentId: string;
  business_name: string;
  country: string;
  city: string;
  hybrid: boolean;
  remote: boolean;
  description: string;
  Chapter: Array<{
    id: number;
    role: string;
    start_date: string;
    end_date: string | null;
    experience: Array<{
      type: string;
      format?: string;
      children?: Array<{
        type: string;
        children?: Array<{
          type: string;
          text?: string;
        }>;
      }>;
    }>;
  }>;
  thumbnail?: {
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface CertificateData {
  id: number;
  documentId: string;
  name: string;
  url: string;
  certificate_supplier?: {
    id: number;
    documentId: string;
    name: string;
    thumbnail?: {
      id: number;
      documentId: string;
      url: string;
      alternativeText?: string;
      width?: number;
      height?: number;
      formats?: {
        thumbnail?: { url: string };
      };
    };
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export async function getCVPage() {
  try {
    const data = await fetchAPI<CVPageData>({
      endpoint: '/cv-page',
      query: {
        'populate': '*',
      },
      tags: ['cv-page'],
    });
    return data;
  } catch (error) {
    console.error('Error fetching CV page:', error);
    return null;
  }
}

export async function getCareerChapters() {
  try {
    const data = await fetchAPI<CareerChapterData[]>({
      endpoint: '/career-chapters',
      query: {
        'populate': '*',
        'pagination[pageSize]': 1000,
      },
      tags: ['career-chapters'],
    });
    return data;
  } catch (error) {
    console.error('Error fetching career chapters:', error);
    return [];
  }
}

export async function getCertificates() {
  try {
    const data = await fetchAPI<CertificateData[]>({
      endpoint: '/certificates',
      query: {
        'populate[certificate_supplier][populate]': 'thumbnail',
        'pagination[pageSize]': 1000,
      },
      tags: ['certificates'],
    });
    return data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
}
