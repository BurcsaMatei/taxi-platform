// styles/introSection.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from './tokens.css';

export const introSectionClass = style({
  padding: `${vars.spacing.lg} 0`,
  textAlign: 'center',
  maxWidth: '700px',
  margin: '0 auto',
});

export const introTitleClass = style({
  fontSize: '2rem',
  fontWeight: 600,
  marginBottom: vars.spacing.sm,
  fontFamily: vars.font.heading,
});

export const introTextClass = style({
  fontSize: '1.15rem',
  fontWeight: 400,
  color: vars.color.textSecondary ?? '#555',
  lineHeight: 1.5,
  fontFamily: vars.font.base,
});
