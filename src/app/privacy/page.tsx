import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `${site.name} runs entirely on your Mac. No account, no server, no analytics. This page explains exactly what the app and this website do with data.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="section">
        <article className="container-x prose-veyro max-w-3xl">
          <h1 className="display display-md">Privacy</h1>
          <p className="lede mt-5">
            The short version: {site.name} does not collect anything, because it
            has nowhere to send it.
          </p>
          <h2 className="display display-sm mt-12">The app</h2>
          <p className="mt-3 text-ink-2">
            {site.name} runs locally on your Mac. It reads the list of cards in
            Apple Wallet on a connected iPhone and writes replacement artwork
            back. It does not read card numbers, expiry dates, balances or
            transactions. It has no account system, makes no network requests
            of its own, and includes no analytics or crash reporting.
          </p>
          <p className="mt-3 text-ink-2">
            Purchases are processed by the payment provider named at checkout.
            {site.name} stores a local receipt so your purchase can be restored.
          </p>
          <h2 className="display display-sm mt-12">This website</h2>
          <p className="mt-3 text-ink-2">
            {site.domain} sets no cookies and runs no third-party trackers. The
            hosting provider keeps standard server logs for security.
          </p>
          <h2 className="display display-sm mt-12">Contact</h2>
          <p className="mt-3 text-ink-2">
            Questions go to{" "}
            <a href={`mailto:${site.email}`} className="underline">
              {site.email}
            </a>
            .
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
