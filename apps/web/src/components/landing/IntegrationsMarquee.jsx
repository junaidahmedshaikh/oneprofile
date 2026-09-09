import React from "react";
import { ArrowRight, Lock, ShieldCheck, Smartphone, CheckCircle } from "lucide-react";

export function IntegrationsMarquee() {
  const integrations = [
    { name: "Apple Contacts", icon: "🍏", category: "Address Book" },
    { name: "Google Contacts", icon: "🌐", category: "Address Book" },
    { name: "WhatsApp Direct", icon: "💬", category: "Messaging" },
    { name: "LinkedIn", icon: "💼", category: "Professional" },
    { name: "Google Calendar", icon: "📅", category: "Scheduling" },
    { name: "Calendly", icon: "⏰", category: "Scheduling" },
    { name: "HubSpot CRM", icon: "🎯", category: "CRM Sync" },
    { name: "Salesforce", icon: "☁️", category: "Enterprise" },
    { name: "Notion", icon: "📝", category: "Database" },
    { name: "Instagram", icon: "📸", category: "Social" },
    { name: "Microsoft Outlook", icon: "✉️", category: "Email" },
  ];

  return (
    <section className="bg-white border-b border-[#EAECEF]">
      
      {/* 1. Electric Lime Green Marquee Banner */}
      <div className="bg-[#9FE870] py-5 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-[1240px] mx-auto flex items-center gap-6 sm:gap-8">
          
          {/* Label Circle */}
          <div className="hidden sm:flex items-center gap-2 bg-[#163300] text-[#9FE870] px-4 py-2 rounded-full shrink-0 shadow-sm">
            <span className="text-xs font-black uppercase tracking-wider">Universal Sync</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>

          {/* Row of Integration Badges */}
          <div
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-1"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollbarColor: "transparent transparent",
            }}
          >
            {integrations.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/90 shadow-sm shrink-0 border border-[#163300]/10 hover:bg-white transition-colors select-none"
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <div className="text-left">
                  <div className="text-xs font-black text-[#163300] leading-none">
                    {item.name}
                  </div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tight mt-0.5">
                    {item.category}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 2. Trust & Technical Assurance Bar */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center text-xs text-[#3A4833]">
          
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F2F4F7] flex items-center justify-center text-[#163300] shrink-0">
              <Smartphone className="w-4 h-4 text-[#163300]" />
            </div>
            <span className="font-semibold text-slate-700">
              <strong className="text-[#163300]">Zero app download required</strong> — opens natively across Safari, Chrome, and all smartphone browsers.
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F2F4F7] flex items-center justify-center text-[#163300] shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#163300]" />
            </div>
            <span className="font-semibold text-slate-700">
              Complies with <strong className="text-[#163300]">RFC 2426 universal vCard specifications</strong>. Zero tracking cookies or data brokering.
            </span>
          </div>

        </div>
      </div>

    </section>
  );
}
