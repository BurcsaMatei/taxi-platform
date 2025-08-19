import Grid from "./Grid";
import Img from "./ui/Img";

export type GalleryCard = {
  src: string;
  alt: string;
  caption?: string;
  href?: string; // opțional
};

type Props = {
  cards: GalleryCard[];
  onItemClick?: (index: number) => void;
  aboveTheFold?: boolean; // dacă true, dăm priority la primele N
  priorityCount?: number; // default 6
};

export default function CardGrid({
  cards,
  onItemClick,
  aboveTheFold = false,
  priorityCount = 6,
}: Props) {
  const handleClick = (i: number) => {
    onItemClick?.(i);
  };

  return (
    <Grid cols={{ base: 2, md: 3, lg: 5 }} gap="16px">
      {cards.map((c, i) => {
        const priority = aboveTheFold && i < priorityCount;

        const body = (
          <>
            <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", borderRadius: 12, overflow: "hidden" }}>
              <Img
                src={c.src}
                alt={c.alt}
                variant="card"
                cover
                priority={priority}
              />
            </div>
            {c.caption && (
              <figcaption style={{ fontSize: ".9rem", opacity: 0.8, marginTop: 8 }}>
                {c.caption}
              </figcaption>
            )}
          </>
        );

        return (
          <figure key={c.src + i} style={{ margin: 0 }}>
            {onItemClick ? (
              <button
                type="button"
                onClick={() => handleClick(i)}
                style={{
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "inherit",
                  width: "100%",
                }}
                aria-label={`Deschide imaginea: ${c.alt}`}
              >
                {body}
              </button>
            ) : c.href ? (
              <a href={c.href} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                {body}
              </a>
            ) : (
              body
            )}
          </figure>
        );
      })}
    </Grid>
  );
}
