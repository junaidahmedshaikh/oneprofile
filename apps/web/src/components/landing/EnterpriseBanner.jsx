import React from "react";
import { Link } from "react-router-dom";
import { Wifi, ShieldCheck, Users, BarChart3, ArrowRight } from "lucide-react";

export function EnterpriseBanner() {
  return (
    <section id="enterprise" className="bg-[#9FE870] py-20 sm:py-28 text-[#163300] border-b border-[#163300]/10 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        
        {/* 1. Master Headline */}
        <h2 className="font-parafina font-black text-[38px] sm:text-[64px] md:text-[76px] lg:text-[90px] text-[#163300] tracking-[-0.04em] uppercase leading-[0.92] mb-12 sm:mb-16 text-left">
          STANDARDIZE YOUR
          <br />
          COMPANY'S IDENTITY
          <br />
          ACROSS THE ENTIRE TEAM
        </h2>

        {/* 2. Grid: Left Dark Business Card, Right Text & Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Vertical Corporate Smart Cards Replica */}
          <div className="lg:col-span-6 flex items-center gap-4 justify-center lg:justify-start select-none">
            
            {/* Card 1: Angled Underneath */}
            <div className="w-28 sm:w-36 h-52 sm:h-64 rounded-2xl bg-[#0D1F02] border border-white/10 shadow-xl p-4 flex flex-col justify-between transform -rotate-6">
              <div className="w-6 h-5 rounded bg-slate-300/80 border border-slate-400" />
              <div className="space-y-1">
                <div className="w-12 h-2 bg-white/20 rounded" />
                <div className="w-8 h-1.5 bg-white/10 rounded" />
              </div>
              <div className="w-3 h-3 rounded-full border border-white/30" />
            </div>

            {/* Card 2: Main Vertical Front Card */}
            <div className="w-48 sm:w-60 h-76 sm:h-88 rounded-3xl bg-gradient-to-b from-[#163300] to-black border border-white/15 shadow-[0_25px_50px_rgba(0,0,0,0.35)] p-6 flex flex-col justify-between text-white relative">
              
              {/* Bottom Chip & Contactless wave icon */}
              <div className="space-y-3">
                <div className="w-10 h-8 rounded-lg bg-gradient-to-tr from-amber-200 to-amber-400 border border-amber-500/50 shadow-inner" />
                <div className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-[#9FE870] rotate-90" />
                  <span className="text-[10px] uppercase tracking-widest text-slate-300 font-bold">
                    Executive Card
                  </span>
                </div>
              </div>

              {/* Employee Title on card */}
              <div className="space-y-1 z-10">
                <div className="font-parafina font-black text-lg text-white">
                  Corporate Edition
                </div>
                <div className="text-[11px] font-medium text-slate-400">
                  Centralized Team Workspace
                </div>
              </div>

              {/* Vertical Embossed Brand Logo */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 transform -rotate-90 origin-right flex items-center gap-2">
                <svg className="w-7 h-7 text-[#9FE870]" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M4 8h16l-5 8h13L14 30l3.5-10H5L4 8z" />
                </svg>
                <span className="font-parafina font-black text-2xl tracking-tight text-white lowercase">
                  oneprofile<span className="text-[#9FE870]">.in</span>
                </span>
              </div>

            </div>

          </div>

          {/* Right Column: Paragraph and Enterprise Features */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <p className="text-base sm:text-[19px] font-normal text-[#163300] leading-relaxed max-w-lg">
              Eliminate outdated paper cards, rogue designs, and lost sales leads. OneProfile for Business gives marketing and sales leaders centralized control over every digital card in the company.
            </p>

            <div className="space-y-3.5 pt-1">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#163300] text-[#9FE870] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#163300]">Central Brand Governance</h4>
                  <p className="text-xs text-[#163300]/80 leading-relaxed">
                    Lock approved company logos, brand hex codes, and legal disclaimers across all employee profiles with one click.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#163300] text-[#9FE870] flex items-center justify-center shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#163300]">Team Lead Attribution & CRM Routing</h4>
                  <p className="text-xs text-[#163300]/80 leading-relaxed">
                    Route prospect contacts collected at trade shows directly into HubSpot or Salesforce with rep attribution.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#163300] text-[#9FE870] flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#163300]">Instant Employee Provisioning</h4>
                  <p className="text-xs text-[#163300]/80 leading-relaxed">
                    Onboard new hires or deactivate departing team members in seconds via CSV or SSO directory management.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to="/signup?type=business"
                className="px-8 py-4 rounded-full font-bold text-sm sm:text-base text-white bg-[#163300] hover:bg-black shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <span>Open a Business Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#interactive-builder"
                className="px-8 py-4 rounded-full font-bold text-sm sm:text-base text-[#163300] bg-transparent border-2 border-[#163300] hover:bg-[#163300]/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Calculate Volume Pricing
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
