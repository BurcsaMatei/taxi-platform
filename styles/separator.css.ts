import { style } from '@vanilla-extract/css';
import { vars } from './tokens.css';

export const separatorClass = style({
  border: 'none',
  borderTop: `2px solid ${vars.color.primary ?? '#78B688'}`,
  borderRadius: '2px',
  width: '110px',
  maxWidth: '40vw',
  margin: '40px auto',
  boxShadow: `0 2px 12px 0 rgba(94,183,135,0.07)`,
  background: 'none',
  height: 0,
});
