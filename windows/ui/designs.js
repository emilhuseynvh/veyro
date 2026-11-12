// Card artworks shared between the renderer (CSS preview) and the main process
// (rasterised to PNG for applying). Each design is expressed as an SVG paint so
// the exact same look renders in the browser and on the card.
// CommonJS so the main process can require it; the renderer loads it as a global.

// Image-based card artworks. Each `img` is a file under the renderer's
// `designs/` folder, used both for the gallery/preview and rasterised to the
// exact card PNG that gets applied. `ink` picks the overlay text colour.
const DESIGNS = [
  // Card art from the CardArt catalog (cardart.cc), the gallery CardLARP uses.
  { id: "g5lm22n1ym", name: "Centurion", tags: ["dark", "metal"], ink: "light", img: "designs/cc/g5lm22n1ym.webp" },
  { id: "3AUQeNPlEz", name: "Amex Platinum", tags: ["metal", "light"], ink: "dark", img: "designs/cc/3AUQeNPlEz.webp" },
  { id: "v2n62X5gWR", name: "Night Cat", tags: ["dark", "minimal"], ink: "light", img: "designs/cc/v2n62X5gWR.webp" },
  { id: "XeAU6pVlv9", name: "Amex Black", tags: ["dark", "metal"], ink: "light", img: "designs/cc/XeAU6pVlv9.webp" },
  { id: "Ckzksw0UQb", name: "Amex Gold", tags: ["metal", "warm"], ink: "dark", img: "designs/cc/Ckzksw0UQb.webp" },
  { id: "tjtp0178Fm", name: "Centurion Art", tags: ["dark", "metal"], ink: "light", img: "designs/cc/tjtp0178Fm.webp" },
  { id: "ijJEklufk6", name: "Santander", tags: ["dark", "minimal"], ink: "light", img: "designs/cc/ijJEklufk6.webp" },
  { id: "QnOQt8KumL", name: "JP Morgan", tags: ["metal", "light"], ink: "dark", img: "designs/cc/QnOQt8KumL.webp" },
  { id: "4tnaMJriD7", name: "Aeternum", tags: ["dark", "minimal"], ink: "light", img: "designs/cc/4tnaMJriD7.webp" },
  { id: "psJG4HTXMX", name: "Platinum Art", tags: ["metal", "light"], ink: "dark", img: "designs/cc/psJG4HTXMX.webp" },
  { id: "uzJawpHnQV", name: "Centurion HD", tags: ["dark", "metal"], ink: "light", img: "designs/cc/uzJawpHnQV.webp" },
  { id: "r6381QWUmy", name: "Liquid Glass", tags: ["light", "minimal"], ink: "dark", img: "designs/cc/r6381QWUmy.webp" },
  { id: "X2d33vf9P5", name: "Bradesco", tags: ["dark", "minimal"], ink: "light", img: "designs/cc/X2d33vf9P5.webp" },
  { id: "QRfRoyQajv", name: "Monogram Blue", tags: ["cool", "pattern"], ink: "light", img: "designs/cc/QRfRoyQajv.webp" },
  { id: "8cq1E7PpGz", name: "Sapphire Reserve", tags: ["cool", "metal"], ink: "light", img: "designs/cc/8cq1E7PpGz.webp" },
  { id: "U1jT3d5tx2", name: "Beyond", tags: ["cool", "minimal"], ink: "light", img: "designs/cc/U1jT3d5tx2.webp" },
  { id: "Kcq1vQSlSQ", name: "Centurion Carbon", tags: ["dark", "pattern"], ink: "light", img: "designs/cc/Kcq1vQSlSQ.webp" },
  { id: "TdBtIPDADD", name: "Revolut Ultra", tags: ["metal", "minimal"], ink: "dark", img: "designs/cc/TdBtIPDADD.webp" },
  { id: "ZOxVu2h8KI", name: "Revolut Metal", tags: ["metal", "minimal"], ink: "light", img: "designs/cc/ZOxVu2h8KI.webp" },
  { id: "4tJ3lMXLzK", name: "Ripped Paper", tags: ["warm", "minimal"], ink: "light", img: "designs/cc/4tJ3lMXLzK.webp" },
  { id: "6JhybXdOzK", name: "Cash Wall", tags: ["dark", "minimal"], ink: "light", img: "designs/cc/6JhybXdOzK.webp" },
  { id: "8ETnWyn0tf", name: "Pink Panther", tags: ["warm", "pattern"], ink: "light", img: "designs/cc/8ETnWyn0tf.webp" },
  { id: "612VJi6GU1", name: "Amex Classic", tags: ["dark", "metal"], ink: "light", img: "designs/cc/612VJi6GU1.webp" },
  { id: "aaj4bD3eJD", name: "Noir Bloom", tags: ["dark", "pattern"], ink: "light", img: "designs/cc/aaj4bD3eJD.webp" },
  { id: "eKYfo4XPRr", name: "Centurion Noir", tags: ["dark", "metal"], ink: "light", img: "designs/cc/eKYfo4XPRr.webp" },
  { id: "hyGY18APHA", name: "Gold Eagle", tags: ["metal", "warm"], ink: "dark", img: "designs/cc/hyGY18APHA.webp" },
  { id: "vp34SpQFl0", name: "Bikini Bottom", tags: ["warm", "pattern"], ink: "light", img: "designs/cc/vp34SpQFl0.webp" },
  { id: "HWu3ftXOjs", name: "Sakura", tags: ["light", "warm"], ink: "dark", img: "designs/cc/HWu3ftXOjs.webp" },
  { id: "9DMZhMiNuo", name: "Golden Arch", tags: ["dark", "minimal"], ink: "light", img: "designs/cc/9DMZhMiNuo.webp" },
  { id: "BpK2IddcN7", name: "Spectrum", tags: ["gradient", "cool"], ink: "light", img: "designs/cc/BpK2IddcN7.webp" },
  { id: "m2GGbFOlQi", name: "Master Black", tags: ["dark", "minimal"], ink: "light", img: "designs/cc/m2GGbFOlQi.webp" },
  { id: "SWTnIApvLi", name: "Reverse", tags: ["warm", "pattern"], ink: "light", img: "designs/cc/SWTnIApvLi.webp" },
  { id: "0xRoZLD8WO", name: "Trust Me", tags: ["warm", "minimal"], ink: "light", img: "designs/cc/0xRoZLD8WO.webp" },
  { id: "3esBvgcyaM", name: "Black Cat", tags: ["dark", "minimal"], ink: "light", img: "designs/cc/3esBvgcyaM.webp" },
  { id: "TY9W95KGMf", name: "Kirky", tags: ["dark", "minimal"], ink: "light", img: "designs/cc/TY9W95KGMf.webp" },
  { id: "hkyV2pIaQo", name: "Hello Kitty", tags: ["warm", "pattern"], ink: "light", img: "designs/cc/hkyV2pIaQo.webp" },
];

