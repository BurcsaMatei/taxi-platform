// pages/blog/index.tsx

// ==============================
// Imports
// ==============================
import type { GetStaticProps, NextPage } from "next";

import Appear from "../../components/animations/Appear";
import BlogCard from "../../components/blog/BlogCard";
import Breadcrumbs from "../../components/Breadcrumbs";
import Grid from "../../components/Grid";
import Hero from "../../components/sections/Hero";
import Seo from "../../components/Seo";
import Separator from "../../components/Separator";
import type { Json } from "../../interfaces";
import { getAllPosts } from "../../lib/blogData";
import { absoluteUrl } from "../../lib/config";
import type { Post } from "../../types/blog";

// ==============================
// Types
// ==============================
type Props = { posts: readonly Post[] };

// ==============================
// Constants
// ==============================
const crumbs = [
  { name: "Acasă", href: "/" },
  { name: "Blog", current: true },
] as const;

// ==============================
// Page
// ==============================
const BlogIndex: NextPage<Props> = ({ posts }) => {
  const breadcrumbList: Json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Acasă", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
    ],
  };

  return (
    <>
      <Seo
        title="Blog"
        description="Noutăți, sfaturi și resurse pentru un web mai bun."
        url={absoluteUrl("/blog")}
        image={absoluteUrl("/images/og-blog.jpg")}
        structuredData={[breadcrumbList]}
      />

      <Breadcrumbs items={crumbs} />

      {/* Hero */}
      <section className="section">
        <div className="container">
          <Appear>
            <Hero
              title="Blog"
              subtitle="Noutăți, sfaturi practice și idei aplicabile despre Next.js, performanță și SEO."
              image={{ src: "/images/current/hero-index-blog.jpg", alt: "Hero blog" }}
              height="md"
            />
          </Appear>
        </div>
      </section>

      <Separator />

      {/* Grid articole */}
      <section className="section">
        <div className="container">
          <Grid mobileCols={2} desktopCols={4} gap="16px" align="stretch" justify="stretch">
            {posts.map((post, i) => (
              <Appear as="div" key={post.slug} style={{ height: "100%" }} delay={0.08 * i}>
                <BlogCard post={post} />
              </Appear>
            ))}
          </Grid>
        </div>
      </section>
    </>
  );
};

// ==============================
// SSG
// ==============================
export const getStaticProps: GetStaticProps<Props> = async () => {
  const raw = getAllPosts();

  const posts: ReadonlyArray<Post> = raw.map((p) => {
    const out: Post = {
      slug: p.slug,
      title: p.title,
      date: p.date,
      excerpt: p.excerpt,
      tags: Array.isArray(p.tags) ? p.tags : [],
    };
    if (p.coverImage) out.coverImage = p.coverImage;
    if (p.author) out.author = p.author;
    return out;
  });

  return { props: { posts } };
};

// ==============================
// Export
// ==============================
export default BlogIndex;
