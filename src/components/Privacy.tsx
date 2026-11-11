import { site } from "@/lib/site";

const points = [
  {
    title: "Nothing leaves your Mac",
    body: "No account, no server, no analytics. Your images and your list of cards stay on the machine in front of you.",
  },
  {
    title: "Everything is reversible",
    body: "The original artwork of every card is kept. Undo one change or rewind the whole wallet in a click.",
  },
  {
    title: "Card details untouched",
    body: "Numbers, expiry dates, balances and bank connections are never read or written. Veyro changes the picture, nothing else.",
  },
];

export function Privacy() {
  return (
    <section
      className="section bg-night text-white"
      aria-labelledby="privacy-title"
    >
      <div className="container-x">
        <div className="max-w-2xl">
          <h2 id="privacy-title" className="display display-md">
            Private by construction, not by promise.
          </h2>
          <p className="lede mt-5 !text-white/70">
            {site.name} has no login screen because it has no reason to know
            who you are.
          </p>
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-3">
          {points.map((p) => (
            <div key={p.title} className="bg-night-2 p-7 sm:p-8">
              <h3 className="display display-sm">{p.title}</h3>
              <p className="mt-3 text-white/70">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
