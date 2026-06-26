"use client";

import { useTheme } from "next-themes";
import { Item, ItemMedia } from "@/components/ui/item";
import { getStrapiMediaURL } from "@/lib/strapi";
import { Typography } from "@/components/ui/typography";
import { useEffect, useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer";

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

interface ThemedLogoProps {
  data: LogoItemData;
}

export function ThemedLogo({ data }: ThemedLogoProps) {
  const { resolvedTheme } = useTheme();
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showDrawer, setShowDrawer] = useState<boolean | undefined>(undefined);
  const imageUrl = data.image?.url ? getStrapiMediaURL(data.image.url) : null;
  const isSvg = data.image?.ext === '.svg';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // xl breakpoint is 1280px
    const mql = window.matchMedia('(max-width: 1279px)');
    const onChange = () => {
      setShowDrawer(window.innerWidth < 1280);
    };
    mql.addEventListener('change', onChange);
    setShowDrawer(window.innerWidth < 1280);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!imageUrl || !isSvg) return;

    // Fetch and inline SVG for CSS variable support
    fetch(imageUrl)
      .then(res => res.text())
      .then(setSvgContent)
      .catch(console.error);
  }, [imageUrl, isSvg]);

  if (!imageUrl) return null;

  // Merge CSS variables based on current theme
  // Only apply theme-specific variables after mounting to prevent hydration mismatch
  const cssVariables = {
    ...(data.cssVariables || {}),
    ...(mounted && resolvedTheme === 'dark' && data.cssVariablesDark ? data.cssVariablesDark : {}),
  } as React.CSSProperties;

  const description = data.description;

  const logoItem = (
    <Item
      variant="default"
      className="size-full justify-center lg:hover:border-primary/50 transition-colors"
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

  // If no description, just return the logo without interaction
  if (!description) {
    return logoItem;
  }

  // Below xl breakpoint: Use Drawer
  if (showDrawer) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          {logoItem}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="gap-3 pb-16">
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
            <DrawerTitle className="pt-4">{data.name}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
            {data.tags && data.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {data.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline">{tag.name}</Badge>
                ))}
              </div>
            )}
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
  }

  // xl breakpoint and above: Use HoverCard
  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        {logoItem}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <Typography variant="small" as="h4">{data.name}</Typography>
          {description && (
            <Typography variant="muted">{description}</Typography>
          )}
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {data.tags.map((tag) => (
                <Badge key={tag.id} variant="outline">{tag.name}</Badge>
              ))}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
