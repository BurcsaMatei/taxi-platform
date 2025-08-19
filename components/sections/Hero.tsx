// components/sections/Hero.tsx
import Image from "next/image";
import { ReactNode } from "react";
import * as s from "../../styles/sectionBase.css";
import * as h from "../../styles/hero.css";

type ImgLike = { src: string; alt: string; priority?: boolean };

type Props = {
  title: string;
  subtitle?: string;
  image: ImgLike;
  cta?: ReactNode;
  align?: "start" | "center";
  height?: "sm" | "md" | "lg";
  withOverlay?: boolean;
};

export default function Hero({
  title,
  subtitle,
  image,
  cta,
  align = "center",
  height = "md",
  withOverlay = true,
}: Props) {
  const heightPx =
    height === "sm" ? "360px" : height === "lg" ? "720px" : undefined;

  const textAlign = align === "start" ? "left" : "center";
  const placeItems = align === "start" ? "start" : "center";

  return (
    <section className={s.section}>
      <div className={`${s.container} ${h.heroWrap}`} style={{ height: heightPx }}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          style={{ objectFit: "cover" }}
          priority={image.priority}
        />
        {withOverlay && <div className={h.overlay} />}
        <div className={h.heroInner} style={{ textAlign, placeItems }}>
          <div style={{ maxWidth: 920 }}>
            <h1 className={h.heroTitle}>{title}</h1>
            {subtitle && <p className={h.heroSub}>{subtitle}</p>}
            {cta && <div style={{ marginTop: "1rem" }}>{cta}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
