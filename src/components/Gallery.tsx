import { cardDesigns } from "@/lib/cards";
import { DesignCard } from "./DesignCard";

export function Gallery() {
  // Split into two rows that drift in opposite directions.
  const half = Math.ceil(cardDesigns.length / 2);
  const rowA = [...cardDesigns.slice(0, half), ...cardDesigns.slice(0, half)];
  const rowB = [...cardDesigns.slice(half), ...cardDesigns.slice(half)];

  return (
    <section
      id="gallery"
      className="section-tight overflow-hidden"
      aria-labelledby="gallery-title"
    >
      <div className="container-x mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 id="gallery-title" className="display display-md max-w-xl">
          Thousands of designs.
          <br />
          Or the one you make.
        </h2>
        <p className="measure max-w-sm text-ink-2">
          Metal, matte, art, chrome and more, all in the real card shape. Drag
          one on, or drop your own PNG. Here are a few.
        </p>
      </div>

      <div className="marquee-track flex flex-col gap-5" aria-hidden>
        <div className="marquee">
          {rowA.map((d, i) => (
            <div key={`a-${d.id}-${i}`} className="w-[220px] shrink-0 sm:w-[260px]">
              <DesignCard design={d} />
            </div>
          ))}
        </div>
        <div className="marquee marquee-reverse">
          {rowB.map((d, i) => (
            <div key={`b-${d.id}-${i}`} className="w-[220px] shrink-0 sm:w-[260px]">
              <DesignCard design={d} />
            </div>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {cardDesigns.map((d) => (
          <li key={d.id}>{d.name}</li>
        ))}
      </ul>
    </section>
  );
}
