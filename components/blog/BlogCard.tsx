// components/blog/BlogCard.tsx
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BlogPostLite } from "../../lib/blogData"
import { cardClass, coverClass, metaRowClass, titleClass, excerptClass } from "../../styles/blogLite.css"
import { formatDateISOtoRo } from "../../lib/dates"

export default function BlogCard({ post }: { post: BlogPostLite }) {
  return (
    <motion.article
      className={cardClass}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.35 }}
    >
      <Link href={`/blog/${post.slug}`} aria-label={post.title}>
        <div className={coverClass}>
          <Image
            src={post.coverImage || "/images/blog/placeholder.jpg"}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
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
        <h3 className={titleClass}>{post.title}</h3>
        <p className={excerptClass}>{post.excerpt}</p>
      </Link>
    </motion.article>
  );
}
