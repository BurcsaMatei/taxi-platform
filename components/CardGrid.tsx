// components/CardGrid.tsx
import React from "react";
import Card from "./Card";
import { cardGridClass } from "../styles/cardGrid.css";

export type CardGridItem = {
  id?: string | number;
  src: string;
  alt: string;
  caption?: React.ReactNode;   // 🔹 acum acceptă ReactNode
  sizes?: string;
  priority?: boolean;
};

type CardGridProps = {
  cards: CardGridItem[];
  className?: string;
  "aria-label"?: string;
  sizes?: string;
  aboveTheFold?: boolean;
  captionClassName?: string;   // 🔹 nou: putem trece o clasă pentru caption
  onItemClick?: (index: number, item: CardGridItem) => void;
};

const DEFAULT_SIZES =
  "(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 290px";

const CardGrid: React.FC<CardGridProps> = ({
  cards,
  className,
  "aria-label": ariaLabel = "Card grid",
  sizes = DEFAULT_SIZES,
  aboveTheFold = false,
  captionClassName,
  onItemClick,
}) => {
  const cls = [cardGridClass, className].filter(Boolean).join(" ");

  return (
    <section aria-label={ariaLabel}>
      <ul className={cls}>
        {cards.map((item, idx) => {
          const isFirst = idx === 0 && aboveTheFold;
          const priority = item.priority ?? isFirst;
          const quality = priority ? 75 : 60;

          const cardEl = (
            <Card
              src={item.src}
              alt={item.alt}
              caption={item.caption}
              captionClassName={captionClassName}  // 🔹 pasăm clasa
              priority={priority}
              sizes={item.sizes ?? sizes}
              quality={quality}
            />
          );

          return (
            <li key={item.id ?? idx}>
              {onItemClick ? (
                <button
                  type="button"
                  aria-label={`Deschide ${typeof item.caption === "string" ? item.caption : "cardul"}`}
                  onClick={() => onItemClick(idx, item)}
                  style={{ all: "unset", cursor: "pointer", display: "block", width: "100%" }}
                >
                  {cardEl}
                </button>
              ) : (
                cardEl
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default CardGrid;
