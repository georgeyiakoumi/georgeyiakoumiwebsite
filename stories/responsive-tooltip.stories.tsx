"use client";

import type { Meta, StoryObj } from "@storybook/nextjs";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Responsive tooltip — shows a HoverCard on desktop (xl+) and a Drawer on mobile/tablet.
 * Supports title, content, icon, and tags slots.
 */
const meta: Meta<typeof ResponsiveTooltip> = {
  title: "ui/ResponsiveTooltip",
  component: ResponsiveTooltip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ResponsiveTooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic tooltip with title and content.
 */
export const Default: Story = {
  render: () => (
    <ResponsiveTooltip
      title="Figma"
      content="Design tool for creating user interfaces, prototypes, and design systems."
    >
      <Button variant="outline">Hover me (desktop) / Tap me (mobile)</Button>
    </ResponsiveTooltip>
  ),
};

/**
 * Tooltip with tags displayed below the content.
 */
export const WithTags: Story = {
  render: () => (
    <ResponsiveTooltip
      title="Next.js"
      content="React framework for production-grade web applications with server-side rendering and static generation."
      tags={
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">Framework</Badge>
          <Badge variant="outline">React</Badge>
          <Badge variant="outline">SSR</Badge>
        </div>
      }
    >
      <Button variant="outline">Next.js</Button>
    </ResponsiveTooltip>
  ),
};

/**
 * Tooltip with a custom icon (shown in the drawer on mobile).
 */
export const WithIcon: Story = {
  render: () => (
    <ResponsiveTooltip
      title="TypeScript"
      content="Typed superset of JavaScript that compiles to plain JavaScript."
      icon={
        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
          <span className="text-2xl font-bold text-primary">TS</span>
        </div>
      }
    >
      <Button variant="outline">TypeScript</Button>
    </ResponsiveTooltip>
  ),
};
