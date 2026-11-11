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
            A licence to use {site.name} on Macs you own. It is free during
            early access. If paid plans are introduced later, they will be
            announced on this site first, with their terms, before anyone pays.
          </p>
          <h2 className="display display-sm mt-12">What it changes</h2>
          <p className="mt-3 text-ink-2">
            {site.name} replaces the artwork shown on cards in Apple Wallet.
            It does not alter payment credentials. You remain responsible for
            the images you upload and for having the right to use them.
          </p>
          <h2 className="display display-sm mt-12">Refunds</h2>
          <p className="mt-3 text-ink-2">
            There is nothing to refund while {site.name} is free. Any paid plan
            introduced later will publish its refund terms here before it goes
            on sale.
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
