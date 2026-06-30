import { Section } from "@/components/layout/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectLoading() {
  return (
    <Section className="!h-auto !justify-start !items-start !p-0 relative">
      <Skeleton className="h-10 w-24 fixed top-8 left-8 md:bottom-8 md:top-auto lg:left-16 lg:bottom-16 z-20" />

      <header className="flex flex-col gap-8 px-8 place-items-center justify-center w-full h-screen">
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="w-full max-w-xl aspect-video rounded-lg" />
      </header>

      <div className="w-full bg-gradient-to-b from-background to-muted/70 py-12 px-8 md:px-0">
        <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-6 max-w-xl mx-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="contents">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      <article className="flex flex-col w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <Section key={i}>
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-4 w-full max-w-2xl" />
            <Skeleton className="h-4 w-full max-w-2xl" />
            <Skeleton className="h-4 w-3/4 max-w-2xl" />
          </Section>
        ))}
      </article>
    </Section>
  );
}
