import { style } from "@vanilla-extract/css";
import { vars } from "./tokens.css";

export const errorWrap = style({
  minHeight: "50vh",
  display: "grid",
  placeItems: "center",
  textAlign: "center",
  color: vars.color.text,
});

export const errorCard = style({
  background: "#fff",
  border: `1px solid ${vars.color.primary}`,
  borderRadius: vars.radius.base,
  padding: "28px 24px",
  boxShadow: "0 10px 32px rgba(40,50,80,0.08)",
  maxWidth: 540,
});

export const errorTitle = style({
  fontFamily: vars.font.heading,
  fontSize: "1.8rem",
  marginBottom: 8,
});

export const errorText = style({
  opacity: 0.85,
  marginBottom: 16,
});

export const errorLink = style({
  color: vars.color.primary,
  textDecoration: "none",
  fontWeight: 600,
});

