import Link from "next/link";
import { Logo } from "./Logo";
import { DownloadCTA } from "./DownloadCTA";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#gallery", label: "Designs" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 pt-3 sm:pt-4">
      <div className="container-x">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-14 max-w-3xl items-center justify-between rounded-full border border-line bg-white/5 pl-4 pr-2 shadow-[0_10px_40px_-20px_rgba(0,0,0,.8)] backdrop-blur-xl"
        >
          <Link href="/" className="flex items-center gap-2.5" aria-label="Veyro home">
            <Logo />
          </Link>
          <ul className="hidden items-center gap-6 text-[0.9375rem] font-medium text-ink-2 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <DownloadCTA
            className="btn btn-accent !h-10 !px-4 text-sm"
            apple={false}
          >
            Download
          </DownloadCTA>
        </nav>
      </div>
    </header>
  );
}
