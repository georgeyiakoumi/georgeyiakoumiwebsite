"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip";
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

  const badge = (
    <Badge
      variant="outline"
      className={`gap-2 select-none cursor-pointer ${tool.classes || ""}`}
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

  if (!tool.description) return badge;

  const drawerIcon = tool.image ? (
    <div
      className="mx-auto size-16 flex items-center justify-center"
      style={cssVariables}
    >
      {isSvg && svgContent ? (
        <span
          className="size-full [&>svg]:size-full [&>svg]:object-contain"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <Image
          src={tool.image.url}
          alt={tool.image.alternativeText || tool.name}
          width={64}
          height={64}
          className="object-contain"
        />
      )}
    </div>
  ) : undefined;

  return (
    <ResponsiveTooltip content={tool.description} title={tool.name} icon={drawerIcon}>
      {badge}
    </ResponsiveTooltip>
  );
}
