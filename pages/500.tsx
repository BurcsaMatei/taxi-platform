import Link from "next/link";
import { errorWrap, errorCard, errorTitle, errorText, errorLink } from "../styles/errorPages.css"

export default function ServerErrorPage() {
  return (
    <div className={errorWrap}>
      <div className={errorCard} role="alert" aria-live="assertive">
        <h1 className={errorTitle}>A apărut o eroare (500)</h1>
        <p className={errorText}>
          Încercăm să o rezolvăm cât mai repede. Reîncearcă mai târziu.
        </p>
        <Link href="/" className={errorLink}>Înapoi la Acasă</Link>
      </div>
    </div>
  );
}
