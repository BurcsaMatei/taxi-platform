// styles/homepage/galleryPreviewHomepage.css.ts
import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "../tokens.css";

export const gpSection = style({ position: "relative", margin: `${vars.spacing.lg} auto`, maxWidth: 1200, width: "100%" });

export const gpHeader = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: vars.spacing.md,
  marginBottom: vars.spacing.md,
});
globalStyle(`${gpHeader} h2`, { margin: 0, fontFamily: vars.font.heading, fontSize: "1.6rem" });
globalStyle(`${gpHeader} a`,  { color: vars.color.primary, textDecoration: "none", fontWeight: 600 });

export const gpTrack = style({
  display: "flex",
  gap: vars.spacing.md,
  overflowX: "auto",
  scrollSnapType: "x mandatory",
  WebkitOverflowScrolling: "touch",
  paddingBottom: vars.spacing.sm,
  selectors: { "&::-webkit-scrollbar": { display: "none" } },
});

export const gpItem = style({
  flex: "0 0 auto",
  width: "clamp(260px, 85vw, 420px)",
  scrollSnapAlign: "start",
  textDecoration: "none",
  color: "inherit",
  borderRadius: vars.radius.base,
  boxShadow: "0 8px 24px rgba(20,30,60,0.08)",
  background: "#fff",
  overflow: "hidden",
  transition: "transform .15s ease",
  ":hover": { transform: "translateY(-2px)" },
});

export const gpImage = style({ position: "relative", width: "100%", aspectRatio: "4 / 3", overflow: "hidden" });
export const gpCaption = style({ padding: vars.spacing.md, fontSize: "0.98rem", color: vars.color.text });

export const gpNavBtnLeft = style({
  position: "absolute",
  left: 0,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 2,
  border: "none",
  background: "rgba(0,0,0,0.45)",
  color: "#fff",
  width: 36,
  height: 36,
  borderRadius: 999,
  cursor: "pointer",
  display: "none",
  "@media": { "screen and (min-width: 900px)": { display: "grid", placeItems: "center" } },
});
export const gpNavBtnRight = style([gpNavBtnLeft, { left: "auto", right: 0 }]);

export const gpCtaRow = style({ marginTop: vars.spacing.md, textAlign: "right" });
globalStyle(`${gpCtaRow} a`, { color: vars.color.primary, textDecoration: "none", fontWeight: 600 });
