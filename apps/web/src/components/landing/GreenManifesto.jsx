import React from "react";
import { Link } from "react-router-dom";
import { Leaf, ArrowRight } from "lucide-react";

export function GreenManifesto() {
  return (
    <section className="bg-[#121814] py-24 sm:py-32 text-white border-b border-white/[0.08] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
        
        {/* 1. Header: Editorial Typography + Supporting Paragraph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-12 sm:mb-16">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9FE870] select-none">
              <Leaf className="w-3.5 h-3.5 text-[#9FE870]" />
              <span>The Sustainable Networking Pledge</span>
            </div>
            <div className="font-editorial italic text-3xl sm:text-5xl text-white/60">
              A lasting presence,
            </div>
            <h2 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[84px] text-[#FAFAF7] tracking-[-0.04em] uppercase leading-[0.92]">
              NETWORKING
              <br />
              <span className="text-[#9FE870]">WITHOUT</span>
              <br />
              WASTE.
            </h2>
          </div>

          <div className="lg:col-span-5 text-slate-300 text-base sm:text-lg leading-relaxed font-normal pt-4 sm:pt-8">
            <p>
              Over 10 billion paper business cards are printed worldwide every year — and 88% end up in the trash within 7 days. We believe professional networking should be digital, contactless, permanent, and zero-waste.
            </p>
          </div>
        </div>

        {/* 2. Editorial Photographic Showcase */}
        <div className="relative w-full h-[360px] sm:h-[480px] md:h-[540px] rounded-[36px] overflow-hidden shadow-2xl bg-black mb-12">
          <img
            src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1600&q=80"
            alt="Professionals connecting wirelessly using OneProfile contactless identity"
            className="w-full h-full object-cover object-center filter brightness-[0.92]"
            loading="lazy"
          />

          {/* Overlaid Hands with Smartphone Mockup in center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 sm:w-64 h-84 sm:h-96 rounded-[36px] bg-black/85 backdrop-blur-md p-4 border-2 border-white/20 shadow-2xl flex flex-col justify-between text-white">
              <div className="flex justify-between items-center text-[10px] px-2 text-slate-300">
                <span>9:41</span>
                <span>●●●</span>
              </div>
              <div className="p-4 bg-[#9FE870] rounded-2xl text-[#163300] space-y-1 text-center">
                <div className="text-[10px] font-black uppercase tracking-wider">Universal Digital Card</div>
                <div className="font-parafina font-black text-lg leading-tight">oneprofile.in</div>
                <div className="text-[10px] font-semibold text-[#163300]/80">Zero Paper • 100% Digital</div>
              </div>
              <div className="text-center text-[10px] text-slate-400 font-medium">
                Tap anywhere to connect instantly
              </div>
            </div>
          </div>
        </div>

        {/* 3. Bottom Bar: Explanatory Copy & Action Button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4">
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
            By switching to OneProfile, forward-thinking professionals and enterprise teams divert millions of printed paper cards from landfills, protect forests, and capture 10x more client relationships. It's better for your business, and better for the planet.
          </p>

          <Link
            to="/signup"
            className="px-8 py-3.5 rounded-full font-bold text-[15px] text-[#163300] bg-[#9FE870] hover:bg-[#8DE05B] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 flex items-center gap-2"
          >
            <span>Join the Zero-Paper Movement</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
