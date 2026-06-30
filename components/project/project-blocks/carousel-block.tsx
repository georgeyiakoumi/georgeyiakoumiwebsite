import { getStrapiMediaURL } from "@/lib/strapi";
import { CarouselItem, PeekCarousel, FadeCarousel } from "@/components/ui/carousel";
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

  const slides = block.slides.map((slide, i) => {
    const slideUrl = getStrapiMediaURL(slide.url);
    const isVideo = slide.mime?.startsWith('video/');
    const media = isVideo ? (
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
    );
    return { id: slide.id, i, media };
  });

  const slideItems = slides.map(({ id, i, media }) => (
    <CarouselItem key={id} index={i}>
      <div className="border border-border rounded-lg overflow-hidden">{media}</div>
    </CarouselItem>
  ));

  return (
    <BlockFigure className="md:!max-w-full xl:!max-w-2xl px-0">

      {/* Mobile / md — peek carousel with inline navigation */}
      <PeekCarousel loop={canLoop}>{slideItems}</PeekCarousel>

      {/* lg+ — fade carousel with overlay navigation */}
      <FadeCarousel loop={canLoop}>{slideItems}</FadeCarousel>

      {block.caption && (
        <BlockCaption className="px-8 lg:px-0">{block.caption}</BlockCaption>
      )}
    </BlockFigure>
  );
}
