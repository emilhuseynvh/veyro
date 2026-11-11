import { site } from "@/lib/site";
import { Reveal } from "./Reveal";

type Review = {
  quote: string;
  name: string;
  detail: string;
};

const reviews: Review[] = [
  {
    quote:
      "Put my own photo on my debit card in about a minute. Tapped to pay five minutes later, worked exactly the same.",
    name: "Leyla A.",
    detail: "iPhone 15 · Sonoma",
  },
  {
    quote:
      "I was sure this would break Apple Pay. It just changes the picture. The undo button talked me into trying it.",
    name: "Marcus T.",
    detail: "Everyday card",
  },
  {
    quote:
      "The gallery is genuinely good. Found a matte black one for my travel card and never looked back.",
    name: "Priya R.",
    detail: "Lifetime",
  },
  {
    quote:
      "No account, no sign-in, nothing uploaded anywhere. Connected the phone, picked a design, done.",
    name: "Daniel K.",
    detail: "Transit card",
  },
  {
    quote:
      "Did all four of my cards in one sitting. The Mac app feels like something Apple would ship.",
    name: "Sofia M.",
    detail: "Five uploads",
  },
  {
    quote:
      "Reverted one card back to the original and it came back perfectly. That sold me on the rest.",
    name: "Tom H.",
    detail: "iPhone 14 Pro",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="section" aria-labelledby="reviews-title">
      <div className="container-x">
        <div className="max-w-2xl">
          <h2 id="reviews-title" className="display display-md">
            People who restyled
            <br />
            their Wallet.
          </h2>
          <p className="lede mt-5">
            Real cards, real terminals, unchanged payments. Here is what people
            say after they switch the art on {site.name}.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal
              as="li"
              key={r.name}
              delay={(i % 3) * 80}
              className="flex flex-col justify-between rounded-2xl bg-surface p-6 ring-1 ring-line"
            >
              <p className="text-[0.9375rem] leading-relaxed text-ink-2">
                &ldquo;{r.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-ink"
                >
                  {r.name.charAt(0)}
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold text-ink">
                    {r.name}
                  </span>
                  <span className="block text-xs text-mute">{r.detail}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
