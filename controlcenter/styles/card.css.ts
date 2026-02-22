// styles/card.css.ts

// ==============================
// Imports
// ==============================
import { vars } from "@taxi/tokens";
import { style } from "@vanilla-extract/css";

// ==============================
// Styles (base)
// ==============================
export const cardRoot = style({
  borderRadius: vars.radius.lg,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  overflow: "hidden",
  display: "grid",
  gridTemplateRows: "auto 1fr",
  boxShadow: vars.shadow.sm,
});

export const imageWrap = style({
  width: "100%",
  overflow: "hidden",
  borderBottom: `1px solid ${vars.color.border}`,
  background: vars.color.surfaceHover,
});

export const contentWrap = style({
  padding: vars.space.lg,
  display: "grid",
  gap: vars.space.md,
});

export const titleClass = style({
  fontSize: vars.typography.size.lg,
  fontWeight: Number(vars.typography.weight.bold),
  lineHeight: vars.typography.leading.tight,
});

export const excerptClass = style({
  fontSize: vars.typography.size.sm,
  color: vars.color.muted,
  lineHeight: vars.typography.leading.normal,
});

export const metaRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.md,
  color: vars.color.muted,
  fontSize: vars.typography.size.sm,
});

export const actionsRow = style({
  display: "flex",
  alignItems: "center",
  gap: vars.space.md,
  flexWrap: "wrap",
});

export const linkReset = style({
  color: "inherit",
  textDecoration: "none",
  display: "block",
});

export const buttonReset = style({
  appearance: "none",
  background: "transparent",
  border: 0,
  padding: 0,
  margin: 0,
  color: "inherit",
  textAlign: "inherit",
  cursor: "pointer",
  width: "100%",
});

// ==============================
// Media helpers (VE-only)
// ==============================

export const mediaImgCover = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
});

export const mediaRatio_1_1 = style({ aspectRatio: "1 / 1" });
export const mediaRatio_4_3 = style({ aspectRatio: "4 / 3" });
export const mediaRatio_3_2 = style({ aspectRatio: "3 / 2" });
export const mediaRatio_16_9 = style({ aspectRatio: "16 / 9" });
