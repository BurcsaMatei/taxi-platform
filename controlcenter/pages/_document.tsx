// pages/_document.tsx

// ==============================
// Imports
// ==============================
import { themeClassDark, themeClassLight } from "@taxi/tokens";
import Document, {
  type DocumentContext,
  type DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";

import { SITE, THEME, withBase } from "../lib/config";

// ==============================
// Utils
// ==============================
function toHtmlLang(locale?: string): string {
  if (!locale) return "en";
  const [rawLang = "en", rawRegion] = locale.replace("_", "-").split("-");
  const lang = rawLang.toLowerCase();
  const region = rawRegion ? rawRegion.toUpperCase() : undefined;
  return region ? `${lang}-${region}` : lang;
}

/**
 * Script inline (before paint):
 *  - citește tema din localStorage / prefers-color-scheme
 *  - aplică clasele VE pe <html> pentru a elimina FOUC
 */
const THEME_BOOTSTRAP_SCRIPT = `
(function() {
  try {
    var d = document.documentElement;
    var saved = localStorage.getItem('theme');
    var t = (saved === 'light' || saved === 'dark')
      ? saved
      : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    d.classList.remove('light','dark','${themeClassLight}','${themeClassDark}');
    d.setAttribute('data-theme', t);
    if (t === 'dark') { d.classList.add('dark','${themeClassDark}'); }
    else { d.classList.add('light','${themeClassLight}'); }
  } catch (e) { /* no-op */ }
})();
`;

// ==============================
// Document
// ==============================
type ExtraProps = { nonce?: string };

export default class MyDocument extends Document<ExtraProps> {
  static override async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps & ExtraProps> {
    const initial = await Document.getInitialProps(ctx);

    const foundNonce =
      (ctx as unknown as { nonce?: string }).nonce ??
      (ctx.res as unknown as { locals?: { nonce?: string } })?.locals?.nonce ??
      (ctx.req as unknown as { headers?: Record<string, string | string[] | undefined> })
        ?.headers?.["x-csp-nonce"];

    const nonce = typeof foundNonce === "string" ? foundNonce : undefined;
    const extras: ExtraProps = nonce ? { nonce } : {};

    return { ...initial, ...extras };
  }

  override render() {
    const htmlLang = toHtmlLang(SITE.locale);
    const nonce = (this.props as ExtraProps).nonce;

    const scriptProps: { nonce?: string } = {};
    const nextScriptProps: { nonce?: string } = {};
    if (nonce) {
      scriptProps.nonce = nonce;
      nextScriptProps.nonce = nonce;
    }

    return (
      <Html lang={htmlLang} className={themeClassLight}>
        <Head>
          {/* Hints: suportăm light & dark */}
          <meta name="color-scheme" content="light dark" />

          {/* Apple touch icon */}
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={withBase("/icons/apple-touch-icon.png")}
          />

          {/* Browser UI / address bar — sincronizat cu THEME din config */}
          <meta
            name="theme-color"
            media="(prefers-color-scheme: light)"
            content={THEME.uiThemeColorLight}
          />
          <meta
            name="theme-color"
            media="(prefers-color-scheme: dark)"
            content={THEME.uiThemeColorDark}
          />

          {/* Elimină FOUC: setează tema pe <html> înainte de paint */}
          <script {...scriptProps} dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }} />
        </Head>
        <body>
          <Main />
          <NextScript {...nextScriptProps} />
        </body>
      </Html>
    );
  }
}
