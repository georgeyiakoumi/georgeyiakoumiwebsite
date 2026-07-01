"use client";

import type { StatsBlock as StatsBlockType } from "@/lib/strapi-queries";
import type { ChartConfig } from "@/components/ui/chart";
import type { ChartFeatures } from "./types";
import { NumberOnlyChart } from "./number-only-chart";
import { StatsAreaChart } from "./area-chart";
import { StatsBarChart } from "./bar-chart";
import { StatsLineChart } from "./line-chart";
import { StatsPieChart } from "./pie-chart";
import { StatsRadarChart } from "./radar-chart";
import { StatsRadialChart } from "./radial-chart";

interface StatsBlockProps {
  block: StatsBlockType;
}

export function StatsBlock({ block }: StatsBlockProps) {
  if (!block.items || block.items.length === 0) return null;

  const chartType = block.chart_type || 'number-only';

  if (chartType === 'number-only') {
    return <NumberOnlyChart items={block.items} description={block.caption} />;
  }

  const suffix = block.items?.[0]?.suffix || '';
  const variant = (block[`${chartType}_variant` as keyof StatsBlockType] as string) || 'default';

  const features: ChartFeatures = {
    showLegend: block.show_legend !== false,
    showGrid: block.show_grid !== false,
    showAxes: block.show_axes !== false,
    showDots: block.show_dots === true,
    showLabels: block.show_labels === true,
  };

  const data = block.items.map((item) => ({
    name: item.label,
    value: typeof item.value === 'string' ? parseFloat(item.value) : item.value,
    fullLabel: item.label,
  }));

  const config = {
    value: {
      label: suffix || "Value",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const sharedProps = { data, config, variant, features, description: block.caption };

  switch (chartType) {
    case 'area':
      return <StatsAreaChart {...sharedProps} />;
    case 'bar':
      return <StatsBarChart {...sharedProps} items={block.items} />;
    case 'line':
      return <StatsLineChart {...sharedProps} />;
    case 'pie':
      return <StatsPieChart {...sharedProps} />;
    case 'radar':
      return <StatsRadarChart {...sharedProps} />;
    case 'radial':
      return <StatsRadialChart {...sharedProps} />;
    default:
      return null;
  }
}
