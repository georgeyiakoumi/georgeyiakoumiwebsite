import React from "react";
import type { ProjectBlock } from "@/lib/strapi-queries";
import { RichTextBlock } from "./rich-text-block";
import { ImageBlock } from "./image-block";
import { CarouselBlock } from "./carousel-block";
import { VideoBlock } from "./video-block";
import { ComparisonSliderBlock } from "./comparison-slider-block";
import { ComparisonSliderBlock as LegacyComparisonSliderBlock } from "@/components/legacy/comparison-slider-block";
import { StatsBlock } from "./stats-block";
import { CodeBlock } from "./code-block";
import { LottieBlock } from "./lottie-block";
interface ProjectBlockRendererProps {
  blocks: ProjectBlock[];
  projectTitle: string;
}

export function ProjectBlockRenderer({ blocks, projectTitle }: ProjectBlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.__component}-${block.id}`;
        switch (block.__component) {
          case 'project-blocks.rich-text':
            return <RichTextBlock key={key} block={block} isFirst={index === 0} />;

          case 'project-blocks.image':
            return <ImageBlock key={key} block={block} projectTitle={projectTitle} />;

          case 'project-blocks.carousel':
            return <CarouselBlock key={key} block={block} projectTitle={projectTitle} />;

          case 'project-blocks.video':
            return <VideoBlock key={key} block={block} />;

          case 'project-blocks.comparison-slider':
            return block.legacy
              ? <LegacyComparisonSliderBlock key={key} block={block} projectTitle={projectTitle} />
              : <ComparisonSliderBlock key={key} block={block} projectTitle={projectTitle} />;

          case 'project-blocks.stats':
            return <StatsBlock key={key} block={block} />;

          case 'project-blocks.code-block':
            return <CodeBlock key={key} block={block} />;

          case 'project-blocks.lottie':
            return <LottieBlock key={key} block={block} />;

          default:
            console.warn(`Unknown block type: ${(block as any).__component}`);
            return null;
        }
      })}
    </>
  );
}

export {
  RichTextBlock,
  ImageBlock,
  CarouselBlock,
  VideoBlock,
  ComparisonSliderBlock,
  StatsBlock,
  CodeBlock,
  LottieBlock,
};
