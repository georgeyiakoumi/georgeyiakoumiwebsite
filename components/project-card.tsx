import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { ChevronRight } from "lucide-react";
import {
  Item,
  ItemHeader,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import type { ProjectData } from "@/lib/strapi-queries";

interface ProjectCardProps {
  project: ProjectData;
  scenario?: "carousel" | "list";
  background?: "muted" | "background";
}

export function ProjectCard({ project, scenario = "carousel", background = "muted" }: ProjectCardProps) {
  if (scenario === "list") {
    return (
      <div className="group transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none xl:hover:scale-[1.02] active:scale-[0.97]">
      <Item
        asChild
        variant="outline"
        className={cn(
          "!p-0 overflow-hidden",
          background === "background" && "xl:bg-background xl:hover:bg-background xl:hover:border-foreground"
        )}
      >
        <Link href={`/project/${project.slug}`}>
          {project.project_thumb && (
            <ItemMedia variant="image" className="size-32 !rounded-none !translate-y-0 !self-center">
              <ImageWithFallback
                src={project.project_thumb.url}
                alt={project.project_thumb.alternativeText || project.title}
                fill
                className="object-cover xl:opacity-80 xl:transition-opacity xl:duration-300 xl:ease-out xl:group-hover:opacity-100"
                sizes="256px"
              />
            </ItemMedia>
          )}
          <ItemContent>
            <ItemTitle className="xl:text-foreground line-clamp-2">
              {project.title}
            </ItemTitle>
            {project.description && (
              <ItemDescription className="xl:text-muted-foreground">
                {project.description}
              </ItemDescription>
            )}
          </ItemContent>
          <ItemActions className="xl:text-foreground pr-4 xl:opacity-0 xl:transition-opacity xl:duration-300 xl:ease-out xl:group-hover:opacity-100">
            <ChevronRight className="size-4" />
          </ItemActions>
        </Link>
      </Item>
      </div>
    );
  }

  return (
    <div className="group transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none xl:hover:scale-[1.02] active:scale-[0.97]">
    <Item
      variant="outline"
      asChild
      className={cn(
        "p-0 rounded-xl overflow-hidden",
        background === "background" && "bg-background",
      )}
    >
      <Link href={`/project/${project.slug}`} className="pb-4">
        {project.project_thumb && (
          <ItemHeader className="relative aspect-video w-full overflow-hidden">
            <ImageWithFallback
              src={project.project_thumb.url}
              alt={project.project_thumb.alternativeText || project.title}
              fill
              className="object-cover xl:opacity-80 xl:transition-opacity xl:duration-300 xl:ease-out xl:group-hover:opacity-100"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </ItemHeader>
        )}
        <ItemContent className="px-4">
          <ItemTitle className="line-clamp-2">
            {project.title}
          </ItemTitle>
          {project.description && (
            <ItemDescription>{project.description}</ItemDescription>
          )}
        </ItemContent>
      </Link>
    </Item>
    </div>
  );
}
