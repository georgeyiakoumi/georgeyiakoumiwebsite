"use client";

import * as React from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Typography } from "@/components/ui/typography";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ResponsiveTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  tags?: React.ReactNode;
}

export function ResponsiveTooltip({ children, content, title, icon, tags }: ResponsiveTooltipProps) {
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  if (isDesktop) {
    return (
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          {children}
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            {title && <Typography variant="small" as="h4">{title}</Typography>}
            {content && <Typography variant="muted">{content}</Typography>}
            {tags}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-3 pb-16">
          {icon}
          {title ? (
            <DrawerTitle className="pt-4">{title}</DrawerTitle>
          ) : (
            <DrawerTitle className="sr-only">Details</DrawerTitle>
          )}
          {content && <DrawerDescription>{content}</DrawerDescription>}
          {tags}
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
