"use client";

import { Pie, PieChart as RechartsPieChart, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { BlockFigure } from "../blocks/block-figure";
import { BlockCaption } from "../blocks/block-caption";
import type { ChartProps } from "./types";

export function StatsPieChart({ data, variant, features, description }: ChartProps) {
  const isDonut = variant === 'donut' || variant === 'donut-text' || variant === 'donut-active';

  const pieChartConfig = data.reduce((config, item, index) => ({
    ...config,
    [item.name]: {
      label: item.name,
      color: `var(--chart-${(index % 5) + 1})`,
    },
  }), {} as ChartConfig);

  return (
    <BlockFigure className="my-16">
      {description && <BlockCaption>{description}</BlockCaption>}
      <ChartContainer config={pieChartConfig} className="h-[400px] w-full">
        <RechartsPieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          {features.showLegend && <ChartLegend content={<ChartLegendContent />} />}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={features.showLabels ? ({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
            outerRadius={120}
            innerRadius={isDonut ? 60 : 0}
            dataKey="value"
            nameKey="name"
          >
            {data.map((item, index) => (
              <Cell key={`cell-${index}`} fill={`var(--color-${item.name})`} />
            ))}
          </Pie>
        </RechartsPieChart>
      </ChartContainer>
    </BlockFigure>
  );
}
