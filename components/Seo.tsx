// components/Seo.tsx
import Head from "next/head";

type SeoProps = {
  title?: string;        // Ex: "Servicii"
  description?: string;  // 140–160c
  image?: string;        // "/images/og-services.jpg" sau URL absolut
  url?: string;          // "/services" sau URL absolut
  noindex?: boolean;
};

const SITE_NAME = "KonceptID";
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
// normalize: eliminăm orice trailing slash
const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

const DEFAULT_TITLE = "Agenție web design și digital | KonceptID";
const DEFAULT_DESC =
  "Lorem ipsum dolores sit amet. Exemplu meta description pentru proiectul tău base-template.";
const DEFAULT_IMG = "/images/og.jpg"; // pune fișierul în /public/images/og.jpg

function toAbsoluteUrl(input?: string) {
  if (!input) return SITE_URL;
  // dacă e deja absolut, lasă-l
  if (/^https?:\/\//i.test(input)) return input;
  // input relativ -> prefix cu domeniul normalizat
  return `${SITE_URL}${input.startsWith("/") ? input : `/${input}`}`;
}

export default function Seo({
  title,
  description,
  image,
  url,
  noindex = false,
}: SeoProps) {
  const metaTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const metaDesc = description ?? DEFAULT_DESC;

  const canonical = toAbsoluteUrl(url ?? "/");
  const ogImageAbs = toAbsoluteUrl(image ?? DEFAULT_IMG);

  return (
    <Head>
      {/* Title + Description */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDesc} />

      {/* Canonical */}
      <link rel="canonical" href={canonical} />

      {/* Robots */}
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow"}
      />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImageAbs} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImageAbs} />
    </Head>
  );
}
