// components/sections/Serviciipreview.tsx
import { motion } from "framer-motion";
import AnimatedIcon from "../ui/AnimatedIcon";
import Button from "../Button";
import * as s from "../../styles/services.css";

type PreviewItem = {
  id: string;
  title: string;
  description: string;
  href?: string;
  iconSrc?: string;
};

const DEFAULT_PREVIEW: PreviewItem[] = [
  { id: "web-design", title: "Web Design", description: "Design modern, responsive.", iconSrc: "/icons/servicii/service1.svg" },
  { id: "nextjs-dev", title: "Dezvoltare Next.js", description: "Rapid, accesibil, scalabil.", iconSrc: "/icons/servicii/service2.svg" },
  { id: "seo", title: "Optimizare & SEO", description: "CWV, OG, schema, sitemap.", iconSrc: "/icons/servicii/service3.svg" },
  { id: "content", title: "Conținut & Blog", description: "Arhitectură & articole.", iconSrc: "/icons/servicii/service4.svg" },
];

type Props = {
  items?: PreviewItem[];
  title?: string;
  subtitle?: string;
};

export function Serviciipreview({
  items = DEFAULT_PREVIEW,
  title = "Servicii — pe scurt",
  subtitle = "O privire rapidă asupra a ceea ce livrăm constant.",
}: Props) {
  return (
    <section className={s.sectionPad} aria-labelledby="services-preview-title">
      {/* Header */}
      <div className={s.previewHeader}>
        <h2 id="services-preview-title" className={s.h2}>
          {title}
        </h2>
        <p className={s.previewSubtitle}>{subtitle}</p>
      </div>

      {/* Grid servicii */}
      <motion.ul
        className={s.grid}
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
        }}
      >
        {items.map((it) => (
          <motion.li
            key={it.id}
            className={s.cardSmall}
            variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          >
            <div className={s.cardIconWrapSmall}>
              {it.iconSrc ? (
                <AnimatedIcon
                  src={it.iconSrc}
                  alt={it.title}
                  size={32}
                  hoverTilt={true}
                />
              ) : null}
            </div>

            <h3 className={s.cardTitleSmall}>{it.title}</h3>
            <p className={s.cardDescSmall}>{it.description}</p>

            {it.href ? (
              <a className={s.cardLink} href={it.href} aria-label={it.title}>
                Detalii
              </a>
            ) : null}
          </motion.li>
        ))}
      </motion.ul>

      {/* Buton centrat */}
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Button href="/services">Vezi toate serviciile</Button>
      </div>
    </section>
  );
}
