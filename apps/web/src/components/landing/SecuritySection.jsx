import React from "react";
import { Link } from "react-router-dom";
import { Lock, Smartphone, ShieldCheck, ArrowRight } from "lucide-react";

export function SecuritySection() {
  return (
    <section id="security" className="bg-[#FAFAF7] py-20 sm:py-28 border-b border-black/[0.07]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
        
        {/* 1. Top Section: Heading, Subtitle, Button & Enterprise Security Badge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 sm:mb-20">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.03] border border-black/[0.06] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#576159] select-none">
              <ShieldCheck className="w-3.5 h-3.5 text-[#163300]" />
              <span>Enterprise Privacy & Architecture</span>
            </div>

            <div className="space-y-2">
              <div className="font-editorial italic text-2xl sm:text-3xl text-[#576159]">
                Zero spam, zero brokers,
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-[#121814] tracking-[-0.035em] uppercase leading-[1]">
                DISAPPOINT SPAMMERS.
                <br />
                PROTECT YOUR NETWORK.
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#576159] font-normal leading-relaxed max-w-lg">
              Your contact network and customer relationships are sovereign corporate assets. OneProfile is engineered with strict cryptographic data governance, end-to-end encryption, and zero third-party data selling.
            </p>

            <div className="pt-2">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-[#FAFAF7] bg-[#163300] hover:bg-[#0E2100] shadow-xs transition-all active:scale-[0.98]"
              >
                <span>How We Protect Your Data</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: Architectural Trust Certificate Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end select-none">
            <div className="w-full max-w-sm rounded-3xl border border-black/[0.08] bg-white p-7 shadow-[0_16px_40px_-12px_rgba(18,24,20,0.05)] space-y-5">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#163300] text-[#9FE870] flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#121814]">Trust & Security Core</div>
                    <div className="text-[10px] text-[#879289] font-mono">SOC-2 / GDPR Ready</div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAFAF7] border border-black/[0.04]">
                  <span className="text-[#576159]">Data Monetization</span>
                  <span className="font-bold text-[#163300]">0% (Strictly Prohibited)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAFAF7] border border-black/[0.04]">
                  <span className="text-[#576159]">vCard RFC Standard</span>
                  <span className="font-bold text-[#121814]">RFC 2426 Native</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAFAF7] border border-black/[0.04]">
                  <span className="text-[#576159]">NFC Hardware Protocol</span>
                  <span className="font-bold text-[#121814]">NTAG 216 Encrypted</span>
                </div>
              </div>

              <div className="text-[11px] text-[#879289] leading-relaxed pt-1">
                All transmissions are handled via TLS 1.3 with AES-256 data at rest.
              </div>
            </div>
          </div>

        </div>

        {/* 2. Bottom 3-Column Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 pt-10 border-t border-black/[0.06]">
          
          {/* Pillar 1 */}
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-black/[0.03] border border-black/[0.06] flex items-center justify-center text-[#163300]">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="font-display font-bold text-base text-[#121814]">
              Zero Unsolicited Sharing
            </h4>
            <p className="text-xs text-[#576159] leading-relaxed">
              Your contact details are shared only when you tap your card or transmit your link. We never monetize, sell, or broker personal information or leads.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-black/[0.03] border border-black/[0.06] flex items-center justify-center text-[#163300]">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="font-display font-bold text-base text-[#121814]">
              Universal RFC Contact Standards
            </h4>
            <p className="text-xs text-[#576159] leading-relaxed">
              RFC 2426-compliant vCard format ensures clean, native compatibility with iOS, Android, and Outlook without third-party tracking scripts.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-black/[0.03] border border-black/[0.06] flex items-center justify-center text-[#163300]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-display font-bold text-base text-[#121814]">
              Enterprise SSO & Provisioning
            </h4>
            <p className="text-xs text-[#576159] leading-relaxed">
              Centralized admin control with Google Workspace, Microsoft Azure AD, and Okta integration to instantly provision or revoke cards for employees.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
