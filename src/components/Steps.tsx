import { steps } from "@/lib/site";
import { cardDesigns } from "@/lib/cards";
import { DesignCard } from "./DesignCard";
import { PhoneMock } from "./PhoneMock";
import { Reveal } from "./Reveal";

const byId = (id: string) => cardDesigns.find((d) => d.id === id)!;
const grid = ["XeAU6pVlv9", "Ckzksw0UQb", "8cq1E7PpGz", "HWu3ftXOjs", "9DMZhMiNuo", "4tnaMJriD7"].map(byId);

export function Steps() {
  return (
    <section
      id="how-it-works"
      className="section section-light"
      aria-labelledby="steps-title"
    >
      <div className="container-x">
        <div className="max-w-2xl">
          <h2 id="steps-title" className="display display-md">
            Three steps,
            <br />
            under two minutes.
          </h2>
          <p className="lede mt-5">
            No iPhone app to install, no account to create. Veyro talks to your
            phone the same way Finder already does.
          </p>
        </div>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 90} className="flex flex-col">
              <div className="relative mb-7 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[1.25rem] bg-[#0b0b0e] ring-1 ring-black/40">
                <div
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{
                    background:
                      "radial-gradient(60% 55% at 50% 30%, rgba(255,255,255,.09), transparent 70%)",
                  }}
                  aria-hidden
                />
                {i === 0 && <ConnectScene />}
                {i === 1 && <PickScene />}
                {i === 2 && <ApplyScene />}
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-sm font-semibold text-ink tabular-nums">
                  {i + 1}
                </span>
                <h3 className="display display-sm">{s.title}</h3>
              </div>
              <p className="measure mt-2.5 text-ink-2">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Step 1: iPhone connects to the Mac. */
function ConnectScene() {
  return (
    <div className="relative w-[56%]" aria-hidden>
      <PhoneMock ids={["BpK2IddcN7", "XeAU6pVlv9"]} />
      <span className="absolute -right-3 top-6 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0b0b0d] shadow-lg">
        <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
        iPhone connected
      </span>
    </div>
  );
}

/** Step 2: the Veyro Mac app, mid-drag over a grid of real designs. */
function PickScene() {
  return (
    <div
      className="macwin absolute left-[6%] right-[6%] top-1/2 w-auto -translate-y-1/2 text-[9px]"
      aria-hidden
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-1.5 flex items-center gap-1 font-semibold tracking-tight text-white/80">
          <svg width="9" height="9" viewBox="0 0 96 96" fill="none">
            <rect width="96" height="96" rx="24" fill="#161619" />
            <path d="M27 30 L48 66 L69 30" stroke="#6b6b73" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M27 30 L48 66" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Veyro
        </span>
      </div>
      <div className="relative p-2.5">
        <div className="grid grid-cols-3 gap-2">
          {grid.map((d, i) => (
            <div
              key={d.id}
              style={{
                position: "relative",
                zIndex: i === 2 ? 3 : undefined,
                transform:
                  i === 2
                    ? "translate(-24%, 30%) rotate(-7deg) scale(1.22)"
                    : undefined,
                filter:
                  i === 2 ? "drop-shadow(0 16px 20px rgba(0,0,0,.6))" : undefined,
              }}
            >
              <DesignCard design={d} />
            </div>
          ))}
        </div>
        {/* cursor */}
        <svg
          className="absolute left-[40%] top-[58%] drop-shadow"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#fff"
          stroke="#000"
          strokeWidth="1"
        >
          <path d="M4 2l6 16 2.5-6.5L19 9z" />
        </svg>
      </div>
    </div>
  );
}

/** Step 3: the restyled card now living in the iPhone's Wallet. */
function ApplyScene() {
  return (
    <div className="relative w-[56%]" aria-hidden>
      <PhoneMock ids={["Ckzksw0UQb", "8cq1E7PpGz", "HWu3ftXOjs"]} />
      <span className="absolute -left-3 bottom-8 inline-flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg ring-1 ring-white/15 backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
        Applied to iPhone
      </span>
    </div>
  );
}
