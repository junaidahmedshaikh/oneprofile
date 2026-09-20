import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowUp } from "lucide-react";
import { OneProfileLogo } from "../ui/OneProfileLogo";

export function LandingFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#121814] text-slate-300 pt-18 pb-14 text-xs border-t border-white/[0.08]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 space-y-12">
        {/* Top Section: Brand + Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="inline-block group">
              <OneProfileLogo size="lg" variant="white" showDomain={true} />
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The digital business identity platform replacing disposable paper
              cards with smart, mobile-first mini-websites, instant vCards, and
              contactless NFC networking.
            </p>
            {/* <div className="pt-2 flex items-center gap-2 text-[11px] text-[#9FE870] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#9FE870]" />
              <span>Certified RFC 2426 & GDPR privacy compliant.</span>
            </div> */}
          </div>

          {/* Col 3: Product */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-[#9FE870] transition-colors font-bold text-[#9FE870]"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <a
                  href="#identity-everywhere"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  Digital Profile Cards
                </a>
              </li>
              <li>
                <a
                  href="#smart-nfc"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  Smart NFC Cards
                </a>
              </li>
              <li>
                <a
                  href="#identity-everywhere"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  1-Tap vCard 3.0 Sync
                </a>
              </li>
              <li>
                <a
                  href="#identity-everywhere"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  Lead Capture Engine
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Solutions */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              Solutions
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a
                  href="#industry"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  For Consultants
                </a>
              </li>
              <li>
                <a
                  href="#industry"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  For Real Estate
                </a>
              </li>
              <li>
                <a
                  href="#industry"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  For B2B Sales Teams
                </a>
              </li>
              <li>
                <a
                  href="#enterprise"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  For Corporate Workforces
                </a>
              </li>
              <li>
                <a
                  href="#industry"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  For Conferences & Expos
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Resources */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a
                  href="#interactive-calculator"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  Paper vs Digital ROI
                </a>
              </li>
              <li>
                <a
                  href="#smart-nfc"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  NFC Device Guide
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  Member Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  Create Free Profile
                </Link>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  Customer Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Col 6: Company */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a
                  href="#manifesto"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  Zero-Paper Pledge
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  Security & Privacy
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  Trust Center
                </a>
              </li>
              <li>
                <Link
                  to="/signup?type=business"
                  className="hover:text-[#9FE870] transition-colors"
                >
                  Contact Enterprise
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Sustainability Disclaimer */}
        <div className="pt-8 border-t border-white/10 text-[11px] text-slate-400 leading-relaxed space-y-2">
          <p>
            OneProfile (OneProfile.in) is a modern digital business identity and
            lead capture SaaS platform. Digital cards comply with universal RFC
            2426 vCard specifications and are natively compatible with Apple
            iOS, Android, macOS, and Windows.
          </p>
          <p>
            Zero trees harmed. By switching from single-use paper business cards
            to OneProfile, our global community prevents thousands of pounds of
            paper waste each year.
          </p>
        </div>

        {/* Bottom Bar: Language, Copyright & Scroll to Top */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              © 2026 OneProfile.in. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-[#9FE870] hover:text-white font-bold transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
