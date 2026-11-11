import { site } from "@/lib/site";
import { Check } from "./icons";
import { DownloadCTA } from "./DownloadCTA";
import { Reveal } from "./Reveal";

const included = [
  "Unlimited uploads",
  "The full design gallery",
  "Your own PNG or JPG on any card",
  "Undo on every card",
  "No account, no card details",
  "Every update during early access",
];

export function Pricing() {
  return (
    <section id="pricing" className="section" aria-labelledby="pricing-title">
      <div className="container-x">
        <div className="max-w-2xl">
          <h2 id="pricing-title" className="display display-md">
            Free while we&rsquo;re
            <br />
            in early access.
          </h2>
          <p className="lede mt-5">
            There is nothing to buy yet. Download {site.name} and every feature
            is unlocked.
          </p>
        </div>

        <Reveal className="mt-14 grid gap-10 rounded-3xl bg-surface-2 p-8 ring-1 ring-purple/50 shadow-[0_30px_80px_-30px_rgba(148,83,255,.45)] sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-12">
          <div>
            <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-ink">
              Early access
            </span>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="display display-lg tabular-nums">$0</span>
              <span className="text-mute">no card needed</span>
            </p>
            <div className="mt-8">
              <DownloadCTA className="btn btn-accent">Download for Mac</DownloadCTA>
            </div>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {included.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[0.9375rem] text-ink-2">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </Reveal>

        <p className="mt-6 max-w-2xl text-sm text-mute">
          If paid plans arrive later, they will be announced here first, before
          anything changes.
        </p>
      </div>
    </section>
  );
}
