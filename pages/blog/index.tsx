// pages/blog/index.tsx
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import Seo from "../../components/Seo";
import Breadcrumbs from "../../components/Breadcrumbs";

import { getAllPosts, SITE_URL } from "../../lib/blogData";
import { formatDateISOtoRo } from "../../lib/dates";

// Folosim aceleași stiluri ca în ArticlesPreview ca să arate identic
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
} from "../../styles/articlesPreview.css";

type Props = {
  posts: ReturnType<typeof getAllPosts>;
};

const BlogIndex: NextPage<Props> = ({ posts }) => {
  const canonical = `${SITE_URL}/blog`;

  const crumbs = [
    { name: "Acasă", href: "/" },
    { name: "Blog", current: true },
  ];

  return (
    <>
      <Seo
        title="Blog"
        description="Articole și ghiduri utile despre design web, optimizare SEO și dezvoltare Next.js."
        url="/blog"
      />
      <Head>
        <link rel="canonical" href={canonical} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Acasă", item: `${SITE_URL}/` },
                { "@type": "ListItem", position: 2, name: "Blog", item: canonical },
              ],
            }),
          }}
        />
      </Head>

      {/* Breadcrumbs centrat (din CSS global) */}
      <Breadcrumbs items={crumbs} />

      {/* Layout + cards identice cu ArticlesPreview */}
      <main className={sectionClass}>
        <div className={headerClass}>
          <h1 className={titleClass}>Noutăți, sfaturi și resurse pentru un web mai bun</h1>
          <p className={subtitleClass}>Citeste unul din sfaturile noastre cu privire la subiectul care te intereseaza</p>
        </div>

        <div className={gridClass}>
          {posts.map((post) => (
            <article key={post.slug} className={cardClass}>
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

                <h2 className={cardTitleClass}>{post.title}</h2>
                <p className={excerptClass}>{post.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
};

export const getStaticProps = async () => {
  const posts = getAllPosts();
  return { props: { posts } };
};

export default BlogIndex;
