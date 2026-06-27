import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCardSkeleton } from "@/components/project/project-card";

export default function PortfolioLoading() {
  return (
    <Section className="px-0 py-32 md:py-24 lg:py-32 justify-center">
      <Skeleton className="h-4 w-64 mx-8" />

      {/* Mobile card skeleton */}
      <div className="w-full md:hidden px-8">
        <ProjectCardSkeleton variant="thumb" />
      </div>

      {/* Tablet card skeletons */}
      <div className="hidden md:flex md:flex-col lg:hidden w-full max-w-3xl gap-8 px-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProjectCardSkeleton key={i} variant="thumb" />
        ))}
      </div>

      {/* Desktop list skeletons */}
      <div className="hidden lg:flex flex-col w-full max-w-3xl gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} variant="list" />
        ))}
      </div>
    </Section>
  );
}
