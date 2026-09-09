import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  Zap,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Share2,
  Smartphone,
  Building2,
  BarChart3,
  Users,
} from "lucide-react";

export function IdentityEverywhere({ activeSegment = "personal" }) {
  const isBusiness = activeSegment === "business";

  return (
    <section
      id="identity-everywhere"
      className="bg-white py-16 sm:py-24 border-b border-[#EAECEF]"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Subtitle, Feature Pillars, CTAs */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSegment + "-badge"}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#163300]/5 text-xs font-bold text-[#163300]"
              >
                {isBusiness ? (
                  <>
                    <Building2 className="w-3.5 h-3.5 text-[#255203]" />
                    <span>Centralized Team Identity Management</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-[#255203]" />
                    <span>Cross-Device Digital Identity</span>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSegment + "-text"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {isBusiness ? (
                  <>
                    <h2 className="font-parafina font-black text-[36px] sm:text-[50px] lg:text-[56px] text-[#163300] tracking-[-0.035em] leading-[1.04]">
                      Complete brand governance.
                      <br />
                      Zero rogue designs.
                      <br />
                      Total lead visibility.
                    </h2>
                    <p className="text-base sm:text-[18px] text-[#3A4833] font-normal leading-relaxed max-w-lg">
                      Eliminate disconnected paper cards and outdated contact details across your company. OneProfile for Teams gives marketing, sales, and HR leaders complete centralized oversight over every employee's digital card.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="font-parafina font-black text-[36px] sm:text-[50px] lg:text-[56px] text-[#163300] tracking-[-0.035em] leading-[1.04]">
                      Manage your complete
                      <br />
                      business identity
                      <br />
                      in one smart link.
                    </h2>
                    <p className="text-base sm:text-[18px] text-[#3A4833] font-normal leading-relaxed max-w-lg">
                      Save directly to phone address books in 1 tap, showcase your
                      portfolio and services, capture qualified inbound leads, and let
                      clients book calls without the friction.
                    </p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Feature Highlights Grid */}
            <div className="space-y-4 pt-2">
              {isBusiness ? (
                <>
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#9FE870]/30 text-[#163300] flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-[#163300]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#163300]">
                        Central Brand Governance & Templates
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Lock approved corporate logos, brand hex codes, approved bios, and legal disclaimers. Update 500 employee cards company-wide in seconds with zero IT headaches.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#9FE870]/30 text-[#163300] flex items-center justify-center shrink-0 mt-0.5">
                      <BarChart3 className="w-4 h-4 text-[#163300]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#163300]">
                        Automated CRM Routing & Lead Attribution
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        When sales reps tap their card at expos or meetings, prospect details flow immediately into HubSpot, Salesforce, or Zoho with automatic rep attribution.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#9FE870]/30 text-[#163300] flex items-center justify-center shrink-0 mt-0.5">
                      <Users className="w-4 h-4 text-[#163300]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#163300]">
                        Single-Click SSO & Bulk Provisioning
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Add, edit, or revoke cards in seconds via CSV upload or Google Workspace & Azure Active Directory SSO. Never leave active company cards with departing staff.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#9FE870]/30 text-[#163300] flex items-center justify-center shrink-0 mt-0.5">
                      <UserCheck className="w-4 h-4 text-[#163300]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#163300]">
                        1-Tap Universal vCard
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Downloads your phone, email, WhatsApp, and links straight to
                        iOS & Android contacts. Zero typing, zero lost connections.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#9FE870]/30 text-[#163300] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-4 h-4 text-[#163300]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#163300]">
                        2-Way Inbound Lead Capture
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Don't just give your details — get theirs. Visitors can
                        instantly submit their contact info directly to your
                        dashboard and CRM.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#9FE870]/30 text-[#163300] flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-4 h-4 text-[#163300]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#163300]">
                        Native Meeting Scheduling
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Convert high-intent prospects on the spot by letting them
                        book discovery calls directly from your profile card.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <Link
                to={isBusiness ? "/signup?type=business" : "/signup"}
                className="px-8 py-3.5 rounded-full font-bold text-[15px] text-[#163300] bg-[#9FE870] hover:bg-[#8DE05B] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isBusiness ? "Deploy for Your Team" : "Create Your Profile Free"}
              </Link>
            </div>

            {/* Universal Compatibility Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
              {isBusiness ? (
                <>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#255203]" />
                    SOC-2 Type II & GDPR Compliant
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-[#255203]" />
                    Automated CRM & Webhook Integration
                  </span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#255203]" />
                    Apple Contacts & Google Contacts Native
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Share2 className="w-4 h-4 text-[#255203]" />
                    No App Download Needed
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Lifestyle Photo + Overlapping Phone Mockup */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            {/* Background Lifestyle Photo */}
            <div className="relative w-full max-w-[480px] h-[500px] sm:h-[540px] rounded-3xl overflow-hidden shadow-md bg-slate-100">
              <img
                src={
                  isBusiness
                    ? "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80"
                    : "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=80"
                }
                alt={isBusiness ? "Corporate enterprise sales team" : "Professional reviewing OneProfile digital identity on smartphone"}
                className="w-full h-full object-cover object-center filter brightness-[0.98]"
                loading="lazy"
              />
            </div>

            {/* Overlapping Floating Phone Screen Mockup */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="absolute left-0 sm:left-4 bottom-0 sm:-bottom-4 w-[290px] sm:w-[320px] bg-white rounded-[38px] shadow-[0_25px_60px_rgba(0,0,0,0.35)] border-[6px] border-black overflow-hidden text-[#163300] z-20"
            >
              {/* Phone Status Bar */}
              <div className="bg-[#163300] text-white px-6 pt-3 pb-2 flex justify-between items-center text-[10px] font-bold select-none">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#9FE870]" />
                  <span className="text-[10px]">
                    {isBusiness ? "oneprofile.in/acme" : "oneprofile.in"}
                  </span>
                </div>
              </div>

              {/* Real OneProfile Card Mockup */}
              <div className="p-4 space-y-3.5 bg-slate-50">
                {/* Profile Header */}
                <div className="bg-white p-3.5 rounded-2xl border border-black/5 shadow-sm text-center space-y-2">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#163300] to-[#255203] text-white font-black text-xl flex items-center justify-center mx-auto shadow-md border-2 border-white">
                      {isBusiness ? "SC" : "AV"}
                    </div>
                    <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#9FE870] border-2 border-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  </div>
                  <div>
                    <h3 className="font-parafina font-black text-base text-[#163300] leading-tight">
                      {isBusiness ? "Sophia Chen" : "Alex Vance"}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-500">
                      {isBusiness ? "VP, Enterprise Solutions" : "Growth Advisor & Founder"}
                    </p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#9FE870]/40 text-[#163300]">
                      {isBusiness ? "Acme Corp • Verified Rep" : "Available for Q3 Advisory"}
                    </span>
                  </div>
                </div>

                {/* Primary Action Button: Save Contact */}
                <div className="grid grid-cols-3 gap-2 text-center select-none">
                  <div className="col-span-2 py-2.5 px-3 rounded-xl bg-[#9FE870] text-[#163300] font-black text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Save Contact</span>
                  </div>
                  <div className="py-2.5 px-2 rounded-xl bg-white border border-black/10 text-[#163300] font-bold text-xs flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{isBusiness ? "Demo" : "Book"}</span>
                  </div>
                </div>

                {/* Featured Service Showcase Box */}
                <div className="bg-white p-3 rounded-2xl border border-black/5 space-y-1 text-left">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                    <span>{isBusiness ? "CORPORATE SOLUTION" : "FEATURED SERVICE"}</span>
                    <span className="text-emerald-700 font-extrabold">
                      Active
                    </span>
                  </div>
                  <div className="font-black text-xs text-[#163300]">
                    {isBusiness ? "Global Cloud Architecture" : "90-Day GTM Scaling Sprint"}
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-1 font-medium">
                    {isBusiness
                      ? "Enterprise multi-region migration & SOC-2 compliance support."
                      : "Helping B2B SaaS reach ₹10 Cr ARR through outbound loops."}
                  </p>
                </div>

                {/* Inbound Lead Capture Box */}
                <div className="bg-[#163300] text-white p-3 rounded-2xl space-y-1.5 text-left">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#9FE870]">
                    <Zap className="w-3 h-3" />
                    <span>{isBusiness ? "Auto CRM Lead Capture" : "Exchange Details"}</span>
                  </div>
                  <div className="text-[11px] font-bold">
                    {isBusiness ? "Direct Salesforce & HubSpot Sync" : "Leave your contact for Alex"}
                  </div>
                  <div className="w-full bg-white/10 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-300 font-medium">
                    {isBusiness ? "prospect@enterprise-client.com" : "your.email@company.com"}
                  </div>
                </div>

                {/* Notification toast */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 flex items-center justify-between text-[10px] font-semibold text-emerald-800">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {isBusiness ? "100% Brand Governed" : "vCard 3.0 RFC Universal Sync"}
                  </span>
                  <span className="text-[9px] text-emerald-600">
                    {isBusiness ? "SSO Enabled" : "iOS • Android"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
