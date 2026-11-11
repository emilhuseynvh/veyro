export const site = {
  name: "Veyro",
  domain: "veyro.biz",
  url: "https://veyro.biz",
  email: "hello@veyro.biz",
  tagline: "Custom Apple Wallet card designs, from your Mac",
  // One-sentence definition used across metadata, JSON-LD and llms.txt.
  // Keep it literal and factual: this is the sentence search engines and
  // AI assistants quote back.
  definition:
    "Veyro is a Mac app that changes the artwork of credit, debit and transit cards in Apple Wallet on your iPhone. Choose from a gallery of designs or upload your own image. Payments, card numbers and balances stay exactly the same.",
  description:
    "Change the look of your Apple Pay cards. Veyro restyles the card art in Apple Wallet from your Mac with thousands of designs or your own image. No jailbreak, no account, first upload free.",
  keywords: [
    "Apple Wallet card design",
    "custom Apple Pay card",
    "change Apple Wallet card image",
    "Apple Pay card skin",
    "Apple Wallet card art",
    "customize Apple Card design",
    "Mac app Apple Wallet",
    "Veyro",
  ],
  requirements: {
    mac: "macOS 14 Sonoma or later",
    iphone: "iPhone on iOS 17 or later, connected by cable or Wi-Fi sync",
  },
  download: {
    url: "/download/Veyro.dmg?v=2",
    version: "1.0.0",
    size: "181 MB",
  },
  social: {
    x: "https://x.com/veyroapp",
    github: "https://github.com/veyroapp",
  },
  launched: "2026-11-10",
} as const;

export type Plan = {
  id: string;
  name: string;
  price: number;
  period: string;
  summary: string;
  features: string[];
  highlight?: "popular" | "value";
};

export const plans: Plan[] = [
  {
    id: "pack",
    name: "Five uploads",
    price: 4.99,
    period: "one time",
    summary: "Enough to dress every card you actually use.",
    features: [
      "5 artwork uploads",
      "Full design gallery",
      "Undo on every card",
      "Never expires",
    ],
    highlight: "popular",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 19.99,
    period: "one time",
    summary: "Unlimited uploads, every future update, forever.",
    features: [
      "Unlimited uploads",
      "Full design gallery",
      "Early access to new designs",
      "All future versions included",
    ],
    highlight: "value",
  },
  {
    id: "month",
    name: "Thirty days",
    price: 14.99,
    period: "one time, does not renew",
    summary: "Unlimited for a month, then it simply stops.",
    features: [
      "Unlimited uploads for 30 days",
      "Full design gallery",
      "Undo stays free after",
      "No subscription",
    ],
  },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "What does Veyro actually change?",
    a: "Only the artwork shown on the front of a card in Apple Wallet. Your card number, expiry, bank, balance and Apple Pay itself are untouched. The card works at every terminal exactly as before.",
  },
  {
    q: "Does Apple Pay still work after I restyle a card?",
    a: "Yes. Veyro never touches the payment side of a card. It swaps the picture Wallet displays, nothing more. Tap to pay, Express Transit and online Apple Pay all keep working.",
  },
  {
    q: "Can I go back to the original design?",
    a: "Always. Veyro keeps the original artwork of every card it touches. Press undo on a card to restore it, or rewind the whole wallet to the state it was in the first time you connected.",
  },
  {
    q: "Do I need to jailbreak my iPhone?",
    a: "No. Veyro works with a standard iPhone. It uses the same local connection your Mac already uses for Finder sync and backups.",
  },
  {
    q: "Which Mac and iPhone do I need?",
    a: "A Mac on macOS 14 Sonoma or later, Apple silicon or Intel, and an iPhone on iOS 17 or later. Connect by USB cable, or over Wi-Fi if your iPhone already syncs wirelessly with that Mac.",
  },
  {
    q: "Can I upload my own image?",
    a: "Yes. Drop any PNG or JPG onto a card. Veyro fits it to the card shape, lets you reposition it, and shows a preview before anything is written to the phone.",
  },
  {
    q: "Is my data sent anywhere?",
    a: "No. Veyro runs entirely on your Mac. There is no account, no server and no analytics. Your images and card list never leave your machine.",
  },
  {
    q: "Why does macOS ask me to approve the app?",
    a: "Veyro is distributed outside the Mac App Store, so the first launch needs a one-time approval in System Settings, under Privacy and Security. The download guide walks through it in two clicks.",
  },
  {
    q: "What does it cost?",
    a: "Your first upload is free. After that choose five uploads for $4.99, thirty days unlimited for $14.99, or lifetime unlimited for $19.99. Every price is one time. Nothing renews.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes, within 14 days of purchase, for any reason. Email hello@veyro.biz with your order number.",
  },
];

export const compare: { label: string; veyro: boolean; wallet: boolean }[] = [
  { label: "Choose any artwork for your real cards", veyro: true, wallet: false },
  { label: "Gallery of ready-made designs", veyro: true, wallet: false },
  { label: "Upload your own image", veyro: true, wallet: false },
  { label: "Original design is always saved", veyro: true, wallet: true },
  { label: "Undo history per card", veyro: true, wallet: false },
  { label: "Works over cable or Wi-Fi", veyro: true, wallet: true },
  { label: "No account or sign-in", veyro: true, wallet: true },
  { label: "Payments, numbers and balances unchanged", veyro: true, wallet: true },
];

export const steps = [
  {
    title: "Connect",
    body: "Plug in your iPhone, or let it find your Mac over Wi-Fi. Veyro mirrors your Wallet in seconds and shows which cards can be restyled.",
  },
  {
    title: "Pick",
    body: "Browse the gallery by issuer, colour or mood, or drop your own PNG or JPG onto a card. You see the result before anything changes.",
  },
  {
    title: "Apply",
    body: "One click writes the new artwork to your iPhone. Open Wallet, double-tap the side button, and your card looks the way you wanted it to.",
  },
] as const;
