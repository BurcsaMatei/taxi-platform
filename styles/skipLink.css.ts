import { style } from "@vanilla-extract/css";
import { vars } from "./tokens.css";

export const skipLinkClass = style({
  position: "fixed",
  top: 8,
  left: 8,
  zIndex: 10000,
  padding: "8px 12px",
  borderRadius: 8,
  background: vars.color.primary,
  color: "#fff",
  textDecoration: "none",
  outline: "none",
  transform: "translateY(-150%)",
  transition: "transform .18s ease",
  selectors: {
    "&:focus": { transform: "translateY(0)" },
  },
});

