// styles/blueprint/blueprintHud.css.ts

// ==============================
// Imports
// ==============================
import { style } from "@vanilla-extract/css";

import { mq, vars } from "../theme.css";

// ==============================
// Constante
// ==============================
const DOCK_W = "clamp(220px, 22vw, 320px)";

// ==============================
// Classes
// ==============================
export const hud = style({
  position: "absolute",
  left: vars.space.md,
  right: vars.space.md,
  bottom: vars.space.md,
  zIndex: vars.z.overlay,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.radius.xl,
  background: vars.color.surface,
  boxShadow: vars.shadow.md,
  overflow: "hidden",

  maxHeight: 56,
  transform: "translate3d(0, 0, 0)",
  transition: `max-height ${vars.motion.fast} ${vars.motion.easing.standard}`,

  "@media": {
    [mq.md]: {
      position: "relative",
      left: "auto",
      right: "auto",
      bottom: "auto",

      zIndex: "auto",
      borderRadius: vars.radius.xl,
      boxShadow: vars.shadow.sm,

      width: DOCK_W,
      height: "100%",
      maxHeight: "none",
      transition: "none",
      transform: "none",
    },
  },
});

export const hudOpen = style({
  maxHeight: "62svh",
});

export const hudInner = style({
  display: "grid",
  gridTemplateRows: "auto 1fr",
  gap: vars.space.sm,
  padding: vars.space.sm,

  "@media": {
    [mq.md]: {
      height: "100%",
      padding: vars.space.md,
      gap: vars.space.md,
    },
  },
});

export const hudHandle = style({
  appearance: "none",
  border: 0,
  background: "transparent",
  cursor: "pointer",
  width: "100%",
  height: 40,
  display: "grid",
  placeItems: "center",
  padding: 0,

  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: 2,
      borderRadius: vars.radius.lg,
    },
  },

  "@media": {
    [mq.md]: {
      display: "none",
    },
  },
});

export const hudHandlePill = style({
  width: 56,
  height: 6,
  borderRadius: 999,
  background: "rgba(127,127,127,0.28)",
});

export const hudHandleArrow = style({
  width: 10,
  height: 10,
  marginTop: 8,
  borderRight: "2px solid rgba(0,0,0,0.6)",
  borderBottom: "2px solid rgba(0,0,0,0.6)",
  transform: "rotate(45deg)",
  transition: `transform ${vars.motion.fast} ${vars.motion.easing.standard}`,

  selectors: {
    [`${hudOpen} &`]: {
      transform: "rotate(225deg)",
    },
  },
});

export const hudContent = style({
  display: "grid",
  gap: vars.space.md,
  overflow: "auto",
  paddingBottom: vars.space.sm,

  "@media": {
    [mq.md]: {
      overflow: "auto",
      paddingBottom: 0,
    },
  },
});

export const hudDistricts = style({
  display: "grid",
  gridAutoFlow: "row",
  gap: vars.space.md,
});

/** Reset btn */
export const hudBtn = style({
  justifySelf: "start",
  border: `1px solid ${vars.color.border}`,
  borderRadius: 999,
  padding: "8px 12px",
  background: "transparent",
  color: "inherit",
  fontWeight: 800,
  lineHeight: 1,
  cursor: "pointer",
  transition: `transform ${vars.motion.fast} ${vars.motion.easing.standard}, background-color ${vars.motion.fast} ${vars.motion.easing.standard}`,
  selectors: {
    "&:hover": {
      transform: "translateY(-1px)",
      backgroundColor: "rgba(127,127,127,0.10)",
    },
    "&:active": {
      transform: "translateY(0px)",
      backgroundColor: "rgba(127,127,127,0.14)",
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: 2,
    },
  },
});

// ==============================
// Accordion
// ==============================
export const accWrap = style({
  display: "grid",
  gap: 8,
});

export const accHeader = style({
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: 10,
  alignItems: "center",
});

