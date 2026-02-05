// pages/sitemap-pages.xml.ts

// ==============================
// Imports
// ==============================
import type { GetServerSideProps } from "next";

import { STATIC_ROUTES } from "../lib/config";
import { getRequestBaseUrl, joinHostPath } from "../lib/url";

// ==============================
// Types
// ==============================
type ChangeFreq = "daily" | "weekly" | "monthly";

// ==============================
// Constante
// ==============================
const XML_ESC = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ==============================
// Utils
// ==============================
const urlEntry = (loc: string, lastmod: string, changefreq: ChangeFreq, priority: string) => `
  <url>
    <loc>${XML_ESC(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

function priorityFor(path: (typeof STATIC_ROUTES)[number]): string {
  if (path === "/") return "1.0";
  if (path === "/blog") return "0.8";
  if (path === "/portfolio") return "0.75";
  if (path === "/concept") return "0.75";
  return "0.7";
}

function changeFreqFor(path: (typeof STATIC_ROUTES)[number]): ChangeFreq {
  if (path === "/blog") return "weekly";
  return "monthly";
}

function generate(baseUrl: string): string {
  const nowIso = new Date().toISOString();

  const urls = STATIC_ROUTES.map((path) => {
    const loc = joinHostPath(baseUrl, path);
    return urlEntry(loc, nowIso, changeFreqFor(path), priorityFor(path));
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// ==============================
// Component
// ==============================
export default function SiteMapPages() {
  return null;
}

// ==============================
// Exporturi
// ==============================
export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const SITE_URL = getRequestBaseUrl(req);
  const xml = generate(SITE_URL);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=600");
  res.end(xml);

  return { props: {} };
};
