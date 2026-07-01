"use client";

import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { User, Briefcase, FlaskConical } from "lucide-react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";

/**
 * Animated tab switcher with a clip-path motion highlight.
 * Used on the homepage (tools) and projects page (type filter).
 */
const meta: Meta<typeof AnimatedTabs> = {
  title: "ui/AnimatedTabs",
  component: AnimatedTabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AnimatedTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Text-only tabs.
 */
export const TextOnly: Story = {
  render: () => {
    const [active, setActive] = useState("client");
    return (
      <AnimatedTabs
        tabs={[
          { value: "client", label: "Client Work" },
          { value: "personal", label: "Personal" },
          { value: "article", label: "Articles" },
        ]}
        activeTab={active}
        onTabChange={setActive}
        ariaLabel="Project type filter"
      />
    );
  },
};

/**
 * Tabs with icons and labels.
 */
export const WithIcons: Story = {
  render: () => {
    const [active, setActive] = useState("client");
    return (
      <AnimatedTabs
        tabs={[
          { value: "client", label: "Client", icon: <Briefcase className="size-4" /> },
          { value: "personal", label: "Personal", icon: <User className="size-4" /> },
          { value: "lab", label: "Lab", icon: <FlaskConical className="size-4" /> },
        ]}
        activeTab={active}
        onTabChange={setActive}
        ariaLabel="Category filter"
      />
    );
  },
};

/**
 * Tabs with badge counts.
 */
export const WithBadges: Story = {
  render: () => {
    const [active, setActive] = useState("all");
    return (
      <AnimatedTabs
        tabs={[
          { value: "all", label: "All", badge: 12 },
          { value: "client", label: "Client", badge: 8 },
          { value: "personal", label: "Personal", badge: 3 },
          { value: "article", label: "Articles", badge: 1 },
        ]}
        activeTab={active}
        onTabChange={setActive}
        ariaLabel="Project filter with counts"
      />
    );
  },
};
