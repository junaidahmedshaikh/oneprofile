import React, { useState } from "react";
import { Building2, Briefcase, TrendingUp, Palette, Stethoscope } from "lucide-react";

export function IndustryDirectory() {
  const [activeTab, setActiveTab] = useState("consulting");

  const industries = {
    consulting: {
      title: "Consultants, Coaches & Creators",
      description: "Replace complex websites and fragmented link lists with a high-converting personal storefront.",
      items: [
        { title: "Native Call Booking", desc: "Sync Google Calendar or Calendly for instant discovery calls.", icon: "📅" },
        { title: "AI Bio & Value Prop", desc: "Craft punchy, high-converting service descriptions in seconds.", icon: "✍️" },
        { title: "Portfolio & Case Studies", desc: "Embed past client results, videos, and proof of work.", icon: "💼" },
        { title: "2-Way Lead Capture", desc: "Visitors submit project details directly to your dashboard.", icon: "⚡" },
        { title: "Custom Domain Mapping", desc: "Host your profile under your own domain (e.g. alexvance.com).", icon: "🌐" },
      ]
    },
    realestate: {
      title: "Real Estate Agents & Brokers",
      description: "Turn every property showing, open house, and casual encounter into a permanent client connection.",
      items: [
        { title: "Active Property Links", desc: "Feature current listings and virtual tour video embeds.", icon: "🏠" },
        { title: "Direct WhatsApp Trigger", desc: "Enable buyers to initiate a WhatsApp chat with 1 tap.", icon: "💬" },
        { title: "Open House Inbound Forms", desc: "Capture visitor contact info and buying timeline on the spot.", icon: "📋" },
        { title: "1-Tap vCard Download", desc: "Buyers save your direct line and license number to contacts.", icon: "📇" },
        { title: "Brokerage Branding", desc: "Maintain unified brokerage logo and licensing disclaimers.", icon: "🏢" },
      ]
    },
    sales: {
      title: "B2B Sales Teams & Executives",
      description: "Dominate conferences and trade shows with contactless NFC cards and automated CRM lead capture.",
      items: [
        { title: "Contactless NFC Card Tap", desc: "Share your identity in 1 tap without handing out paper.", icon: "📳" },
        { title: "HubSpot & Salesforce Sync", desc: "Route conference leads directly to your sales pipeline.", icon: "🎯" },
        { title: "Team Attribution", desc: "Track which sales reps generate the most profile engagements.", icon: "📊" },
        { title: "Zero App Requirement", desc: "Prospects open your profile immediately in their browser.", icon: "⚡" },
        { title: "Dynamic Real-Time Edits", desc: "Update collateral and titles without reprinting physical cards.", icon: "🔄" },
      ]
    },
    agency: {
      title: "Agencies & Design Studios",
      description: "Showcase agency capabilities, manage multi-member staff cards, and win high-ticket contracts.",
      items: [
        { title: "Team Member Directory", desc: "Centralized digital cards for all creative and account leads.", icon: "👥" },
        { title: "Visual Showreel Embeds", desc: "Stream Vimeo or YouTube design showreels natively on mobile.", icon: "🎬" },
        { title: "Custom CSS & Aurora Themes", desc: "Express your agency's unique aesthetic identity.", icon: "🎨" },
        { title: "Instant Contact Exchange", desc: "Pitch clients and share your pitch deck in one link.", icon: "📑" },
        { title: "Central Brand Lock", desc: "Keep all partner and designer cards aligned with brand guidelines.", icon: "🔒" },
      ]
    },
    medical: {
      title: "Healthcare, Legal & Finance",
      description: "Project uncompromising professionalism with RFC-compliant, encrypted digital business identity.",
      items: [
        { title: "Practice & Office Hours", desc: "Display clinic hours, office locations, and direct intake info.", icon: "🏥" },
        { title: "Encrypted Contact Sync", desc: "RFC 2426 vCard ensures secure address book integration.", icon: "🛡️" },
        { title: "Direct Appointment Booking", desc: "Let patients and clients schedule initial consultations.", icon: "🗓️" },
        { title: "Regulatory Disclaimers", desc: "Include Bar credentials, medical registry numbers, and disclosures.", icon: "⚖️" },
        { title: "Zero Paper Waste", desc: "Align with paperless clinic and sustainable firm initiatives.", icon: "🌿" },
      ]
    },
  };

  const currentData = industries[activeTab] || industries.consulting;

  return (
    <section id="industry" className="bg-[#F8F9FA] py-20 sm:py-28 border-b border-[#EAECEF]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        
        {/* Title & Tabs */}
        <div className="space-y-6 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#163300]/5 text-xs font-bold text-[#163300]">
            <span>Tailored Solutions</span>
          </div>

          <h2 className="font-parafina font-black text-[38px] sm:text-[52px] lg:text-[58px] text-[#163300] tracking-[-0.035em]">
            Built for high performers across every industry
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl">
            Whether you are a solo consultant closing five-figure deals or a national sales team of 500+, OneProfile adapts to your workflow.
          </p>

          {/* Segment Tab Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab("consulting")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "consulting"
                  ? "bg-[#9FE870] text-[#163300] font-extrabold shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-black/5"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Consultants & Creators</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("realestate")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "realestate"
                  ? "bg-[#9FE870] text-[#163300] font-extrabold shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-black/5"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Real Estate & Brokers</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sales")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "sales"
                  ? "bg-[#9FE870] text-[#163300] font-extrabold shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-black/5"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>B2B Sales & Tech</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("agency")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "agency"
                  ? "bg-[#9FE870] text-[#163300] font-extrabold shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-black/5"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Agencies & Studios</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("medical")}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "medical"
                  ? "bg-[#9FE870] text-[#163300] font-extrabold shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-black/5"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Medical, Legal & Finance</span>
            </button>
          </div>
        </div>

        {/* Dynamic Industry Features Grid */}
        <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-black/5 shadow-xs space-y-6">
          <div>
            <h3 className="font-parafina font-black text-xl sm:text-2xl text-[#163300]">
              {currentData.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              {currentData.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-4 border-t border-slate-100">
            {currentData.items.map((item, idx) => (
              <div key={idx} className="space-y-2 p-3 rounded-2xl bg-[#F8F9FA] hover:bg-slate-100 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-xs border border-black/5">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-[#163300]">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-normal leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
