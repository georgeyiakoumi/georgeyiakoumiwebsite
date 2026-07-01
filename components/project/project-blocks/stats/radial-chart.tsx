"use client";

import { RadialBar, RadialBarChart as RechartsRadialBarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { BlockFigure } from "../blocks/block-figure";
import { BlockCaption } from "../blocks/block-caption";
import type { ChartProps } from "./types";

export function StatsRadialChart({ data, variant, features, description }: ChartProps) {
  const isStacked = variant === 'stacked';
  const showText = variant === 'text';

  const radialChartConfig = data.reduce((config, item, index) => ({
    ...config,
    [item.name]: {
      label: item.name,
      color: `var(--chart-${(index % 5) + 1})`,
    },
  }), {} as ChartConfig);

  const radialData = data.map((item, index) => ({
    ...item,
    fill: `var(--chart-${(index % 5) + 1})`,
  }));

  return (
    <BlockFigure className="my-16">
      {description && <BlockCaption>{description}</BlockCaption>}
      <ChartContainer config={radialChartConfig} className="h-[400px] w-full mx-auto aspect-square max-h-[400px]">
        <RechartsRadialBarChart
          data={radialData}
          startAngle={-90}
          endAngle={380}
          innerRadius={30}
          outerRadius={140}
        >
          <ChartTooltip content={<ChartTooltipContent hideLabel nameKey="name" />} cursor={false} />
          {features.showLegend && <ChartLegend content={<ChartLegendContent />} />}
          <RadialBar
            dataKey="value"
            background
            stackId={isStacked ? "a" : undefined}
            label={features.showLabels || showText ? { position: 'insideStart', fill: '#fff' } : undefined}
          />
        </RechartsRadialBarChart>
      </ChartContainer>
    </BlockFigure>
  );
}
