// pages/404.tsx
import Head from "next/head";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Pagina nu a fost găsită – 404</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main style={{ minHeight: "60vh", display: "grid", placeItems: "center", padding: "48px 16px" }}>
        <div style={{ textAlign: "center", maxWidth: 640 }}>
          <h1 style={{ margin: 0, fontSize: 36 }}>404 – Pagina nu există</h1>
          <p style={{ marginTop: 12, color: "#4b5563" }}>
            Ne pare rău, pagina căutată nu a fost găsită.
          </p>
          <div style={{ marginTop: 20 }}>
            <Link href="/" style={{ color: "#5561F2", fontWeight: 600 }}>
              Înapoi la Acasă →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
