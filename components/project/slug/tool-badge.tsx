"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { getStrapiMediaURL } from "@/lib/strapi";
import type { ToolData } from "@/lib/strapi-queries";

export function ToolBadge({ tool }: { tool: ToolData }) {
  const { resolvedTheme } = useTheme();
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const imageUrl = tool.image?.url ? getStrapiMediaURL(tool.image.url) : null;
  const isSvg = tool.image?.ext === '.svg';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSvg && imageUrl) {
      fetch(imageUrl)
        .then((res) => res.text())
        .then((svg) => setSvgContent(svg))
        .catch((err) => console.error('Failed to fetch SVG:', err));
    }
  }, [isSvg, imageUrl]);

  const cssVariables = {
    ...(tool.cssVariables || {}),
    ...(mounted && resolvedTheme === 'dark' && tool.cssVariablesDark ? tool.cssVariablesDark : {}),
  } as React.CSSProperties;

  return (
    <Badge
      variant="secondary"
      className={`gap-2 ${tool.classes || ""}`}
      style={cssVariables}
    >
      {tool.image && (
        <>
          {isSvg && svgContent ? (
            <span
              className="size-4 [&>svg]:size-full [&>svg]:object-contain"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <Image
              src={tool.image.url}
              alt={tool.image.alternativeText || tool.name}
              width={16}
              height={16}
              className="object-contain"
            />
          )}
        </>
      )}
      {tool.name}
    </Badge>
  );
}
