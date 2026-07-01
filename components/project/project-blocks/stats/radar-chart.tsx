"use client";

import { Radar, RadarChart as RechartsRadarChart, PolarAngleAxis, PolarGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BlockFigure } from "../blocks/block-figure";
import { BlockCaption } from "../blocks/block-caption";
import type { ChartProps } from "./types";

export function StatsRadarChart({ data, config, variant, features, description }: ChartProps) {
  const showRadarDots = variant === 'dots' || features.showDots;
  const linesOnly = variant === 'lines-only';
  const isCircle = variant === 'circle';
  const isFilled = variant === 'filled';

  return (
    <BlockFigure className="my-16">
      {description && <BlockCaption>{description}</BlockCaption>}
      <ChartContainer config={config} className="h-[400px] w-full mx-auto aspect-square max-h-[400px]">
        <RechartsRadarChart data={data}>
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          {features.showLegend && <ChartLegend content={<ChartLegendContent />} />}
          <PolarAngleAxis dataKey="name" />
          {features.showGrid && <PolarGrid gridType={isCircle ? "circle" : "polygon"} />}
          <Radar
            dataKey="value"
            fill="var(--color-value)"
            fillOpacity={isFilled ? 0.6 : linesOnly ? 0 : 0.3}
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={showRadarDots}
          />
        </RechartsRadarChart>
      </ChartContainer>
    </BlockFigure>
  );
}
