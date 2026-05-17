import { Section } from "@/components/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectLoading() {
  return (
    <Section className="!h-auto !justify-start !items-start !p-0 relative">
      <Skeleton className="h-10 w-24 fixed top-8 left-8 md:bottom-8 md:top-auto lg:left-16 lg:bottom-16 z-20" />

      <header className="flex flex-col gap-8 px-8 place-items-center justify-center w-full h-screen">
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="h-6 w-full max-w-xl" />
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-36" />
        </div>
      </header>

      <div className="w-full px-8 md:px-0 my-8 md:max-w-md lg:max-w-xl xl:max-w-3xl mx-auto">
        <Skeleton className="w-full aspect-video rounded-lg" />
      </div>

      <article className="flex flex-col w-full">
        {Array.from({ length: 5 }).map((_, i) => (
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
