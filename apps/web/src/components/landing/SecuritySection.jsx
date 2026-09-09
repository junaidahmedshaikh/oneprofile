import React from "react";
import { Link } from "react-router-dom";
import { Lock, Smartphone, ShieldCheck, ArrowRight } from "lucide-react";

export function SecuritySection() {
  return (
    <section id="security" className="bg-white py-20 sm:py-28 border-b border-[#EAECEF]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        
        {/* 1. Top Section: Heading, Subtitle, Button & 3D Glassy Padlock */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 sm:mb-20">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#163300]/5 text-xs font-bold text-[#163300]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#255203]" />
              <span>Enterprise Privacy & Protection</span>
            </div>

            <h2 className="font-parafina font-black text-[38px] sm:text-[54px] lg:text-[62px] text-[#163300] tracking-[-0.035em] leading-[1]">
              Disappoint spammers.
              <br />
              Protect your network.
            </h2>

            <p className="text-base sm:text-[18px] text-[#3A4833] font-normal leading-relaxed max-w-lg">
              Your professional contact network and captured customer leads are valuable business assets. OneProfile is engineered with strict data governance, end-to-end encryption, and zero third-party data selling.
            </p>

            <div className="pt-2">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-[15px] text-[#163300] bg-[#9FE870] hover:bg-[#8DE05B] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>How We Protect Your Data</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right: 3D Translucent Glassy Cyan Padlock */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end select-none">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              
              <div className="relative w-44 sm:w-52 h-52 sm:h-60 flex flex-col items-center justify-end">
                
                {/* Silver Metal Shackle */}
                <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-t-full border-[10px] border-slate-300 shadow-md flex items-center justify-center -mb-8">
                  <div className="w-10 h-14 rounded-t-full bg-slate-100/50" />
                </div>

                {/* 3D Glassy Cyan Body with Faceted Angles */}
                <div className="relative w-full h-36 sm:h-44 rounded-3xl bg-gradient-to-br from-[#00E5FF] via-[#00B4D8] to-[#0077B6] p-4 shadow-[0_20px_45px_rgba(0,180,216,0.4)] border-2 border-white/50 backdrop-blur-md flex flex-col items-center justify-center">
                  
                  {/* Gloss Highlight */}
                  <div className="absolute top-2 left-4 w-12 h-3 bg-white/40 rounded-full blur-[1px]" />

                  {/* Dark Keyhole in Center */}
                  <div className="w-7 h-7 rounded-full bg-[#032B44] flex items-center justify-center shadow-inner">
                    <div className="w-1.5 h-3 bg-white/30 rounded-t-full" />
                  </div>
                  <div className="w-3 h-5 bg-[#032B44] -mt-1 rounded-b-sm shadow-inner" />
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* 2. Bottom 3-Column Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 pt-8 border-t border-slate-100">
          
          {/* Pillar 1 */}
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F2F4F7] flex items-center justify-center text-[#163300]">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-parafina font-black text-lg text-[#163300]">
              Zero Unsolicited Data Sharing
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your contact details are shared only when you tap or send your link. We never monetize, sell, or broker your personal information or leads.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F2F4F7] flex items-center justify-center text-[#163300]">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="font-parafina font-black text-lg text-[#163300]">
              Universal RFC Contact Standards
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              RFC 2426-compliant vCard format ensures clean, native compatibility with iOS, Android, and Outlook without third-party tracking scripts.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F2F4F7] flex items-center justify-center text-[#163300]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-parafina font-black text-lg text-[#163300]">
              SOC2 & GDPR Privacy Architecture
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              End-to-end encrypted lead collection, secure authentication, and full self-serve data removal anytime you request.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
