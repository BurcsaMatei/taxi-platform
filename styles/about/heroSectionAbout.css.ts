import { style } from '@vanilla-extract/css';
import { vars } from '../tokens.css';
import { container } from '../container.css';

// Fundal cu culoare deschisă (dacă vrei alt ton, folosește direct hex sau adaugă variabilă în tokens!)
export const heroSectionAboutBgClass = style({
  width: '100vw',
  background: '#f5f7fb', // sau vars.color.background
  color: vars.color.text,
  paddingTop: vars.spacing.lg,
  paddingBottom: vars.spacing.lg,
  marginLeft: 'calc(50% - 50vw)',
  marginRight: 'calc(50% - 50vw)',
});

export const heroSectionAboutContainerClass = style([
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
