// styles/blogLite.css.ts
import { style } from "@vanilla-extract/css";

export const containerClass = style({
  maxWidth: 1120,
  margin: "0 auto",
  padding: "24px 16px",
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
  height: 220,
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

export const titleClass = style({
  fontSize: 20,
  lineHeight: 1.2,
  padding: "8px 16px 0",
});

export const excerptClass = style({
  padding: "8px 16px 16px",
  color: "#374151",
  fontSize: 15,
});

export const pageHeaderClass = style({
  maxWidth: 820,
  margin: "0 auto",
  padding: "24px 0",
  textAlign: "center",
});

export const coverPageClass = style({
  position: "relative",
  width: "100%",
  height: 380,
  background: "#f3f4f6",
  borderRadius: 18,
  overflow: "hidden",
  margin: "0 auto",
});

export const articleClass = style({
  maxWidth: 820,
  margin: "24px auto 64px",
  fontSize: 18,
  lineHeight: 1.75,
  color: "#111827",
});
