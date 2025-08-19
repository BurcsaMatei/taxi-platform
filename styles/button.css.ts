// styles/button.css.ts
import { style } from "@vanilla-extract/css";
import { vars } from "./tokens.css";

/**
 * Bază comună pentru toate butoanele (link <a> sau <button>)
 * - focus accesibil (WCAG)
 * - padding, radius, font
 * - tranziții discrete (dezactivate la prefers-reduced-motion)
 */
const baseButton = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,

  padding: "10px 16px",
  borderRadius: 12,
  border: "1px solid transparent",

  fontFamily: vars.font.base,
  fontWeight: 700,
  fontSize: "15px",
  lineHeight: 1.2,
  textDecoration: "none",
  whiteSpace: "nowrap",

  cursor: "pointer",
  userSelect: "none",
  WebkitTapHighlightColor: "transparent",

  transition: "background-color .18s ease, color .18s ease, border-color .18s ease, box-shadow .18s ease, transform .08s ease",

  selectors: {
    "&:focus-visible": {
      outline: "3px solid #2563eb",
      outlineOffset: 2,
    },
    "&:active": {
      transform: "translateY(1px)",
    },
    "&:disabled, &[aria-disabled='true']": {
      opacity: 0.6,
      cursor: "not-allowed",
      pointerEvents: "none",
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transition: "none",
    },
  },
});

/**
 * Variantă PRIMARY
 * - fundal brand, text alb
 * - hover: ușor mai întunecat / secundar
 */
const primary = style([
  baseButton,
  {
    background: vars.color.primary,
    color: "#fff",
    borderColor: vars.color.primary,
    boxShadow: "0 8px 22px rgba(85,97,242,0.22)",

    selectors: {
      "&:hover:not(:disabled):not([aria-disabled='true'])": {
        background: vars.color.secondary, // poți înlocui cu o nuanță mai închisă a brandului
        borderColor: vars.color.secondary,
        boxShadow: "0 10px 26px rgba(85,97,242,0.28)",
      },
      "&:active:not(:disabled):not([aria-disabled='true'])": {
        transform: "translateY(1px)",
        boxShadow: "0 8px 20px rgba(85,97,242,0.22)",
      },
    },
  },
]);

/**
 * Variantă SECONDARY
 * - fundal alb, border color → brand
 * - hover: fundal subtil gri deschis
 */
const secondary = style([
  baseButton,
  {
    background: "#fff",
    color: vars.color.primary,
    borderColor: vars.color.primary,
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",

    selectors: {
      "&:hover:not(:disabled):not([aria-disabled='true'])": {
        background: "#f3f4f6",
        borderColor: vars.color.secondary,
        color: vars.color.secondary,
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      },
      "&:active:not(:disabled):not([aria-disabled='true'])": {
        transform: "translateY(1px)",
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
      },
    },
  },
]);

/**
 * Export map pentru componenta <Button />
 * Folosire: className={buttonClass.primary} / .secondary
 */
export const buttonClass = {
  primary,
  secondary,
};
