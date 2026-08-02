import clsx from "clsx";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  MapPin,
  Users,
  Calendar,
  Clock,
  Star,
  Phone,
  MessageSquare,
  Mail,
  CheckCircle2,
  Download,
  Sparkles,
  Share2,
  Globe,
  ExternalLink,
  Award,
  Briefcase,
  Building,
} from "lucide-react";
import React from "react";
import {
  parseCustomLink,
  renderCustomLinkIcon,
} from "../../lib/customLinkHelper";
import { downloadVCardFile } from "../../lib/vcardHelper";

function getOperatingStatus(workingHours) {
  if (!workingHours || Object.keys(workingHours).length === 0) return null;
  const now = new Date();
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const currentDay = dayNames[now.getDay()];
  const todayHours = workingHours[currentDay];

  if (!todayHours || !todayHours.enabled)
    return { isOpen: false, text: "Closed Today" };

  const [openH, openM] = (todayHours.open || "09:00").split(":").map(Number);
  const [closeH, closeM] = (todayHours.close || "18:00").split(":").map(Number);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + (openM || 0);
  const closeMinutes = closeH * 60 + (closeM || 0);

  if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
    return { isOpen: true, text: `Open Now • Closes at ${todayHours.close}` };
  }
  return { isOpen: false, text: `Closed • Opens at ${todayHours.open}` };
}

