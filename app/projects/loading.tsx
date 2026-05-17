import { Section } from "@/components/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function PortfolioLoading() {
  return (
    <Section className="px-0 py-32 md:py-24 lg:py-32 justify-center">
      <Skeleton className="h-4 w-64 mx-8" />

      {/* Mobile card skeleton */}
      <div className="w-full md:hidden px-8">
        <Skeleton className="w-full aspect-video rounded-xl" />
        <div className="flex flex-col gap-2 mt-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      {/* Tablet card skeletons */}
      <div className="hidden md:flex md:flex-col lg:hidden w-full max-w-3xl gap-8 px-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="w-full aspect-video rounded-xl" />
            <div className="flex flex-col gap-2 mt-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop list skeletons */}
      <div className="hidden lg:flex flex-col w-full max-w-3xl gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center rounded-lg border border-border p-px">
            <Skeleton className="size-32 rounded-l-lg shrink-0" />
            <div className="flex flex-col gap-2 flex-1 py-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
