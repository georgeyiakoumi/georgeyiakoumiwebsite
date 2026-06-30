import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const typographyVariants = cva("text-foreground", {
  variants: {
    variant: {
      display: "text-3xl md:text-4xl lg:text-6xl font-medium leading-normal text-muted-foreground",
      h1: "text-3xl md:text-4xl font-semibold",
      h2: "text-2xl md:text-3xl font-semibold",
      h3: "text-xl md:text-2xl font-semibold",
      h4: "text-lg md:text-xl font-semibold",
      h5: "text-base md:text-lg font-semibold",
      h6: "text-sm md:text-base font-semibold",
      p: "text-lg text-foreground/70 tracking-tight leading-7",
      lead: "text-lg md:text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-5",
      muted: "text-sm text-muted-foreground",
      figcaption: "text-xs text-muted-foreground text-center",
      blockquote: "border-l-4 border-border pl-4 italic text-muted-foreground",
      overline: "block uppercase font-extrabold tracking-widest text-xs text-foreground/50",
      code: "bg-muted px-1 py-0.5 rounded text-sm font-mono",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    variant: "p",
    align: "left",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "time" | "figcaption" | "blockquote" | "code" | "dt" | "dd"
  dateTime?: string
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, align, as, ...props }, ref) => {
    const Comp = as || getDefaultElement(variant)

    return (
      <Comp
        ref={ref as any}
        className={cn(typographyVariants({ variant, align, className }))}
        {...props}
      />
    )
  }
)

Typography.displayName = "Typography"

function getDefaultElement(
  variant: TypographyProps["variant"]
): "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "figcaption" | "blockquote" | "code" {
  switch (variant) {
    case "h1":
      return "h1"
    case "h2":
      return "h2"
    case "h3":
      return "h3"
    case "h4":
      return "h4"
    case "h5":
      return "h5"
    case "h6":
      return "h6"
    case "figcaption":
      return "figcaption"
    case "blockquote":
      return "blockquote"
    case "code":
      return "code"
    default:
      return "p"
  }
}

export { Typography, typographyVariants }
