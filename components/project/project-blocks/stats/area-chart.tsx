"use client";

import { Area, AreaChart as RechartsAreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BlockFigure } from "../blocks/block-figure";
import { BlockCaption } from "../blocks/block-caption";
import type { ChartProps } from "./types";

export function StatsAreaChart({ data, config, variant, features, description }: ChartProps) {
  const areaType = variant === 'linear' ? 'linear' : variant === 'step' ? 'step' : 'natural';
  const isStacked = variant === 'stacked';
  const isGradient = variant === 'gradient';

  return (
    <BlockFigure className="my-16">
      {description && <BlockCaption>{description}</BlockCaption>}
      <ChartContainer config={config} className="h-[400px] w-full">
        <RechartsAreaChart data={data}>
          {features.showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          {features.showAxes && <XAxis dataKey="name" />}
          {features.showAxes && <YAxis />}
          <ChartTooltip content={<ChartTooltipContent />} />
          {features.showLegend && <ChartLegend content={<ChartLegendContent />} />}
          <defs>
            <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-value)" stopOpacity={isGradient ? 0.1 : 0.3} />
            </linearGradient>
          </defs>
          <Area
            dataKey="value"
            type={areaType}
            fill="url(#fillValue)"
            fillOpacity={1}
            stroke="var(--color-value)"
            strokeWidth={2}
            stackId={isStacked ? "a" : undefined}
            dot={features.showDots}
          />
        </RechartsAreaChart>
      </ChartContainer>
    </BlockFigure>
  );
}
