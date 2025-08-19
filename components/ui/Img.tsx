// components/ui/image.tsx
import Image, { type ImageProps } from "next/image";
import React from "react";

interface ImgProps
  extends Omit<
    ImageProps,
    "src" | "alt" | "loading" | "priority" | "fetchPriority" | "decoding"
  > {
  /** ex: "/images/card.jpg" (din /public) */
  src: string;
  /** text alternativ accesibil */
  alt: string;
  /** Marchează imaginea ca LCP/above-the-fold (face preload automat) */
  priority?: boolean;
  /** ex: "(max-width: 768px) 100vw, 33vw" */
  sizes?: string;
  /** 1–100 (default 75) */
  quality?: number;
  /** className opțional */
  className?: string;
  /** override rar pentru fetchPriority (în mod normal nu e necesar) */
  fetchPriority?: "high" | "low" | "auto";
  /** placeholder next/image: "empty" (default) sau "blur" + blurDataURL */
  placeholder?: ImageProps["placeholder"];
  blurDataURL?: ImageProps["blurDataURL"];
}

const Img: React.FC<ImgProps> = ({
  src,
  alt,
  priority = false,
  sizes = "100vw",
  quality = 75,
  className,
  fetchPriority,
  placeholder = "empty",
  blurDataURL,
  ...rest
}) => {
  const isPriority = !!priority;
  const resolvedFetchPriority =
    fetchPriority ?? (isPriority ? "high" : "auto");

  return (
    <Image
      src={src}
      alt={alt}
      // Performance flags
      decoding="async"
      priority={isPriority}
      loading={isPriority ? undefined : "lazy"}
      fetchPriority={resolvedFetchPriority}
      // Quality & responsive behavior
      sizes={sizes}
      quality={quality}
      // Placeholder handling
      placeholder={placeholder}
      blurDataURL={placeholder === "blur" ? blurDataURL : undefined}
      // Styling / other props
      className={className}
      {...rest}
    />
  );
};

export default Img;
