import { renderStrapiRichText } from "@/lib/strapi-blocks-renderer";
import { cn } from "@/lib/utils";
import type { RichTextBlock as RichTextBlockType } from "@/lib/strapi-queries";

interface RichTextBlockProps {
  block: RichTextBlockType;
  isFirst?: boolean;
}

export function RichTextBlock({ block, isFirst }: RichTextBlockProps) {
  if (!block.content) return null;

  const firstBlock = Array.isArray(block.content) ? block.content[0] : null;
  const startsWithH2 = firstBlock?.type === 'heading' && firstBlock?.level === 2;
  const startsWithEyebrow = firstBlock?.type === 'paragraph'
    && firstBlock?.children?.length === 1
    && /^\{\{\w+:.+\}\}$/.test(firstBlock.children[0]?.text?.trim() || '');
  const isNewSection = startsWithH2 || startsWithEyebrow;

  return (
    <div className={cn(
      "mx-auto w-full lg:max-w-2xl xl:max-w-4xl 2xl:max-w-6xl px-8 pt-12 lg:px-0",
      isNewSection && !isFirst && "border-border border-t"
    )}>
      <section className="md:max-w-xl xl:max-w-2xl mx-auto">
      {renderStrapiRichText(block.content)}
      </section>
    </div>
  );
}
