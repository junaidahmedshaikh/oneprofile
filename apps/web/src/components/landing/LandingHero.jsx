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
  Smartphone,
  Download,
  Share2,
  QrCode,
  Check,
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
    <section className="relative overflow-hidden bg-[#FAFAF7] pt-12 sm:pt-18 pb-20 sm:pb-32 border-b border-black/[0.07]">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 text-center">
        {/* Editorial Eyebrow Tag */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSegment + "-eyebrow"}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.03] border border-black/[0.06] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#576159] mb-6 select-none"
          >
            {isBusiness ? (
              <>
                <Building2 className="w-3.5 h-3.5 text-[#163300]" />
                <span>Enterprise Identity & Central Brand Governance</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#163300]" />
                <span>The Modern Standard for Personal Identity</span>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 1. Master Editorial Headline & Subtitle */}
        <div className="max-w-4xl mx-auto space-y-5">
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
                  <div className="font-editorial italic text-3xl sm:text-5xl md:text-6xl text-[#576159] tracking-[-0.015em] mb-1">
                    Unified brand presence,
                  </div>
                  <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[84px] text-[#121814] tracking-[-0.04em] uppercase leading-[0.92] text-balance">
                    EVERY SALES REP.
                    <br />
                    ZERO PAPER WASTE.
                  </h1>
                  <p className="text-base sm:text-lg text-[#576159] font-normal max-w-2xl mx-auto leading-relaxed pt-3">
                    Equip your organization with centralized digital business cards, metallic NFC hardware, and automated CRM lead routing. Manage 5 to 5,000+ employees with single-click admin controls.
                  </p>
                </>
              ) : (
                <>
                  <div className="font-editorial italic text-3xl sm:text-5xl md:text-6xl text-[#576159] tracking-[-0.015em] mb-1">
                    The digital identity
                  </div>
                  <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-[84px] text-[#121814] tracking-[-0.04em] uppercase leading-[0.92] text-balance">
                    THAT PRECEDES YOU.
                  </h1>
                  <p className="text-base sm:text-lg text-[#576159] font-normal max-w-2xl mx-auto leading-relaxed pt-3">
                    Your card, your portfolio, and your verified credentials in one contactless link. Save directly into any phone address book in 1 tap — zero recipient apps needed.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {/* 2. Architectural Handle Claim Bar */}
          <form onSubmit={handleClaimSubmit} className="pt-6 max-w-xl mx-auto">
            <div className="p-1.5 sm:p-2 bg-white rounded-2xl border border-black/[0.1] focus-within:border-[#163300] focus-within:ring-2 focus-within:ring-[#163300]/10 transition-all flex items-center shadow-xs">
              <div className="pl-4 sm:pl-5 pr-1 text-xs sm:text-sm font-semibold font-mono text-[#879289] select-none shrink-0">
                {isBusiness ? "oneprofile.in/company/" : "oneprofile.in/p/"}
              </div>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder={isBusiness ? "acme-corp" : "alex"}
                className="w-full bg-transparent outline-none border-none font-medium text-sm sm:text-base text-[#121814] placeholder-[#879289] py-1"
              />
              <button
                type="submit"
                className="shrink-0 px-5 sm:px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-[#FAFAF7] bg-[#163300] hover:bg-[#0E2100] transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>{isBusiness ? "Start Team Trial" : "Claim Handle"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Micro-Trust Guarantees */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#576159]">
              {isBusiness ? (
                <>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#163300]" />
                    Centralized admin dashboard
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#163300]" />
                    HubSpot & Salesforce sync
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#163300]" />
                    Zero app install needed
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#163300]" />
                    100% Free digital vCard
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#163300]" />
                    Setup in under 2 minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#163300]" />
                    Instant tap to iOS & Android
                  </span>
                </>
              )}
            </div>
          </form>
        </div>

        {/* 3. Luxury Editorial Product Presentation */}
        <div className="relative mt-14 sm:mt-20 max-w-4xl mx-auto">
          {/* Subtle Grounding Shadow */}
          <div className="absolute -bottom-6 inset-x-12 h-16 bg-black/[0.04] rounded-full blur-2xl -z-10" />

          {/* Product Surface: Dual Layer Digital Identity Showcase */}
          <div className="relative rounded-3xl border border-black/[0.08] bg-[#F6F5EE] p-6 sm:p-10 shadow-[0_16px_50px_-12px_rgba(18,24,20,0.06)] overflow-hidden">
            {/* Fine Paper Top Light */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
              {/* Left Column: Physical & NFC Card Visualization */}
              <div className="md:col-span-6 space-y-4">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#879289] font-bold">
                  Physical Hardware • Metal Edition
                </div>

                {/* The Luxury Card */}
                <div className="relative rounded-2xl bg-[#121814] text-white p-6 sm:p-7 shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-white/[0.12] overflow-hidden aspect-[1.58/1] flex flex-col justify-between group">
                  {/* Subtle Metallic Grain & Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-transparent to-white/[0.06] pointer-events-none" />
                  <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#9FE870]/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Top: OneProfile Mark + Smart Chip */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-display font-bold text-sm tracking-tight text-white/90">
                      oneprofile<span className="text-[#9FE870]">.in</span>
                    </span>
                    <div className="w-9 h-7 rounded-md bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#AA771C] p-0.5 shadow-xs flex items-center justify-center opacity-90">
                      <div className="w-full h-full border border-black/20 rounded-xs flex items-center justify-center">
                        <span className="text-[8px] font-mono font-black text-black/70">NFC</span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Tap Icon Indicator */}
                  <div className="flex items-center gap-2 text-white/40 text-xs relative z-10">
                    <Smartphone className="w-3.5 h-3.5 text-[#9FE870]" />
                    <span className="text-[11px] font-mono tracking-wide text-white/60">Tap to Connect</span>
                  </div>

                  {/* Bottom: Cardholder Name & Title */}
                  <div className="relative z-10 flex items-end justify-between">
                    <div>
                      <div className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                        {isBusiness ? "Acme Enterprise" : "Alex Rivera"}
                        <span className="w-3.5 h-3.5 rounded-full bg-[#9FE870] text-[#163300] text-[9px] font-black inline-flex items-center justify-center">
                          ✓
                        </span>
                      </div>
                      <div className="text-xs text-white/60 font-medium">
                        {isBusiness ? "Corporate Card #0842" : "Principal Product Designer"}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                      NFC v2.4
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#576159] pt-1 font-medium">
                  <span>Sub-second transmission</span>
                  <span className="font-mono text-[11px] text-[#163300] font-bold">0.4s Handshake</span>
                </div>
              </div>

              {/* Right Column: Live Mobile Identity Screen (What the recipient sees) */}
              <div className="md:col-span-6 space-y-4">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#879289] font-bold">
                  Recipient Instant View • Zero App Required
                </div>

                {/* Recipient Mini-Site Preview Surface */}
                <div className="rounded-2xl border border-black/[0.08] bg-white p-5 sm:p-6 shadow-xs space-y-4">
                  {/* Avatar & Header */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#163300] text-[#FAFAF7] font-display font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                      {isBusiness ? "A" : "AR"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-[#121814] flex items-center gap-1.5 truncate">
                        {isBusiness ? "Acme Technologies" : "Alex Rivera"}
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Verified
                        </span>
                      </div>
                      <div className="text-xs text-[#576159] truncate">
                        {isBusiness ? "Enterprise SaaS Solutions" : "Design Systems & Product Architecture"}
                      </div>
                    </div>
                  </div>

                  {/* Primary Contact Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#163300] text-[#FAFAF7] text-xs font-semibold shadow-xs">
                      <Download className="w-3.5 h-3.5 text-[#9FE870]" />
                      <span>Save vCard</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#F6F5EE] border border-black/[0.07] text-[#121814] text-xs font-semibold">
                      <QrCode className="w-3.5 h-3.5 text-[#576159]" />
                      <span>Share QR</span>
                    </div>
                  </div>

                  {/* Metrics / Verified Status */}
                  <div className="p-3 rounded-xl bg-[#FAFAF7] border border-black/[0.05] flex items-center justify-between text-xs">
                    <div className="text-[#576159]">
                      <span className="font-semibold text-[#121814]">Live Profile: </span>
                      oneprofile.in/p/{isBusiness ? "acme" : "alex"}
                    </div>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#576159] pt-1 font-medium">
                  <span>Saves directly to Contacts</span>
                  <span className="text-[#163300] font-bold">100% Native vCard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
