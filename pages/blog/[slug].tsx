// pages/blog/[slug].tsx
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import Seo from "../../components/Seo";
import JsonLd from "../../components/JsonLd";
import Breadcrumbs from "../../components/Breadcrumbs";
import RelatedPosts from "../../components/blog/RelatedPosts";

import { getAllPosts, getPostBySlug, SITE_URL } from "../../lib/blogData";
import type { BlogPostLite } from "../../lib/blogData";
import { formatDateISOtoRo } from "../../lib/dates";
import {
  articleClass,
  containerClass,
  coverPageClass,
  pageHeaderClass,
} from "../../styles/blogLite.css";
import { proseClass } from "../../styles/prose.css";

type Props = {
  post: NonNullable<ReturnType<typeof getPostBySlug>>;
  related: { slug: string; title: string }[];
};

const BlogPostPage: NextPage<Props> = ({ post, related }) => {
  const canonical = `${SITE_URL}/blog/${post.slug}`;

  // JSON-LD BlogPosting
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    description: post.excerpt,
    image: post.coverImage
      ? post.coverImage.startsWith("http")
        ? post.coverImage
        : `${SITE_URL}${post.coverImage}`
      : undefined,
    url: canonical,
    mainEntityOfPage: canonical,
    author: post.author ? { "@type": "Person", name: post.author } : undefined,
    publisher: {
      "@type": "Organization",
      name: "KonceptID",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/og-image.png` },
    },
  };

  // Breadcrumbs (vizual + JSON-LD)
  const crumbs = [
    { name: "Acasă", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, current: true },
  ];
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.href ? `${SITE_URL}${c.href}` : canonical,
    })),
  };

  return (
    <>
      {/* 🔹 OG & Twitter vor folosi url + image din articol via Seo */}
      <Seo
        title={post.title}
        description={post.excerpt}
        url={`/blog/${post.slug}`}
        image={post.coverImage || "/images/blog/placeholder.jpg"}
      />
      <Head>
        <link rel="canonical" href={canonical} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
        />
      </Head>
      <JsonLd schema={jsonLd} />

      <main className={containerClass}>
        <Breadcrumbs items={crumbs} />

        <header className={pageHeaderClass}>
          <h1 style={{ fontSize: 36, margin: 0 }}>{post.title}</h1>
          <p style={{ color: "#6b7280", marginTop: 12 }}>
            {formatDateISOtoRo(post.date)} {post.readingTime ? `· ${post.readingTime}` : ""}
          </p>
        </header>

        {post.coverImage && (
          <div className={coverPageClass} aria-label="Imagine reprezentativă articol">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority={false}
              sizes="(max-width: 820px) 100vw, 820px"
            />
          </div>
        )}

        <article className={`${articleClass} ${proseClass}`}>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </article>

        {/* Poate te mai interesează și… */}
        <RelatedPosts items={related} />
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  const paths = posts.map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug);
  const post = getPostBySlug(slug);
  if (!post) return { notFound: true };

  // restul articolelor (max 6), exclude curentul
  const related = getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, 6)
    .map((p) => ({ slug: p.slug, title: p.title }));

  return { props: { post, related } };
};

export default BlogPostPage;
