// Card artworks are pure CSS so the site ships no heavy images and nothing
// here resembles a real issuer's trademarked design.

export type Design = {
  id: string;
  name: string;
  tags: string[];
  /** CSS `background` value for the card face. */
  background: string;
  /** Foreground ink for the chip, number and name on this card. */
  ink: "light" | "dark";
};

export const designs: Design[] = [
  {
    id: "jade",
    name: "Deep Jade",
    tags: ["dark", "metal"],
    background:
      "radial-gradient(120% 90% at 100% 0%, #1f8f78 0%, transparent 55%), radial-gradient(80% 80% at 0% 100%, #063a30 0%, transparent 60%), #0b4a3d",
    ink: "light",
  },
  {
    id: "brushed",
    name: "Brushed Steel",
    tags: ["metal", "light"],
    background:
      "repeating-linear-gradient(90deg, rgba(255,255,255,.35) 0 1px, transparent 1px 3px), linear-gradient(135deg, #e9eaee 0%, #b9bcc4 40%, #f2f3f5 60%, #a6a9b2 100%)",
    ink: "dark",
  },
  {
    id: "dusk",
    name: "Dusk",
    tags: ["gradient", "warm"],
    background:
      "linear-gradient(160deg, #ffb37a 0%, #ff6f91 45%, #6b3fd6 100%)",
    ink: "light",
  },
  {
    id: "ink",
    name: "Matte Black",
    tags: ["dark", "minimal"],
    background:
      "radial-gradient(90% 70% at 20% 10%, #2a2b31 0%, transparent 60%), #121317",
    ink: "light",
  },
  {
    id: "topo",
    name: "Topography",
    tags: ["pattern", "light"],
    background:
      "repeating-radial-gradient(circle at 70% 40%, transparent 0 14px, rgba(21,22,26,.12) 14px 15px), #eef0e9",
    ink: "dark",
  },
  {
    id: "aurora",
    name: "Aurora",
    tags: ["gradient", "cool"],
    background:
      "radial-gradient(70% 90% at 80% 20%, #7ef0c8 0%, transparent 60%), radial-gradient(60% 80% at 10% 90%, #4f7dff 0%, transparent 60%), #0d1b3d",
    ink: "light",
  },
  {
    id: "checker",
    name: "Checker",
    tags: ["pattern", "bold"],
    background:
      "conic-gradient(#15161a 25%, #f6f6f3 0 50%, #15161a 0 75%, #f6f6f3 0) 0 0 / 36px 36px",
    ink: "light",
  },
  {
    id: "gold",
    name: "Soft Gold",
    tags: ["metal", "warm"],
    background:
      "linear-gradient(120deg, #f5e3b3 0%, #d8b96a 35%, #f7ebc6 55%, #c9a452 100%)",
    ink: "dark",
  },
  {
    id: "grid",
    name: "Blueprint",
    tags: ["pattern", "cool"],
    background:
      "linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px) 0 0 / 20px 20px, linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px) 0 0 / 20px 20px, #1b4fd8",
    ink: "light",
  },
  {
    id: "clay",
    name: "Clay",
    tags: ["warm", "minimal"],
    background: "linear-gradient(150deg, #f0d6c5 0%, #d29b80 100%)",
    ink: "dark",
  },
  {
    id: "noise",
    name: "Static",
    tags: ["pattern", "dark"],
    background:
      "repeating-linear-gradient(45deg, rgba(255,255,255,.07) 0 2px, transparent 2px 6px), #2b2d35",
    ink: "light",
  },
  {
    id: "mint",
    name: "Mint Paper",
    tags: ["light", "minimal"],
    background: "linear-gradient(180deg, #e6f6ef 0%, #c8ead9 100%)",
    ink: "dark",
  },
];

/** The designs the hero cycles through. */
export const heroDesigns = ["jade", "brushed", "dusk", "ink", "aurora", "gold"]
  .map((id) => designs.find((d) => d.id === id)!)
  .filter(Boolean);
