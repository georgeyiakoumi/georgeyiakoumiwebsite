"use client";

import { useRef, useEffect } from "react";
import { getStrapiMediaURL } from "@/lib/strapi";
import { BlockFigure } from "./block-figure";
import { BlockCaption } from "./block-caption";
import type { VideoBlock as VideoBlockType } from "@/lib/strapi-queries";

function toEmbedUrl(url: string): string {
  // YouTube: watch?v=ID → embed/ID
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo: vimeo.com/ID → player.vimeo.com/video/ID
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return url;
}

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

  // Embedded URL (YouTube/Vimeo)
  if (block.url) {
    return (
      <BlockFigure>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden lg:border-border lg:border">
          <iframe
            src={toEmbedUrl(block.url)}
            title="Project video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        {block.caption && (
          <BlockCaption>{block.caption}</BlockCaption>
        )}
      </BlockFigure>
    );
  }

  // Self-hosted video file
  if (block.file) {
    const videoUrl = getStrapiMediaURL(block.file.url);

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
