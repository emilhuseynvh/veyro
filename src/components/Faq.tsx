import { faqs } from "@/lib/site";
import { Plus } from "./icons";

export function Faq() {
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="faq-title" className="display display-md">
            Questions, answered plainly.
          </h2>
          <p className="lede mt-5">
            Anything missing? Write to{" "}
            <a
              href="mailto:hello@veyro.biz"
              className="font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            >
              hello@veyro.biz
            </a>
            .
          </p>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f, i) => (
            <details key={f.q} className="group" open={i === 0}>
              <summary className="flex items-center justify-between gap-6 py-5 text-left text-[1.0625rem] font-semibold">
                <span>{f.q}</span>
                <Plus className="faq-icon h-5 w-5 shrink-0 text-mute" />
              </summary>
              <p className="measure pb-6 text-ink-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
