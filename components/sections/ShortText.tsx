import { ReactNode } from "react";
import * as s from "../../styles/sectionBase.css";

type Props = {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  align?: "start" | "center";
  maxWidth?: "normal" | "narrow";
  className?: string;
};

export default function ShortText({
  title,
  subtitle,
  children,
  align = "center",
  maxWidth = "narrow",
  className,
}: Props) {
  return (
    <section className={`${s.section} ${className ?? ""}`}>
      <div className={`${s.container} ${maxWidth === "narrow" ? s.narrow : ""} ${align === "center" ? s.center : ""}`}>
        {title && <h2 className={s.heading}>{title}</h2>}
        {subtitle && <p className={s.lede}>{subtitle}</p>}
        {children && <div className={s.content}>{children}</div>}
      </div>
    </section>
  );
}
