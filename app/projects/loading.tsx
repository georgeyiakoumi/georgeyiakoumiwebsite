import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCardSkeleton, ProjectCardList, ProjectCardGrid } from "@/components/project/project-card";

export default function PortfolioLoading() {
  return (
    <Section className="px-0 py-32 md:py-24 lg:py-32 justify-center">
      <Skeleton className="h-4 w-64 mx-8" />

      {/* Mobile card skeleton */}
      <div className="w-full md:hidden px-8">
        <ProjectCardSkeleton variant="thumb" />
      </div>

      {/* Tablet card skeletons */}
      <ProjectCardGrid className="hidden md:grid lg:hidden w-full max-w-3xl px-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProjectCardSkeleton key={i} variant="thumb" />
        ))}
      </ProjectCardGrid>

      {/* Desktop list skeletons */}
      <ProjectCardList className="hidden lg:flex w-full max-w-3xl">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} variant="list" />
        ))}
      </ProjectCardList>
    </Section>
  );
}
