import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Flow from "@/components/sections/Flow";
import Tour from "@/components/sections/Tour";
import Division from "@/components/sections/Division";
import Report from "@/components/sections/Report";
import Verify from "@/components/sections/Verify";
import After from "@/components/sections/After";
import Data from "@/components/sections/Data";
import Start from "@/components/sections/Start";
import Setup from "@/components/sections/Setup";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import { site } from "@/lib/site";
import { getRelease } from "@/lib/release";

const ldBase = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: site.name,
  url: site.url,
  description: site.description,
  applicationCategory: "FinanceApplication",
  inLanguage: "ko",
  operatingSystem: "Windows, macOS, Linux",
  isAccessibleForFree: true,
};

export default async function Home() {
  const release = await getRelease();
  const jsonLd = { ...ldBase, softwareVersion: release.version, downloadUrl: release.allUrl };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main id="main">
        <Hero />
        <Flow />
        <Tour />
        <Division />
        <Report />
        <Verify />
        <After />
        <Data />
        <Start />
        <Setup />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
