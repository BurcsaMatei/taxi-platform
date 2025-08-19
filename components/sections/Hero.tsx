import Image from "next/image";
import { ReactNode } from "react";
import { style } from "@vanilla-extract/css";
import * as s from "../../styles/sectionBase.css";

const heroWrap = style({
  position: "relative",
  height: "clamp(320px, 55vh, 640px)",
  borderRadius: "16px",
  overflow: "hidden",
});

const overlay = style({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.25) 100%)",
});

const heroInner = style({
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center",
  textAlign: "center",
  color: "#fff",
  padding: "clamp(16px, 4vw, 32px)",
});

const heroTitle = style({
  fontSize: "clamp(1.75rem, 4.5vw, 3rem)",
  lineHeight: 1.15,
  margin: 0,
});

const heroSub = style({
  fontSize: "clamp(1rem, 2vw, 1.25rem)",
  opacity: 0.9,
  marginTop: "0.75rem",
});

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
  return (
    <section className={s.section}>
      <div className={`${s.container} ${heroWrap}`} style={{
        height: height === "sm" ? "360px" : height === "lg" ? "720px" : undefined
      }}>
        <Image src={image.src} alt={image.alt} fill style={{ objectFit: "cover" }} priority={image.priority} />
        {withOverlay && <div className={overlay} />}
        <div className={heroInner} style={{ textAlign: align === "start" ? "left" : "center", placeItems: align === "start" ? "start" : "center" }}>
          <div style={{ maxWidth: 920 }}>
            <h1 className={heroTitle}>{title}</h1>
            {subtitle && <p className={heroSub}>{subtitle}</p>}
            {cta && <div style={{ marginTop: "1rem" }}>{cta}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
