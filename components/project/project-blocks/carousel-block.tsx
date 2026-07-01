import { cn } from "@/lib/utils";
import { getStrapiMediaURL } from "@/lib/strapi";
import { ResponsiveCarousel } from "@/components/ui/carousel";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { BlockFigure } from "./blocks/block-figure";
import { BlockCaption } from "./blocks/block-caption";
import type { CarouselBlock as CarouselBlockType } from "@/lib/strapi-queries";

interface CarouselBlockProps {
  block: CarouselBlockType;
  projectTitle: string;
}

export function CarouselBlock({ block, projectTitle }: CarouselBlockProps) {
  if (!block.slides || block.slides.length === 0) return null;

  const noGap = block.noGap ?? false;
  const slideCount = block.slides?.length ?? 0;
  const canLoop = !noGap && slideCount >= 2;

  return (
    <BlockFigure className="md:!max-w-full lg:!max-w-xl xl:!max-w-2xl px-0">
      <ResponsiveCarousel loop={canLoop} noGap={noGap}>
        {block.slides.map((slide) => {
          const slideUrl = getStrapiMediaURL(slide.url);
          const isVideo = slide.mime?.startsWith('video/');
          return (
            <div key={slide.id} className={cn(!noGap && "border border-border rounded-lg", "overflow-hidden")}>
              {isVideo ? (
                <video src={slideUrl || ''} className="w-full h-auto" controls playsInline>
                  Your browser does not support the video tag.
                </video>
              ) : (
                <ImageWithFallback
                  src={slideUrl || ''}
                  alt={slide.alternativeText || projectTitle}
                  width={slide.width || 1920}
                  height={slide.height || 1080}
                  sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 42rem, 48rem"
                  className="w-full h-auto"
                  skeletonClassName="rounded-lg"
                />
              )}
            </div>
          );
        })}
      </ResponsiveCarousel>
      {block.caption && (
        <BlockCaption className="px-8 lg:px-0">{block.caption}</BlockCaption>
      )}
    </BlockFigure>
  );
}
