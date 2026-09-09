import React, { useState } from "react";
import { LandingNavbar } from "../components/landing/LandingNavbar";
import { LandingHero } from "../components/landing/LandingHero";
import { IdentityEverywhere } from "../components/landing/IdentityEverywhere";
import { InteractiveCardBuilder } from "../components/landing/InteractiveCardBuilder";
import { SmartNfcSection } from "../components/landing/SmartNfcSection";
import { IntegrationsMarquee } from "../components/landing/IntegrationsMarquee";
import { EnterpriseBanner } from "../components/landing/EnterpriseBanner";
import { TestimonialsCarousel } from "../components/landing/TestimonialsCarousel";
import { GreenManifesto } from "../components/landing/GreenManifesto";
import { SecuritySection } from "../components/landing/SecuritySection";
import { IndustryDirectory } from "../components/landing/IndustryDirectory";
import { LandingFooter } from "../components/landing/LandingFooter";

export function LandingPage() {
  const [activeSegment, setActiveSegment] = useState("personal");

  const handleSegmentChange = (segment) => {
    setActiveSegment(segment);
  };

  return (
    <div className="min-h-screen bg-white text-[#163300] selection:bg-[#9FE870] selection:text-[#163300] font-sans overflow-x-hidden">
      {/* 0. Header with Top Announcement Bar & Capsule Toggle */}
      <LandingNavbar
        activeSegment={activeSegment}
        onSegmentChange={handleSegmentChange}
      />

      {/* 1. Hero: Massive Display Headline & Floating 3D Globe with Orbiting Digital Cards */}
      <LandingHero activeSegment={activeSegment} />

      {/* 2. Cross-Device Identity Management (Dual column + Lifestyle photo + Phone mockup) */}
      <IdentityEverywhere activeSegment={activeSegment} />

      {/* 3. Live Card Customizer & Setup Builder */}
      <InteractiveCardBuilder activeSegment={activeSegment} />

      {/* 4. The Smart NFC Card (Full-width editorial photography & contactless tap features) */}
      <SmartNfcSection activeSegment={activeSegment} />

      {/* 5. Enterprise & Teams Banner (shown when Business segment is active) */}
      {activeSegment === "business" && <EnterpriseBanner />}

      {/* 7. Customer Stories: FOR PEOPLE GOING PLACES (Pastel rounded card carousel) */}
      {/* <TestimonialsCarousel /> */}

      {/* 8. Full-Bleed Forest Green (#163300) Sustainable Networking Manifesto */}
      <GreenManifesto />

      {/* 9. Security & Anti-Fraud: "Disappoint spammers" (3D padlock + 3-pillar security grid) */}
      <SecuritySection />

      {/* 10. Industry Solutions Matrix: OneProfile works nearly everywhere */}
      <IndustryDirectory />

      {/* 11. Multi-Column Wise-Style Footer */}
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
