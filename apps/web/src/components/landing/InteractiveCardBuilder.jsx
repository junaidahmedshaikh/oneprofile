import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  User,
  Check,
  ArrowRight,
  Sparkles,
  Smartphone,
  QrCode,
  Wifi,
  Zap,
} from "lucide-react";

export function InteractiveCardBuilder({ activeSegment = "personal" }) {
  const navigate = useNavigate();

  const isBusiness = activeSegment === "business";

  // State
  const [scaleType, setScaleType] = useState("solo"); // "solo" | "team"
  const [teamSize, setTeamSize] = useState(5);
  const [profilePlan, setProfilePlan] = useState("pro"); // "free" | "pro" | "enterprise"
  const [cardType, setCardType] = useState("heavy"); // "none" | "basic" | "heavy" | "metal"

  // Synchronize when activeSegment toggles
  React.useEffect(() => {
    if (activeSegment === "business") {
      setScaleType("team");
      setProfilePlan("enterprise");
    } else {
      setScaleType("solo");
      setProfilePlan("pro");
    }
  }, [activeSegment]);

  // Pricing constants in INR
  const cardPrices = {
    none: 0,
    basic: 390,
    heavy: 590,
    metal: 1790,
  };

  const cardLabels = {
    none: "Digital Only (No Card)",
    basic: "Basic Plastic",
    heavy: "Heavy Plastic",
    metal: "Metal",
  };

  const planLabels = {
    free: "Free Plan",
    pro: "Pro Plan",
    enterprise: "Enterprise",
  };

  const seats = scaleType === "solo" ? 1 : teamSize;
  const nfcUnitPrice = cardPrices[cardType];
  const totalHardwareCost = cardType === "none" ? 0 : seats * nfcUnitPrice;

  // Monthly subscription calculation
  const monthlyPlanPrice =
    profilePlan === "free"
      ? 0
      : profilePlan === "pro"
        ? scaleType === "solo"
          ? 199
          : 199 * seats
        : 499 * seats;

  // Dynamic card visuals based on material
  const getCardVisualStyles = () => {
    switch (cardType) {
      case "metal":
        return {
          wrapperBg:
            "bg-gradient-to-br from-[#1c1c1e] via-[#2c2c2e] to-[#0a0a0a]",
          border: "border-slate-700/80 shadow-[0_20px_40px_rgba(0,0,0,0.35)]",
          accentColor: "text-amber-300",
          textColor: "text-white",
          subColor: "text-slate-300",
          chipBg: "bg-gradient-to-br from-amber-400 to-amber-600 text-black",
          badgeBg: "bg-amber-400/20 text-amber-300 border-amber-400/30",
          materialLabel: "Laser-Engraved Metal",
          chipText: "Laser NFC Chip",
        };
      case "basic":
        return {
          wrapperBg: "bg-gradient-to-br from-white via-[#f8fafc] to-[#edf2f7]",
          border: "border-slate-300/80 shadow-[0_16px_35px_rgba(0,0,0,0.12)]",
          accentColor: "text-[#163300]",
          textColor: "text-[#163300]",
          subColor: "text-slate-600",
          chipBg: "bg-[#9FE870] text-[#163300]",
          badgeBg: "bg-[#163300]/10 text-[#163300] border-[#163300]/20",
          materialLabel: "Basic Matte PVC",
          chipText: "NFC Smart Chip",
        };
      case "none":
        return {
          wrapperBg:
            "bg-gradient-to-br from-[#163300] via-[#1F4500] to-[#122800]",
          border: "border-[#9FE870]/30 shadow-[0_20px_40px_rgba(0,0,0,0.25)]",
          accentColor: "text-[#9FE870]",
          textColor: "text-white",
          subColor: "text-emerald-100/80",
          chipBg: "bg-[#9FE870] text-[#163300]",
          badgeBg: "bg-[#9FE870]/20 text-[#9FE870] border-[#9FE870]/30",
          materialLabel: "Virtual Digital Pass",
          chipText: "Dynamic QR & Web",
        };
      case "heavy":
      default:
        return {
          wrapperBg:
            "bg-gradient-to-br from-[#163300] via-[#1a3d00] to-[#0e2100]",
          border: "border-[#9FE870]/30 shadow-[0_22px_45px_rgba(0,0,0,0.28)]",
          accentColor: "text-[#9FE870]",
          textColor: "text-white",
          subColor: "text-slate-300",
          chipBg: "bg-[#9FE870] text-[#163300]",
          badgeBg: "bg-[#9FE870]/20 text-[#9FE870] border-[#9FE870]/30",
          materialLabel: "Heavy Weighted Plastic",
          chipText: "High-Speed NFC Chip",
        };
    }
  };

  const visual = getCardVisualStyles();

  // CTA navigation handler
  const handlePrimaryCta = () => {
    if (profilePlan === "free") {
      navigate("/signup");
    } else if (profilePlan === "pro") {
      navigate("/signup?plan=pro");
    } else {
      navigate("/signup?type=business");
    }
  };

  return (
    <section
      id="interactive-builder"
      className="bg-[#F6F5EE] py-24 sm:py-32 border-b border-black/[0.07] text-[#121814]"
    >
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Headline, Visual NFC Card Preview, Core Value Pillars */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.03] border border-black/[0.06] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#576159] select-none">
              <Sparkles className="w-3.5 h-3.5 text-[#163300]" />
              <span>
                {isBusiness
                  ? "Enterprise Team & Hardware Configurator"
                  : "Interactive Profile & Card Builder"}
              </span>
            </div>

            <div className="space-y-2">
              <div className="font-editorial italic text-2xl sm:text-3xl text-[#576159]">
                Tailored hardware & software,
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl text-[#121814] tracking-[-0.035em] uppercase leading-[1]">
                {isBusiness ? (
                  <>
                    DEPLOY YOUR TEAM.
                    <br />
                    PICK YOUR HARDWARE.
                    <br />
                    TRACK ROI LIVE.
                  </>
                ) : (
                  <>
                    CONFIGURE YOUR IDENTITY.
                    <br />
                    PICK YOUR SMART CARD.
                    <br />
                    CONNECT IN 1 TAP.
                  </>
                )}
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#576159] font-normal leading-relaxed max-w-lg">
              {isBusiness ? (
                <>
                  Standardize your company's digital cards, empower every sales
                  rep with a 1-tap contactless NFC card, and calculate the exact
                  transparent cost for your team with zero hidden fees.
                </>
              ) : (
                <>
                  Built for founders, freelancers, sales leaders, and
                  modern professionals. Pair your live OneProfile digital identity with
                  a 1-tap physical NFC smart card — purchased once, updated anytime, with zero recurring
                  card fees.
                </>
              )}
            </p>

            {/* Live Interactive Smart Card Mockup */}
            <div className="pt-2">
              <div
                className={`relative w-full max-w-[420px] aspect-[1.586/1] rounded-2xl p-5 sm:p-6 border transition-all duration-300 flex flex-col justify-between ${visual.wrapperBg} ${visual.border}`}
              >
                {/* Card Top Row: Brand & Contactless Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#9FE870] flex items-center justify-center font-black text-[#163300] text-sm shadow-xs">
                      1P
                    </div>
                    <span
                      className={`font-parafina font-black text-sm tracking-tight ${visual.textColor}`}
                    >
                      OneProfile
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${visual.badgeBg}`}
                    >
                      {visual.materialLabel}
                    </span>
                    <Wifi
                      className={`w-5 h-5 rotate-90 ${visual.accentColor}`}
                    />
                  </div>
                </div>

                {/* Card Middle: User Name & Role */}
                <div className="space-y-0.5">
                  <h4
                    className={`font-parafina font-black text-xl sm:text-2xl tracking-tight leading-tight ${visual.textColor}`}
                  >
                    {isBusiness
                      ? "Acme Global Sales Team"
                      : scaleType === "solo"
                        ? "Alex Vance"
                        : "Alex Vance & Team"}
                  </h4>
                  <p className={`text-xs font-semibold ${visual.subColor}`}>
                    {isBusiness
                      ? `Corporate Workspace • ${seats} Managed Cards`
                      : scaleType === "solo"
                        ? "Founder & Creative Consultant"
                        : `Executive Directory • ${seats} Team Cards`}
                  </p>
                </div>

                {/* Card Bottom Row: Chip & Instant vCard indicator */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-6 rounded bg-[#9FE870]/20 border border-[#9FE870]/40 flex items-center justify-center">
                      <Zap className={`w-3.5 h-3.5 ${visual.accentColor}`} />
                    </div>
                    <span
                      className={`text-[10px] font-bold ${visual.subColor}`}
                    >
                      {visual.chipText}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold">
                    <QrCode className={`w-3.5 h-3.5 ${visual.accentColor}`} />
                    <span className={visual.accentColor}>
                      oneprofile.me/alex
                    </span>
                  </div>
                </div>
              </div>

              {/* Frictionless Tap Pill */}
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#163300] mt-3 bg-[#163300]/10 px-3.5 py-1 rounded-full">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>
                  1-Tap contact save (.vcf) • No app required for recipient •
                  Works on all phones
                </span>
              </div>
            </div>

            {/* 3 Key Value Pillars for OneProfile Users */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-black/[0.08] shadow-xs">
                <div className="font-display font-black text-xl sm:text-2xl text-[#121814]">
                  1-Tap
                </div>
                <div className="text-[11px] font-medium text-[#576159] mt-1 leading-snug">
                  Direct vCard save to Apple/Google Contacts
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-black/[0.08] shadow-xs">
                <div className="font-display font-black text-xl sm:text-2xl text-[#121814]">
                  1-Time
                </div>
                <div className="text-[11px] font-medium text-[#576159] mt-1 leading-snug">
                  Hardware purchase, zero recurring card fees
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-black/[0.08] shadow-xs">
                <div className="font-display font-black text-xl sm:text-2xl text-[#121814]">
                  Live
                </div>
                <div className="text-[11px] font-medium text-[#576159] mt-1 leading-snug">
                  Real-time updates, unlimited link edits
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive White Configurator Card */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="w-full max-w-[540px] bg-white rounded-3xl shadow-[0_16px_50px_-12px_rgba(18,24,20,0.06)] border border-black/[0.08] p-6 sm:p-8 text-[#121814] space-y-5">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-black/[0.06] pb-3.5">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#163300]" />
                  <h3 className="font-display font-black text-lg text-[#121814]">
                    Build Your Setup
                  </h3>
                </div>
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#163300] text-[#FAFAF7]">
                  Live Calculator
                </span>
              </div>

              {/* Step 1: Scale Selection (Solo vs Team) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  1. Who is this setup for?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setScaleType("solo")}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      scaleType === "solo"
                        ? "bg-[#163300] text-white border-[#163300] shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Solo Professional</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setScaleType("team");
                      if (profilePlan === "free") setProfilePlan("enterprise");
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      scaleType === "team"
                        ? "bg-[#163300] text-white border-[#163300] shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Team / Agency</span>
                  </button>
                </div>

                {/* Team Size Slider (Only visible if Team is active) */}
                {scaleType === "team" && (
                  <div className="pt-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700">
                        Team Members / Cards:
                      </span>
                      <span className="font-black text-sm text-[#163300]">
                        {teamSize} seats
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="50"
                      value={teamSize}
                      onChange={(e) => setTeamSize(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#163300]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>2 Members</span>
                      <span>10 Sales Reps</span>
                      <span>25 Team</span>
                      <span>50+ Company</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Choose Digital Profile Plan */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 block">
                    2. Choose Digital Profile Plan:
                  </label>
                  <span className="text-[10px] font-bold text-slate-400">
                    Cancel or upgrade anytime
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Free Plan */}
                  <button
                    type="button"
                    onClick={() => setProfilePlan("free")}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      profilePlan === "free"
                        ? "bg-[#9FE870]/25 border-[#163300] text-[#163300] shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">Free</span>
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                            profilePlan === "free"
                              ? "bg-[#163300] text-white"
                              : "border border-slate-300"
                          }`}
                        >
                          {profilePlan === "free" && (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Digital Card + QR
                      </div>
                    </div>
                    <div className="mt-2 font-black text-sm text-[#163300]">
                      ₹0
                    </div>
                  </button>

                  {/* Pro Plan */}
                  <button
                    type="button"
                    onClick={() => setProfilePlan("pro")}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                      profilePlan === "pro"
                        ? "bg-[#9FE870]/25 border-[#163300] text-[#163300] shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="absolute -top-2 right-2 text-[9px] font-black bg-[#163300] text-white px-1.5 py-0.2 rounded-full">
                      Popular
                    </span>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">Pro</span>
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                            profilePlan === "pro"
                              ? "bg-[#163300] text-white"
                              : "border border-slate-300"
                          }`}
                        >
                          {profilePlan === "pro" && (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Custom URL + vCard
                      </div>
                    </div>
                    <div className="mt-2 font-black text-sm text-[#163300]">
                      ₹199
                      <span className="text-[10px] font-medium text-slate-500">
                        {scaleType === "solo" ? "/mo" : "/seat/mo"}
                      </span>
                    </div>
                  </button>

                  {/* Enterprise Plan */}
                  <button
                    type="button"
                    onClick={() => setProfilePlan("enterprise")}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      profilePlan === "enterprise"
                        ? "bg-[#9FE870]/25 border-[#163300] text-[#163300] shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">Enterprise</span>
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                            profilePlan === "enterprise"
                              ? "bg-[#163300] text-white"
                              : "border border-slate-300"
                          }`}
                        >
                          {profilePlan === "enterprise" && (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Team Dashboard
                      </div>
                    </div>
                    <div className="mt-2 font-black text-sm text-[#163300]">
                      ₹499
                      <span className="text-[10px] font-medium text-slate-500">
                        /seat/mo
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 3: Physical NFC Smart Card (One-Time Purchase) */}
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 block">
                    3. Physical NFC Card (One-Time Purchase):
                  </label>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Buy Once • Tap Forever
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Option 1: Basic Plastic */}
                  <button
                    type="button"
                    onClick={() => setCardType("basic")}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between cursor-pointer select-none transition-all ${
                      cardType === "basic"
                        ? "bg-[#9FE870]/25 border-[#163300] text-[#163300] shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold leading-tight">
                        Basic Plastic
                      </span>
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                          cardType === "basic"
                            ? "bg-[#163300] text-white"
                            : "border border-slate-300"
                        }`}
                      >
                        {cardType === "basic" && (
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="font-extrabold text-xs text-[#163300]">
                        ₹390
                      </div>
                      <div className="text-[9px] text-slate-400 font-semibold">
                        one-time
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Heavy Plastic */}
                  <button
                    type="button"
                    onClick={() => setCardType("heavy")}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between cursor-pointer select-none transition-all ${
                      cardType === "heavy"
                        ? "bg-[#9FE870]/25 border-[#163300] text-[#163300] shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold leading-tight">
                        Heavy Plastic
                      </span>
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                          cardType === "heavy"
                            ? "bg-[#163300] text-white"
                            : "border border-slate-300"
                        }`}
                      >
                        {cardType === "heavy" && (
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="font-extrabold text-xs text-[#163300]">
                        ₹590
                      </div>
                      <div className="text-[9px] text-slate-400 font-semibold">
                        one-time
                      </div>
                    </div>
                  </button>

                  {/* Option 3: Metal */}
                  <button
                    type="button"
                    onClick={() => setCardType("metal")}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between cursor-pointer select-none transition-all ${
                      cardType === "metal"
                        ? "bg-[#9FE870]/25 border-[#163300] text-[#163300] shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold leading-tight">
                        Metal
                      </span>
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                          cardType === "metal"
                            ? "bg-[#163300] text-white"
                            : "border border-slate-300"
                        }`}
                      >
                        {cardType === "metal" && (
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="font-extrabold text-xs text-[#163300]">
                        ₹1,790
                      </div>
                      <div className="text-[9px] text-slate-400 font-semibold">
                        one-time
                      </div>
                    </div>
                  </button>

                  {/* Option 4: Digital Only */}
                  <button
                    type="button"
                    onClick={() => setCardType("none")}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between cursor-pointer select-none transition-all ${
                      cardType === "none"
                        ? "bg-[#9FE870]/25 border-[#163300] text-[#163300] shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold leading-tight">
                        Digital Only
                      </span>
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                          cardType === "none"
                            ? "bg-[#163300] text-white"
                            : "border border-slate-300"
                        }`}
                      >
                        {cardType === "none" && (
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="font-extrabold text-xs text-[#163300]">
                        ₹0
                      </div>
                      <div className="text-[9px] text-slate-400 font-semibold">
                        no card
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Live Cost & Setup Summary Box */}
              <div className="bg-[#F2F4F7] rounded-2xl p-4 sm:p-5 space-y-3.5 border border-slate-200/80">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Total Investment Breakdown
                    </div>
                    <div className="font-parafina font-black text-2xl sm:text-3xl text-[#163300]">
                      {totalHardwareCost > 0 ? (
                        <>
                          ₹{totalHardwareCost.toLocaleString("en-IN")}{" "}
                          <span className="text-xs font-bold text-slate-500">
                            one-time hardware
                          </span>
                        </>
                      ) : (
                        <>
                          ₹0{" "}
                          <span className="text-xs font-bold text-slate-500">
                            hardware
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-xs font-bold text-emerald-800">
                      + ₹{monthlyPlanPrice.toLocaleString("en-IN")}/mo for{" "}
                      {planLabels[profilePlan]}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#9FE870] text-[#163300] text-xs font-black">
                      {scaleType === "solo"
                        ? "Solo Setup"
                        : `${seats} Seats Bundle`}
                    </span>
                  </div>
                </div>

                {/* Line Item Breakdown */}
                <div className="bg-white/90 rounded-xl p-3 space-y-2 text-[11px] font-medium border border-black/5">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      NFC Hardware ({cardLabels[cardType]}
                      {cardType !== "none" ? ` × ${seats}` : ""}):
                    </span>
                    <span className="font-bold text-[#163300]">
                      {cardType === "none"
                        ? "₹0 (Digital Only)"
                        : `₹${totalHardwareCost.toLocaleString("en-IN")} (One-Time)`}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600 border-t border-slate-100 pt-1.5">
                    <span>
                      Digital Profile ({planLabels[profilePlan]}
                      {scaleType === "team" && profilePlan !== "free"
                        ? ` × ${seats} seats`
                        : ""}
                      ):
                    </span>
                    <span className="font-bold text-[#163300]">
                      {profilePlan === "free"
                        ? "₹0 (Forever Free)"
                        : `₹${monthlyPlanPrice.toLocaleString("en-IN")}/month`}
                    </span>
                  </div>
                </div>

                {/* What's Included Checklist */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-[11px] font-semibold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                    <span>Instant 1-Tap vCard Download</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                    <span>Dynamic QR + Custom Profile URL</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                    <span>WhatsApp Lead & Contact Form</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                    <span>Unlimited Profile Edits Forever</span>
                  </div>
                </div> */}
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => navigate("/pricing")}
                  className="py-3.5 px-4 rounded-full text-center text-xs font-bold border border-[#163300] text-[#163300] hover:bg-[#F2F4F7] transition-all cursor-pointer"
                >
                  Compare All Plans
                </button>
                <button
                  type="button"
                  onClick={handlePrimaryCta}
                  className="py-3.5 px-4 rounded-full text-center text-xs font-black bg-[#163300] hover:bg-black text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>
                    {profilePlan === "free"
                      ? "Get Started Free"
                      : profilePlan === "pro"
                        ? "Get Started with Pro"
                        : "Get Enterprise"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
