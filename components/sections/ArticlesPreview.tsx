// components/sections/ArticlesPreview.tsx
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BlogPostLite } from "../../lib/blogData"
import { formatDateISOtoRo } from "../../lib/dates"
import {
  sectionClass,
  headerClass,
  titleClass,
  subtitleClass,
  gridClass,
  cardClass,
  coverClass,
  metaRowClass,
  cardTitleClass,
  excerptClass,
  ctaRowClass,
  emptyClass,
} from "../../styles/articlesPreview.css"
import Button from "../../components/Button"

type Props = {
  posts: BlogPostLite[];
  title?: string;
  subtitle?: string;
  showCta?: boolean;
};

export default function ArticlesPreview({
  posts,
  title = "Articole recente",
  subtitle = "Noutăți și ghiduri scurte.",
  showCta = true,
}: Props) {
  return (
    <section className={sectionClass} aria-labelledby="articles-preview-title">
      <div className={headerClass}>
        <h2 id="articles-preview-title" className={titleClass}>{title}</h2>
        <p className={subtitleClass}>{subtitle}</p>
      </div>

      {(!posts || posts.length === 0) ? (
        <div className={emptyClass}>Nu avem încă articole publice. Revino curând.</div>
      ) : (
        <>
          <div className={gridClass}>
            {posts.map((post) => (
              <motion.article
                key={post.slug}
                className={cardClass}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/blog/${post.slug}`} aria-label={post.title}>
                  <div className={coverClass}>
                    <Image
                      src={post.coverImage || "/images/blog/placeholder.jpg"}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className={metaRowClass}>
                    <span>{formatDateISOtoRo(post.date)}</span>
                    {post.readingTime && (
                      <>
                        <span>&middot;</span>
                        <span>{post.readingTime}</span>
                      </>
                    )}
                  </div>
                  <h3 className={cardTitleClass}>{post.title}</h3>
                  <p className={excerptClass}>{post.excerpt}</p>
                </Link>
              </motion.article>
            ))}
          </div>

          {showCta && (
            <div className={ctaRowClass}>
              <Button>
                <Link href="/blog">Vezi toate articolele →</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
