// styles/cardGrid.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from './tokens.css';

export const cardGridClass = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: vars.spacing.md,
  '@media': {
    'screen and (min-width: 600px)': { gridTemplateColumns: '1fr 1fr' },
    'screen and (min-width: 900px)': { gridTemplateColumns: '1fr 1fr 1fr' },
    'screen and (min-width: 1200px)': { gridTemplateColumns: '1fr 1fr 1fr 1fr' },
  },
});
