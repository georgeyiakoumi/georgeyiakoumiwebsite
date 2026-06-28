import React from 'react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { getStrapiMediaURL } from './strapi';
import { cn } from './utils';
import { Typography } from '@/components/ui/typography';

interface RichTextChild {
  type: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  url?: string;
  children?: RichTextChild[];
}

interface RichTextBlock {
  type: string;
  children?: RichTextChild[];
  format?: string;
  level?: number;
  url?: string;
}

interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

interface StrapiRichTextBlock {
  id: number;
  content: RichTextBlock[];
  Image?: StrapiImage | null;
}

// Custom tag regex: matches {{tagname:content}} patterns
const CUSTOM_TAG_REGEX = /\{\{(\w+):(.+?)\}\}/g;

// Inline effects map: tag name → className
const INLINE_EFFECTS: Record<string, string> = {
  highlight: 'bg-primary/15 text-primary px-1 py-0.5 rounded-sm font-medium',
  underline: 'underline decoration-primary decoration-2 underline-offset-4',
};

function extractBlockTag(block: RichTextBlock): { tag: string; content: string } | null {
  if (block.type !== 'paragraph') return null;
  if (!block.children || block.children.length !== 1) return null;

  const child = block.children[0];
  if (!child.text) return null;

  const trimmed = child.text.trim();
  const match = trimmed.match(/^\{\{(\w+):(.+?)\}\}$/);
  if (!match) return null;

  return { tag: match[1].toLowerCase(), content: match[2].trim() };
}

function parseInlineTags(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  const regex = new RegExp(CUSTOM_TAG_REGEX.source, 'g');
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const tagName = match[1].toLowerCase();
    const tagContent = match[2];
    const effectClass = INLINE_EFFECTS[tagName];

    if (effectClass) {
      parts.push(
        <span key={`${keyPrefix}-tag-${matchIndex}`} className={effectClass}>
          {tagContent}
        </span>
      );
    } else {
      parts.push(match[0]);
    }

    lastIndex = match.index + match[0].length;
    matchIndex++;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function hasInlineTags(text: string): boolean {
  return CUSTOM_TAG_REGEX.test(text);
}

function renderChild(child: RichTextChild, index: number): React.ReactNode {
  if (!child.text && !child.children) return null;

  if (child.children) {
    const nestedContent = child.children.map((nestedChild, i) => renderChild(nestedChild, i));

    switch (child.type) {
      case 'list-item':
        return <li key={index}>{nestedContent}</li>;
      case 'link':
        return <a key={index} href={child.url} target="_blank" rel="noopener noreferrer">{nestedContent}</a>;
      default:
        return <span key={index}>{nestedContent}</span>;
    }
  }

  if (!child.text) return null;

  let content: React.ReactNode;
  if (hasInlineTags(child.text)) {
    const parsed = parseInlineTags(child.text, `child-${index}`);
    content = parsed.length === 1 ? parsed[0] : <>{parsed}</>;
  } else {
    content = child.text;
  }

  if (child.bold) {
    content = <strong key={index}>{content}</strong>;
  }
  if (child.italic) {
    content = <em key={index}>{content}</em>;
  }
  if (child.underline) {
    content = <u key={index}>{content}</u>;
  }
  if (child.strikethrough) {
    content = <s key={index}>{content}</s>;
  }
  if (child.code) {
    content = <code key={index}>{content}</code>;
  }

  return <React.Fragment key={index}>{content}</React.Fragment>;
}

function renderBlock(block: RichTextBlock, index: number, followsEyebrow?: boolean): React.ReactNode {
  const children = block.children?.map((child, i) => renderChild(child, i));

  switch (block.type) {
    case 'paragraph':
      return <p key={index}>{children}</p>;

    case 'heading': {
      const Tag = `h${block.level || 2}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return (
        <Tag
          key={index}
          className={cn(followsEyebrow && "!mt-0")}
        >
          {children}
        </Tag>
      );
    }

    case 'list': {
      const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
      return <ListTag key={index}>{children}</ListTag>;
    }

    case 'list-item':
      return <li key={index}>{children}</li>;

    case 'quote':
      return <blockquote key={index}>{children}</blockquote>;

    case 'code':
      return <pre key={index}><code>{children}</code></pre>;

    case 'link':
      return <a key={index} href={block.url} target="_blank" rel="noopener noreferrer">{children}</a>;

    default:
      return <p key={index}>{children}</p>;
  }
}

function renderEyebrow(text: string, key: number): React.ReactNode {
  return (
    <Typography
      key={key}
      variant="overline"
      as="span"
      className="mb-4"
    >
      {text}
    </Typography>
  );
}

function renderBlocksWithCustomTags(blocks: RichTextBlock[]): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let eyebrowPending = false;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockTag = extractBlockTag(block);

    if (blockTag) {
      switch (blockTag.tag) {
        case 'eyebrow':
          elements.push(renderEyebrow(blockTag.content, i));
          eyebrowPending = true;
          continue;
        default:
          break;
      }
    }

    elements.push(renderBlock(block, i, eyebrowPending));
    eyebrowPending = false;
  }

  return elements;
}

function blocksHaveCustomTags(blocks: RichTextBlock[]): boolean {
  for (const block of blocks) {
    if (extractBlockTag(block)) return true;
    if (block.children) {
      for (const child of block.children) {
        if (child.text && hasInlineTags(child.text)) return true;
      }
    }
  }
  return false;
}

function renderBlocks(blocks: RichTextBlock[], className?: string): React.ReactNode {
  const useCustomTags = blocksHaveCustomTags(blocks);
  return (
    <div className={cn("prose prose-lg dark:prose-invert max-w-none", className)}>
      {useCustomTags
        ? renderBlocksWithCustomTags(blocks)
        : blocks.map((block, index) => renderBlock(block, index))
      }
    </div>
  );
}

export function renderStrapiRichText(
  richTextBlock: StrapiRichTextBlock | RichTextBlock[] | undefined,
  className?: string
): React.ReactNode {
  if (!richTextBlock) return null;

  if (Array.isArray(richTextBlock)) {
    return renderBlocks(richTextBlock, className);
  }

  if (!richTextBlock.content) return null;

  const hasImage = richTextBlock.Image && richTextBlock.Image.url;
  const imageUrl = hasImage ? getStrapiMediaURL(richTextBlock.Image?.url) : null;

  return (
    <>
      {renderBlocks(richTextBlock.content, className)}

      {imageUrl && (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <ImageWithFallback
            src={imageUrl}
            alt={richTextBlock.Image?.alternativeText || 'Section image'}
            fill
            sizes="100vw"
            className="object-cover"
            skeletonClassName="rounded-lg"
          />
        </div>
      )}
    </>
  );
}