// Card raster the Wallet cache expects (~1.585:1).
const CARD_W = 1536;
const CARD_H = 969;

// Build a full-bleed SVG for a design. Shared so the renderer can rasterise it
// to the exact PNG that gets applied, and so previews and output always match.
function buildSvg(design) {
  const layers = design.svg || [["solid", "#1d1d1f"]];
  const defs = [];
  const rects = [];
  let gi = 0;
  for (const layer of layers) {
    const type = layer[0];
    const id = "g" + gi++;
    if (type === "solid") {
      rects.push(`<rect width="${CARD_W}" height="${CARD_H}" fill="${layer[1]}"/>`);
    } else if (type === "linear") {
      const angle = Number(layer[1]);
      const stops = layer[2];
      const rad = ((angle - 90) * Math.PI) / 180;
      const x = Math.cos(rad), y = Math.sin(rad);
      const x1 = 50 - x * 50, y1 = 50 - y * 50, x2 = 50 + x * 50, y2 = 50 + y * 50;
      const s = stops.map((c, i) => `<stop offset="${(i / (stops.length - 1)) * 100}%" stop-color="${c}"/>`).join("");
      defs.push(`<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">${s}</linearGradient>`);
      rects.push(`<rect width="${CARD_W}" height="${CARD_H}" fill="url(#${id})"/>`);
    } else if (type === "radial") {
      defs.push(`<radialGradient id="${id}" cx="${layer[1]}" cy="${layer[2]}" r="80%"><stop offset="0%" stop-color="${layer[3]}"/><stop offset="100%" stop-color="${layer[4]}"/></radialGradient>`);
      rects.push(`<rect width="${CARD_W}" height="${CARD_H}" fill="url(#${id})"/>`);
    } else if (type === "checker") {
      const sz = 96, c = layer[1];
      defs.push(`<pattern id="${id}" width="${sz * 2}" height="${sz * 2}" patternUnits="userSpaceOnUse"><rect width="${sz}" height="${sz}" fill="${c}"/><rect x="${sz}" y="${sz}" width="${sz}" height="${sz}" fill="${c}"/></pattern>`);
      rects.push(`<rect width="${CARD_W}" height="${CARD_H}" fill="url(#${id})"/>`);
    } else if (type === "grid") {
      const sz = 54, c = layer[1];
      defs.push(`<pattern id="${id}" width="${sz}" height="${sz}" patternUnits="userSpaceOnUse"><path d="M ${sz} 0 L 0 0 0 ${sz}" fill="none" stroke="${c}" stroke-width="2"/></pattern>`);
      rects.push(`<rect width="${CARD_W}" height="${CARD_H}" fill="url(#${id})"/>`);
    } else if (type === "hatch") {
      defs.push(`<pattern id="${id}" width="16" height="16" patternTransform="rotate(45)" patternUnits="userSpaceOnUse"><rect width="6" height="16" fill="${layer[1]}"/></pattern>`);
      rects.push(`<rect width="${CARD_W}" height="${CARD_H}" fill="url(#${id})"/>`);
    } else if (type === "rings") {
      const cx = (parseFloat(layer[1]) / 100) * CARD_W, cy = (parseFloat(layer[2]) / 100) * CARD_H, c = layer[3];
      let circles = "";
      for (let r = 40; r < 1500; r += 56) circles += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${c}" stroke-width="3"/>`;
      rects.push(circles);
    }
  }
  defs.push(`<linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="60%"><stop offset="30%" stop-color="#ffffff00"/><stop offset="48%" stop-color="#ffffff22"/><stop offset="56%" stop-color="#ffffff08"/><stop offset="70%" stop-color="#ffffff00"/></linearGradient>`);
  rects.push(`<rect width="${CARD_W}" height="${CARD_H}" fill="url(#sheen)"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}"><defs>${defs.join("")}</defs>${rects.join("")}</svg>`;
}

const EXPORTS = { DESIGNS, CARD_W, CARD_H, buildSvg };
if (typeof module !== "undefined" && module.exports) {
  module.exports = EXPORTS;
} else {
  window.VEYRO_DESIGNS = DESIGNS;
  window.VEYRO = EXPORTS;
}
