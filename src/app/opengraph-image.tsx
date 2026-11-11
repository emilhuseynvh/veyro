import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: custom Apple Wallet card designs, from your Mac`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const cards = [
  { bg: "linear-gradient(135deg,#1f8f78,#063a30)", rot: -14, x: 700, y: 110 },
  { bg: "linear-gradient(135deg,#e9eaee,#a6a9b2)", rot: -6, x: 780, y: 230 },
  { bg: "linear-gradient(160deg,#ffb37a,#ff6f91 45%,#6b3fd6)", rot: 4, x: 860, y: 350 },
];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f3f4f6",
          position: "relative",
          fontFamily: "sans-serif",
          color: "#15161a",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 72,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          <svg width="40" height="40" viewBox="0 0 96 96" fill="none">
            <rect width="96" height="96" rx="24" fill="#161619" />
            <path
              d="M27 30 L48 66 L69 30"
              stroke="#6b6b73"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M27 30 L48 66"
              stroke="#ffffff"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          {site.name}
        </div>

        <div
          style={{
            position: "absolute",
            left: 72,
            top: 200,
            display: "flex",
            flexDirection: "column",
            width: 620,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 84,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 0.98,
            }}
          >
            <span>Your wallet.</span>
            <span>Your artwork.</span>
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              lineHeight: 1.35,
              color: "#4b4e58",
            }}
          >
            Change the look of your Apple Pay cards from your Mac. First upload free.
          </div>
        </div>

        {cards.map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              width: 380,
              height: 240,
              borderRadius: 26,
              background: c.bg,
              transform: `rotate(${c.rot}deg)`,
              boxShadow: "0 30px 60px -20px rgba(21,22,26,.45)",
              display: "flex",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 30,
                top: 86,
                width: 54,
                height: 40,
                borderRadius: 9,
                background: "rgba(255,255,255,.75)",
              }}
            />
          </div>
        ))}

        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: 60,
            fontSize: 24,
            color: "#7a7e8a",
          }}
        >
          {site.domain}
        </div>
      </div>
    ),
    size,
  );
}
