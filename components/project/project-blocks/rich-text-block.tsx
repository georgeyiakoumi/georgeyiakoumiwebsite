import { renderStrapiRichText } from "@/lib/strapi-blocks-renderer";
import type { RichTextBlock as RichTextBlockType } from "@/lib/strapi-queries";

interface RichTextBlockProps {
  block: RichTextBlockType;
}

export function RichTextBlock({ block }: RichTextBlockProps) {
  if (!block.content) return null;

  const firstBlock = Array.isArray(block.content) ? block.content[0] : null;
  const startsWithH2 = firstBlock?.type === 'heading' && firstBlock?.level === 2;
  const startsWithEyebrow = firstBlock?.type === 'paragraph'
    && firstBlock?.children?.length === 1
    && /^\{\{\w+:.+\}\}$/.test(firstBlock.children[0]?.text?.trim() || '');
  const isNewSection = startsWithH2 || startsWithEyebrow;

  return (
    <div className={`mx-auto w-full lg:max-w-2xl xl:max-w-4xl 2xl:max-w-6xl px-8 lg:px-0 ${isNewSection ? 'mt-16 pt-16 border-border border-t first:mt-0 first:border-none' : ''}`}>
      <section className="lg:max-w-xl xl:max-w-2xl mx-auto">
      {renderStrapiRichText(block.content)}
      </section>
    </div>
  );
}
