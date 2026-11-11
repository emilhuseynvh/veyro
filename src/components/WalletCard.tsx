import type { CSSProperties } from "react";
import type { Design } from "@/lib/designs";

type Props = {
  design: Design;
  className?: string;
  style?: CSSProperties;
  /** Show chip, masked number and holder line. */
  detailed?: boolean;
  label?: string;
};

/**
 * A payment card rendered entirely in CSS. Chip and contactless mark are
 * generic; no issuer logos.
 */
export function WalletCard({
  design,
  className = "",
  style,
  detailed = true,
  label,
}: Props) {
  const light = design.ink === "light";
  const fg = light ? "rgba(255,255,255,.92)" : "rgba(21,22,26,.88)";
  const fgSoft = light ? "rgba(255,255,255,.6)" : "rgba(21,22,26,.55)";

  return (
    <div
      className={`wcard ${className}`}
      style={style}
      role="img"
      aria-label={`${label ?? "Card"} with the ${design.name} design`}
    >
      <div className="wcard-face" style={{ background: design.background }} />
      {detailed && (
        <div
          className="wcard-face flex flex-col justify-between p-[6%]"
          style={{ color: fg }}
        >
          <div className="flex items-start justify-between">
            <span
              className="block rounded-[14%] border"
              style={{
                width: "14%",
                aspectRatio: "1.3 / 1",
                background: light
                  ? "linear-gradient(135deg,#f4e5b7,#c9a452)"
                  : "linear-gradient(135deg,#f8edc7,#d4b36a)",
                borderColor: "rgba(0,0,0,.15)",
              }}
              aria-hidden
            />
            <svg
              viewBox="0 0 24 24"
              width="11%"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              aria-hidden
              style={{ opacity: 0.85 }}
            >
              <path d="M6 8a8 8 0 0 1 0 8" />
              <path d="M9.5 6a11 11 0 0 1 0 12" />
              <path d="M13 4a14 14 0 0 1 0 16" />
            </svg>
          </div>
          <div>
            <div
              className="font-medium tracking-[0.12em]"
              style={{ fontSize: "clamp(9px, 4.2cqw, 15px)" }}
            >
              •••• 4821
            </div>
            <div
              className="mt-[2%] flex items-end justify-between"
              style={{ color: fgSoft, fontSize: "clamp(7px, 3cqw, 11px)" }}
            >
              <span>{label ?? "Everyday card"}</span>
              <span>{design.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
