import { skipLinkClass } from "../styles/skipLink.css";

export default function SkipLink() {
  return (
    <a href="#main-content" className={skipLinkClass}>
      Sari la conținutul principal
    </a>
  );
}
