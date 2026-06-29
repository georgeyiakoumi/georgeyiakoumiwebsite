import { getStrapiMediaURL } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import Fade from "embla-carousel-fade";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
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
    <BlockFigure className={cn(usePeek && "md:max-w-full lg:max-w-xl px-0")}>
      <Carousel
        opts={{
          align: "center",
          loop: canLoop,
          containScroll: false,
        }}
        plugins={usePeek ? [Fade({ active: false, breakpoints: { "(min-width: 1024px)": { active: true } } })] : []}
        className="w-full"
      >
        <div className={cn(
          "relative",
          usePeek
            ? "lg:border lg:border-border lg:rounded-lg lg:overflow-hidden"
            : "border border-border rounded-lg overflow-hidden"
        )}>
          <CarouselNavigation className="hidden lg:flex absolute top-1 right-1 z-10" />
          <CarouselContent className={cn(usePeek ? "max-w-2xl lg:mx-0 lg:-ml-4" : "ml-0")}>
            {block.slides.map((slide) => {
              const slideUrl = getStrapiMediaURL(slide.url);
              const isVideo = slide.mime?.startsWith('video/');

              return (
                <CarouselItem key={slide.id} className={cn(
                  usePeek
                    ? "px-1.5 lg:px-0 lg:pl-4"
                    : "pl-0"
                )}>
                  <div className={cn(
                    usePeek
                      ? "border border-border rounded-lg overflow-hidden lg:border-0 lg:rounded-none"
                      : ""
                  )}>
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
        <div className={cn("flex items-center justify-between mt-2 md:mx-auto md:max-w-2xl lg:hidden", usePeek && "px-8 lg:px-0")}>
          <CarouselPrevious className="static translate-y-0" />
          <CarouselCounter />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
      {block.caption && (
        <BlockCaption className={cn(usePeek && "px-8 lg:px-0")}>{block.caption}</BlockCaption>
      )}
    </BlockFigure>
  );
}
