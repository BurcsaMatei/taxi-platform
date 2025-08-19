// pages/sitemap.xml.ts
import type { GetServerSideProps } from "next";
import { getAllPosts } from "../lib/blogData"

// Rute statice. Am eliminat complet "about".
const STATIC_ROUTES = ["/", "/services", "/galerie", "/contact", "/blog"] as const;

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function urlEntry(loc: string, lastmod: string, changefreq: "daily" | "weekly" | "monthly", priority: string) {
  return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function generateSiteMap(host: string) {
  // 1) Rute statice
  const staticUrls = STATIC_ROUTES.map((path) => {
    const priority = path === "/" ? "1.0" : path === "/blog" ? "0.8" : "0.7";
    return urlEntry(`${host}${path}`, new Date().toISOString(), "weekly", priority);
  }).join("");

  // 2) Articole din varianta "lite"
  const posts = getAllPosts(); // deja exclude draft-urile și sortează
  const postUrls = posts
    .map((p) => {
      const loc = `${host}/blog/${p.slug}`;
      // dacă 'p.date' e valid, îl folosim ca lastmod; altfel, azi
      const lastmod = new Date(p.date).toString() !== "Invalid Date" ? new Date(p.date).toISOString() : new Date().toISOString();
      return urlEntry(loc, lastmod, "monthly", "0.8");
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${postUrls}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const forwardedProto = (req.headers["x-forwarded-proto"] as string) || "http";
  const forwardedHost = (req.headers["x-forwarded-host"] as string) || req.headers.host || "localhost:3000";

  // preferă .env.local dacă e setat
  const rawBase = process.env.NEXT_PUBLIC_SITE_URL || `${forwardedProto}://${forwardedHost}`;
  const SITE_URL = rawBase.replace(/\/+$/, ""); // fără trailing slash

  const sitemap = generateSiteMap(SITE_URL);

  res.setHeader("Content-Type", "application/xml");
  // cache 1h + stale-while-revalidate
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=600");

  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function SiteMap() {
  return null;
}
