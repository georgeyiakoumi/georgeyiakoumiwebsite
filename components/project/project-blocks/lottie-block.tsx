"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { getStrapiMediaURL } from "@/lib/strapi";
import { BlockFigure } from "./blocks/block-figure";
import { BlockCaption } from "./blocks/block-caption";
import type { LottieBlock as LottieBlockType } from "@/lib/strapi-queries";

interface LottieBlockProps {
  block: LottieBlockType;
}

export function LottieBlock({ block }: LottieBlockProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    if (!block.file) return;

    const url = getStrapiMediaURL(block.file.url);
    if (!url) return;

    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort();
  }, [block.file]);

  if (!block.file || !animationData) return null;

  return (
    <BlockFigure>
      <div className="w-full border border-border rounded-lg overflow-hidden flex justify-center">
        <Lottie
          animationData={animationData}
          loop={block.loop ?? true}
          autoplay={block.autoplay ?? true}
          className="w-full"
        />
      </div>
      {block.caption && <BlockCaption>{block.caption}</BlockCaption>}
    </BlockFigure>
  );
}
