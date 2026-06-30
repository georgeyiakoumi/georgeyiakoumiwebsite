"use client"

import * as React from "react"
import { useRef, useEffect, useState } from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import Fade from "embla-carousel-fade"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, type ChevronLeftIconHandle } from "@/components/ui/chevron-left"
import { ChevronRightIcon, type ChevronRightIconHandle } from "@/components/ui/chevron-right"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  setApi?: (api: CarouselApi) => void
  fade?: boolean
  navigation?: "overlay" | "inline"
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  fade: boolean
} & Omit<CarouselProps, "fade">

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function Carousel({
  opts,
  setApi,
  plugins,
  fade = false,
  navigation,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const fadePlugin = fade ? [Fade()] : []

  const allPlugins: CarouselPlugin = [...(plugins ?? []), ...fadePlugin]
  const [carouselRef, api] = useEmblaCarousel(
    { ...opts },
    allPlugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("reInit", onSelect)
    api.on("select", onSelect)

    return () => {
      api?.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        fade,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative w-full", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {/* lg+ overlay nav — sits inside the carousel image */}
        {navigation === "overlay" && (
          <CarouselNavigation variant="overlay" className="absolute top-1 right-1 z-10" />
        )}
        {children}
        {/* Mobile / md inline nav — sits below the carousel, hidden at lg+ */}
        {navigation === "inline" && (
          <CarouselNavigation variant="inline" className="mt-2 px-8 md:mx-auto md:max-w-xl" />
        )}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, viewportClassName, ...props }: React.ComponentProps<"div"> & { viewportClassName?: string }) {
  const { carouselRef, fade } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className={cn("overflow-clip w-full", viewportClassName)}
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex touch-pan-y pinch-zoom",
          !fade && "space-x-4 md:space-x-8",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, index, ...props }: React.ComponentProps<"div"> & { index?: number }) {
  const { selectedIndex, fade } = useCarousel()
  const isActive = index === undefined || index === selectedIndex

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 [transform:translate3d(0,0,0)] transition-opacity duration-50",
        fade
          ? "[flex:0_0_100%]"
          : cn(
              "md:max-w-xl",
              "last:mr-4 md:last:mr-8",
              "[flex:0_0_calc(var(--carousel-slide-size,100%)-var(--carousel-peek,0px)*2)]",
              !isActive && "opacity-40"
            ),
        className
      )}
      {...props}
    />
  )
}

function useCarouselCounter() {
  const { api } = useCarousel()
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (!api) return
    setTotal(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())
    const onSelect = () => setCurrent(api.selectedScrollSnap())
    const onReInit = () => {
      setTotal(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap())
    }
    api.on("select", onSelect)
    api.on("reInit", onReInit)
    return () => {
      api.off("select", onSelect)
      api.off("reInit", onReInit)
    }
  }, [api])

  return { current, total }
}

function CarouselNavigation({ variant = "overlay", className }: { variant?: "overlay" | "inline"; className?: string }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()
  const { current, total } = useCarouselCounter()
  const leftRef = useRef<ChevronLeftIconHandle>(null)
  const rightRef = useRef<ChevronRightIconHandle>(null)

  if (total <= 1) return null

  // Mobile — prev/counter/next bar below the carousel
  if (variant === "inline") {
    return (
      <div 
        className={cn(
          "flex items-center justify-between",
          "md:max-w-3xl md:mx-auto",
          "lg:hidden",
          className
          )}>
        <Button
          variant="ghost"
          size="icon"
          className="static translate-y-0 rounded-full"
          disabled={!canScrollPrev}
          onClick={scrollPrev}
        >
          <ArrowLeft />
          <span className="sr-only">Previous slide</span>
        </Button>
        <span className="text-xs font-mono text-muted-foreground tracking-tighter tabular-nums select-none">
          {current + 1} / {total}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="static translate-y-0 rounded-full"
          disabled={!canScrollNext}
          onClick={scrollNext}
        >
          <ArrowRight />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>
    )
  }

  // lg+ — compact pill overlaid on the carousel image
  return (
    <div 
      className={cn(
        "flex items-center gap-2 bg-card rounded-lg origin-top-right",
        "will-change-transform transition-all duration-200",
        "xl:hover:scale-[1.1] xl:hover:bg-background", 
        className
      )}>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={scrollPrev}
        onMouseEnter={() => leftRef.current?.startAnimation()}
        onMouseLeave={() => leftRef.current?.stopAnimation()}
        disabled={!canScrollPrev}
        className="rounded-lg cursor-pointer dark:hover:bg-white/15"
      >
        <ChevronLeftIcon ref={leftRef} />
        <span className="sr-only">Previous slide</span>
      </Button>
      <span className="text-xs font-mono text-muted-foreground tracking-tighter tabular-nums select-none">
        {current + 1} / {total}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={scrollNext}
        onMouseEnter={() => rightRef.current?.startAnimation()}
        onMouseLeave={() => rightRef.current?.stopAnimation()}
        disabled={!canScrollNext}
        className="rounded-lg cursor-pointer dark:hover:bg-white/15"
      >
        <ChevronRightIcon ref={rightRef} />
        <span className="sr-only">Next slide</span>
      </Button>
    </div>
  )
}

// Responsive carousel — peek on mobile/md, fade on lg+
// CSS visibility handles which instance is active; context-aware classes prevent style conflicts
function ResponsiveCarousel({ loop, children }: { loop?: boolean; children: React.ReactNode }) {
  const slides = React.Children.toArray(children)

  const slideItems = slides.map((child, i) => (
    <CarouselItem key={i} index={i}>
      {child}
    </CarouselItem>
  ))

  return (
    <>
      <Carousel
        opts={{ align: "center", loop, containScroll: false }}
        navigation="inline"
        className="lg:hidden"
      >
        <CarouselContent viewportClassName="px-8 md:px-0">
          {slideItems}
        </CarouselContent>
      </Carousel>
      <Carousel
        opts={{ align: "center", loop, containScroll: false }}
        fade
        navigation="overlay"
        className="hidden lg:flex"
      >
        <CarouselContent>
          {slideItems}
        </CarouselContent>
      </Carousel>
    </>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  ResponsiveCarousel,
  useCarousel,
}