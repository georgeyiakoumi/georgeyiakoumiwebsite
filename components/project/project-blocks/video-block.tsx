"use client";

import { useRef, useEffect } from "react";
import { getBrowserMediaURL } from "@/lib/strapi";
import { BlockFigure } from "./blocks/block-figure";
import { BlockCaption } from "./blocks/block-caption";
import type { VideoBlock as VideoBlockType } from "@/lib/strapi-queries";

interface VideoBlockProps {
  block: VideoBlockType;
}

export function VideoBlock({ block }: VideoBlockProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-play when scrolled into view
  useEffect(() => {
    if (!block.file || !videoRef.current) return;

    const video = videoRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Auto-play was prevented
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [block.file]);

  // Self-hosted video file
  if (block.file) {
    const videoUrl = getBrowserMediaURL(block.file.url);

    return (
      <BlockFigure>
        <video
          ref={videoRef}
          src={videoUrl || ''}
          className="project-image w-full h-auto rounded-lg lg:border-border lg:border"
          loop
          muted
          playsInline
        >
          Your browser does not support the video tag.
        </video>
        {block.caption && (
          <BlockCaption>{block.caption}</BlockCaption>
        )}
      </BlockFigure>
    );
  }

  return null;
}
