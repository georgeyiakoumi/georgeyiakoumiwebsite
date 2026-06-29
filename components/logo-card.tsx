"use client";

import { useTheme } from "next-themes";
import { Item, ItemMedia } from "@/components/ui/item";
import { getStrapiMediaURL } from "@/lib/strapi";
import { Badge } from "@/components/ui/badge";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip";
import { useEffect, useState } from "react";

interface LogoItemData {
  id: number;
  name: string;
  classes?: string | null;
  cssVariables?: Record<string, string> | null;
  cssVariablesDark?: Record<string, string> | null;
  description?: string | null;
  url?: string | null;
  image?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
    ext?: string;
  };
  sector?: { id: number; name: string } | null;
  tags?: { id: number; name: string }[];
}

interface LogoCardProps {
  data: LogoItemData;
}

export function LogoCard({ data }: LogoCardProps) {
  const { resolvedTheme } = useTheme();
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const imageUrl = data.image?.url ? getStrapiMediaURL(data.image.url) : null;
  const isSvg = data.image?.ext === '.svg';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!imageUrl || !isSvg) return;
    fetch(imageUrl)
      .then(res => res.text())
      .then(setSvgContent)
      .catch(console.error);
  }, [imageUrl, isSvg]);

  if (!imageUrl) return null;

  const cssVariables = {
    ...(data.cssVariables || {}),
    ...(mounted && resolvedTheme === 'dark' && data.cssVariablesDark ? data.cssVariablesDark : {}),
  } as React.CSSProperties;

  const logoItem = (
    <Item
      variant="default"
      className="size-full justify-center xl:opacity-80 xl:hover:opacity-100 xl:transition-[colors,opacity] xl:lg:hover:border-primary/50"
      role="img"
      aria-label={`Logo for ${data.name}`}
      style={cssVariables}
    >
      <ItemMedia
        className={`w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain ${data.classes || ""}`}
        dangerouslySetInnerHTML={svgContent ? { __html: svgContent } : undefined}
      />
    </Item>
  );

  if (!data.description) return logoItem;

  const drawerIcon = (
    <Item
      variant="default"
      className="max-w-[50%] sm:max-w-[30%] md:max-w-[20%] size-full justify-center aspect-2/1 mx-auto"
      role="img"
      aria-label={`Logo for ${data.name}`}
      style={cssVariables}
    >
      <ItemMedia
        className={`w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain ${data.classes || ""}`}
        dangerouslySetInnerHTML={svgContent ? { __html: svgContent } : undefined}
      />
    </Item>
  );

  const tagsContent = data.tags && data.tags.length > 0 ? (
    <div className="flex flex-wrap gap-1.5 justify-center xl:justify-start">
      {data.tags.map((tag) => (
        <Badge key={tag.id} variant="outline">{tag.name}</Badge>
      ))}
    </div>
  ) : undefined;

  return (
    <ResponsiveTooltip
      content={data.description}
      title={data.name}
      icon={drawerIcon}
      tags={tagsContent}
    >
      {logoItem}
    </ResponsiveTooltip>
  );
}
