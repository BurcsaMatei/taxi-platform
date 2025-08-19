import { style } from '@vanilla-extract/css';
import { vars } from './tokens.css';

export const shortTextClass = style({
  fontSize: '1.05rem',
  fontWeight: 500,
  textAlign: 'center',
  margin: '0 auto 32px auto',
  maxWidth: '520px',
  lineHeight: 1.45,
  fontFamily: vars.font.base,
});
