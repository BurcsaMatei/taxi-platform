// styles/articlesPreview.css.ts
import { style } from "@vanilla-extract/css";
import { container } from "./container.css"; // container global

export const sectionClass = style([
  container,
  {
    padding: "40px 16px",
  },
]);

export const headerClass = style({
  textAlign: "center",
  marginBottom: 32,
});

export const titleClass = style({
  fontSize: 28,
  lineHeight: 1.2,
  margin: 0,
});

export const subtitleClass = style({
  color: "#4b5563",
  marginTop: 6,
  fontSize: 16,
});

export const gridClass = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: 20,
  "@media": {
    "screen and (min-width: 768px)": { gridTemplateColumns: "1fr 1fr" },
    "screen and (min-width: 1200px)": { gridTemplateColumns: "1fr 1fr 1fr" },
  },
});

export const cardClass = style({
  borderRadius: 18,
  overflow: "hidden",
  background: "white",
  boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
  selectors: { "&:hover": { transform: "translateY(-2px)", boxShadow: "0 6px 26px rgba(0,0,0,0.10)" } },
  transition: "transform .2s ease, box-shadow .2s ease",
});

export const coverClass = style({
  position: "relative",
  width: "100%",
  height: 200,
  background: "#f3f4f6",
});

export const metaRowClass = style({
  display: "flex",
  gap: 8,
  alignItems: "center",
  color: "#6b7280",
  fontSize: 13,
  padding: "12px 16px 0",
});

export const cardTitleClass = style({
  fontSize: 18,
  lineHeight: 1.2,
  padding: "8px 16px 0",
});

export const excerptClass = style({
  padding: "8px 16px 16px",
  color: "#374151",
  fontSize: 15,
});

export const ctaRowClass = style({
  display: "flex",
  justifyContent: "center",
  marginTop: 32,
});

export const emptyClass = style({
  padding: "20px",
  borderRadius: 12,
  background: "#f9fafb",
  color: "#6b7280",
  textAlign: "center",
});
