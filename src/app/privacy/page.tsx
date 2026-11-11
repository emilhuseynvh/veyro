import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `The ${site.name} app runs entirely on your Mac and sends nothing. This page explains exactly what the app and this website do with data.`,
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
            The short version: the {site.name} app sends nothing anywhere. This
            website counts downloads and page visits, and that is all.
          </p>

          <h2 className="display display-sm mt-12">The app</h2>
          <p className="mt-3 text-ink-2">
            {site.name} runs locally on your Mac. It reads the list of cards in
            Apple Wallet on a connected iPhone and writes replacement artwork
            back. It does not read card numbers, expiry dates, balances or
            transactions. It has no account system, makes no network requests
            of its own, and includes no analytics or crash reporting. Your
            images and your card list stay on your Mac.
          </p>

          <h2 className="display display-sm mt-12">This website</h2>
          <p className="mt-3 text-ink-2">
            {site.domain} sets no cookies of its own and shows no ads. Two
            things are measured:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-ink-2">
            <li>
              <strong className="text-ink">Download clicks.</strong> When you
              press Download, our server records the time, your IP address,
              your browser&rsquo;s user-agent and whether you were on a Mac. We
              use this only to count downloads and to stop abuse. It is never
              sold or shared.
            </li>
            <li>
              <strong className="text-ink">Page visits.</strong> The site is
              served through Cloudflare, which provides Cloudflare Web
              Analytics. It counts page views without cookies and without
              building a profile of you. Cloudflare also keeps standard
              security logs.
            </li>
          </ul>

          <h2 className="display display-sm mt-12">Payments</h2>
          <p className="mt-3 text-ink-2">
            Paid plans are not on sale yet. When they are, this page will name
            the payment provider before you pay, and {site.name} will never see
            your card details.
          </p>

          <h2 className="display display-sm mt-12">Contact</h2>
          <p className="mt-3 text-ink-2">
            Questions, or a request to delete download records tied to your IP
            address, go to{" "}
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
