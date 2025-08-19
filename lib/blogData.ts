// lib/blogData.ts
export type BlogPostLite = {
  slug: string;
  title: string;
  date: string;             // ISO 8601 (ex: "2025-08-12T09:00:00Z")
  excerpt: string;          // 150-160 caractere pentru meta description
  coverImage?: string;      // ex: "/images/blog/cover-1.jpg" (din /public)
  author?: string;          // opțional
  tags?: string[];          // opțional
  contentHtml: string;      // HTML simplu (p, h2/h3, ul/ol, img)
  readingTime?: string;     // ex: "3 min" (opțional)
  draft?: boolean;          // dacă true => nu se afișează
};

// === CONFIG SITE URL (pentru canonical/JSON-LD)
const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

// === BAZA DE ARTICOLE (editezi / adaugi aici) ===============================
export const POSTS: BlogPostLite[] = [
  {
    slug: "tendinte-design-2025",
    title: "Tendințe de design 2025 pentru site-uri de prezentare",
    date: "2025-08-12T09:00:00Z",
    excerpt:
      "Minimalism, viteză și mesaje clare. Ce funcționează acum pentru conversii pe site-urile de tip prezentare.",
    coverImage: "/images/blog/cover-2.jpg",
    author: "KonceptID",
    tags: ["design", "ux"],
    readingTime: "4 min",
    contentHtml: `
<p>Interfețe <strong>curate</strong>, contrast bun, imagini optimizate și micro-interacțiuni discrete (ex: <code>framer-motion</code>) cresc încrederea și conversiile.</p>
<h3>Recomandări</h3>
<ol>
  <li>Text scurt, accent pe beneficii</li>
  <li>Imagini locale, <em>lazy</em> și compresate</li>
  <li>CTA clar, deasupra pliului</li>
</ol>
`,
  },
  {
    slug: "ghid-organizare-eveniment",
    title: "Ghid rapid: organizarea unui eveniment reușit",
    date: "2025-08-10T09:00:00Z",
    excerpt:
      "Pașii esențiali pentru a-ți planifica evenimentul fără stres: buget, locație, furnizori și timeline clar.",
    coverImage: "/images/blog/cover-1.jpg",
    author: "Redacția",
    tags: ["organizare", "evenimente"],
    readingTime: "3 min",
    contentHtml: `
<p>O planificare bună începe cu un <strong>buget realist</strong> și un <em>timeline</em> clar. Apoi alegi locația, furnizorii și trasezi responsabilitățile.</p>
<h2>Checklist de pornire</h2>
<ul>
  <li>Buget și priorități</li>
  <li>Locație, dată și invitați</li>
  <li>Contracte & logistică</li>
</ul>
<p>Reia planul săptămânal și păstrează legătura cu furnizorii.</p>
`,
  },
  {
    slug: "viteza-site-core-web-vitals",
    title: "Viteza site-ului și Core Web Vitals: ce contează în 2025",
    date: "2025-08-05T08:30:00Z",
    excerpt:
      "CLS, LCP și INP influențează direct SEO și conversiile. Iată cum optimizezi imaginile, fonturile și scripturile pentru rezultate reale.",
    coverImage: "/images/blog/cover-3.jpg",
    author: "KonceptID",
    tags: ["performance", "seo", "core-web-vitals"],
    readingTime: "5 min",
    contentHtml: `
<p>Google măsoară experiența reală a utilizatorilor prin <strong>Core Web Vitals</strong>: <em>LCP</em>, <em>CLS</em> și <em>INP</em>. Un scor bun înseamnă încărcare rapidă și interfețe stabile.</p>
<h2>Pași practici</h2>
<ul>
  <li>Optimizează imaginile (format modern, dimensiuni corecte, <code>next/image</code>)</li>
  <li>Folosește <code>font-display: swap</code> și preîncarcă fonturile critice</li>
  <li>Amână scripturile neesențiale și elimină CSS nefolosit</li>
</ul>
`,
  },
  {
    slug: "structurare-continut-seo",
    title: "Structurarea conținutului pentru SEO: ghid scurt",
    date: "2025-08-01T10:00:00Z",
    excerpt:
      "Titluri clare, paragrafe scurte și intertitluri relevante. Cum scrii pagini care răspund intenției de căutare și cresc rata de conversie.",
    coverImage: "/images/blog/cover-4.jpg",
    author: "Redacția",
    tags: ["seo", "content"],
    readingTime: "3 min",
    contentHtml: `
<p>Conținutul bine structurat ajută atât <strong>utilizatorii</strong>, cât și <strong>motoarele de căutare</strong>. Începe cu un H1 clar, apoi secțiuni logice cu H2/H3.</p>
<h2>Formulă simplă</h2>
<ol>
  <li>Deschidere scurtă cu beneficiu</li>
  <li>Dezvoltare în 2-3 puncte cheie</li>
  <li>Concluzie cu CTA</li>
</ol>
`,
  },
  {
    slug: "nextjs-ssg-vs-ssr-alegere",
    title: "Next.js: SSG vs SSR — ce alegi pentru site-ul tău?",
    date: "2025-07-20T09:15:00Z",
    excerpt:
      "Pagini rapide și sigure cu SSG sau date proaspete la fiecare cerere cu SSR? Un ghid pragmatic pentru site-uri de prezentare.",
    coverImage: "/images/blog/cover-5.jpg",
    author: "KonceptID",
    tags: ["nextjs", "arch"],
    readingTime: "4 min",
    contentHtml: `
<p><strong>SSG</strong> oferă viteză și costuri mici. <strong>SSR</strong> aduce date proaspete, dar cu latență mai mare. Pentru site-urile de prezentare, SSG este de obicei suficient.</p>
<h3>Când alegi SSR</h3>
<ul>
  <li>Conținut care se schimbă la minut</li>
  <li>Personalizare pe utilizator</li>
</ul>
`,
  },
  {
    slug: "imagini-eficiente-webp-avif",
    title: "Imagini eficiente: WebP și AVIF pentru un site mai rapid",
    date: "2025-07-10T07:45:00Z",
    excerpt:
      "Conversia la WebP/AVIF reduce dimensiunea fără pierderi vizibile. Vezi cum setezi <code>next/image</code> și fallback pentru compatibilitate.",
    coverImage: "/images/blog/cover-6.jpg",
    author: "Redacția",
    tags: ["imagini", "performance"],
    readingTime: "3 min",
    contentHtml: `
<p>Formatele <strong>WebP</strong> și <strong>AVIF</strong> oferă compresie mai bună față de JPEG/PNG. În Next.js, <code>next/image</code> gestionează automat multe optimizări.</p>
<h2>Practic</h2>
<ul>
  <li>Setează dimensiuni explicite</li>
  <li>Definește <code>sizes</code> pentru layout responsive</li>
  <li>Folosește imagini <em>lazy</em> în afara pliului</li>
</ul>
`,
  },
  {
    slug: "microcopy-cta-conversii",
    title: "Microcopy și CTA: mici texte, impact mare în conversii",
    date: "2025-06-28T11:10:00Z",
    excerpt:
      "Butonul și mesajul din jurul lui contează. Testează variante, scoate jargonul și explică beneficiul în 6–10 cuvinte.",
    coverImage: "/images/blog/cover-7.jpg",
    author: "KonceptID",
    tags: ["copywriting", "ux", "conversii"],
    readingTime: "2 min",
    contentHtml: `
<p>Un <strong>CTA</strong> reușit nu vinde, ci clarifică următorul pas. Evită formulările vagi și leagă textul de un beneficiu concret pentru utilizator.</p>
<ul>
  <li>„Solicită ofertă în 24h”</li>
  <li>„Vezi portofoliul complet”</li>
</ul>
`,
  },
  {
    slug: "audit-seo-rapid-checklist",
    title: "Audit SEO rapid: checklist pentru site-uri mici",
    date: "2025-06-15T08:00:00Z",
    excerpt:
      "Titluri unice, descrieri clare, sitemap valid, viteza bună și conținut util. Un control rapid care oferă rezultate vizibile.",
    coverImage: "/images/blog/cover-8.jpg",
    author: "Redacția",
    tags: ["seo", "audit"],
    readingTime: "3 min",
    contentHtml: `
<p>Începe cu bazele: <strong>title</strong> și <strong>meta description</strong> unice, sitemap corect, <em>robots.txt</em>, structură clară de heading-uri și performanță solidă.</p>
<h3>Checklist</h3>
<ol>
  <li>Indexare (Search Console)</li>
  <li>Performanță (Lighthouse)</li>
  <li>Conținut (intenție & relevanță)</li>
</ol>
`,
  },
];

// === UTILE: listă + un articol =============================================
export function getAllPosts(): BlogPostLite[] {
  return POSTS
    .filter((p) => !p.draft)
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPostLite | null {
  const p = POSTS.find((x) => x.slug === slug && !x.draft);
  return p || null;
}

export function canonicalFor(pathname: string): string {
  return `${SITE_URL}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}
