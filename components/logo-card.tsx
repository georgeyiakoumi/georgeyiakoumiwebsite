"use client";

import { useTheme } from "next-themes";
import { Item, ItemMedia } from "@/components/ui/item";
import { getStrapiMediaURL } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip";
import { BrandIcon } from "@/components/brand-icon";
import type { BrandIcon as BrandIconData } from "@/lib/brand-icons";
import { useEffect, useState } from "react";

interface LogoItemData {
  id: number;
  name: string;
  classes?: string | null;
  cssVariables?: Record<string, string> | null;
  cssVariablesDark?: Record<string, string> | null;
  description?: string | null;
  url?: string | null;
  icon?: BrandIconData;
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
    if (data.icon || !imageUrl || !isSvg) return;

    const controller = new AbortController();
    fetch(imageUrl, { signal: controller.signal })
      .then(res => res.text())
      .then(setSvgContent)
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort();
  }, [data.icon, imageUrl, isSvg]);

  if (!data.icon && !imageUrl) return null;

  const cssVariables = data.icon ? undefined : {
    ...(data.cssVariables || {}),
    ...(mounted && resolvedTheme === 'dark' && data.cssVariablesDark ? data.cssVariablesDark : {}),
  } as React.CSSProperties;

  const logoMedia = data.icon ? (
    <ItemMedia className="w-full h-full">
      <BrandIcon icon={data.icon} className="size-full" />
    </ItemMedia>
  ) : (
    <ItemMedia
      className={`w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain ${data.classes || ""}`}
      dangerouslySetInnerHTML={svgContent ? { __html: svgContent } : undefined}
    />
  );

  const logoItem = (
    <Item
      variant="default"
      className={cn(
        "size-full justify-center xl:opacity-80 xl:hover:opacity-100 xl:transition-[colors,opacity] xl:lg:hover:border-primary/50",
        data.icon && "aspect-square"
      )}
      role="img"
      aria-label={`Logo for ${data.name}`}
      style={cssVariables}
    >
      {logoMedia}
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
      {logoMedia}
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
