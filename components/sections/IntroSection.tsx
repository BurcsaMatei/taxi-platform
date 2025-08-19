import { ReactNode } from "react";
import * as s from "../../styles/sectionBase.css";

type Props = {
  eyebrow?: string;
  title: string;
  lede?: string;
  children?: ReactNode;
  align?: "start" | "center";
  maxWidth?: "normal" | "narrow";
  className?: string;
};

export default function IntroSection({
  eyebrow,
  title,
  lede,
  children,
  align = "center",
  maxWidth = "narrow",
  className,
}: Props) {
  return (
    <section className={`${s.section} ${className ?? ""}`}>
      <div className={`${s.container} ${maxWidth === "narrow" ? s.narrow : ""} ${align === "center" ? s.center : ""}`}>
        {eyebrow && <div className={s.eyebrow}>{eyebrow}</div>}
        <h2 className={s.heading}>{title}</h2>
        {lede && <p className={s.lede}>{lede}</p>}
        {children && <div className={s.content}>{children}</div>}
      </div>
    </section>
  );
}
