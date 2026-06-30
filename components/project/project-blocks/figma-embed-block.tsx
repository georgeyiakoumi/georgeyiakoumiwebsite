import { BlockFigure } from "./block-figure";
import { BlockCaption } from "./block-caption";
import type { FigmaEmbedBlock as FigmaEmbedBlockType } from "@/lib/strapi-queries";

interface FigmaEmbedBlockProps {
  block: FigmaEmbedBlockType;
}

export function FigmaEmbedBlock({ block }: FigmaEmbedBlockProps) {
  if (!block.url) return null;

  return (
    <BlockFigure>
      <div className="w-full aspect-video rounded-lg border border-border overflow-hidden">
        <iframe
          src={block.url}
          className="w-full h-full"
          allowFullScreen
          loading="lazy"
          title={block.caption || "Figma embed"}
        />
      </div>
      {block.caption && <BlockCaption>{block.caption}</BlockCaption>}
    </BlockFigure>
  );
}
