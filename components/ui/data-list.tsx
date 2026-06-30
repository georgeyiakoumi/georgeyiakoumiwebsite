import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/typography"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type Orientation = "horizontal" | "vertical"

type OrientationProp = Orientation | { initial?: Orientation; sm?: Orientation; md?: Orientation; lg?: Orientation; xl?: Orientation }

const DataListContext = React.createContext<{ orientation: OrientationProp }>({ orientation: "horizontal" })

interface DataListProps extends React.ComponentProps<"dl"> {
  orientation?: OrientationProp
}

const orientationClasses: Record<string, { horizontal: string; vertical: string }> = {
  initial: { horizontal: "grid-cols-[auto_1fr]", vertical: "grid-cols-1" },
  sm: { horizontal: "sm:grid-cols-[auto_1fr]", vertical: "sm:grid-cols-1" },
  md: { horizontal: "md:grid-cols-[auto_1fr]", vertical: "md:grid-cols-1" },
  lg: { horizontal: "lg:grid-cols-[auto_1fr]", vertical: "lg:grid-cols-1" },
  xl: { horizontal: "xl:grid-cols-[auto_1fr]", vertical: "xl:grid-cols-1" },
}

function resolveOrientationClasses(orientation: OrientationProp): string {
  if (typeof orientation === "string") {
    return orientationClasses.initial[orientation]
  }
  return Object.entries(orientation)
    .map(([bp, value]) => orientationClasses[bp]?.[value] ?? "")
    .filter(Boolean)
    .join(" ")
}

function isVerticalOrientation(orientation: OrientationProp): boolean {
  if (typeof orientation === "string") return orientation === "vertical"
  return (orientation.initial ?? "horizontal") === "vertical"
}

function DataList({ className, orientation = "horizontal", ...props }: DataListProps) {
  return (
    <DataListContext.Provider value={{ orientation }}>
      <dl
        data-slot="data-list"
        className={cn("md:max-w-xl xl:max-w-2xl mx-auto grid items-start gap-x-6 gap-y-6", resolveOrientationClasses(orientation), className)}
        {...props}
      />
    </DataListContext.Provider>
  )
}

interface DataListLabelProps extends Omit<React.ComponentProps<"dt">, "children"> {
  label: string
  tooltip?: string
}

function DataListLabel({ className, label, tooltip, ...props }: DataListLabelProps) {
  return (
    <Typography as="dt" variant="overline" className={cn("flex items-center gap-1 pb-2", className)} {...props}>
      {label}
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              aria-label={tooltip}
              className="inline-flex items-center justify-center size-4 rounded-full border border-foreground/30 text-foreground/40 text-xs font-bold leading-none cursor-default select-none"
            >
              ?
            </span>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      )}
    </Typography>
  )
}

DataList.Item = function DataListItem({ className, children, ...props }: React.ComponentProps<"div">) {
  const { orientation } = React.useContext(DataListContext)
  const isVertical = isVerticalOrientation(orientation)

  if (!isVertical) return <React.Fragment>{children}</React.Fragment>

  return (
    <div
      data-slot="data-list-item"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {children}
    </div>
  )
}

DataList.Label = DataListLabel

interface DataListValueProps extends React.ComponentProps<"dd"> {
  layout?: "wrap"
}

DataList.Value = function DataListValue({ className, layout, ...props }: DataListValueProps) {
  return (
    <dd
      data-slot="data-list-value"
      className={cn(
        "text-sm text-foreground",
        layout === "wrap" && "flex flex-wrap gap-1.5",
        className
      )}
      {...props}
    />
  )
}

interface DataListButtonProps extends React.ComponentProps<"a"> {
  asChild?: boolean
}

DataList.Button = function DataListButton({ className, asChild, ...props }: DataListButtonProps) {
  const Comp = asChild ? Slot : "a"
  return (
    <Comp
      data-slot="data-list-button"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium !text-primary transition-colors hover:bg-accent hover:text-accent-foreground active:scale-[0.97]",
        className
      )}
      {...props}
    />
  )
}

export { DataList }
