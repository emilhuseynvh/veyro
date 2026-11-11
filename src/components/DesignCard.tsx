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
    <div className={`wcard ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={design.img}
        alt={`${design.name} card design`}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="wcard-face h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}
