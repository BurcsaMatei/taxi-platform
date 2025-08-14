// pages/sitemap.xml.ts
import type { GetServerSideProps } from "next";

const ROUTES = ["/", "/about", "/galerie", "/contact"];

function generateSiteMap(host: string) {
  const urls = ROUTES.map((path) => {
    const priority = path === "/" ? "1.0" : "0.7";
    return `
  <url>
    <loc>${host}${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  const forwardedProto = (req.headers["x-forwarded-proto"] as string) || "http";
  const forwardedHost = (req.headers["x-forwarded-host"] as string) || req.headers.host || "localhost:3000";

  // ia din .env.local dacă există; altfel, din headerele request-ului
  const rawBase = process.env.NEXT_PUBLIC_SITE_URL || `${forwardedProto}://${forwardedHost}`;
  const SITE_URL = rawBase.replace(/\/+$/, ""); // fără trailing slash

  const sitemap = generateSiteMap(SITE_URL);

  res.setHeader("Content-Type", "application/xml");
  // (opțional) cache 1h + stale-while-revalidate
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=600");

  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function SiteMap() {
  return null;
}
