// styles/hero.css.ts
import { style } from "@vanilla-extract/css";

export const heroWrap = style({
  position: "relative",
  height: "clamp(320px, 55vh, 640px)", // default; îl poți suprascrie inline
  borderRadius: "16px",
  overflow: "hidden",
});

export const overlay = style({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.25) 100%)",
});

export const heroInner = style({
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center",
  textAlign: "center",
  color: "#fff",
  padding: "clamp(16px, 4vw, 32px)",
});

export const heroTitle = style({
  fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
  lineHeight: 1.15,
  margin: 0,
});

export const heroSub = style({
  fontSize: "clamp(1rem, 2vw, 1.25rem)",
  opacity: 0.9,
  marginTop: "0.75rem",
});
