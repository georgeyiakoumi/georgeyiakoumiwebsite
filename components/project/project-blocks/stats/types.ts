import type { ChartConfig } from "@/components/ui/chart";

export interface ChartDataItem {
  name: string;
  value: number;
  fullLabel: string;
}

export interface ChartFeatures {
  showLegend: boolean;
  showGrid: boolean;
  showAxes: boolean;
  showDots: boolean;
  showLabels: boolean;
}

export interface ChartProps {
  data: ChartDataItem[];
  config: ChartConfig;
  variant: string;
  features: ChartFeatures;
  description?: string;
}
