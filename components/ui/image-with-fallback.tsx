"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type ImageWithFallbackProps = React.ComponentProps<typeof Image> & {
  skeletonClassName?: string;
  wrapperClassName?: string;
};

export function ImageWithFallback({
  skeletonClassName,
  wrapperClassName,
  className,
  onLoad,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const isPriority = !!props.priority;
  const [isLoaded, setIsLoaded] = useState(isPriority);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    onError?.(e);
  };

  const showOverlay = !isLoaded || hasError;

  const overlay = showOverlay && (
    <Skeleton
      className={cn(
        "absolute inset-0 z-10 flex items-center justify-center",
        hasError && "animate-none",
        skeletonClassName
      )}
    >
      <div className="relative flex items-center justify-center">
        <ImageIcon className="size-24 text-muted-foreground opacity-10 absolute" />
        {!hasError && <Spinner className="size-8 text-muted-foreground" />}
      </div>
    </Skeleton>
  );

  // Fill mode: parent controls dimensions, skeleton siblings the image
  if (props.fill) {
    return (
      <>
        {!hasError && (
          <Image
            {...props}
            fill
            className={cn(className, !isLoaded && "invisible")}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}
        {overlay}
      </>
    );
  }

  // Width/height mode: wrapper preserves image's natural layout
  return (
    <span className={cn("relative block", wrapperClassName)}>
      {!hasError ? (
        <Image
          {...props}
          className={cn(className, !isLoaded && "invisible")}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <span
          className="block w-full"
          style={{
            aspectRatio: `${props.width} / ${props.height}`,
          }}
        />
      )}
      {overlay}
    </span>
  );
}
