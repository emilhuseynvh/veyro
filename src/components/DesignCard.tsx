import type { CardDesign } from "@/lib/cards";

/** A finished card face (real artwork) in the ISO card aspect ratio. */
export function DesignCard({
  design,
  className = "",
  priority = false,
}: {
  design: CardDesign;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`wcard ${className}`}
      role="img"
      aria-label={`${design.name} card design`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={design.img}
        alt=""
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="wcard-face h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}
