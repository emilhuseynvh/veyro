import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DownloadCTA } from "@/components/DownloadCTA";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to open Veyro",
  description: `Veyro is distributed outside the Mac App Store, so macOS asks you to approve it the first time. Here is how to open ${site.name} in two clicks.`,
  alternates: { canonical: "/open" },
};

const steps = [
  {
    n: "1",
    title: "Move Veyro to Applications",
    body: "Open the downloaded .dmg and drag the Veyro icon onto the Applications folder. Then eject the disk image.",
  },
  {
    n: "2",
    title: "Open it from Applications",
    body: "Double-click Veyro. macOS shows a notice because the app is from outside the App Store. Leave it on screen and go to the next step.",
  },
  {
    n: "3",
    title: "Click Open Anyway",
    body: "Open System Settings → Privacy & Security, scroll to Security, and click “Open Anyway” next to Veyro. Confirm with Open. You only do this once.",
  },
];

export default function OpenPage() {
  return (
    <>
      <Nav />
      <main className="section">
        <div className="container-x max-w-3xl">
          <p className="text-sm font-medium text-mute">First launch</p>
          <h1 className="display display-md mt-3">How to open {site.name}.</h1>
          <p className="lede mt-5">
            {site.name} is distributed outside the Mac App Store, so the very
            first time you open it macOS asks you to approve it. It takes two
            clicks, and only once.
          </p>

          <ol className="mt-12 grid gap-4">
            {steps.map((s) => (
              <li
                key={s.n}
                className="flex gap-5 rounded-2xl bg-surface p-6 ring-1 ring-line sm:p-7"
              >
                <span className="display display-sm shrink-0 text-ink">
                  {s.n}
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-ink">{s.title}</h2>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-2xl bg-surface p-6 ring-1 ring-line sm:p-7">
            <h2 className="text-lg font-semibold text-ink">
              Why does macOS ask?
            </h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
              {site.name} uses a local connection to your iPhone that App Store
              apps are not allowed to use, so it ships directly instead. It is
              not notarized by Apple, which is why you approve it by hand. The
              app makes no network requests of its own and keeps everything on
              your Mac.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <DownloadCTA className="btn btn-accent">Download {site.name}</DownloadCTA>
            <a href="/#faq" className="btn btn-ghost">
              More questions
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
