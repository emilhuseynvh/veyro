import { site, faqs, plans, steps } from "@/lib/site";

/**
 * One @graph with stable @ids so Organization, WebSite, SoftwareApplication,
 * HowTo and FAQPage reference each other. Rendered once in the root layout.
 */
export function JsonLd() {
  const org = `${site.url}/#organization`;
  const website = `${site.url}/#website`;
  const app = `${site.url}/#software`;
  const webpage = `${site.url}/#webpage`;

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: site.name,
        url: site.url,
        email: site.email,
        logo: {
          "@type": "ImageObject",
          url: `${site.url}/icon`,
          width: 512,
          height: 512,
        },
        sameAs: [site.social.x, site.social.github],
        contactPoint: {
          "@type": "ContactPoint",
          email: site.email,
          contactType: "customer support",
          availableLanguage: ["English"],
        },
      },
      {
        "@type": "WebSite",
        "@id": website,
        url: site.url,
        name: site.name,
        description: site.definition,
        publisher: { "@id": org },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id": webpage,
        url: site.url,
        name: `${site.name}: custom Apple Wallet card designs for Mac`,
        isPartOf: { "@id": website },
        about: { "@id": app },
        description: site.description,
        inLanguage: "en",
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${site.url}/opengraph-image`,
          width: 1200,
          height: 630,
        },
        datePublished: site.launched,
      },
      {
        "@type": "SoftwareApplication",
        "@id": app,
        name: site.name,
        url: site.url,
        description: site.definition,
        applicationCategory: "UtilitiesApplication",
        applicationSubCategory: "Personalization",
        operatingSystem: site.requirements.mac,
        softwareVersion: site.download.version,
        fileSize: site.download.size,
        downloadUrl: `${site.url}${site.download.url}`,
        installUrl: `${site.url}/#download`,
        screenshot: `${site.url}/opengraph-image`,
        image: `${site.url}/opengraph-image`,
        publisher: { "@id": org },
        author: { "@id": org },
        isAccessibleForFree: true,
        featureList: [
          "Change Apple Wallet card artwork from a Mac",
          "Gallery of ready-made card designs",
          "Upload your own PNG or JPG",
          "Undo per card and rewind the whole wallet",
          "No jailbreak, no account, no server",
        ],
        offers: [
          {
            "@type": "Offer",
            name: "First upload",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          },
          ...plans.map((p) => ({
            "@type": "Offer",
            name: p.name,
            price: p.price.toFixed(2),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: `${site.url}/#pricing`,
          })),
        ],
      },
      {
        "@type": "HowTo",
        name: "How to change the design of an Apple Wallet card with Veyro",
        description:
          "Restyle the artwork of a card in Apple Wallet from a Mac in three steps.",
        totalTime: "PT2M",
        tool: [
          { "@type": "HowToTool", name: "Mac on macOS 14 or later" },
          { "@type": "HowToTool", name: "iPhone on iOS 17 or later" },
        ],
        step: steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.title,
          text: s.body,
          url: `${site.url}/#how-it-works`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
