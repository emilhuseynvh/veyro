# Veyro — logo usage guide

The Veyro mark is **Overlap**: two rounded surfaces overlapping, with a window
opening where they meet. It says, in one shape, what the app does — put a new
look onto your Wallet card. Abstract on purpose: not a credit card, not a letter.

## The logo

| Asset | File | Use |
| --- | --- | --- |
| Symbol | `veyro-symbol.svg` | App icon, favicon, avatar, anywhere square |
| Horizontal lockup | `veyro-horizontal.svg` | Default logo — site header, docs |
| Stacked lockup | `veyro-stacked.svg` | Narrow or centred spaces |
| Reversed lockup | `veyro-horizontal-white.svg` | On dark backgrounds |
| Small-size symbol | `veyro-symbol-small.svg` | 16–24 px (wider window so it stays open) |

Exported variants and the full web-icon set are in `export/`
(black, white, mono, app-icon, favicon.ico, PNG icons, `site.webmanifest`,
`head-snippet.html`).

## Colour

| Role | HEX | Notes |
| --- | --- | --- |
| Ink (primary) | `#141414` | The mark on light backgrounds |
| White (reverse) | `#FFFFFF` | The mark on dark backgrounds |
| Tile | `#0E0E10` | App-icon background |
| Purple (accent, optional) | `#9453FF` | Ties to the current site; use sparingly |

The logo is monochrome first. It must always work in a single colour and
reversed — never rely on colour to carry it.

## Clear space & minimum size

- **Clear space:** keep a margin equal to the symbol's inner window all around
  the logo. Nothing else sits inside that space.
- **Minimum size:** symbol 16 px; horizontal lockup 96 px wide. Below 24 px use
  `veyro-symbol-small.svg`.

## Backgrounds

- Ink mark on white or light neutral (`#F5F5F7` is fine).
- White mark on `#0E0E10`–`#141414` or a dark photo with enough contrast.
- Avoid busy photos behind the mark; put it on a solid tile instead.

## Don't

- Don't recolour the mark with gradients or more than one colour.
- Don't rotate, stretch, outline or add shadows to the mark.
- Don't fill in the overlap window or change the two radii.
- Don't re-space or substitute the wordmark font.

## Wordmark note

The wordmark is set in **Futura (medium, lowercase, −2 tracking)**. For
production files that don't depend on a font, outline the wordmark from a
licensed Futura, or switch to **Jost** (Google Fonts, open-source, Futura-like)
and outline that — same look, no licence cost. The symbol itself is already
pure vector and needs no font.
