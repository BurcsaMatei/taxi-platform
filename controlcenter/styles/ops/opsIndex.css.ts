// controlcenter/styles/ops/opsIndex.css.ts

// ==============================
// Imports
// ==============================
import { mq, vars } from "@taxi/tokens";
import { style } from "@vanilla-extract/css";

// ==============================
// Styles (migrat din homeIndex + extensii)
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

export const mono = style({
  fontFamily: vars.typography.font.mono,
  fontWeight: 900,
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

// ==============================
// New: session row (top hero)
// ==============================
export const sessionRow = style({
  marginTop: vars.space.lg,
  display: "flex",
  alignItems: "center",
  gap: vars.space.sm,
  flexWrap: "wrap",
});

export const sessionPill = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.sm,
  paddingInline: 12,
  paddingBlock: 8,
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  fontWeight: 900,
  fontSize: 13,
  whiteSpace: "nowrap",
});

export const sessionPillMuted = style({
  display: "inline-flex",
  alignItems: "center",
  gap: vars.space.sm,
  paddingInline: 12,
  paddingBlock: 8,
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  fontWeight: 900,
  fontSize: 13,
  whiteSpace: "nowrap",
  color: vars.color.muted,
});

export const sessionBtn = style({
  height: 40,
  paddingInline: vars.space.lg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  color: vars.color.text,
  fontWeight: 900,
  cursor: "pointer",
  selectors: {
    "&:hover": { background: vars.color.surfaceActive },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

// ==============================
// New: panels
// ==============================
export const panelCard = style({
  borderRadius: vars.radius.xl,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  padding: vars.space.xxl,
  display: "grid",
  gap: vars.space.md,
  boxShadow: vars.shadow.md,
});

export const panelTopRow = style({
  display: "grid",
  gap: vars.space.md,
  alignItems: "start",
  "@media": {
    [mq.md]: {
      gridTemplateColumns: "1fr auto",
      alignItems: "center",
    },
  },
});

export const panelLeft = style({
  display: "grid",
  gap: 6,
  minWidth: 0,
});

export const panelRight = style({
  display: "grid",
  gap: vars.space.sm,
  minWidth: 0,
  "@media": {
    [mq.md]: {
      minWidth: 320,
    },
  },
});

export const panelKicker = style({
  fontSize: vars.typography.size.sm,
  fontWeight: 900,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: vars.color.muted,
});

export const panelTitle = style({
  fontSize: "clamp(18px, 2.2vw, 26px)",
  lineHeight: 1.1,
  fontWeight: 900,
  letterSpacing: "-0.01em",
});

export const panelDesc = style({
  fontSize: vars.typography.size.md,
  fontWeight: 700,
  color: vars.color.muted,
  maxWidth: 720,
});

// ==============================
// New: form controls
// ==============================
export const form = style({
  display: "grid",
  gap: vars.space.md,
  marginTop: vars.space.sm,
  maxWidth: 520,
});

export const field = style({
  display: "grid",
  gap: vars.space.sm,
});

export const label = style({
  fontSize: 12,
  fontWeight: 900,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: vars.color.muted,
});

export const input = style({
  height: 44,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  paddingInline: vars.space.md,
  fontFamily: vars.typography.font.mono,
  fontWeight: 900,
  outline: "none",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const primaryBtn = style({
  height: 44,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  color: vars.color.text,
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: vars.shadow.md,
  selectors: {
    "&:hover": { background: vars.color.surfaceActive },
    "&:disabled": { opacity: 0.7, cursor: "not-allowed" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const alert = style({
  padding: vars.space.sm,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  fontWeight: 800,
  color: vars.color.muted,
  overflowWrap: "anywhere",
});

// ==============================
// New: cities list
// ==============================
export const search = style({
  height: 44,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  paddingInline: vars.space.md,
  fontWeight: 900,
  outline: "none",
  selectors: {
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const cityList = style({
  display: "grid",
  gap: vars.space.md,
  marginTop: vars.space.sm,
});

export const cityRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: vars.space.lg,
  padding: vars.space.md,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  boxShadow: vars.shadow.sm,
});

export const cityMeta = style({
  display: "grid",
  gap: 4,
  minWidth: 0,
});

export const cityName = style({
  fontWeight: 900,
});

export const cityId = style({
  display: "flex",
  gap: vars.space.md,
  alignItems: "baseline",
  flexWrap: "wrap",
  color: vars.color.muted,
  fontWeight: 900,
});

export const cityPhone = style({
  color: vars.color.muted,
  fontWeight: 900,
});

export const cityActions = style({
  display: "flex",
  gap: vars.space.sm,
  flexWrap: "wrap",
});

export const cityLinkBtn = style({
  height: 40,
  display: "inline-flex",
  alignItems: "center",
  paddingInline: vars.space.lg,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  color: vars.color.text,
  fontWeight: 900,
  textDecoration: "none",
  cursor: "pointer",
  selectors: {
    "&:hover": { background: vars.color.surfaceActive },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const empty = style({
  padding: vars.space.lg,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
  color: vars.color.muted,
  fontWeight: 900,
});

// ==============================
// New: quick links
// ==============================
export const quickRow = style({
  marginTop: vars.space.md,
  display: "flex",
  gap: vars.space.md,
  flexWrap: "wrap",
});

export const quickLink = style({
  fontFamily: vars.typography.font.mono,
  fontWeight: 900,
  fontSize: 12,
  color: vars.color.link,
  textDecoration: "none",
  selectors: {
    "&:hover": { color: vars.color.linkHover },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});
