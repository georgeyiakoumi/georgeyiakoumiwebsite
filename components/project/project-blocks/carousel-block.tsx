import { getStrapiMediaURL } from "@/lib/strapi";
import { Carousel, CarouselContent, CarouselItem, CarouselNavigation } from "@/components/ui/carousel";
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

  const noGap = block.noGap ?? false;
  const slideCount = block.slides?.length ?? 0;
  const usePeek = !noGap;
  const canLoop = usePeek && slideCount >= 2;

  return (
    <BlockFigure className="md:!max-w-full lg:!max-w-xl xl:!max-w-2xl px-0">
      <Carousel
        opts={{ align: "center", loop: canLoop, containScroll: false }}
        fade={usePeek}
      >
        <div className="relative">
          <CarouselNavigation variant="overlay" className="hidden lg:flex absolute top-1 right-1 z-10" />
          <CarouselContent>
            {block.slides.map((slide, i) => {
              const slideUrl = getStrapiMediaURL(slide.url);
              const isVideo = slide.mime?.startsWith('video/');

              return (
                <CarouselItem key={slide.id} index={i}>
                  <div className="border border-border rounded-lg overflow-hidden ">
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
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </div>
        <CarouselNavigation variant="inline" className="mt-2 px-8 md:mx-auto md:max-w-2xl xl:hidden" />
      </Carousel>
      {block.caption && (
        <BlockCaption className="px-8 lg:px-0">{block.caption}</BlockCaption>
      )}
    </BlockFigure>
  );
}
