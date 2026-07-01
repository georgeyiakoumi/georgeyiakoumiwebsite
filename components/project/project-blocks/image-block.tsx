import { getStrapiMediaURL } from "@/lib/strapi";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { ZoomableImage } from "@/components/zoomable-image";
import { BlockFigure } from "./blocks/block-figure";
import { BlockCaption } from "./blocks/block-caption";
import type { ImageBlock as ImageBlockType } from "@/lib/strapi-queries";

interface ImageBlockProps {
  block: ImageBlockType;
  projectTitle: string;
}

export function ImageBlock({ block, projectTitle }: ImageBlockProps) {
  if (!block.image) return null;

  const imageUrl = getStrapiMediaURL(block.image.url);

  const sizes =
    block.size === 'full' ? '100vw' :
    block.size === 'small' ? '(max-width: 768px) 100vw, 28rem' :
    '(max-width: 768px) 100vw, (max-width: 1024px) 32rem, 48rem'; // contained (default)

  const imageElement = (
    <ImageWithFallback
      src={imageUrl || ''}
      alt={block.image.alternativeText || projectTitle}
      width={block.image.width || 1920}
      height={block.image.height || 1080}
      sizes={sizes}
      className="h-auto border-border border rounded-lg select-none"
      wrapperClassName="w-full flex justify-center"
      skeletonClassName="rounded-lg"
      draggable={false}
    />
  );

  return (
    <BlockFigure>
      {block.zoomEnabled ? (
        <ZoomableImage
          src={imageUrl || ''}
          alt={block.image.alternativeText || projectTitle}
          width={block.image.width || 1920}
          height={block.image.height || 1080}
        >
          {imageElement}
        </ZoomableImage>
      ) : (
        imageElement
      )}
      {block.caption && (
        <BlockCaption>{block.caption}</BlockCaption>
      )}
    </BlockFigure>
  );
}
