import { plans } from "@/lib/site";
import { Check } from "./icons";
import { Reveal } from "./Reveal";

export function Pricing() {
  return (
    <section id="pricing" className="section" aria-labelledby="pricing-title">
      <div className="container-x">
        <div className="max-w-2xl">
          <h2 id="pricing-title" className="display display-md">
            Your first upload is free. After that, pay once.
          </h2>
          <p className="lede mt-5">
            No subscriptions. Pick what fits, and undo is always free.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {plans.map((p, i) => {
            const featured = p.highlight === "value";
            return (
              <Reveal
                as="li"
                key={p.id}
                delay={i * 90}
                className={`flex flex-col rounded-2xl p-7 sm:p-8 ${
                  featured
                    ? "bg-surface-2 text-white ring-1 ring-purple/60 shadow-[0_30px_80px_-30px_rgba(148,83,255,.5)]"
                    : "bg-surface ring-1 ring-line"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  {p.highlight && (
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        featured
                          ? "bg-accent text-accent-ink"
                          : "bg-accent-soft text-accent"
                      }`}
                    >
                      {p.highlight === "value" ? "Best value" : "Most chosen"}
                    </span>
                  )}
                </div>
                <p
                  className={`mt-1.5 text-sm ${featured ? "text-white/65" : "text-mute"}`}
                >
                  {p.summary}
                </p>
                <p className="mt-7 flex items-baseline gap-1.5">
                  <span className="display display-md tabular-nums">
                    ${p.price.toFixed(2)}
                  </span>
                  <span
                    className={`text-sm ${featured ? "text-white/65" : "text-mute"}`}
                  >
                    {p.period}
                  </span>
                </p>
                <ul className="mt-7 space-y-3 text-[0.9375rem]">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          featured ? "text-white" : "text-accent"
                        }`}
                      />
                      <span className={featured ? "text-white/85" : "text-ink-2"}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#download"
                  className={`btn mt-8 w-full ${featured ? "btn-accent" : "btn-ghost"}`}
                >
                  Start with the free upload
                </a>
              </Reveal>
            );
          })}
        </ul>
        <p className="mt-6 max-w-2xl text-sm text-mute">
          Prices in USD, before local taxes. Purchases unlock inside the app
          and restore on any Mac with the same receipt. Refunds within 14 days.
        </p>
      </div>
    </section>
  );
}
