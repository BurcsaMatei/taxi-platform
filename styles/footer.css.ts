// styles/footer.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from './tokens.css';

export const footerClass = style({
  background: vars.color.footerBg,
  color: vars.color.text,
  fontFamily: vars.font.base,
  padding: `${vars.spacing.md} ${vars.spacing.lg}`,
  textAlign: 'center',
  fontSize: '1rem',
  borderTop: `1px solid ${vars.color.primary}`,
  marginTop: vars.spacing.lg,
});

export const footerLogoBoxClass = style({
  height: '40px',              // pt. autosize (SVG <-> height:100%)
  minHeight: '40px',           // siguranță pe unele motoare de layout
  lineHeight: 0,               // elimină spațiul „baseline”
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: '8px',
  paddingBottom: '8px',
});

export const footerDividerClass = style({
  width: '100%',
  maxWidth: 1200,
  margin: '8px auto 12px auto',
  border: 'none',
  borderTop: '1px solid #e4e8ef',
});

export const footerCopyClass = style({
  display: 'block',
  marginTop: '4px',
});
