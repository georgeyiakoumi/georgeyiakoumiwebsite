"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ZoomableImageProps {
  children: React.ReactNode;
  src: string;
  alt: string;
  width: number;
  height: number;
}

function ZoomControls({ onClose }: { onClose: () => void }) {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="fixed top-4 right-4 z-[60] flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => zoomIn()}
        className="size-10 bg-white/15 text-white backdrop-blur-sm xl:hover:bg-white/25"
        aria-label="Zoom in"
      >
        <ZoomIn className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => zoomOut()}
        className="size-10 bg-white/15 text-white backdrop-blur-sm xl:hover:bg-white/25"
        aria-label="Zoom out"
      >
        <ZoomOut className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => resetTransform()}
        className="size-10 bg-white/15 text-white backdrop-blur-sm xl:hover:bg-white/25"
        aria-label="Reset zoom"
      >
        <RotateCcw className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="size-10 bg-white/15 text-white backdrop-blur-sm xl:hover:bg-white/25"
        aria-label="Close zoom view"
      >
        <X className="size-5" />
      </Button>
    </div>
  );
}

export function ZoomableImage({ children, src, alt, width, height }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    },
    [handleClose]
  );

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="relative group cursor-zoom-in w-full"
        aria-label={`Zoom into ${alt}`}
      >
        {children}
        <span className="absolute bottom-3 right-3 flex items-center justify-center size-8 rounded-full bg-black/50 text-white backdrop-blur-sm opacity-70 xl:group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <ZoomIn className="size-4" />
        </span>
      </button>

      {isOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Zoomed view of ${alt}`}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
          >
            <TransformWrapper
              initialScale={1}
              minScale={0.5}
              maxScale={6}
              centerOnInit
              doubleClick={{ mode: "zoomIn", step: 1.5 }}
              wheel={{ step: 0.15 }}
              panning={{ velocityDisabled: false }}
            >
              <ZoomControls onClose={handleClose} />
              <TransformComponent
                wrapperClass="!w-screen !h-screen"
                contentClass="!w-screen !h-screen flex items-center justify-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  className={cn(
                    "max-w-full max-h-full object-contain select-none",
                    width > height ? "w-full h-auto" : "h-full w-auto"
                  )}
                  draggable={false}
                />
              </TransformComponent>
            </TransformWrapper>
          </div>,
          document.body
        )}
    </>
  );
}
