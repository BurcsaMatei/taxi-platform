// components/Breadcrumbs.tsx
import {
  breadcrumbsWrapperClass,
  breadcrumbsListClass,
  breadcrumbLinkClass,
  breadcrumbCurrentClass,
  breadcrumbItemClass,
} from "../styles/breadcrumbs.css";

type Crumb = { name: string; href?: string; current?: boolean };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb" className={breadcrumbsWrapperClass}>
      <ol className={breadcrumbsListClass}>
        {items.map((c, i) => (
          <li
            key={i}
            className={breadcrumbItemClass}
            aria-current={c.current ? "page" : undefined}
          >
            {c.href && !c.current ? (
              <a href={c.href} className={breadcrumbLinkClass}>
                {c.name}
              </a>
            ) : (
              <span className={breadcrumbCurrentClass}>{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
