// components/ui/AnimatedIcon.tsx
import { motion, Variants } from "framer-motion";
import Image from "next/image";

export type AnimatedIconProps = {
  src: string;
  alt: string;
  size?: number;
  hoverTilt?: boolean;
  delaySeed?: number;
};

export default function AnimatedIcon({
  src,
  alt,
  size = 48,
  hoverTilt = false,
  delaySeed = 0,
}: AnimatedIconProps) {
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const floatVariants: Variants = {
    hidden: { opacity: 0, scale: 0.98 },
    show: prefersReduced
      ? { opacity: 1, scale: 1 }
      : { opacity: 1, scale: [1, 1.02, 1] },
  };

  const tiltVariants: Variants = {
    hidden: { opacity: 0, scale: 1, rotate: 0, y: 0 },
    show: { opacity: 1, scale: 1, rotate: 0, y: 0 },
    hover: {
      rotate: 3,
      y: -2,
      transition: { type: "spring", stiffness: 200, damping: 8 },
    },
  };

  const floatTransition = prefersReduced
    ? { duration: 0 }
    : { duration: 3, repeat: Infinity, repeatType: "mirror" as const };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      whileHover={hoverTilt ? "hover" : undefined}
      variants={hoverTilt ? tiltVariants : floatVariants}
      transition={hoverTilt ? undefined : floatTransition}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image src={src} alt={alt} width={size} height={size} />
    </motion.div>
  );
}
