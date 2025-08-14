import { style } from "@vanilla-extract/css";
import { vars } from "../tokens.css";

export const form = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
  padding: 0,
});

export const group = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const label = style({
  fontWeight: 500,
  fontFamily: vars.font.base,
  fontSize: "15px",           // hardcode, pentru că nu ai încă size în tokens
  color: vars.color.primary,
  marginBottom: 2,
});

export const input = style({
  border: `1px solid ${vars.color.secondary}`,
  borderRadius: vars.radius.base,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  fontFamily: vars.font.base,
  fontSize: "15px",           // hardcode până adaugi în tokens
  color: vars.color.text,
  background: vars.color.background,
  outline: "none",
  transition: "border-color .2s",
  selectors: {
    "&:focus": {
      borderColor: vars.color.primary,
    },
  },
});

export const textarea = style([
  input,
  {
    minHeight: 90,
    resize: "vertical",
  },
]);

export const button = style({
  alignSelf: "flex-start",
  background: vars.color.primary,
  color: "#fff",
  border: "none",
  padding: `${vars.spacing.sm} ${vars.spacing.lg}`,
  borderRadius: vars.radius.base,
  fontWeight: 600,
  fontFamily: vars.font.base,
  fontSize: "15px",
  cursor: "pointer",
  transition: "background .2s",
  selectors: {
    "&:hover:not(:disabled)": {
      background: vars.color.secondary,
    },
    "&:disabled": {
      opacity: 0.7,
      cursor: "wait",
    },
  },
});

export const error = style({
  color: "#d42b2b",
  fontWeight: 500,
  fontFamily: vars.font.base,
  fontSize: "14px",
  marginTop: 2,
});
export const success = style({
  color: "#219150",
  fontWeight: 500,
  fontFamily: vars.font.base,
  fontSize: "14px",
  marginTop: 2,
});
