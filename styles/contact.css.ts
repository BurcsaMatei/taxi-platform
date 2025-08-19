// styles/contact.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from "../styles/tokens.css"



export const mapSectionClass = style({
  marginTop: '40px',                 // poți trece pe tokens: `calc(${vars.spacing.lg} + 8px)`
});
