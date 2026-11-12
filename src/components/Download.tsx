import { site } from "@/lib/site";
import { DownloadCTA, WindowsDownloadCTA } from "./DownloadCTA";

export function Download() {
  return (
    <section
      id="download"
      className="section"
      aria-labelledby="download-title"
    >
      <div className="container-x">
        <div className="surface rounded-3xl p-8 sm:p-12 lg:p-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 id="download-title" className="display display-md">
                Get {site.name} for Mac.
              </h2>
              <p className="lede mt-5">
                Version {site.download.version}, {site.download.size}. Runs
                natively on Apple silicon. Needs{" "}
                {site.requirements.mac}.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <DownloadCTA className="btn btn-accent">
                  Download the .dmg
                </DownloadCTA>
                <WindowsDownloadCTA className="btn btn-ink">
                  Download for Windows
                </WindowsDownloadCTA>
                <a href="/open" className="btn btn-ghost">
                  How to open Veyro
                </a>
              </div>
              <p className="mt-3 text-sm text-mute">
                Windows version {site.downloadWin.version},{" "}
                {site.downloadWin.size}. Needs {site.requirements.windows} and
                Apple&nbsp;Devices (or iTunes) installed.
              </p>
            </div>
            <div className="rounded-2xl bg-black/30 p-6 ring-1 ring-line">
              <h3 className="font-semibold">First launch on macOS</h3>
              <ol className="mt-3 space-y-2.5 text-[0.9375rem] text-ink-2">
                <li className="flex gap-3">
                  <span className="font-display font-semibold text-accent tabular-nums">
                    1
                  </span>
                  Open the .dmg and drag {site.name} to Applications.
                </li>
                <li className="flex gap-3">
                  <span className="font-display font-semibold text-accent tabular-nums">
                    2
                  </span>
                  On the first open, macOS will ask you to approve the app under
                  System Settings, Privacy and Security. Click Open Anyway.
                </li>
                <li className="flex gap-3">
                  <span className="font-display font-semibold text-accent tabular-nums">
                    3
                  </span>
                  Connect your iPhone and tap Trust when it asks.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
