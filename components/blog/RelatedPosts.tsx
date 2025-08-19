// components/blog/RelatedPosts.tsx
import Link from "next/link";
import {
  relatedWrapClass,
  relatedTitleClass,
  relatedListClass,
  relatedLinkClass,
} from "../../styles/relatedPosts.css"

type Item = { slug: string; title: string };

export default function RelatedPosts({ items }: { items: Item[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className={relatedWrapClass} aria-labelledby="related-posts-title">
      <h3 id="related-posts-title" className={relatedTitleClass}>
        Poate te mai interesează și:
      </h3>
      <ul className={relatedListClass}>
        {items.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className={relatedLinkClass}>
              {p.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
