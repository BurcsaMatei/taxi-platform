// styles/blogCardCaption.css.ts
import { style } from "@vanilla-extract/css";
import { cardCaptionClass } from "./card.css";

// wrapper-ul caption-ului moștenește stilul global de cardCaption și adaugă fine-tuning pt blog
export const blogCaptionWrapClass = style([
  cardCaptionClass,
  {
    textAlign: "left", // dacă vrei centru, șterge această linie
    padding: "14px 16px",
  },
]);

export const blogTitleClass = style({
  fontSize: "1rem",
  fontWeight: 700,
  color: "#111827",
  margin: 0,
  marginBottom: 6,
  lineHeight: 1.3,
  // clamp la 2 linii ca să nu umfle cardul
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const blogMetaClass = style({
  fontSize: 13,
  color: "#6b7280",
  marginBottom: 6,
});

export const blogExcerptClass = style({
  fontSize: 15,
  lineHeight: 1.5,
  // clamp la 3 rânduri + „...”
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  // înălțime minimă pentru aliniere (≈ 3 rânduri × 1.5em)
  minHeight: "4.5em",
});
