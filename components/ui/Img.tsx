import Image, { ImageProps } from "next/image";

type Variant = "hero" | "card" | "thumb" | "icon";

const PRESETS: Record<Variant, { sizes: string; fill?: boolean }> = {
  hero: {
    sizes: "100vw",
    fill: true,
  },
  card: {
    sizes:
      "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  },
  thumb: {
    sizes:
      "(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px",
  },
  icon: {
    sizes: "48px",
  },
};

export type ImgProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
  variant?: Variant;
  cover?: boolean;        // object-fit: cover
  priority?: boolean;
};

export default function Img({
  src,
  alt,
  variant = "card",
  sizes,
  fill,
  cover,
  priority,
  style,
  ...rest
}: ImgProps) {
  const preset = PRESETS[variant];
  const computedSizes = sizes ?? preset.sizes;
  const computedFill = fill ?? preset.fill ?? false;

  return (
    <Image
      src={src}
      alt={alt}
      sizes={computedSizes}
      fill={computedFill}
      priority={priority}
      style={{
        objectFit: cover ? "cover" : undefined,
        ...style,
      }}
      {...rest}
    />
  );
}
