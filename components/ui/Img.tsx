import Image, { ImageProps } from "next/image";
import React from "react";

interface ImgProps extends Omit<ImageProps, "src" | "alt"> {
  src: string;          // ex: "/images/card.jpg" (din /public)
  alt: string;          // text alternativ
  priority?: boolean;   // true doar pentru prima imagine importantă
  sizes?: string;       // ex: "(max-width: 768px) 100vw, 33vw"
  quality?: number;     // 1–100 (default 75)
  className?: string;   // stiluri custom dacă ai nevoie
}

const Img: React.FC<ImgProps> = ({
  src,
  alt,
  priority = false,
  sizes = "100vw", // se poate suprascrie din părinte
  quality = 75,
  className,
  ...props
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      sizes={sizes}
      quality={quality}
      className={className}
      loading={priority ? undefined : "lazy"} // lazy dacă nu e priority
      decoding="async"
      {...props}
    />
  );
};

export default Img;
