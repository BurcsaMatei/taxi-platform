import Img from "./ui/Img";
import { cardClass, cardCaptionClass } from "../styles/card.css";
import { imageWrap } from "../styles/cardImageWrap.css";

type CardProps = {
  src?: string;       // ex: "/images/card.jpg" (din /public)
  alt?: string;
  caption?: string;
  priority?: boolean; // true DOAR pentru prima imagine vizibilă în viewport
  sizes?: string;     // override opțional din grid/părinte
  quality?: number;   // 1-100 (default 75)
};

const Card = ({
  src = "/images/card.jpg",
  alt = "Imagine card",
  caption = "Comentariu sau titlu aici",
  priority = false,
  sizes,
  quality = 75,
}: CardProps) => (
  <div className={cardClass}>
    <div className={imageWrap}>
      <Img
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"}
        style={{ objectFit: "cover" }}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        quality={quality}
      />
    </div>
    <div className={cardCaptionClass}>{caption}</div>
  </div>
);

export default Card;
