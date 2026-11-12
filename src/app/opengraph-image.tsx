import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = `${site.name}: custom Apple Wallet card designs, from your Mac`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const dir = join(process.cwd(), "src/app/_og");
const font = (f: string) => readFile(join(dir, f));
const card = async (id: string) =>
  `data:image/jpeg;base64,${(await readFile(join(dir, `${id}.jpg`))).toString("base64")}`;

const LIME = "#cdfb45";
const PURPLE = "#9453ff";

export default async function OpenGraphImage() {
  const [display, body, c1, c2, c3] = await Promise.all([
    font("BricolageGrotesque-ExtraBold.ttf"),
    font("InstrumentSans-Medium.ttf"),
    card("XeAU6pVlv9"),
    card("8ETnWyn0tf"),
    card("BpK2IddcN7"),
  ]);

  const cards = [
    { src: c1, left: 650, top: 70, rot: -16 },
    { src: c2, left: 735, top: 175, rot: -5 },
    { src: c3, left: 790, top: 300, rot: 7 },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#09090b",
          backgroundImage: `radial-gradient(circle at 8% 0%, rgba(148,83,255,.45), transparent 42%), radial-gradient(circle at 92% 100%, rgba(205,251,69,.32), transparent 45%)`,
          color: "#f4f4f5",
          fontFamily: "Body",
        }}
      >
        {/* brand */}
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 64,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "Display",
            fontSize: 32,
          }}
        >
          <svg width="46" height="46" viewBox="38 38 180 180" fill="none">
            <path
              fillRule="evenodd"
              fill="#9453FF"
              d="M74 46H142A28 28 0 0 1 170 74V142A28 28 0 0 1 142 170H74A28 28 0 0 1 46 142V74A28 28 0 0 1 74 46Z M114 86H182A28 28 0 0 1 210 114V182A28 28 0 0 1 182 210H114A28 28 0 0 1 86 182V114A28 28 0 0 1 114 86Z"
            />
          </svg>
          {site.name}
        </div>

        {/* headline */}
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 172,
            display: "flex",
            flexDirection: "column",
            fontFamily: "Display",
            fontSize: 92,
            lineHeight: 0.98,
            letterSpacing: -4,
          }}
        >
          <span>Your wallet.</span>
          <div style={{ display: "flex" }}>
            <span>Your&nbsp;</span>
            <div style={{ display: "flex", position: "relative" }}>
              <span style={{ color: LIME }}>artwork</span>
              <svg
                width="300"
                height="22"
                viewBox="0 0 220 24"
                fill="none"
                style={{ position: "absolute", left: 4, bottom: -18 }}
              >
                <path d="M4 15c40-12 92-14 150-6 18 2 40 6 62 2" stroke={LIME} strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>
            <span>.</span>
          </div>
        </div>

        {/* subline */}
        <div
          style={{
            position: "absolute",
            left: 72,
            top: 420,
            width: 540,
            fontSize: 28,
            lineHeight: 1.35,
            color: "#b2b2ba",
          }}
        >
          Restyle the cards in Apple Wallet from your Mac. Free in early access.
        </div>

        {/* footer pill */}
        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: 56,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 22px",
            borderRadius: 999,
            background: PURPLE,
            color: "#fff",
            fontSize: 22,
          }}
        >
          Download for Mac · {site.domain}
        </div>

        {/* cards */}
        {cards.map((c, i) => (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img
            key={i}
            src={c.src}
            width={420}
            height={265}
            style={{
              position: "absolute",
              left: c.left,
              top: c.top,
              width: 420,
              height: 265,
              borderRadius: 22,
              objectFit: "cover",
              transform: `rotate(${c.rot}deg)`,
              boxShadow: "0 30px 60px rgba(0,0,0,.6)",
              border: "1px solid rgba(255,255,255,.12)",
            }}
          />
        ))}
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: display, weight: 800, style: "normal" },
        { name: "Body", data: body, weight: 500, style: "normal" },
      ],
    },
  );
}
