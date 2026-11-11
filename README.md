# Veyro — veyro.biz

Marketing site for Veyro, a Mac app that changes the artwork of cards in Apple Wallet.

Built with Next.js (App Router, Cache Components), Tailwind CSS v4 and `next/font`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Where things live

| Path | What |
| --- | --- |
| `src/lib/site.ts` | All copy that is also data: pricing, FAQ, comparison table, steps, requirements, download info. Edit here first. |
| `src/lib/designs.ts` | Card artworks as CSS backgrounds. |
| `src/app/layout.tsx` | Fonts, global `metadata`, viewport, JSON-LD. |
| `src/components/JsonLd.tsx` | One schema.org graph: Organization, WebSite, WebPage, SoftwareApplication with Offers, HowTo, FAQPage. |
| `src/app/opengraph-image.tsx` | Generated 1200×630 social image. `twitter-image.tsx` re-exports it. |
| `src/app/icon.tsx` | Generated favicon / app icon. |
| `src/app/sitemap.ts`, `robots.ts`, `manifest.ts` | Crawl and PWA metadata. Robots explicitly allows AI crawlers. |
| `public/llms.txt` | Plain-text summary for AI assistants. |

## Before launch

- Put the real `Veyro.dmg` at `public/download/Veyro.dmg` or change `site.download.url`.
- Set real social handles in `site.social` and the `twitter.creator` field in `layout.tsx`.
- Verify structured data at https://validator.schema.org and https://search.google.com/test/rich-results.
