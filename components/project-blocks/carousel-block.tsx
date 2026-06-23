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
    <BlockFigure className="px-0 md:px-0">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <div className="relative md:border md:border-border md:rounded-lg md:overflow-hidden [&>[data-slot=carousel-content]]:overflow-visible md:[&>[data-slot=carousel-content]]:overflow-hidden">
          <CarouselNavigation className="hidden lg:flex absolute top-1 right-1 z-10" />
          <CarouselContent className="-ml-3 md:-ml-4">
            {block.slides.map((slide) => {
              const slideUrl = getStrapiMediaURL(slide.url);
              const isVideo = slide.mime?.startsWith('video/');

              return (
                <CarouselItem key={slide.id} className="pl-3 basis-[calc(100%-4rem)] md:basis-full md:pl-4">
                  <div className="border border-border rounded-lg overflow-hidden md:border-0 md:rounded-none">
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
                        className="w-full h-auto"
                        skeletonClassName="rounded-lg"
                      />
                    )}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </div>
        <div className="flex items-center justify-between mt-2 px-8 md:px-0 lg:hidden">
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
