// components/Card.tsx
import React from "react";
import Img from "./ui/Img";
import { cardClass, cardCaptionClass } from "../styles/card.css";
import { imageWrap } from "../styles/cardImageWrap.css";

type CardProps = {
  src?: string;
  alt?: string;
  caption?: React.ReactNode;
  captionClassName?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
};

const Card = ({
  src = "/images/card.jpg",
  alt = "Imagine card",
  caption = "Comentariu sau titlu aici",
  captionClassName,
  priority = false,
  sizes,
  quality = 75,
}: CardProps) => (
  <div className={cardClass}>
    {/* Imaginea full-bleed */}
    <div className={imageWrap}>
      <Img
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"}
        style={{ objectFit: "cover" }}
        priority={priority}
        
        quality={quality}
      />
    </div>

    {/* Caption cu padding separat */}
    <div className={[cardCaptionClass, captionClassName].filter(Boolean).join(" ")}>
  {caption}
</div>

  </div>
);

export default Card;
