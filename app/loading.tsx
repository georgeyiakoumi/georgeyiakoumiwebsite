import { HeroSectionSkeleton } from "@/components/home/hero-section";
import { FeaturedWorkSectionSkeleton } from "@/components/home/featured-work-section";
import { CompaniesSectionSkeleton } from "@/components/home/companies-section";
import { StackSectionSkeleton } from "@/components/home/stack-section";
import { AboutSectionSkeleton } from "@/components/home/about-section";

export default function HomeLoading() {
  return (
    <>
      <HeroSectionSkeleton />
      <FeaturedWorkSectionSkeleton />
      <CompaniesSectionSkeleton />
      <StackSectionSkeleton />
      <AboutSectionSkeleton />
    </>
  );
}
