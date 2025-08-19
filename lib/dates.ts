// lib/dates.ts
export function formatDateISOtoRo(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}
