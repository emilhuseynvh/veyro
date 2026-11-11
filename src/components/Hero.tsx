import { site } from "@/lib/site";
import { cardDesigns } from "@/lib/cards";
import { DesignCard } from "./DesignCard";
import { PhoneMock } from "./PhoneMock";
import { DownloadCTA } from "./DownloadCTA";

const byId = (id: string) => cardDesigns.find((d) => d.id === id)!;

export function Hero() {
  return (
    <section
      className="relative overflow-hidden pt-10 pb-20 sm:pt-16"
      aria-labelledby="hero-title"
    >
      <div className="container-x grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <div className="relative z-10 max-w-2xl">
          <h1 id="hero-title" className="display display-lg">
            Your wallet.
            <br />
            Your{" "}
            <span className="relative whitespace-nowrap text-accent">
              artwork
              <svg
                className="absolute -bottom-4 left-0 w-full"
                viewBox="0 0 220 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 15c40-12 92-14 150-6 18 2 40 6 62 2"
                  stroke="var(--accent)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>
          <p className="lede mt-9">
            {site.name} changes the look of the cards in Apple Wallet, straight
            from your Mac. Pick a design or drop in your own image. Your card
            keeps paying exactly as it did.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <DownloadCTA className="btn btn-accent !h-13 !px-7 text-base">
              Download for Mac
            </DownloadCTA>
            <a href="#how-it-works" className="btn btn-ghost !h-13 !px-6">
              See how it works
            </a>
          </div>
          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
            <Feature
              label="No account, ever"
              sub="Runs entirely on your Mac"
              icon={
                <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
              }
            />
            <Feature
              label="Undo on every card"
              sub="Originals are always saved"
              icon={
                <>
                  <path d="M3 10a8 8 0 1 1 1 4" />
                  <path d="M3 5v5h5" />
                </>
              }
            />
          </dl>
        </div>

        <HeroArt />
      </div>
    </section>
  );
}

function Feature({
  label,
  sub,
  icon,
}: {
  label: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {icon}
        </svg>
      </span>
      <div>
        <dt className="text-sm font-semibold text-ink">{label}</dt>
        <dd className="text-xs text-mute">{sub}</dd>
      </div>
    </div>
  );
}

/** Phone-in-scene with floating cards and ambient colour glows. */
function HeroArt() {
  return (
    <div className="relative mx-auto h-[560px] w-full max-w-[520px] sm:h-[600px]">
      <div className="glow glow-purple left-[-6%] top-[8%] h-[300px] w-[300px]" />
      <div className="glow glow-lime right-[-4%] bottom-[6%] h-[280px] w-[280px]" />

      {/* sparkle */}
      <svg
        className="absolute right-[2%] top-[2%] text-white"
        width="46"
        height="46"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 0c.6 6 1.4 6.8 7.4 7.4C13.4 8 12.6 8.8 12 14.8 11.4 8.8 10.6 8 4.6 7.4 10.6 6.8 11.4 6 12 0z" />
      </svg>

      {/* floating card behind, left */}
      <div className="absolute left-[-2%] top-[30%] w-[58%] rotate-[-12deg] opacity-95">
        <DesignCard design={byId("8cq1E7PpGz")} />
      </div>

      {/* lime glass card, right */}
      <div
        className="glass absolute right-[-4%] top-[22%] flex aspect-[1.586/1] w-[60%] rotate-[10deg] flex-col justify-between rounded-[18px] p-4"
        style={{
          background:
            "linear-gradient(145deg, rgba(205,251,69,.85), rgba(150,210,40,.55) 55%, rgba(20,22,16,.6))",
        }}
        aria-hidden
      >
        <div className="flex justify-end">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1a2208" strokeWidth={1.8} strokeLinecap="round">
            <path d="M6 8a8 8 0 0 1 0 8" />
            <path d="M9.5 6a11 11 0 0 1 0 12" />
          </svg>
        </div>
        <div className="font-display text-[13px] font-bold tracking-[0.12em] text-[#1a2208]">
          0000 0000
        </div>
      </div>

      {/* phone, front and centre */}
      <div className="absolute left-1/2 top-0 w-[50%] max-w-[270px] -translate-x-1/2">
        <PhoneMock ids={["HWu3ftXOjs", "Ckzksw0UQb", "BpK2IddcN7", "XeAU6pVlv9", "8ETnWyn0tf"]} />
      </div>
    </div>
  );
}
