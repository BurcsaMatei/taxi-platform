import { style } from "@vanilla-extract/css";
import { vars } from "../tokens.css";

// Grid wrapper (3/2/1 coloane) + spacing adaptiv
export const contactGridClass = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: vars.spacing.lg,
  marginTop: vars.spacing.lg,

  "@media": {
    "screen and (max-width: 900px)": { gridTemplateColumns: "repeat(2, 1fr)" },
    "screen and (max-width: 600px)": {
      gridTemplateColumns: "1fr",
      gap: vars.spacing.md,
      marginTop: vars.spacing.md,
    },
  },
});

// Card (hover fin; shadow + border + mic translateY)
export const contactItemClass = style({
  background: vars.color.background,
  border: `1px solid ${vars.color.secondary}`,
  borderRadius: vars.radius.base,
  padding: vars.spacing.lg,
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  transition: "transform .25s ease, box-shadow .25s ease, border-color .25s ease",
  selectors: {
    "&:hover": {
      transform: "translateY(-2px) scale(1.015)",
      boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
      borderColor: vars.color.primary,
    },
  },

  "@media": {
    "screen and (max-width: 600px)": {
      padding: vars.spacing.md,
    },
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

// Titlu card
export const cardTitleClass = style({
  fontWeight: 600,
  fontFamily: vars.font.heading,
  fontSize: "1.1rem",
  margin: 0,
  color: vars.color.primary,

  "@media": {
    "screen and (max-width: 600px)": {
      fontSize: "1rem",
    },
  },
});

// Icon stânga
export const contactIconClass = style({
  flexShrink: 0,
  width: "26px",
  height: "26px",
  color: vars.color.primary,
});

// Text
export const contactTextClass = style({
  fontFamily: vars.font.base,
  fontSize: "15px",
  color: vars.color.text,
  lineHeight: 1.5,

  "@media": {
    "screen and (max-width: 600px)": {
      fontSize: "14px",
      lineHeight: 1.45,
    },
  },
});
