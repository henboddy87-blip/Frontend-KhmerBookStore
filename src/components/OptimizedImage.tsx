import React, { useState, useEffect, useRef } from "react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  fallbackSrc?: string;
  aspectRatio?: "3/4" | "1/1" | "16/9" | "auto";
  priority?: boolean;
}

const DEFAULT_FALLBACK = "/images/personal-development/1.jpg";

export function OptimizedImage({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  fallbackSrc = DEFAULT_FALLBACK,
  aspectRatio = "3/4",
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Check if image is already cached by browser
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [currentSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  const aspectClass =
    aspectRatio === "3/4"
      ? "aspect-[3/4]"
      : aspectRatio === "1/1"
      ? "aspect-square"
      : aspectRatio === "16/9"
      ? "aspect-video"
      : "";

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${aspectClass} ${wrapperClassName}`}
    >
      {/* Shimmer Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-shimmer" />
      )}

      <img
        ref={imgRef}
        src={currentSrc || fallbackSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-contain transition-all duration-500 ${
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
