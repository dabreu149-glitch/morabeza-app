import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LanguagesSection } from "@/components/landing/LanguagesSection";
import { SocialProofSection } from "@/components/landing/SocialProofSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";
import { useAnalytics } from "@/hooks/use-analytics";
import { useEffect } from "react";

export default function Index() {
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView("/");
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <SocialProofSection />
        <LanguagesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
