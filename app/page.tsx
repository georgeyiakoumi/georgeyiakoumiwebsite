import { generatePageMetadata } from "@/lib/metadata";
import { getAboutPage, getTools, getBusinesses, getFeaturedProjects, getTestimonials } from "@/lib/strapi-queries";
import { HomeContent } from "@/components/home-content";

export const generateMetadata = async () => {
  return generatePageMetadata({
    title: { absolute: "George Yiakoumi" },
    description: "Product Designer and design engineer specializing in user experience, interface design, and digital product strategy. I've worked with leading companies to create intuitive digital experiences.",
    path: "/",
  });
};

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch all data in parallel on the server
  const [aboutData, tools, businesses, featuredProjects, testimonials] = await Promise.all([
    getAboutPage(),
    getTools(),
    getBusinesses(),
    getFeaturedProjects(),
    getTestimonials(),
  ]);

  return <HomeContent aboutData={aboutData} tools={tools} businesses={businesses} featuredProjects={featuredProjects} testimonials={testimonials} />;
}
