import { Metadata } from "next";
import { getGlobalSEO } from "./strapi-queries";
import { getStrapiMediaURL } from "./strapi";

// Fallback configuration if Strapi is unavailable
export const SITE_CONFIG = {
  name: "George Yiakoumi",
  title: "George Yiakoumi - Product Designer & UX/UI Specialist",
  description: "Product Designer specializing in user experience, interface design, and digital product strategy. View my portfolio of design work and case studies.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://georgeyiakoumi.com",
  author: {
    name: "George Yiakoumi",
    url: "https://georgeyiakoumi.com",
    linkedin: "https://linkedin.com/in/georgeyiakoumi",
    github: "https://github.com/georgeyiakoumi",
    jobTitle: "Product Designer",
  },
  keywords: [
    "Product Designer",
    "UX Designer",
    "UI Designer",
    "User Experience",
    "Interface Design",
    "Product Design",
    "Design Portfolio",
    "Digital Product Design",
    "George Yiakoumi",
  ] as string[],
  ogImage: "/og-image.jpg",
  twitterHandle: "@georgeyiakoumi",
};

export async function generateSiteMetadata(): Promise<Metadata> {
  const seoData = await getGlobalSEO();

  // Merge Strapi data with fallbacks
  const siteName = seoData?.siteName || SITE_CONFIG.name;
  const siteTitle = seoData?.siteTitle || SITE_CONFIG.title;
  const siteDescription = seoData?.siteDescription || SITE_CONFIG.description;
  const keywords = seoData?.keywords
    ? seoData.keywords.split(',').map(k => k.trim())
    : SITE_CONFIG.keywords;
  const authorName = seoData?.authorName || SITE_CONFIG.author.name;
  const authorUrl = SITE_CONFIG.url;
  const twitterHandle = seoData?.twitterHandle || SITE_CONFIG.twitterHandle;
  const ogImageUrl = seoData?.ogImage?.url
    ? getStrapiMediaURL(seoData.ogImage.url)
    : SITE_CONFIG.ogImage;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: siteTitle,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: keywords,
    authors: [
      {
        name: authorName,
        url: authorUrl,
      },
    ],
    creator: authorName,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_CONFIG.url,
      title: seoData?.ogTitle || siteTitle,
      description: seoData?.ogDescription || siteDescription,
      siteName: siteName,
      images: [
        {
          url: ogImageUrl || SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: seoData?.twitterCard || "summary_large_image",
      title: seoData?.ogTitle || siteTitle,
      description: seoData?.ogDescription || siteDescription,
      images: [ogImageUrl || SITE_CONFIG.ogImage],
      creator: twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "32x32" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export async function generatePageMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Promise<Metadata> {
  const url = `${SITE_CONFIG.url}${path}`;

  // Fetch global SEO to get the default OG image if no custom image is provided
  const seoData = await getGlobalSEO();
  const defaultOgImage = seoData?.ogImage?.url
    ? getStrapiMediaURL(seoData.ogImage.url) ?? SITE_CONFIG.ogImage
    : SITE_CONFIG.ogImage;

  const ogImage = image || defaultOgImage;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export async function generatePersonJsonLd() {
  const seoData = await getGlobalSEO();

  const authorName = seoData?.authorName || SITE_CONFIG.author.name;
  const authorJobTitle = seoData?.authorJobTitle || SITE_CONFIG.author.jobTitle;
  const authorBio = seoData?.authorBio || SITE_CONFIG.description;
  const linkedinUrl = seoData?.linkedinUrl || SITE_CONFIG.author.linkedin;
  const githubUrl = seoData?.githubUrl || SITE_CONFIG.author.github;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: authorName,
    url: SITE_CONFIG.url,
    jobTitle: authorJobTitle,
    description: authorBio,
    sameAs: [linkedinUrl, githubUrl].filter(Boolean),
  };
}

export async function generateWebsiteJsonLd() {
  const seoData = await getGlobalSEO();

  const siteName = seoData?.siteName || SITE_CONFIG.name;
  const siteDescription = seoData?.siteDescription || SITE_CONFIG.description;
  const authorName = seoData?.authorName || SITE_CONFIG.author.name;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: SITE_CONFIG.url,
    description: siteDescription,
    author: {
      "@type": "Person",
      name: authorName,
    },
  };
}

export async function generateProjectJsonLd({
  title,
  description,
  slug,
  image,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
}) {
  const seoData = await getGlobalSEO();
  const authorName = seoData?.authorName || SITE_CONFIG.author.name;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_CONFIG.url}/project/${slug}`,
    name: title,
    description: description,
    url: `${SITE_CONFIG.url}/project/${slug}`,
    image: image || SITE_CONFIG.ogImage,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      url: SITE_CONFIG.url,
    },
    inLanguage: "en-US",
  };
}
