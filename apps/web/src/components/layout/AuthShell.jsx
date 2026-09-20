import { motion } from "framer-motion";
import { Outlet, Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Smartphone, Check, ArrowRight } from "lucide-react";
import { OneProfileLogo } from "../ui/OneProfileLogo";

export function AuthShell({ eyebrow, title, subtitle, children, sideContent }) {
  return (
    <div className="relative min-h-screen bg-[#FAFAF7] text-[#121814] flex flex-col justify-between selection:bg-[#9FE870] selection:text-[#163300]">
      {/* Ambient background with quiet paper depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#9FE870]/12 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#163300]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-[#163300]/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(#121814 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* Header bar */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group transition-transform active:scale-95">
          <OneProfileLogo size="md" variant="primary" showDomain={true} />
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6F5EE] border border-black/[0.08] text-[11px] font-mono uppercase tracking-wider text-[#576159]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#163300]" />
            Enterprise-ready
          </span>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#576159] hover:text-[#121814] transition-colors py-1.5 px-3 rounded-xl hover:bg-black/[0.04]"
          >
            Back to Home
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main split grid */}
      <main className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-6 sm:px-8 py-10 lg:grid-cols-[1.08fr_0.92fr]">
        {/* Left Side: Brand Story & Live Showcase */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col justify-center h-full max-w-xl"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F6F5EE] border border-black/[0.08] text-[#163300] text-xs font-mono uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              {eyebrow || "Digital Identity Suite"}
            </div>

            <h1 className="mt-5 font-display text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#121814] leading-[1.08]">
              {title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#576159] leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="mt-8 hidden lg:block">
            {sideContent || (
              <div className="relative rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_20px_50px_rgba(18,24,20,0.03)] space-y-5">
                {/* Live Card Mockup */}
                <div className="relative rounded-xl bg-[#121814] p-6 text-white border border-black/[0.12] shadow-sm overflow-hidden">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-[#9FE870]/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Header of card */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-[#9FE870] text-sm font-display">
                        AR
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-1.5">
                          Alex Rivera
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#163300] text-[#9FE870] text-[10px] font-bold">
                            ✓
                          </span>
                        </div>
                        <div className="text-xs text-[#879289] font-mono">
                          oneprofile.in/p/alex
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-white/[0.08] border border-white/10 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#9FE870] flex items-center gap-1">
                      <Smartphone className="w-3 h-3" /> NFC Card Active
                    </span>
                  </div>

                  {/* Metrics preview */}
                  <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10 text-center relative z-10">
                    <div className="bg-white/[0.04] rounded-xl p-2.5 border border-white/10">
                      <div className="text-lg font-bold font-display text-white">
                        4,820
                      </div>
                      <div className="text-[10px] text-[#879289] font-mono uppercase tracking-wider">
                        Profile Views
                      </div>
                    </div>
                    <div className="bg-white/[0.04] rounded-xl p-2.5 border border-white/10">
                      <div className="text-lg font-bold font-display text-[#9FE870]">
                        98.4%
                      </div>
                      <div className="text-[10px] text-[#879289] font-mono uppercase tracking-wider">
                        Contact Saves
                      </div>
                    </div>
                    <div className="bg-white/[0.04] rounded-xl p-2.5 border border-white/10">
                      <div className="text-lg font-bold font-display text-white">
                        Instant
                      </div>
                      <div className="text-[10px] text-[#879289] font-mono uppercase tracking-wider">
                        NFC Tap Sync
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Points */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#121814]">
                    <div className="w-5 h-5 rounded-full bg-[#F6F5EE] border border-black/[0.08] text-[#163300] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>Zero app install needed</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#121814]">
                    <div className="w-5 h-5 rounded-full bg-[#F6F5EE] border border-black/[0.08] text-[#163300] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                    <span>End-to-end encrypted</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Right Side: Form Card */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          className="w-full flex items-center justify-center"
        >
          <div className="w-full max-w-[480px] bg-white rounded-2xl border border-black/[0.08] p-7 sm:p-10 shadow-[0_20px_50px_rgba(18,24,20,0.03)] relative overflow-hidden">
            {/* Top accent hairline */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9FE870]/60 to-transparent" />
            <div className="relative z-10">{children || <Outlet />}</div>
          </div>
        </motion.section>
      </main>

      {/* Footer bar */}
      <footer className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 py-6 text-center sm:flex sm:items-center sm:justify-between border-t border-black/[0.08]">
        <p className="text-[11px] font-mono uppercase tracking-wider text-[#879289]">
          © {new Date().getFullYear()} OneProfile Technologies Inc. All rights reserved.
        </p>
        <div className="flex items-center justify-center gap-5 mt-3 sm:mt-0 text-[11px] font-mono uppercase tracking-wider text-[#576159]">
          <Link to="/pricing" className="hover:text-[#121814] transition-colors">
            Pricing
          </Link>
          <span className="text-black/20">•</span>
          <a href="#" className="hover:text-[#121814] transition-colors">
            Privacy Policy
          </a>
          <span className="text-black/20">•</span>
          <a href="#" className="hover:text-[#121814] transition-colors">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
}

