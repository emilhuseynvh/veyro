const features = [
  {
    title: "Your real cards, mirrored",
    body: "The moment your iPhone connects, Veyro shows every card in Wallet and marks the ones that can be restyled. Tickets, passes and gift cards stay out of the way.",
  },
  {
    title: "Drop in anything",
    body: "Drag a gallery design or your own PNG or JPG onto a card. Veyro fits it to the card shape and lets you nudge the crop before you commit.",
  },
  {
    title: "Undo, per card",
    body: "Every card keeps its own history. Step back one change, or rewind the whole wallet to the day you first plugged in.",
  },
  {
    title: "Only the picture changes",
    body: "Card numbers, expiry, your bank connection and Apple Pay itself are never touched. Tap to pay works exactly as before.",
  },
];

export function Features() {
  return (
    <section className="section" aria-labelledby="features-title">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <h2 id="features-title" className="display display-md">
            Built like a Mac utility should be.
          </h2>
          <p className="lede mt-5">
            Small, fast and honest about what it does. One window, one job.
          </p>
        </div>
        <dl className="divide-y divide-line border-y border-line">
          {features.map((f) => (
            <div
              key={f.title}
              className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8"
            >
              <dt className="font-semibold text-ink">{f.title}</dt>
              <dd className="measure text-ink-2">{f.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
