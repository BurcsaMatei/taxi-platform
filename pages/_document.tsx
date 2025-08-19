// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ro">
      <Head>
        {/* Preload explicit pentru Hero image */}
        <link
          rel="preload"
          as="image"
          href="/images/current/hero.jpg"
          type="image/jpeg"
        />

        {/* Dacă folosești alt format (ex. WebP/PNG), schimbă type */}
        {/* Exemplu WebP: type="image/webp" */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
