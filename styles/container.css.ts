import { style } from '@vanilla-extract/css';
import { vars } from './tokens.css';

export const container = style({
  width: '100%',
  maxWidth: 1100,
  margin: '0 auto',
  paddingLeft: vars.spacing.lg,
  paddingRight: vars.spacing.lg,
  boxSizing: 'border-box',
});
