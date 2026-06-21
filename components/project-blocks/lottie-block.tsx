"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { getStrapiMediaURL } from "@/lib/strapi";
import { BlockFigure } from "./block-figure";
import { BlockCaption } from "./block-caption";
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

    fetch(url)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(console.error);
  }, [block.file]);

  if (!block.file || !animationData) return null;

  return (
    <BlockFigure>
      <div className="w-full flex justify-center">
        <Lottie
          animationData={animationData}
          loop={block.loop ?? true}
          autoplay={block.autoplay ?? true}
          className="w-full max-w-xl"
        />
      </div>
      {block.caption && <BlockCaption>{block.caption}</BlockCaption>}
    </BlockFigure>
  );
}
