// animations/heroText.ts
import type { Variants } from "framer-motion";

// Hero H1 – Slide Up + Fade In
export const heroH1Variants: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.44, 0.72, 0.58, 0.96] } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3 } }
};

// Hero H2 / intro text – Fade In
export const heroH2Variants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.65, delay: 0.18, ease: [0.44, 0.72, 0.58, 0.96] } },
  exit: { opacity: 0, y: 0, transition: { duration: 0.2 } }
};

// Flag global: activezi sau dezactivezi animațiile de hero
export const HERO_ANIMATION_ENABLED = true;
