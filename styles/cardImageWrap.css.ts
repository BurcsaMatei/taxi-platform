import { style } from "@vanilla-extract/css";
import { vars } from "./tokens.css";

export const imageWrap = style({
  position: "relative",
  width: "100%",
  aspectRatio: "4 / 3",
  overflow: "hidden",
  borderTopLeftRadius: vars.radius.base,
  borderTopRightRadius: vars.radius.base,
});
