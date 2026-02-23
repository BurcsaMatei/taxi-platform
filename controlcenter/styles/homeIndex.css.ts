// controlcenter/styles/homeIndex.css.ts

// ==============================
// Imports
// ==============================
import { mq, vars } from "@taxi/tokens";
import { style } from "@vanilla-extract/css";

// ==============================
// Styles
// ==============================
export const page = style({
  minHeight: "100svh",
  display: "grid",
  alignContent: "start",
  gap: vars.space.xl,
  padding: vars.space.xl,
});

export const hero = style({
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  boxShadow: vars.shadow.md,
  padding: vars.space.xxl,
});

export const heroInner = style({
  maxWidth: 860,
});

export const title = style({
  margin: 0,
  fontSize: "clamp(28px, 4vw, 44px)",
  lineHeight: 1.05,
  fontWeight: 900,
  letterSpacing: "-0.02em",
});

export const subtitle = style({
  margin: 0,
  marginTop: vars.space.sm,
  fontSize: "clamp(14px, 1.6vw, 18px)",
  fontWeight: 900,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: vars.color.muted,
});

export const lead = style({
  marginTop: vars.space.lg,
  marginBottom: 0,
  fontSize: "clamp(16px, 1.8vw, 18px)",
  fontWeight: 700,
  color: vars.color.text,
  maxWidth: 720,
});

export const ctaSection = style({
  width: "100%",
});

export const ctaGrid = style({
  display: "grid",
  gap: vars.space.lg,
  gridTemplateColumns: "1fr",
  "@media": {
    [mq.md]: {
      gridTemplateColumns: "1fr 1fr",
    },
  },
});

export const ctaCard = style({
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  padding: vars.space.xxl,
  display: "grid",
  gap: vars.space.sm,
  boxShadow: vars.shadow.md,
  transition: `transform ${vars.motion.normal} ${vars.motion.easing.standard}, background-color ${vars.motion.normal} ${vars.motion.easing.standard}`,
  selectors: {
    "&:hover": {
      transform: "translateY(-2px)",
      background: vars.color.surfaceHover,
    },
    "&:active": { transform: "translateY(0px)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 3 },
  },
});

export const ctaKicker = style({
  fontSize: vars.typography.size.sm,
  fontWeight: 900,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: vars.color.muted,
});

export const ctaTitle = style({
  fontSize: "clamp(22px, 2.6vw, 30px)",
  lineHeight: 1.1,
  fontWeight: 900,
  letterSpacing: "-0.01em",
});

export const ctaDesc = style({
  fontSize: vars.typography.size.md,
  fontWeight: 700,
  color: vars.color.muted,
  maxWidth: 520,
});
