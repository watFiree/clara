import { CtaSection } from "@/modules/cta-section/cta-section";
import { FeaturesSection } from "@/modules/features-section/features-section";
import { Footer } from "@/modules/footer/footer";
import { Navbar } from "@/modules/navbar/navbar";
import { Hero } from "@/modules/hero/hero";
import { ValuesSection } from "@/modules/values-section/values-section";
import { HowItWorksSection } from "@/modules/how-it-works-section/how-it-works-section";
import { PrivacySection } from "@/modules/privacy-section/privacy-section";
import { Providers } from "./providers";

export default function Home() {
  return (
    <Providers>
      <main className="min-h-screen bg-background font-sans">
        <Navbar />
        <Hero />
        <HowItWorksSection />
        <FeaturesSection />
        <ValuesSection />
        <PrivacySection />
        <CtaSection />
        <Footer />
      </main>
    </Providers>
  );
}
