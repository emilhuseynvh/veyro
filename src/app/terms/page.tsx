import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms of use for the ${site.name} Mac app and the ${site.domain} website.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="section">
        <article className="container-x max-w-3xl">
          <h1 className="display display-md">Terms</h1>
          <p className="lede mt-5">
            Plain terms for a small tool. Last updated {site.launched}.
          </p>
          <h2 className="display display-sm mt-12">What you get</h2>
          <p className="mt-3 text-ink-2">
            A licence to use {site.name} on Macs you own. The first upload is
            free. Paid tiers are one-time purchases and never renew.
          </p>
          <h2 className="display display-sm mt-12">What it changes</h2>
          <p className="mt-3 text-ink-2">
            {site.name} replaces the artwork shown on cards in Apple Wallet.
            It does not alter payment credentials. You remain responsible for
            the images you upload and for having the right to use them.
          </p>
          <h2 className="display display-sm mt-12">Refunds</h2>
          <p className="mt-3 text-ink-2">
            Within 14 days of purchase, for any reason. Email {site.email} with
            your order number.
          </p>
          <h2 className="display display-sm mt-12">No affiliation</h2>
          <p className="mt-3 text-ink-2">
            {site.name} is an independent project and is not affiliated with
            or endorsed by Apple Inc. Apple, Apple Pay, Apple Wallet, iPhone
            and Mac are trademarks of Apple Inc.
          </p>
          <h2 className="display display-sm mt-12">Warranty</h2>
          <p className="mt-3 text-ink-2">
            The software is provided as is. Every change it makes can be
            undone from inside the app, and the original artwork of every card
            is kept.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
