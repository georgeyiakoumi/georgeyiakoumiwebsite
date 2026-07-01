"use client";

import { Line, LineChart as RechartsLineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BlockFigure } from "../blocks/block-figure";
import { BlockCaption } from "../blocks/block-caption";
import type { ChartProps } from "./types";

export function StatsLineChart({ data, config, variant, features, description }: ChartProps) {
  const lineType = variant === 'linear' ? 'linear' : variant === 'step' ? 'step' : 'natural';
  const showLineDots = variant === 'dots' || features.showDots;

  return (
    <BlockFigure className="my-16">
      {description && <BlockCaption>{description}</BlockCaption>}
      <ChartContainer config={config} className="h-[400px] w-full">
        <RechartsLineChart data={data}>
          {features.showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          {features.showAxes && <XAxis dataKey="name" />}
          {features.showAxes && <YAxis />}
          <ChartTooltip content={<ChartTooltipContent />} />
          {features.showLegend && <ChartLegend content={<ChartLegendContent />} />}
          <Line
            type={lineType}
            dataKey="value"
            stroke="var(--color-value)"
            strokeWidth={2}
            dot={showLineDots}
          />
        </RechartsLineChart>
      </ChartContainer>
    </BlockFigure>
  );
}
