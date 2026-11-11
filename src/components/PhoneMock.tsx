import { cardDesigns } from "@/lib/cards";
import { DesignCard } from "./DesignCard";

/**
 * A dark iPhone (real proportions) showing Apple Wallet with a stack of real
 * card designs. All inner sizes use cqw so it scales cleanly at any width.
 */
export function PhoneMock({
  ids,
  className = "",
}: {
  ids: string[];
  className?: string;
}) {
  const cards = ids
    .map((id) => cardDesigns.find((d) => d.id === id))
    .filter(Boolean) as (typeof cardDesigns)[number][];

  return (
    <div className={`iphone ${className}`} aria-hidden>
      <span className="iphone-island" />
      <div className="iphone-screen">
        {/* status bar, level with the Dynamic Island */}
        <div
          className="absolute left-0 right-0 flex items-center justify-between text-white"
          style={{ top: "4.6cqw", padding: "0 9cqw" }}
        >
          <span style={{ fontSize: "4.4cqw", fontWeight: 600 }}>9:41</span>
          <span className="flex items-center" style={{ gap: "1.6cqw" }}>
            <svg viewBox="0 0 17 11" fill="currentColor" style={{ width: "5.6cqw" }}>
              <rect x="0" y="7.5" width="2.6" height="3.5" rx="0.8" />
              <rect x="4.4" y="5" width="2.6" height="6" rx="0.8" />
              <rect x="8.8" y="2.5" width="2.6" height="8.5" rx="0.8" />
              <rect x="13.2" y="0" width="2.6" height="11" rx="0.8" />
            </svg>
            <svg viewBox="0 0 24 11" fill="none" style={{ width: "7.6cqw" }}>
              <rect x="0.6" y="0.6" width="19" height="9.8" rx="2.6" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
              <rect x="2" y="2" width="16" height="7" rx="1.5" fill="currentColor" />
              <rect x="20.5" y="3.5" width="1.8" height="4" rx="0.9" fill="currentColor" fillOpacity="0.5" />
            </svg>
          </span>
        </div>

        <div
          className="font-extrabold text-white"
          style={{
            fontSize: "9cqw",
            letterSpacing: "-0.03em",
            padding: "2cqw 1.5cqw 4cqw",
          }}
        >
          Wallet
        </div>

        <div className="relative" style={{ padding: "0 1cqw" }}>
          {cards.map((d, i) => (
            <div
              key={d.id}
              style={{
                marginTop: i === 0 ? 0 : "-50%",
                position: "relative",
                zIndex: i,
              }}
            >
              <DesignCard design={d} priority={i === cards.length - 1} />
            </div>
          ))}
        </div>
        <span className="iphone-home" />
      </div>
    </div>
  );
}
