import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  UserCheck,
  Calendar,
  Zap,
  CreditCard,
  Building2,
  ShieldCheck,
  Users,
} from "lucide-react";

export function LandingHero({ activeSegment = "personal" }) {
  const [handle, setHandle] = useState("");
  const navigate = useNavigate();

  const isBusiness = activeSegment === "business";

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    const cleanHandle = handle
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "");
    if (isBusiness) {
      if (cleanHandle) {
        navigate(`/signup?type=business&company=${encodeURIComponent(cleanHandle)}`);
      } else {
        navigate("/signup?type=business");
      }
    } else {
      if (cleanHandle) {
        navigate(`/signup?username=${encodeURIComponent(cleanHandle)}`);
      } else {
        navigate("/signup");
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pt-10 sm:pt-14 pb-16 sm:pb-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 text-center">
        {/* Category Eyebrow Pill */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSegment + "-eyebrow"}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#163300]/5 border border-[#163300]/10 text-xs font-bold text-[#163300] mb-6"
          >
            {isBusiness ? (
              <>
                <Building2 className="w-3.5 h-3.5 text-[#255203]" />
                <span>Enterprise Digital Identity & Team Lead Generation</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#255203]" />
                <span>The AI-Powered Digital Identity & Mini-Website</span>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 1. Master Headline & Subtitle */}
        <div className="max-w-4xl mx-auto space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSegment + "-heading"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {isBusiness ? (
                <>
                  <h1 className="font-parafina font-black text-[40px] sm:text-[68px] md:text-[84px] lg:text-[96px] text-[#163300] tracking-[-0.04em] uppercase leading-[0.92] text-balance">
                    ONE BRAND IDENTITY.
                    <br />
                    EVERY SALES REP.
                    <br />
                    ZERO PAPER WASTE.
                  </h1>
                  <p className="text-base sm:text-lg md:text-[19px] text-[#3A4833] font-normal max-w-2xl mx-auto leading-relaxed pt-3">
                    Equip your entire organization with centralized digital business cards, co-branded NFC hardware, and automated CRM lead capture. Manage 5 to 5,000+ employees with single-click admin governance.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="font-parafina font-black text-[40px] sm:text-[68px] md:text-[84px] lg:text-[96px] text-[#163300] tracking-[-0.04em] uppercase leading-[0.92] text-balance">
                    YOUR DIGITAL CARD.
                    <br />
                    YOUR MINI-WEBSITE.
                    <br />
                    ALL IN ONE TAP.
                  </h1>
                  <p className="text-base sm:text-lg md:text-[19px] text-[#3A4833] font-normal max-w-2xl mx-auto leading-relaxed pt-3">
                    The modern way to share your contact details, showcase your portfolio, and capture qualified client leads. Save directly to phone address books in 1 tap — zero app required for recipients.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 3. Interactive Handle / Company Claim Bar */}
          <form onSubmit={handleClaimSubmit} className="pt-6 max-w-xl mx-auto">
            <div className="p-1.5 sm:p-2 bg-[#F2F4F7] rounded-full border border-black/10 focus-within:border-[#163300] focus-within:ring-2 focus-within:ring-[#9FE870]/60 transition-all flex items-center shadow-sm">
              <div className="pl-4 sm:pl-5 pr-1 text-xs sm:text-sm font-bold text-slate-500 select-none shrink-0">
                {isBusiness ? "oneprofile.in/company/" : "oneprofile.in/p/"}
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder={isBusiness ? "yourcompany" : "yourname"}
                className="w-full bg-transparent outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 border-none font-bold text-sm sm:text-base text-[#163300] placeholder-slate-400 py-1"
                style={{ outline: "none", boxShadow: "none" }}
              />
              <button
                type="submit"
                className="shrink-0 px-5 sm:px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-[#163300] bg-[#9FE870] hover:bg-[#8DE05B] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isBusiness ? "Start Team Trial" : "Claim Free vCard"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Micro-Trust Guarantees */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-[#556947]">
              {isBusiness ? (
                <>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#255203]" />
                    Centralized brand governance
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#255203]" />
                    HubSpot & Salesforce CRM sync
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#255203]" />
                    Google Workspace & Azure SSO
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#255203]" />
                    100% Free forever tier
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#255203]" />
                    Ready in under 3 minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#255203]" />
                    Universal iOS & Android support
                  </span>
                </>
              )}
            </div>
          </form>
        </div>

        {/* 4. Center 3D Floating Network Globe with Orbiting OneProfile Digital Badges */}
        <div className="relative mt-12 sm:mt-16 max-w-2xl mx-auto h-[380px] sm:h-[480px] md:h-[500px] flex items-center justify-center select-none">
          {/* Floor Shadow */}
          <div className="absolute bottom-6 w-72 sm:w-88 h-10 rounded-full bg-black/10 blur-xl -z-10 transform scale-y-50" />

          {/* Center 3D Globe Sphere */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] rounded-full bg-gradient-to-br from-[#255203] via-[#163300] to-[#0A1800] shadow-[inset_-30px_-30px_70px_rgba(0,0,0,0.65),0_30px_70px_rgba(22,51,0,0.35)] flex items-center justify-center overflow-hidden border border-white/20"
          >
            {/* Atmospheric reflection */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.35)_0%,transparent_60%)] pointer-events-none" />

            {/* Continents in bright lime green #9FE870 */}
            <svg
              className="w-full h-full opacity-70"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              <path
                d="M35,65 Q55,45 80,55 T125,50 T145,75 T115,115 T65,105 Z"
                fill="#9FE870"
              />
              <path
                d="M115,105 Q135,85 155,105 T165,135 T125,155 Z"
                fill="#88D9BE"
              />
              <path d="M45,125 Q65,115 75,140 T55,165 Z" fill="#9FE870" />
              <ellipse
                cx="100"
                cy="100"
                rx="95"
                ry="48"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
              <ellipse
                cx="100"
                cy="100"
                rx="48"
                ry="95"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
            </svg>
          </motion.div>

          {/* Floating Badge 1: Top Right */}
          <motion.div
            animate={{
              y: [-8, 8, -8],
              rotate: [0, 4, 0],
            }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 right-2 sm:top-8 sm:right-8 z-20"
          >
            <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_16px_32px_rgba(0,0,0,0.18)] border border-black/10 flex items-center gap-3 text-left transform rotate-6">
              <div className="w-9 h-9 rounded-xl bg-[#9FE870] flex items-center justify-center text-[#163300]">
                {isBusiness ? <Building2 className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-xs font-black text-[#163300] leading-none">
                  {isBusiness ? "48 Team Cards Active 🏢" : "vCard Saved 📲"}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 mt-1">
                  {isBusiness ? "Central Brand Governed" : "Direct to iOS & Android"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Badge 2: Large Center/Bottom Left */}
          <motion.div
            animate={{
              y: [8, -8, 8],
              rotate: [-3, 3, -3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="absolute bottom-10 left-2 sm:bottom-12 sm:left-12 z-30"
          >
            <div className="bg-[#163300] text-white px-4 py-3 rounded-2xl shadow-[0_20px_40px_rgba(22,51,0,0.45)] border border-white/15 flex items-center gap-3 text-left transform -rotate-6">
              <div className="w-10 h-10 rounded-xl bg-[#9FE870] text-[#163300] flex items-center justify-center font-black">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#9FE870] uppercase tracking-wider text-[10px]">
                  {isBusiness ? "Salesforce CRM Synced" : "Inbound Lead"}
                </div>
                <div className="text-xs font-black text-white">
                  {isBusiness ? "+142 Qualified Leads This Week" : "Sarah Jenkins • VP Growth"}
                </div>
                <div className="text-[10px] text-slate-300 font-medium">
                  {isBusiness ? "Auto-routed to regional sales reps" : "Synced to Dashboard & CRM"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Badge 3: Mid Right */}
          <motion.div
            animate={{
              y: [-6, 6, -6],
              rotate: [4, -4, 4],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.7,
            }}
            className="absolute bottom-24 right-0 sm:bottom-28 sm:right-6 z-20"
          >
            <div className="bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-[0_14px_28px_rgba(0,0,0,0.14)] border border-black/10 flex items-center gap-2.5 text-left transform rotate-3">
              <div className="w-8 h-8 rounded-xl bg-[#F2F4F7] text-[#163300] flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-[#163300]" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#163300]">
                  {isBusiness ? "Co-Branded NFC Hardware" : "1-Tap NFC Connect"}
                </div>
                <div className="text-[10px] text-emerald-700 font-bold">
                  {isBusiness ? "Company logo laser-etched" : "Instant profile load"}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Badge 4: Far Bottom Left */}
          <motion.div
            animate={{
              y: [10, -10, 10],
              rotate: [-20, -15, -20],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.1,
            }}
            className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10"
          >
            <div className="bg-[#9FE870] text-[#163300] px-3.5 py-2 rounded-xl shadow-lg border border-black/10 flex items-center gap-2 transform -rotate-12">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[11px] font-extrabold">
                {isBusiness ? "Admin Console: 100% Compliant" : "15-Min Call Booked"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
