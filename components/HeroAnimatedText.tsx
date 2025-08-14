// components/HeroAnimatedText.tsx
import { motion } from "framer-motion";
import {
  heroH1Variants,
  heroH2Variants,
  HERO_ANIMATION_ENABLED,
} from "../styles/animations/heroText";

type HeroAnimatedTextProps = {
  as?: "h1" | "h2";
  children: React.ReactNode;
  className?: string;
};

export function HeroAnimatedText({ as = "h1", children, className }: HeroAnimatedTextProps) {
  // Decizi ce variantă să folosești
  const variants = as === "h1" ? heroH1Variants : heroH2Variants;
  const Tag = motion[as as "h1" | "h2"];

  if (!HERO_ANIMATION_ENABLED) {
    // Nu aplica animație (randează doar textul cu clasa)
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </Tag>
  );
}
