import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Zap,
  Star,
  ChevronDown,
  CreditCard,
  UserCheck,
  Layers,
  BarChart3,
  Globe,
  Sliders,
  Building2,
  Users,
} from "lucide-react";
import { LandingNavbar } from "../components/landing/LandingNavbar";
import { LandingFooter } from "../components/landing/LandingFooter";

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly"); // "monthly" | "yearly"
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const toggleFaq = (idx) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  const proMonthlyPrice = 199;
  const proYearlyMonthlyPrice = 159; // ₹1,899 / year (~20% discount)
  const proAnnualTotal = 1899;

  const enterpriseMonthlyPrice = 499;
  const enterpriseYearlyMonthlyPrice = 399; // ₹4,788 / year (~20% discount)
  const enterpriseAnnualTotal = 4788;

  const comparisonCategories = [
    {
      category: "Profile & Identity",
      icon: <Globe className="w-4 h-4 text-[#255203]" />,
      features: [
        {
          name: "Active Digital Profiles",
          free: "1 Profile",
          pro: "Unlimited Profiles",
          enterprise: "Centralized Multi-Seat Workspace",
        },
        {
          name: "Digital Business Card Web Page",
          free: true,
          pro: true,
          enterprise: true,
        },
        {
          name: "Dynamic High-Res QR Code",
          free: true,
          pro: true,
          enterprise: true,
        },
        {
          name: "Custom URL / Slug (oneprofile.in/p/name)",
          free: false,
          pro: true,
          enterprise: "Custom URL + Team Directory",
        },
        {
          name: "Remove OneProfile Branding Watermark",
          free: false,
          pro: true,
          enterprise: "100% White-Label Branding",
        },
        {
          name: "Custom Domain Mapping (yourname.com)",
          free: false,
          pro: true,
          enterprise: "Custom Domain + Subdomains",
        },
      ],
    },
    {
      category: "Showcase & Portfolio",
      icon: <Layers className="w-4 h-4 text-[#255203]" />,
      features: [
        {
          name: "Portfolio Items & Case Studies",
          free: "Basic (3 items)",
          pro: "Unlimited Showcases",
          enterprise: "Unlimited Showcases",
        },
        {
          name: "Featured Products Showcase",
          free: "Up to 3 Products",
          pro: "Up to 10 Products",
          enterprise: "Unlimited Catalog",
        },
        {
          name: "Featured Services Listing",
          free: "Up to 3 Services",
          pro: "Up to 10 Services",
          enterprise: "Unlimited Services",
        },
        {
          name: "Video & Media Embeds (YouTube, Vimeo)",
          free: "Basic",
          pro: "Unlimited Rich Media",
          enterprise: "Unlimited Rich Media",
        },
        {
          name: "Social & Professional Web Links",
          free: "Unlimited",
          pro: "Unlimited",
          enterprise: "Unlimited",
        },
      ],
    },
    {
      category: "Lead Capture & Networking",
      icon: <UserCheck className="w-4 h-4 text-[#255203]" />,
      features: [
        {
          name: "1-Tap vCard 3.0 Direct Contact Save",
          free: false,
          pro: true,
          enterprise: true,
        },
        {
          name: "Inbound Lead & Contact Inquiry Form",
          free: false,
          pro: true,
          enterprise: "Advanced Form + Rep Routing",
        },
        {
          name: "Direct WhatsApp Message Trigger",
          free: true,
          pro: true,
          enterprise: true,
        },
        {
          name: "Native Calendar Booking (Google / Calendly)",
          free: false,
          pro: true,
          enterprise: true,
        },
        {
          name: "Lead Export & CRM Sync",
          free: false,
          pro: "CSV / Notion Export",
          enterprise: "Direct Sync (HubSpot, Salesforce, Zoho)",
        },
      ],
    },
    {
      category: "Team & Organization Management",
      icon: <Users className="w-4 h-4 text-[#255203]" />,
      features: [
        {
          name: "Central Brand Governance & Hex Lock",
          free: false,
          pro: false,
          enterprise: true,
        },
        {
          name: "Team Lead Attribution & Routing",
          free: false,
          pro: false,
          enterprise: true,
        },
        {
          name: "Bulk CSV Employee Provisioning",
          free: false,
          pro: false,
          enterprise: true,
        },
        {
          name: "SSO / SAML & Directory Management",
          free: false,
          pro: false,
          enterprise: true,
        },
        {
          name: "Multi-User Role Permissions (Admin/Manager/Rep)",
          free: false,
          pro: false,
          enterprise: true,
        },
        {
          name: "GST Invoicing & Centralized Billing",
          free: false,
          pro: true,
          enterprise: true,
        },
      ],
    },
    {
      category: "Design, Analytics & SEO",
      icon: <Sliders className="w-4 h-4 text-[#255203]" />,
      features: [
        {
          name: "Design Themes & Color Schemes",
          free: "Standard Themes",
          pro: "All Premium Themes + Custom CSS",
          enterprise: "Custom Corporate Theme System",
        },
        {
          name: "Advanced Theme Customization",
          free: false,
          pro: true,
          enterprise: true,
        },
        {
          name: "Analytics Dashboard",
          free: "7-Day Basic Views",
          pro: "Real-time Traffic, Clicks & CTR",
          enterprise: "Team Roster Leaderboard & Exports",
        },
        {
          name: "Custom SEO Meta Title & Description",
          free: false,
          pro: true,
          enterprise: true,
        },
        {
          name: "Open Graph Social Share Previews",
          free: "Standard",
          pro: "Fully Custom Rich Cards",
          enterprise: "Enforced Corporate Brand Cards",
        },
      ],
    },
    {
      category: "Security & Support",
      icon: <ShieldCheck className="w-4 h-4 text-[#255203]" />,
      features: [
        {
          name: "RFC 2426 vCard Universal Standard",
          free: true,
          pro: true,
          enterprise: true,
        },
        {
          name: "Zero Recipient App Requirement",
          free: true,
          pro: true,
          enterprise: true,
        },
        {
          name: "SSL Encryption & GDPR Compliance",
          free: true,
          pro: true,
          enterprise: "SOC2 Type II & GDPR Ready",
        },
        {
          name: "Customer Support",
          free: "Community Support",
          pro: "Priority Email & WhatsApp",
          enterprise: "Dedicated Account Manager + 99.9% SLA",
        },
      ],
    },
  ];

  const faqs = [
    {
      q: "Can I use the Free plan forever without paying anything?",
      a: "Yes, absolutely. The Free plan is 100% free forever. It includes your digital business card, dynamic QR code, basic portfolio, and up to 3 products and 3 services. No credit card is needed to get started.",
    },
    {
      q: "How does the Enterprise plan work for corporate teams?",
      a: "OneProfile Enterprise equips your marketing or HR department with a central administrative dashboard. You can provision profiles for 5 to 5,000+ employees in seconds via CSV or SSO, enforce brand logos and colors, route leads directly to HubSpot or Salesforce, and order company-branded physical NFC cards with volume discounts.",
    },
    {
      q: "How does the Pro plan's 1-tap vCard download work?",
      a: "When a client, prospect, or conference attendee visits your OneProfile, tapping 'Save Contact' downloads an RFC 2426-compliant vCard file that instantly saves your name, phone number, email, WhatsApp, and website directly into their phone's native address book (Apple Contacts or Google Contacts). They don't need any app installed.",
    },
    {
      q: "Can I use my own custom domain name (e.g. alexvance.com)?",
      a: "Yes! Pro subscribers can map their own custom domain name directly to their OneProfile with automated SSL certificates configured at no additional charge.",
    },
    {
      q: "What happens if I downgrade from Pro to Free later?",
      a: "If you ever decide to downgrade, your account seamlessly transitions back to the Free plan at the end of your billing cycle. Your primary profile, QR code, and essential details remain active.",
    },
    {
      q: "What payment methods are supported in India?",
      a: "We support all major Indian payment methods, including UPI (Google Pay, PhonePe, Paytm), RuPay, Visa, Mastercard, Net Banking, and recurring credit/debit card mandates.",
    },
    {
      q: "Can I also order a physical NFC Smart Business Card?",
      a: "Yes! You can order physical laser-engraved NFC cards in Matte Luxe Polycarbonate, Eco Bamboo, or Metal directly from your dashboard. Physical cards link dynamically to your OneProfile URL, whether you are on Free or Pro.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#163300] selection:bg-[#9FE870] selection:text-[#163300] font-sans overflow-x-hidden">
      {/* 1. Global Navigation */}
      <LandingNavbar />

      {/* 2. Pricing Header & Hero */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-8 bg-white border-b border-[#EAECEF]">
        <div className="max-w-[1240px] mx-auto text-center space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#163300]/5 border border-[#163300]/10 text-xs font-bold text-[#163300]">
            <Sparkles className="w-3.5 h-3.5 text-[#255203]" />
            <span>Transparent & Predictable Pricing</span>
          </div>

          {/* Master Headline */}
          <h1 className="font-parafina font-black text-[38px] sm:text-[58px] md:text-[72px] lg:text-[80px] text-[#163300] tracking-[-0.04em] uppercase leading-[0.94] text-balance max-w-4xl mx-auto">
            INVEST IN YOUR IDENTITY.
            <br />
            GROW YOUR BUSINESS.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#3A4833] font-normal max-w-2xl mx-auto leading-relaxed">
            Start free, upgrade as your network scales. No surprise fees, no
            complicated lock-in. Cancel or switch plans anytime with one click.
          </p>

          {/* Monthly / Yearly Billing Toggle */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 select-none">
            <div className="inline-flex items-center p-1.5 bg-[#F2F4F7] rounded-full border border-black/5 shadow-xs">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-[#163300] text-white shadow-sm"
                    : "text-[#556947] hover:text-[#163300]"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  billingCycle === "yearly"
                    ? "bg-[#9FE870] text-[#163300] font-black shadow-sm"
                    : "text-[#556947] hover:text-[#163300]"
                }`}
              >
                <span>Annual Billing</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#163300] text-white font-extrabold uppercase tracking-wide">
                  Save 20%
                </span>
              </button>
            </div>
            {billingCycle === "yearly" && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
              >
                🎉 2 Months Free applied automatically
              </motion.span>
            )}
          </div>
        </div>
      </section>

      {/* 3. Pricing Cards Grid (Free vs Pro vs Enterprise) */}
      <section className="py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Card 1: FREE PLAN */}
          <div className="bg-white rounded-[36px] p-6 sm:p-8 lg:p-9 border-2 border-slate-200 shadow-sm flex flex-col justify-between relative hover:border-slate-300 transition-all">
            <div className="space-y-6">
              {/* Plan Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Starter
                  </span>
                  <h3 className="font-parafina font-black text-3xl sm:text-4xl text-[#163300] mt-1">
                    Free
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                  Zero Cost
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Essential digital business identity for solopreneurs, students,
                and practitioners getting started.
              </p>

              {/* Price Display */}
              <div className="pt-2 pb-4 border-b border-slate-100 flex items-baseline gap-2">
                <span className="font-parafina font-black text-4xl sm:text-5xl text-[#163300]">
                  ₹0
                </span>
                <span className="text-sm font-bold text-slate-500">
                  / forever free
                </span>
              </div>

              {/* CTA Button */}
              <Link
                to="/signup"
                className="w-full py-4 rounded-full text-center text-sm font-black border-2 border-[#163300] text-[#163300] hover:bg-[#163300] hover:text-white transition-all shadow-xs hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="text-center text-[11px] font-semibold text-slate-400">
                ✓ No credit card required • Instant setup
              </div>

              {/* Features List */}
              <div className="space-y-3.5 pt-4">
                <div className="text-xs font-black uppercase tracking-wider text-[#163300]">
                  What's included in Free:
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>1 Active Digital Profile</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Universal Digital Business Card link</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Dynamic High-Resolution QR Code</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Basic Portfolio showcase</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      Up to <strong>3 Featured Products</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      Up to <strong>3 Featured Services</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Mobile-responsive, sub-second loads</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </div>
                    <span className="line-through">
                      Custom URL slug (includes /p/id)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </div>
                    <span className="line-through">
                      1-Tap vCard Address Book Save
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                      <X className="w-3.5 h-3.5" />
                    </div>
                    <span className="line-through">
                      OneProfile Watermark removal
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2: PRO PLAN (Most Popular Highlight) */}
          <div className="bg-[#163300] text-white rounded-[36px] p-6 sm:p-8 lg:p-9 border-2 border-[#9FE870] shadow-[0_25px_60px_rgba(22,51,0,0.3)] flex flex-col justify-between relative transform lg:-translate-y-2 hover:scale-[1.01] transition-all">
            {/* Top Most Popular Ribbon */}
            <div className="absolute -top-4 right-8 bg-[#9FE870] text-[#163300] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              <Star className="w-3.5 h-3.5 fill-[#163300]" />
              <span>Most Popular</span>
            </div>

            <div className="space-y-6">
              {/* Plan Header */}
              <div className="flex justify-between items-start pt-2">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#9FE870]">
                    Professional
                  </span>
                  <h3 className="font-parafina font-black text-3xl sm:text-4xl text-white mt-1">
                    Pro
                  </h3>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-white/10 text-[#9FE870] font-bold text-xs border border-white/10">
                  Full Power
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                For freelancers, consultants, and leaders closing high-ticket
                deals.
              </p>

              {/* Price Display */}
              <div className="pt-2 pb-4 border-b border-white/10 flex items-baseline gap-2">
                <span className="font-parafina font-black text-4xl sm:text-5xl text-[#9FE870]">
                  ₹
                  {billingCycle === "monthly"
                    ? proMonthlyPrice
                    : proYearlyMonthlyPrice}
                </span>
                <span className="text-sm font-bold text-slate-300">
                  / mo {billingCycle === "yearly" && "(billed annually)"}
                </span>
              </div>

              {billingCycle === "yearly" && (
                <div className="text-xs text-[#9FE870] font-bold -mt-2">
                  ₹{proAnnualTotal} billed yearly • Save ₹489 every year!
                </div>
              )}

              {/* CTA Button */}
              <Link
                to="/signup?plan=pro"
                className="w-full py-4 rounded-full text-center text-sm font-black bg-[#9FE870] hover:bg-[#8DE05B] text-[#163300] transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Upgrade to Pro</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="text-center text-[11px] font-semibold text-slate-300">
                ✓ 14-day money-back guarantee • Cancel anytime
              </div>

              {/* Features List */}
              <div className="space-y-3.5 pt-4">
                <div className="text-xs font-black uppercase tracking-wider text-[#9FE870]">
                  Everything in Free, plus:
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#9FE870] text-[#163300] flex items-center justify-center shrink-0 font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>1-Tap vCard Direct Download</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#9FE870] text-[#163300] flex items-center justify-center shrink-0 font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Custom Profile URL</strong> (oneprofile.in/p/name)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#9FE870] text-[#163300] flex items-center justify-center shrink-0 font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Unlimited Portfolio Showcases</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#9FE870] text-[#163300] flex items-center justify-center shrink-0 font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      Up to <strong>10 Featured Products</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#9FE870] text-[#163300] flex items-center justify-center shrink-0 font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      Up to <strong>10 Featured Services</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#9FE870] text-[#163300] flex items-center justify-center shrink-0 font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Inbound Lead Capture Form</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#9FE870] text-[#163300] flex items-center justify-center shrink-0 font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Remove OneProfile Branding</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#9FE870] text-[#163300] flex items-center justify-center shrink-0 font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Real-time Analytics</strong> (Views & Clicks)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#9FE870] text-[#163300] flex items-center justify-center shrink-0 font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Custom SEO Meta Controls</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#9FE870] text-[#163300] flex items-center justify-center shrink-0 font-bold">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Advanced Themes & Custom CSS</strong>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 3: ENTERPRISE PLAN (Teams & Corporate) */}
          <div className="bg-white rounded-[36px] p-6 sm:p-8 lg:p-9 border-2 border-slate-200 shadow-sm flex flex-col justify-between relative hover:border-[#163300]/40 hover:shadow-md transition-all">
            <div className="space-y-6">
              {/* Plan Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    Organizations
                  </span>
                  <h3 className="font-parafina font-black text-3xl sm:text-4xl text-[#163300] mt-1">
                    Enterprise
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#163300]/10 text-[#163300] font-bold text-xs flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#255203]" />
                  <span>Teams</span>
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Centralized corporate identity, brand governance, and lead
                routing for teams of 5 to 5,000+.
              </p>

              {/* Price Display */}
              <div className="pt-2 pb-4 border-b border-slate-100 flex items-baseline gap-2">
                <span className="font-parafina font-black text-4xl sm:text-5xl text-[#163300]">
                  ₹
                  {billingCycle === "monthly"
                    ? enterpriseMonthlyPrice
                    : enterpriseYearlyMonthlyPrice}
                </span>
                <span className="text-sm font-bold text-slate-500">
                  / user / mo {billingCycle === "yearly" && "(annual)"}
                </span>
              </div>

              {billingCycle === "yearly" && (
                <div className="text-xs text-[#255203] font-bold -mt-2">
                  ₹{enterpriseAnnualTotal}/seat billed yearly • Volume discounts
                  for 50+ seats!
                </div>
              )}

              {/* CTA Button */}
              <Link
                to="/signup?type=business"
                className="w-full py-4 rounded-full text-center text-sm font-black bg-[#163300] hover:bg-black text-white transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span>Get Enterprise</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="text-center text-[11px] font-semibold text-slate-400">
                ✓ Dedicated onboarding • Invoicing & GST compliance
              </div>

              {/* Features List */}
              <div className="space-y-3.5 pt-4">
                <div className="text-xs font-black uppercase tracking-wider text-[#163300]">
                  Everything in Pro, plus:
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Centralized Team Admin Dashboard</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Central Brand Governance</strong> (Lock logos &
                      colors)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Bulk CSV Provisioning</strong> & Directory Sync
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Team Lead Attribution</strong> & CRM Auto-Routing
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Company Analytics</strong> & Leaderboards
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Co-Branded NFC Cards</strong> (Volume Rates)
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong>Dedicated Account Manager</strong> & 99.9% SLA
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Hardware Upsell Banner: Smart NFC Contactless Cards */}
      <section className="px-4 sm:px-8 pb-16 max-w-[1100px] mx-auto">
        <div className="bg-[#9FE870] rounded-[32px] p-6 sm:p-10 border border-[#163300]/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#163300]">
              <CreditCard className="w-4 h-4" />
              <span>Looking for Physical NFC Cards?</span>
            </div>
            <h3 className="font-parafina font-black text-2xl sm:text-3xl text-[#163300] leading-tight">
              One contactless card. Works with Free & Pro.
            </h3>
            <p className="text-xs sm:text-sm text-[#163300]/90 max-w-xl leading-relaxed">
              Order physical NFC smart cards (Basic Plastic ₹390, Heavy Plastic ₹590, Metal ₹1,790) as a one-time purchase. Tap against any iPhone or Android to open your OneProfile instantly.
            </p>
          </div>
          <Link
            to="/signup"
            className="shrink-0 px-8 py-3.5 rounded-full font-black text-sm bg-[#163300] hover:bg-black text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Order NFC Card
          </Link>
        </div>
      </section>

      {/* 5. Detailed Feature Comparison Table */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-y border-[#EAECEF]">
        <div className="max-w-[1240px] mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#163300]/5 text-xs font-bold text-[#163300]">
              <Layers className="w-3.5 h-3.5 text-[#255203]" />
              <span>Full Comparison</span>
            </div>
            <h2 className="font-parafina font-black text-3xl sm:text-5xl text-[#163300] tracking-tight">
              Compare Free, Pro & Enterprise side-by-side
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Everything you need to know about the capabilities of each tier.
            </p>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wider font-extrabold text-slate-500">
                  <th className="py-4 px-4 sm:px-6 w-2/5">Features</th>
                  <th className="py-4 px-4 sm:px-6 w-1/5 text-center">
                    <span className="block text-base font-black text-[#163300]">
                      Free
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      ₹0
                    </span>
                  </th>
                  <th className="py-4 px-4 sm:px-6 w-1/5 text-center bg-[#9FE870]/10 rounded-t-2xl">
                    <span className="block text-base font-black text-[#163300]">
                      Pro
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800">
                      ₹
                      {billingCycle === "monthly"
                        ? proMonthlyPrice
                        : proYearlyMonthlyPrice}{" "}
                      / mo
                    </span>
                  </th>
                  <th className="py-4 px-4 sm:px-6 w-1/5 text-center bg-[#163300]/5 rounded-t-2xl">
                    <span className="block text-base font-black text-[#163300]">
                      Enterprise
                    </span>
                    <span className="text-[11px] font-bold text-[#255203]">
                      ₹
                      {billingCycle === "monthly"
                        ? enterpriseMonthlyPrice
                        : enterpriseYearlyMonthlyPrice}{" "}
                      / seat
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {comparisonCategories.map((cat, ci) => (
                  <React.Fragment key={ci}>
                    {/* Category Header Row */}
                    <tr className="bg-[#F8F9FA]">
                      <td
                        colSpan={4}
                        className="py-3 px-4 sm:px-6 font-black text-xs uppercase tracking-wider text-[#163300] flex items-center gap-2"
                      >
                        {cat.icon}
                        <span>{cat.category}</span>
                      </td>
                    </tr>

                    {/* Features in this category */}
                    {cat.features.map((f, fi) => (
                      <tr
                        key={fi}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3.5 px-4 sm:px-6 font-semibold text-[#163300]">
                          {f.name}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-center text-slate-600">
                          {typeof f.free === "boolean" ? (
                            f.free ? (
                              <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                            ) : (
                              <X className="w-4 h-4 text-slate-300 mx-auto" />
                            )
                          ) : (
                            <span className="font-bold text-xs">{f.free}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-center text-[#163300] bg-[#9FE870]/10 font-bold">
                          {typeof f.pro === "boolean" ? (
                            f.pro ? (
                              <Check className="w-4 h-4 text-emerald-700 mx-auto stroke-[2.5]" />
                            ) : (
                              <X className="w-4 h-4 text-slate-300 mx-auto" />
                            )
                          ) : (
                            <span className="font-extrabold text-xs text-emerald-900">
                              {f.pro}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-center text-[#163300] bg-[#163300]/5 font-bold">
                          {typeof f.enterprise === "boolean" ? (
                            f.enterprise ? (
                              <Check className="w-4 h-4 text-emerald-800 mx-auto stroke-[2.5]" />
                            ) : (
                              <X className="w-4 h-4 text-slate-300 mx-auto" />
                            )
                          ) : (
                            <span className="font-extrabold text-xs text-[#163300]">
                              {f.enterprise}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom CTAs */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm border-2 border-[#163300] text-[#163300] hover:bg-[#163300] hover:text-white transition-all text-center"
            >
              Start Free (₹0)
            </Link>
            <Link
              to="/signup?plan=pro"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-black text-xs sm:text-sm bg-[#9FE870] hover:bg-[#8DE05B] text-[#163300] transition-all shadow-sm text-center flex items-center justify-center gap-2"
            >
              <span>
                Get Pro (₹
                {billingCycle === "monthly"
                  ? proMonthlyPrice
                  : proYearlyMonthlyPrice}
                /mo)
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/signup?type=business"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-black text-xs sm:text-sm bg-[#163300] hover:bg-black text-white transition-all shadow-sm text-center flex items-center justify-center gap-2"
            >
              <span>
                Get Enterprise (₹
                {billingCycle === "monthly"
                  ? enterpriseMonthlyPrice
                  : enterpriseYearlyMonthlyPrice}
                /seat)
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Pricing FAQ Accordion */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-[900px] mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#163300]/5 text-xs font-bold text-[#163300]">
            <HelpCircle className="w-3.5 h-3.5 text-[#255203]" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-parafina font-black text-3xl sm:text-4xl text-[#163300]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Clear answers about plans, billing, and features.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 font-black text-sm sm:text-base text-[#163300] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#163300]" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Final High-Impact Conversion Banner */}
      <section className="bg-[#163300] text-white py-16 sm:py-20 px-4 sm:px-8 border-t border-black/20">
        <div className="max-w-[1100px] mx-auto text-center space-y-6">
          <h2 className="font-parafina font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            YOUR NETWORK IS WAITING.
            <br />
            <span className="text-[#9FE870]">UPGRADE YOUR IDENTITY TODAY.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of modern professionals across India and globally who
            have replaced paper cards with OneProfile.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all text-center"
            >
              Get Started Free (₹0)
            </Link>
            <Link
              to="/signup?plan=pro"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-black text-sm bg-[#9FE870] hover:bg-[#8DE05B] text-[#163300] transition-all shadow-md text-center flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Upgrade to Pro — ₹199/mo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Global Footer */}
      <LandingFooter />
    </div>
  );
}

export default PricingPage;
