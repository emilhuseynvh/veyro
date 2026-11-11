import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

const groups = [
  {
    title: "Product",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#gallery", label: "Designs" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#download", label: "Download" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/#faq", label: "FAQ" },
      { href: `mailto:${site.email}`, label: "Email support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/llms.txt", label: "llms.txt" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-[#0b0b0d]">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Link href="/" aria-label="Veyro home">
              <Logo />
            </Link>
            <p className="mt-4 text-sm text-ink-2">{site.tagline}.</p>
          </div>
          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <h2 className="text-sm font-semibold">{g.title}</h2>
              <ul className="mt-3 space-y-2 text-sm text-ink-2">
                {g.links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("/") ? (
                      <Link href={l.href} className="hover:text-ink">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} className="hover:text-ink">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-12 max-w-3xl text-xs leading-relaxed text-mute">
          {site.name} is an independent project and is not affiliated with or
          endorsed by Apple Inc. Apple, Apple Pay, Apple Wallet, iPhone and Mac
          are trademarks of Apple Inc. Card designs shown are illustrations and
          may resemble third-party brands; those marks belong to their owners.
          Copyright {new Date(site.launched).getFullYear()} {site.name}.
        </p>
      </div>
    </footer>
  );
}
