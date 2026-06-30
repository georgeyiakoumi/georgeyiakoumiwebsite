import { getStrapiMediaURL } from "@/lib/strapi";
import Fade from "embla-carousel-fade";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselControls } from "@/components/ui/carousel";
import { CarouselNavigation, CarouselCounter } from "@/components/ui/carousel-navigation";
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
    <BlockFigure className="md:!max-w-full lg:!max-w-xl xl:!max-w-2xl">
      <Carousel
        opts={{ align: "center", loop: canLoop, containScroll: false }}
        plugins={usePeek ? [Fade({ active: false, breakpoints: { "(min-width: 1024px)": { active: true } } })] : []}
        className="w-full [--carousel-slide-size:100%] [--carousel-peek:2rem] [--carousel-gap:1rem] md:[--carousel-slide-size:37rem] md:[--carousel-peek:0px] lg:[--carousel-slide-size:100%] lg:[--carousel-gap:0px]"
      >
        <div className="relative">
          <CarouselNavigation className="hidden lg:flex absolute top-1 right-1 z-10" />
          <CarouselContent>
            {block.slides.map((slide) => {
              const slideUrl = getStrapiMediaURL(slide.url);
              const isVideo = slide.mime?.startsWith('video/');

              return (
                <CarouselItem key={slide.id}>
                  <div className="border border-border rounded-lg overflow-hidden">
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
        <CarouselControls className="mt-2 px-8 lg:px-0 md:mx-auto md:max-w-2xl lg:hidden">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselCounter />
          <CarouselNext className="static translate-y-0" />
        </CarouselControls>
      </Carousel>
      {block.caption && (
        <BlockCaption className="px-8 lg:px-0">{block.caption}</BlockCaption>
      )}
    </BlockFigure>
  );
}
