import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";
import { Steps } from "@/components/Steps";
import { Features } from "@/components/Features";
import { Moments } from "@/components/Moments";
import { Compare } from "@/components/Compare";
import { Privacy } from "@/components/Privacy";
import { Pricing } from "@/components/Pricing";
import { Download } from "@/components/Download";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Gallery />
        <Steps />
        <Features />
        <Moments />
        <Compare />
        <Privacy />
        <Pricing />
        <Download />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
