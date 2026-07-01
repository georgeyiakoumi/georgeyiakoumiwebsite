import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import { BlockFigure } from "../blocks/block-figure";
import { BlockCaption } from "../blocks/block-caption";
import type { StatsBlock as StatsBlockType } from "@/lib/strapi-queries";

type StatItem = NonNullable<StatsBlockType["items"]>[number];

function StatCard({ item, className }: { item: StatItem; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col md:items-start bg-muted/50 rounded-lg py-4 px-8",
        className
      )}
    >
      <Typography variant="h3" className="!text-3xl font-semibold">
        {item.value}
        {item.suffix && <span className="font-semibold text-lg"> {item.suffix}</span>}
      </Typography>
      <Typography className="text-muted-foreground">
        {item.label}
      </Typography>
    </div>
  );
}

interface NumberOnlyChartProps {
  items: StatsBlockType["items"];
  description?: string;
}

export function NumberOnlyChart({ items, description }: NumberOnlyChartProps) {
  if (!items || items.length === 0) return null;

  const itemCount = items.length;
  const xlCols = itemCount <= 2 ? 'xl:grid-cols-2' : itemCount === 3 ? 'lg:grid-cols-3' : 'xl:grid-cols-4';

  return (
    <BlockFigure className="w-full">
      <div className={cn(
        "w-full grid grid-cols-1 gap-2 md:gap-4",
        "md:grid-cols-2",
        xlCols, 
        "lg:gap-4")}>
        {items.map((item) => (
          <StatCard key={item.id} item={item} />
        ))}
      </div>
      {description && <BlockCaption>{description}</BlockCaption>}
    </BlockFigure>
  );
}
