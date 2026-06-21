import { getStrapiMediaURL } from "@/lib/strapi";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselPagination } from "@/components/ui/carousel";
import { CarouselNavigation } from "@/components/ui/carousel-navigation";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { BlockFigure } from "./block-figure";
import { BlockCaption } from "./block-caption";
import type { CarouselBlock as CarouselBlockType } from "@/lib/strapi-queries";

interface CarouselBlockProps {
  block: CarouselBlockType;
  projectTitle: string;
}

export function CarouselBlock({ block, projectTitle }: CarouselBlockProps) {
  if (!block.slides || block.slides.length === 0) return null;

  return (
    <BlockFigure>
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <div className="relative border border-border rounded-lg overflow-hidden">
          <CarouselNavigation className="hidden lg:flex absolute top-1 right-1 z-10" />
          <CarouselContent>
            {block.slides.map((slide) => {
              const slideUrl = getStrapiMediaURL(slide.url);
              const isVideo = slide.mime?.startsWith('video/');

              return (
                <CarouselItem key={slide.id}>
                  {isVideo ? (
                    <video
                      src={slideUrl || ''}
                      className="w-full h-auto"
                      controls
                      playsInline
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <ImageWithFallback
                      src={slideUrl || ''}
                      alt={slide.alternativeText || projectTitle}
                      width={slide.width || 1920}
                      height={slide.height || 1080}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 32rem, 48rem"
                      className="w-full h-auto rounded-lg overflow-hidden"
                      skeletonClassName="rounded-lg"
                    />
                  )}
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </div>
        <div className="flex items-center justify-between mt-2 lg:hidden">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselPagination className="mt-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
      {block.caption && (
        <BlockCaption>{block.caption}</BlockCaption>
      )}
    </BlockFigure>
  );
}