export const accToggle = style({
  appearance: "none",
  border: `1px solid ${vars.color.border}`,
  borderRadius: 12,
  background: "transparent",
  cursor: "pointer",
  padding: "10px 12px",
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  fontWeight: 900,
  fontSize: 12,
  lineHeight: 1,
  selectors: {
    "&:hover": { background: "rgba(127,127,127,0.10)" },
    "&:active": { background: "rgba(127,127,127,0.14)" },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: 2,
    },
  },
});

export const accToggleLabel = style({
  opacity: 0.85,
});

export const accChevron = style({
  width: 10,
  height: 10,
  borderRight: "2px solid rgba(0,0,0,0.6)",
  borderBottom: "2px solid rgba(0,0,0,0.6)",
  transform: "rotate(45deg)",
  transition: `transform ${vars.motion.fast} ${vars.motion.easing.standard}`,
  selectors: {
    [`${accToggle}[aria-expanded="true"] &`]: {
      transform: "rotate(225deg)",
    },
  },
});

export const accBody = style({
  overflow: "hidden",
  maxHeight: 0,
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: "rgba(127,127,127,0.06)",
  transition: `max-height ${vars.motion.fast} ${vars.motion.easing.standard}`,
});

export const accBodyOpen = style({
  // suficient pentru 3–12 elemente; scroll în interior
  maxHeight: "360px",
});

export const accBodyInner = style({
  padding: vars.space.md,
  display: "grid",
  gap: vars.space.sm,
  overflow: "auto",
  maxHeight: 360,
});

export const accEmpty = style({
  margin: 0,
  fontSize: 12,
  opacity: 0.78,
});

export const accList = style({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gap: vars.space.sm,
});

export const accItem = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  padding: vars.space.md,
  display: "grid",
  gap: vars.space.sm,
});

export const accItemMain = style({
  display: "grid",
  gap: 2,
});

export const accItemTitle = style({
  margin: 0,
  fontSize: 13,
  fontWeight: 900,
  lineHeight: 1.2,
});

export const accItemDesc = style({
  margin: 0,
  fontSize: 12,
  opacity: 0.82,
  lineHeight: 1.35,
});

export const accItemActions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: vars.space.sm,
});

export const accActionPrimary = style({
  textDecoration: "none",
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  padding: "9px 12px",
  fontWeight: 900,
  lineHeight: 1,
  selectors: {
    "&:hover": { background: "rgba(127,127,127,0.10)" },
    "&:active": { background: "rgba(127,127,127,0.14)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

export const accActionSecondary = style({
  textDecoration: "none",
  borderRadius: 999,
  border: `1px solid ${vars.color.border}`,
  padding: "9px 12px",
  fontWeight: 900,
  lineHeight: 1,
  opacity: 0.9,
  selectors: {
    "&:hover": { background: "rgba(127,127,127,0.10)" },
    "&:active": { background: "rgba(127,127,127,0.14)" },
    "&:focus-visible": { outline: `2px solid ${vars.color.focus}`, outlineOffset: 2 },
  },
});

// ==============================
// Existing buttons
// ==============================
export const teleportButton = style({
  appearance: "none",
  border: `1px solid ${vars.color.border}`,
  background: "transparent",
  borderRadius: 12,
  padding: "10px 12px",
  fontSize: 13,
  fontWeight: 900,
  cursor: "pointer",
  width: "100%",
  textAlign: "center",
  selectors: {
    "&:hover": {
      background: "rgba(127,127,127,0.10)",
    },
    "&:active": {
      background: "rgba(127,127,127,0.14)",
    },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: 2,
    },
  },
});

export const openPanelLink = style({
  appearance: "none",
  border: 0,
  padding: 0,
  margin: 0,
  background: "transparent",
  textAlign: "left",
  width: "fit-content",
  cursor: "pointer",

  fontSize: 12,
  color: "rgba(0,0,0,0.65)",
  textDecoration: "underline",

  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.focus}`,
      outlineOffset: 2,
      borderRadius: 8,
    },
  },
});