export function ProfessionalPublicProfile({ profile, leadForm }) {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const workingHours = profile.workingHours || {};
  const openStatus = getOperatingStatus(workingHours);

  const handleScrollToContact = () => {
    const whatsAppTarget =
      profile?.contactDetails?.whatsAppNumber || profile?.contactDetails?.phone;
    const phoneNumber = profile?.contactDetails?.phone;
    const email = profile?.contactDetails?.email;
    const name = profile?.title || profile?.companyName || "you";

    const message = `Hello ${name},
I'm interested in connecting with you and learning more about your work and services.
Could you please share more details about what you offer, pricing, and availability?
Looking forward to connecting with you.
Thank you.`;

    if (whatsAppTarget) {
      const cleanWhatsApp = whatsAppTarget.replace(/[^0-9]/g, "");
      const encodedMessage = encodeURIComponent(message);
      window.open(
        `https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`,
        "_blank",
      );
    } else if (phoneNumber) {
      window.location.href = `tel:${phoneNumber.replace(/[\s\(\)-]/g, "")}`;
    } else if (email) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Inquiry for ${name}`)}&body=${encodeURIComponent(message)}`;
    } else {
      const elem = document.getElementById("contact-section");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator
        .share({
          title: profile.title || "Professional Profile",
          text:
            profile.headline ||
            profile.tagline ||
            "Check out this professional profile on OneProfile",
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Profile URL copied to clipboard!");
    }
  };

  return (
    <div className="space-y-10 font-sans">
      {/* 1. Enhanced Hero Cover & Profile Identity Section */}
      <section className="relative">
        {/* Expanded Banner Height */}
        <div className="relative h-72 sm:h-80 lg:h-96 w-full overflow-hidden rounded-[28px] border border-[#E5E7EB] shadow-sm">
          {profile.coverImageUrl ? (
            <img
              src={profile.coverImageUrl}
              alt={profile.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
              <Sparkles className="w-10 h-10 text-blue-400/40 mb-2 animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                OneProfile Verified Professional Identity
              </span>
            </div>
          )}
        </div>

        {/* Floating Identity & Action Card */}
        <div className="-mt-16 sm:-mt-20 lg:-mt-24 mx-4 sm:mx-8 relative z-10 bg-white border border-[#E5E7EB] shadow-[0_12px_40px_rgba(0,0,0,0.05)] rounded-[28px] p-6 sm:p-8 lg:p-10 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            {/* Left: Avatar & Text Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.title}
                  className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl object-cover border-4 border-white bg-white shadow-xl shrink-0 -mt-10 sm:-mt-14"
                />
              ) : (
                <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl border-4 border-white bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl flex items-center justify-center text-4xl sm:text-5xl font-black text-white shrink-0 select-none -mt-10 sm:-mt-14">
                  {(profile.title || "U").charAt(0).toUpperCase()}
                </div>
              )}

              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#111827]">
                    {profile.title || "Professional Profile"}
                  </h1>
                  <span className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold tracking-wider text-emerald-700 shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
                    <span className="hidden sm:inline">Verified</span>
                  </span>
                </div>

                {/* {profile.designation && (
                  <p className="text-sm sm:text-base font-bold text-[#2563EB]">
                    {profile.designation}
                  </p>
                )} */}

                {(profile.headline || profile.tagline) && (
                  <p className="text-xs sm:text-sm font-medium text-[#4B5563] leading-relaxed">
                    {profile.headline || profile.tagline}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Quick Action CTA Group */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 shrink-0 w-full lg:w-auto pt-2 lg:pt-0">
              {profile.contactDetails?.phone && (
                <a
                  href={`tel:${profile.contactDetails.phone.replace(/[\s\(\)-]/g, "")}`}
                  className="h-11 sm:h-12 px-4 sm:px-5 rounded-full border border-[#E5E7EB] hover:bg-slate-50 text-[#111827] text-xs font-bold flex items-center gap-2 transition-all active:scale-[0.98] shadow-2xs"
                  title="Call Phone"
                >
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                  <span className="sm:hidden">Call</span>
                  <span className="hidden sm:inline">Call Now</span>
                </a>
              )}
              <button
                type="button"
                onClick={handleScrollToContact}
                className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-[#2563EB]/20"
              >
                <span>Connect Online ➔</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Responsive 12-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Main Profile Content (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* A. Professional Background & About Card */}
          {(profile.designation ||
            profile.department ||
            profile.workLocation ||
            profile.yearsOfExperience ||
            profile.bio) && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Left side: Background Header & Biography Overview */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-3xs uppercase tracking-[0.25em] text-[#6B7280] font-bold block">
                      BACKGROUND
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
                      Professional Summary
                    </h2>
                  </div>

                  <div className="space-y-2 pt-1">
                    {profile.bio ? (
                      <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed whitespace-pre-wrap font-normal">
                        {profile.bio}
                      </p>
                    ) : (
                      <p className="text-xs text-[#9CA3AF] italic">
                        No biography details added.
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side: Key Credentials & Statistic Chips */}
                <div className="bg-slate-50/80 border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="grid gap-3.5 sm:grid-cols-2 text-xs">
                    {profile.designation && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
                        <span className="text-3xs text-[#6B7280] block font-bold uppercase">
                          Designation
                        </span>
                        <span className="font-bold text-[#111827] mt-0.5 block truncate">
                          {profile.designation}
                        </span>
                      </div>
                    )}
                    {profile.department && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
                        <span className="text-3xs text-[#6B7280] block font-bold uppercase">
                          Department
                        </span>
                        <span className="font-bold text-[#111827] mt-0.5 block truncate">
                          {profile.department}
                        </span>
                      </div>
                    )}
                    {profile.workLocation && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
                        <span className="text-3xs text-[#6B7280] block font-bold uppercase">
                          Service Area
                        </span>
                        <span className="font-bold text-[#111827] mt-0.5 block truncate">
                          {profile.workLocation}
                        </span>
                      </div>
                    )}
                    {profile.yearsOfExperience && (
                      <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
                        <span className="text-3xs text-[#6B7280] block font-bold uppercase">
                          Total Experience
                        </span>
                        <span className="font-bold text-[#2563EB] mt-0.5 block">
                          {profile.yearsOfExperience}+ Years
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* B. Core Skills & Certifications */}
          {(profile.skills?.length > 0 ||
            profile.certifications?.length > 0) && (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] grid gap-6 sm:grid-cols-1"
            >
              {profile.skills?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {/* <Sparkles className="w-4 h-4 text-[#2563EB]" /> */}
                    <span className="text-3xs uppercase tracking-[0.2em] font-bold text-[#6B7280]">
                      Core Expertise
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200/60 text-xs font-semibold text-[#2563EB] flex items-center gap-1.5 shadow-2xs transition-all hover:bg-blue-100/80"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {profile.certifications?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-600" />
                    <span className="text-3xs uppercase tracking-[0.2em] font-bold text-[#6B7280]">
                      Credentials & Certifications
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-50/80 border border-purple-200/60 text-xs font-semibold text-purple-700 flex items-center gap-1.5 shadow-2xs transition-all hover:bg-purple-100/80"
                      >
                        <Award className="w-3.5 h-3.5 text-purple-600" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.section>
          )}

          {/* C. LinkedIn-Style Experience Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6"
          >
            <div className="space-y-1">
              <span className="text-3xs uppercase tracking-[0.25em] text-[#6B7280] font-bold block">
                TIMELINE
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
                Milestones & Work History
              </h2>
            </div>

            {profile.experience?.length ? (
              <div className="relative pl-6 space-y-8 border-l-2 border-slate-100 ml-2">
                {profile.experience.map((exp, idx) => (
                  <div key={idx} className="relative space-y-2 group">
                    {/* Timeline bullet dot */}
                    <span className="absolute left-[-31px] top-1.5 h-4 w-4 rounded-full border-2 bg-white flex items-center justify-center border-[#2563EB] shadow-sm group-hover:scale-125 transition-transform">
                      <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
                    </span>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                      <h4 className="text-sm font-bold text-[#111827] leading-tight">
                        {exp.title}
                      </h4>
                      <span className="text-3xs text-[#6B7280] font-bold uppercase shrink-0 px-2.5 py-0.5 rounded-md bg-slate-100">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#2563EB] flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      {exp.company}
                    </span>
                    {exp.description && (
                      <p className="text-xs text-[#6B7280] mt-2 leading-relaxed whitespace-pre-wrap bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-[#E5E7EB] rounded-2xl">
                No experience milestones added yet.
              </div>
            )}
          </motion.section>

          {/* D. Social Links Row */}
          {profile.socialLinks &&
            Object.values(profile.socialLinks).some(Boolean) && (
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 }}
                className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4"
              >
                <span className="text-3xs uppercase tracking-[0.2em] font-bold text-[#6B7280] block">
                  Connect & Social Channels
                </span>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(profile.socialLinks).map(([key, value]) => {
                    if (!value || key === "customLinks") return null;
                    return (
                      <a
                        key={key}
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] hover:bg-slate-100 hover:border-slate-300 text-xs font-bold text-[#111827] transition-all select-none shadow-2xs hover:-translate-y-0.5"
                      >
                        <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span className="capitalize">{key}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    );
                  })}
                </div>
              </motion.section>
            )}
        </div>

        {/* RIGHT COLUMN: Sticky Reach & Availability Sidebar (4 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-6">
          {/* Get In Touch & Lead Form Card */}
          {leadForm}

          {/* Location Details Card */}
          {(profile.location?.address ||
            profile.location?.city ||
            profile.location?.country) && (
            <div className="bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[28px] p-6 space-y-4">
              <div className="border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2563EB]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Address & Location
                </h4>
              </div>
              <div className="text-xs space-y-3.5">
                {profile.location?.address && (
                  <div>
                    <span className="text-3xs text-[#6B7280] uppercase font-bold tracking-wider block">
                      Address
                    </span>
                    <span className="font-semibold text-[#111827] mt-1 block leading-normal">
                      {profile.location.address}
                    </span>
                  </div>
                )}
                {(profile.location?.city || profile.location?.country) && (
                  <div>
                    <span className="text-3xs text-[#6B7280] uppercase font-bold tracking-wider block">
                      Region
                    </span>
                    <span className="font-semibold text-[#111827] mt-1 block">
                      {[profile.location.city, profile.location.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Working Hours Card with Live Open/Closed Badge */}
          {Object.keys(workingHours).length > 0 &&
            Object.values(workingHours).some((h) => h.enabled) && (
              <div className="bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[28px] p-6 space-y-4">
                <div className="border-b border-[#E5E7EB] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2563EB]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                      Available Hours
                    </h4>
                  </div>
                  {openStatus && (
                    <span
                      className={clsx(
                        "px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider  flex items-center gap-1 border",
                        openStatus.isOpen
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200",
                      )}
                    >
                      <span
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full",
                          openStatus.isOpen
                            ? "bg-emerald-500 animate-ping"
                            : "bg-amber-500",
                        )}
                      />
                      {openStatus.isOpen ? "Open Now" : "Closed"}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  {days.map((day) => {
                    const hour = workingHours[day];
                    if (!hour || !hour.enabled) return null;
                    return (
                      <div
                        key={day}
                        className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0"
                      >
                        <span className="capitalize text-[#6B7280] font-semibold">
                          {day}
                        </span>
                        <span className="font-bold text-[#111827]">
                          {hour.open} - {hour.close}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Resources & Custom Links */}
          {profile.socialLinks?.customLinks?.length ? (
            <div className="bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[28px] p-6 space-y-4">
              <div className="border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2563EB]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Resources & Links
                </h4>
              </div>
              <div className="space-y-2">
                {profile.socialLinks.customLinks.map((link, idx) => {
                  const parsed = parseCustomLink(link.title);
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-[#E5E7EB] hover:bg-slate-100 hover:border-slate-300 transition-all text-xs font-bold text-[#111827] gap-3 group"
                    >
                      <div className="flex items-center gap-2">
                        {renderCustomLinkIcon(parsed.icon)}
                        <span>{parsed.title}</span>
                      </div>
                      <span className="text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
                        ➔
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
