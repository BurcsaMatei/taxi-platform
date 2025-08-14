import { style } from '@vanilla-extract/css';
import { vars } from '../tokens.css';
import { container } from '../container.css';

// Fundal cu o nuanță neutră sau distinctă față de celelalte pagini
export const heroSectionContactBgClass = style({
  width: '100vw',
  background: vars.color.secondary, // <<=== modificat! dacă vrei altă nuanță, adaugă în tokens!
  color: vars.color.text,
  paddingTop: vars.spacing.lg,
  paddingBottom: vars.spacing.lg,
  marginLeft: 'calc(50% - 50vw)',
  marginRight: 'calc(50% - 50vw)',
});

export const heroSectionContactContainerClass = style([
  container,
  {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '340px',
    textAlign: 'center',
    borderRadius: vars.radius.base,
  }
]);

export const heroTitleClass = style({
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: vars.spacing.md,
  fontFamily: vars.font.heading,
  lineHeight: 1.1,
  '@media': {
    'screen and (max-width: 600px)': {
      fontSize: '1.5rem',
    }
  }
});

export const heroSubtitleClass = style({
  fontSize: '1.3rem',
  fontWeight: 400,
  marginBottom: vars.spacing.md,
  fontFamily: vars.font.base,
  lineHeight: 1.3,
  maxWidth: '540px',
  '@media': {
    'screen and (max-width: 600px)': {
      fontSize: '1rem',
      maxWidth: '90vw',
    }
  }
});
