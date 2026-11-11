import { site } from "@/lib/site";
import { PhoneMock } from "./PhoneMock";
import { Reveal } from "./Reveal";
import { Check } from "./icons";

const places = [
  {
    title: "In Apple Wallet",
    body: "The card face you chose, every time you open Wallet to pay.",
  },
  {
    title: "On the Lock Screen",
    body: "Double-click the side button and the restyled card is right there.",
  },
  {
    title: "At the terminal",
    body: "Tap to pay and the new look shows on the reader. The payment is unchanged.",
  },
];

export function Moments() {
  return (
    <section
      id="where"
      className="section"
      aria-labelledby="moments-title"
    >
      <div className="container-x grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="order-2 flex justify-center lg:order-1">
          <PhoneMock
            ids={["Ckzksw0UQb", "8ETnWyn0tf", "XeAU6pVlv9", "8cq1E7PpGz", "BpK2IddcN7"]}
            className="w-[300px] max-w-full"
          />
        </Reveal>

        <Reveal className="order-1 lg:order-2">
          <h2 id="moments-title" className="display display-md">
            Lands right in
            <br />
            Apple Wallet.
          </h2>
          <p className="lede mt-5">
            Veyro writes the new art to the card itself, so it appears wherever
            the card already does. Nothing about {site.name} is visible on the
            phone. Only the card.
          </p>

          <ul className="mt-9 grid gap-5">
            {places.map((p) => (
              <li key={p.title} className="flex gap-4">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-ink">
                  <Check className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-2">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
