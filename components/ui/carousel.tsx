"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import Fade from "embla-carousel-fade"
import { cn } from "@/lib/utils"
import { ArrowLeftIcon, type ArrowLeftIconHandle } from "@/components/ui/arrow-left"
import { ArrowRightIcon, type ArrowRightIconHandle } from "@/components/ui/arrow-right"

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

function CarouselNavButton({ direction, overlay, className, ...props }: React.ComponentProps<"button"> & { direction: "prev" | "next"; overlay?: boolean }) {
  const iconRef = useRef<ArrowLeftIconHandle | ArrowRightIconHandle>(null)
  const iconSize = overlay ? 14 : 16

  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous slide" : "Next slide"}
      className={cn(
        "inline-flex items-center justify-center transition-colors dark:xl:hover:bg-muted xl:hover:bg-muted",
        "disabled:pointer-events-none disabled:opacity-50",
        "active:scale-[0.97]",
        overlay
          ? cn(
              "size-7 cursor-pointer",
              direction === "prev"
                ? "rounded-l-md rounded-r-none"
                : "rounded-r-md rounded-l-none"
            )
          : "size-10 rounded-full",
        className
      )}
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
      {...props}
    >
      {direction === "prev"
        ? <ArrowLeftIcon ref={iconRef as React.Ref<ArrowLeftIconHandle>} size={iconSize} />
        : <ArrowRightIcon ref={iconRef as React.Ref<ArrowRightIconHandle>} size={iconSize} />
      }
    </button>
  )
}

function CarouselNavigation({ variant = "overlay", className }: { variant?: "overlay" | "inline"; className?: string }) {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel()
  const { current, total } = useCarouselCounter()
  const isOverlay = variant === "overlay"

  if (total <= 1) return null

  return (
    <div
      className={cn(
        "flex items-center",
        isOverlay
          ? cn(
              "gap-2 bg-card rounded-md origin-top-right",
              "will-change-transform transition-all duration-200",
              "xl:hover:scale-[1.1] xl:hover:bg-background xl:hover:shadow-xl"
            )
          : "justify-between md:max-w-3xl md:mx-auto lg:hidden",
        className
      )}
    >
      <CarouselNavButton direction="prev" overlay={isOverlay} disabled={!canScrollPrev} onClick={scrollPrev} />
      <span className="text-xs font-mono text-muted-foreground tracking-tighter tabular-nums select-none">
        {current + 1} / {total}
      </span>
      <CarouselNavButton direction="next" overlay={isOverlay} disabled={!canScrollNext} onClick={scrollNext} />
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