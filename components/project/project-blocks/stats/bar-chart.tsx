"use client";

import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { BlockFigure } from "../blocks/block-figure";
import { BlockCaption } from "../blocks/block-caption";
import type { ChartProps } from "./types";
import type { StatsBlock as StatsBlockType } from "@/lib/strapi-queries";

interface BarChartProps extends ChartProps {
  items: NonNullable<StatsBlockType["items"]>;
}

export function StatsBarChart({ data, config, variant, features, description, items }: BarChartProps) {
  const isHorizontal = variant === 'horizontal';
  const isStacked = variant === 'stacked';
  const hasGroups = items.some(item => item.group);

  if (hasGroups) {
    const groups = [...new Set(items.filter(item => item.group).map(item => item.group!))];
    const labels = [...new Set(items.map(item => item.label))];

    const sanitize = (str: string) => str.toLowerCase().replace(/\s+/g, '-');
    const groupKeyMap = Object.fromEntries(groups.map(g => [g, sanitize(g)]));

    const groupedChartData = labels.map(label => {
      const row: Record<string, string | number> = { name: label };
      items
        .filter(item => item.label === label)
        .forEach(item => {
          if (item.group) {
            row[groupKeyMap[item.group]] = typeof item.value === 'string' ? parseFloat(item.value) : item.value;
          }
        });
      return row;
    });

    const groupedChartConfig = groups.reduce((cfg, group, index) => ({
      ...cfg,
      [groupKeyMap[group]]: {
        label: group,
        color: `var(--chart-${(index % 5) + 1})`,
      },
    }), {} as ChartConfig);

    return (
      <BlockFigure className="my-16">
        {description && <BlockCaption>{description}</BlockCaption>}
        <ChartContainer config={groupedChartConfig} className="h-[400px] w-full">
          <RechartsBarChart accessibilityLayer data={groupedChartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
            {features.showAxes && <YAxis />}
            <ChartTooltip content={<ChartTooltipContent />} />
            {features.showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {groups.map((group) => (
              <Bar
                key={groupKeyMap[group]}
                dataKey={groupKeyMap[group]}
                fill={`var(--color-${groupKeyMap[group]})`}
                radius={isStacked ? 0 : 4}
                stackId={isStacked ? "a" : undefined}
              />
            ))}
          </RechartsBarChart>
        </ChartContainer>
      </BlockFigure>
    );
  }

  return (
    <BlockFigure className="my-16">
      {description && <BlockCaption>{description}</BlockCaption>}
      <ChartContainer config={config} className="h-[400px] w-full">
        <RechartsBarChart data={data} layout={isHorizontal ? "vertical" : "horizontal"}>
          {features.showGrid && <CartesianGrid strokeDasharray="3 3" vertical={!isHorizontal} />}
          {isHorizontal ? (
            <>
              {features.showAxes && <XAxis type="number" />}
              {features.showAxes && <YAxis dataKey="name" type="category" />}
            </>
          ) : (
            <>
              {features.showAxes && <XAxis dataKey="name" />}
              {features.showAxes && <YAxis />}
            </>
          )}
          <ChartTooltip content={<ChartTooltipContent />} />
          {features.showLegend && <ChartLegend content={<ChartLegendContent />} />}
          <Bar dataKey="value" fill="var(--color-value)" radius={4} />
        </RechartsBarChart>
      </ChartContainer>
    </BlockFigure>
  );
}
