import Link from "next/link";
import { errorWrap, errorCard, errorTitle, errorText, errorLink } from "../styles/errorPages.css"

export default function NotFoundPage() {
  return (
    <div className={errorWrap}>
      <div className={errorCard} role="alert" aria-live="assertive">
        <h1 className={errorTitle}>Pagina nu a fost găsită (404)</h1>
        <p className={errorText}>
          Ne pare rău, linkul poate fi greșit sau pagina a fost mutată.
        </p>
        <Link href="/" className={errorLink}>Înapoi la Acasă</Link>
      </div>
    </div>
  );
}

