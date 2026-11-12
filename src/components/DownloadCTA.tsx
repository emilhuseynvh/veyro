"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { site } from "@/lib/site";
import { AppleMark, Check, Cross, WindowsMark } from "./icons";

/**
 * Windows download button. The installer is a direct .exe download, so there is
 * no "send to your Mac" modal — it just downloads and pings analytics.
 */
export function WindowsDownloadCTA({
  className = "btn btn-ink",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  function ping() {
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api) return;
    try {
      void fetch(`${api}/api/v1/downloads`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ platform: "windows", version: site.downloadWin.version }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* analytics is best-effort */
    }
  }

  return (
    <a href={site.downloadWin.url} download onClick={ping} className={className}>
      <WindowsMark className="h-4 w-4" />
      {children}
    </a>
  );
}

/**
 * Download button that knows where it is. On a Mac it downloads the .dmg
 * directly. On a phone or anything else it opens a small modal so the visitor
 * can send the link to their Mac, the way CardLARP does.
 */
export function DownloadCTA({
  className = "btn btn-ink",
  apple = true,
  children,
}: {
  className?: string;
  apple?: boolean;
  children: ReactNode;
}) {
  // Assume Mac during SSR so the plain anchor download still works without JS.
  const [isMac, setIsMac] = useState(true);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isApplePhone = /iPhone|iPad|iPod/.test(ua);
    // iPadOS reports as "Macintosh" but has a touch screen.
    const isIpadOS = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
    const mac = /Macintosh|Mac OS X/.test(ua) && !isApplePhone && !isIpadOS;
    setIsMac(mac);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // Keep the page from scrolling behind the modal.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const shareUrl = site.url;
  const mailHref = `mailto:?subject=${encodeURIComponent(
    `${site.name} for Mac`,
  )}&body=${encodeURIComponent(
    `Open this on your Mac to download ${site.name}: ${shareUrl}`,
  )}`;

  function pingDownload(platform: "mac" | "other") {
    const api = process.env.NEXT_PUBLIC_API_URL;
    if (!api) return;
    try {
      void fetch(`${api}/api/v1/downloads`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ platform, version: site.download.version }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* analytics is best-effort */
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the email option still works */
    }
  }

  return (
    <>
      <a
        href={site.download.url}
        download
        onClick={(e) => {
          pingDownload(isMac ? "mac" : "other");
          if (!isMac) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={className}
      >
        {apple && <AppleMark className="h-4 w-4" />}
        {children}
      </a>

      {/* Portal to <body>: the nav uses backdrop-filter, which would otherwise
          trap this fixed overlay inside the nav instead of the viewport. */}
      {open &&
        createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sendmac-title"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-4"
        >
          <button
            aria-label="Close"
            className="absolute inset-0 cursor-default bg-black/65 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="surface relative w-full max-w-md rounded-3xl p-7 shadow-[0_40px_90px_-24px_rgba(0,0,0,.8)] sm:p-8">
            <button
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-mute transition-colors hover:bg-white/10 hover:text-ink"
            >
              <Cross className="h-4 w-4" />
            </button>
            <h3 id="sendmac-title" className="display display-sm">
              {site.name} runs on your Mac.
            </h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
              {site.name} is a Mac app that restyles the cards on your connected
              iPhone. Send yourself the link and open it on your Mac to
              download.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={copyLink}
                className="btn btn-ink w-full"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Link copied
                  </>
                ) : (
                  "Copy link"
                )}
              </button>
              <a href={mailHref} className="btn btn-ghost w-full">
                Email me the link
              </a>
            </div>
            <p className="mt-4 text-xs text-mute">
              Needs {site.requirements.mac}.
            </p>
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
