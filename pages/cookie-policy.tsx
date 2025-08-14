// pages/cookie-policy.tsx
import Head from "next/head";
import { container } from "../styles/container.css";

export default function CookiePolicyPage() {
  const pageTitle = "Politica Cookie | KonceptID";
  const pageDesc =
    "Află cum folosim cookie-urile pe site-ul nostru, ce tipuri de cookie-uri utilizăm și cum le poți gestiona.";
  const pageUrl = "https://konceptid.com/cookie-policy";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDesc,
    url: pageUrl,
    publisher: {
      "@type": "Organization",
      name: "KonceptID",
      url: "https://konceptid.com",
      logo: {
        "@type": "ImageObject",
        url: "https://konceptid.com/icons/apple-touch-icon.png",
      },
    },
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={pageUrl} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      

      <main>
        <div className={container} style={{ padding: "2rem 0" }}>
          <h1>Politica privind fișierele cookie</h1>
          <p>
            Această politică explică ce sunt cookie-urile, cum le folosim pe site-ul
            nostru și ce opțiuni ai la dispoziție pentru a le gestiona.
          </p>

          <section>
            <h2>1. Ce sunt cookie-urile?</h2>
            <p>
              Cookie-urile sunt fișiere mici de text plasate pe dispozitivul tău de către
              site-urile web pe care le vizitezi. Acestea sunt utilizate pe scară largă
              pentru a permite funcționarea corectă a site-urilor sau pentru a îmbunătăți
              experiența utilizatorului.
            </p>
          </section>

          <section>
            <h2>2. Tipuri de cookie-uri pe care le folosim</h2>
            <ul>
              <li>
                <strong>Cookie-uri esențiale:</strong> necesare pentru funcționarea
                site-ului (ex: autentificare, coș de cumpărături).
              </li>
              <li>
                <strong>Cookie-uri de performanță:</strong> ne ajută să înțelegem cum
                utilizezi site-ul, pentru a-l îmbunătăți.
              </li>
              <li>
                <strong>Cookie-uri de funcționalitate:</strong> rețin preferințele tale
                (ex: limbă, locație).
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Cum poți controla cookie-urile</h2>
            <p>
              Poți gestiona sau dezactiva cookie-urile din setările browserului tău.
              Reține că dezactivarea acestora poate afecta funcționalitatea site-ului.
            </p>
            <p>
              Găsești mai multe informații pe:
              <br />
              <a
                href="https://www.allaboutcookies.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.allaboutcookies.org
              </a>
            </p>
          </section>

          <section>
            <h2>4. Modificări ale politicii cookie</h2>
            <p>
              Putem actualiza această politică periodic. Orice modificare va fi publicată
              pe această pagină, împreună cu data ultimei actualizări.
            </p>
            <p><em>Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}</em></p>
          </section>
        </div>
      </main>

      
    </>
  );
}
