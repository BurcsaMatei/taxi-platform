// styles/skipLink.css.ts
import { style } from "@vanilla-extract/css";
import { vars } from "./tokens.css";

export const skipLinkClass = style({
  position: "fixed",
  top: 12,
  left: 12,
  zIndex: 10000,
  padding: "10px 14px",
  borderRadius: 8,
  background: vars.color.primary, // culoare brand
  color: "#fff",
  textDecoration: "none",
  lineHeight: 1.2,
  fontWeight: 600,
  transform: "translateY(-150%)",
  boxShadow: "0 10px 30px rgba(0,0,0,.18)",
  transition: "transform .15s ease, box-shadow .2s ease",
  selectors: {
    "&:hover": {
      boxShadow: "0 12px 34px rgba(0,0,0,.22)",
    },
    "&:focus-visible": {
      transform: "translateY(0)",
      outline: "3px solid #2563eb",
      outlineOffset: 2,
    },
  },
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});
