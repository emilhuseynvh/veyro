import { compare, site } from "@/lib/site";
import { Check, Cross } from "./icons";

export function Compare() {
  return (
    <section className="section section-light" aria-labelledby="compare-title">
      <div className="container-x grid items-start gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div className="lg:sticky lg:top-28">
          <h2 id="compare-title" className="display display-md">
            Same Wallet.
            <br />
            Your look.
          </h2>
          <p className="lede mt-5">
            {site.name} only changes how your cards look. Everything Apple
            Wallet already does for you stays the same.
          </p>
        </div>

        <table className="w-full border-collapse text-[0.9375rem]">
          <caption className="sr-only">
            Feature comparison between {site.name} and Apple Wallet alone
          </caption>
          <thead>
            <tr className="text-left">
              <th scope="col" className="pb-4 font-medium text-mute">
                Feature
              </th>
              <th
                scope="col"
                className="w-24 pb-4 text-center font-semibold text-ink"
              >
                {site.name}
              </th>
              <th
                scope="col"
                className="w-24 pb-4 text-center font-medium text-mute"
              >
                Wallet
              </th>
            </tr>
          </thead>
          <tbody>
            {compare.map((row) => (
              <tr key={row.label} className="border-t border-line">
                <th
                  scope="row"
                  className="py-4 pr-4 text-left font-normal text-ink-2"
                >
                  {row.label}
                </th>
                <td className="py-4 text-center">
                  <Mark yes={row.veyro} strong />
                </td>
                <td className="py-4 text-center">
                  <Mark yes={row.wallet} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Mark({ yes, strong = false }: { yes: boolean; strong?: boolean }) {
  if (yes) {
    return (
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
          strong ? "bg-accent text-accent-ink" : "bg-surface-2 text-ink-2"
        }`}
      >
        <Check className="h-4 w-4" />
        <span className="sr-only">Yes</span>
      </span>
    );
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-line text-mute">
      <Cross className="h-3.5 w-3.5" />
      <span className="sr-only">No</span>
    </span>
  );
}
