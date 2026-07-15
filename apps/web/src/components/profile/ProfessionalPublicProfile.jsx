import clsx from "clsx";
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
} from "lucide-react";
import React from "react";
import { parseCustomLink, renderCustomLinkIcon } from "../../lib/customLinkHelper";

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

  const handleScrollToContact = () => {
    const whatsAppNumber = profile?.contactDetails?.whatsAppNumber;
    const phoneNumber = profile?.contactDetails?.phone;
    const companyName =
      profile?.companyName || profile?.title || "your business";

    const message = `Hello,

I'm interested in connecting with ${companyName}.

Could you please share more details about your offerings, pricing, and availability?

Thank you.`;

    if (whatsAppNumber) {
      const cleanWhatsApp = whatsAppNumber.replace(/[^0-9]/g, "");
      const encodedMessage = encodeURIComponent(message);
      window.open(
        `https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`,
        "_blank",
      );
    } else if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };
  console.log("profile", profile);

  return (
    <div className="space-y-12">
      {/* 1. Hero Cover & Profile Identity Section */}
      <section className="relative">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-3xl border border-[#E5E7EB] shadow-sm">
          {profile.coverImageUrl ? (
            <img
              src={profile.coverImageUrl}
              alt={profile.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-slate-100 to-slate-50 flex items-center justify-center text-[#6B7280]">
              OneProfile Premium Professional Identity
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Floating Identity Card */}
        <div className="-mt-16 sm:-mt-20 mx-4 sm:mx-8 relative z-10 bg-white border border-[#E5E7EB] shadow-[0_10px_30px_rgba(0,0,0,0.04)] rounded-[24px] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.title}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border border-[#E5E7EB] bg-white shadow-sm shrink-0 animate-floating"
                />
              ) : (
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border border-[#E5E7EB] bg-slate-50 flex items-center justify-center text-4xl font-black text-[#2563EB] shrink-0 select-none animate-floating">
                  {(profile.title || "U").charAt(0).toUpperCase()}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
                    {profile.title || "Professional Profile"}
                  </h1>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm font-semibold uppercase tracking-wider text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/15" />{" "}
                    Verified
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#2563EB]">
                  {profile.designation || "Independent Professional"}
                  {profile.companyName ? ` @ ${profile.companyName}` : ""}
                </p>

                {/* Rating & Social Proof Header */}
                {/* <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#6B7280]">
                  <div className="flex items-center gap-1 text-[#F59E0B] font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-[#111827] ml-1">5.0</span>
                  </div>
                  <span>•</span>
                  {profile.professionalCategory && (
                    <span className="font-semibold text-[#111827]">
                      {profile.professionalCategory}
                    </span>
                  )}
                  {profile.location?.city && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-[#111827]">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />{" "}
                        {profile.location.city}
                      </span>
                    </>
                  )}
                </div> */}
              </div>
            </div>

            {/* Quick conversion CTA buttons */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-3 shrink-0">
              {profile.contactDetails?.phone && (
                <a
                  href={`tel:${profile.contactDetails.phone}`}
                  className="h-12 px-6 rounded-full border border-[#E5E7EB] hover:bg-slate-50 text-[#111827] text-xs font-bold flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4 text-[#2563EB]" /> Call Now
                </a>
              )}
              <button
                onClick={handleScrollToContact}
                className="h-12 px-6 rounded-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-[0.98] shadow-sm shadow-[#2563EB]/10"
              >
                Connect Online ➔
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Biography & Details Grid */}
      <section className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 grid md:grid-cols-[1.5fr_1fr] gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-[0.25em] text-[#6B7280] font-bold block">
              BIOGRAPHY
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
              Professional Experience & History
            </h2>
          </div>
          <p className="text-sm text-[#6B7280] leading-relaxed whitespace-pre-wrap">
            {profile.bio ||
              "Learn more about my professional journey, expertise, and accomplishments."}
          </p>
        </div>

        {/* Credentials and highlights */}
        <div className="bg-slate-50 border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" /> Verified
            Background
          </h4>
          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-[#6B7280] block">Employment Status</span>
              <span className="font-bold text-[#111827] mt-0.5 capitalize block">
                {profile.employmentType === "employed"
                  ? "Employed"
                  : "Self-Employed / Independent"}
              </span>
            </div>
            {profile.employmentType === "employed" ? (
              <>
                {profile.department && (
                  <div>
                    <span className="text-[#6B7280] block">Department</span>
                    <span className="font-bold text-[#111827] mt-0.5 block">
                      {profile.department}
                    </span>
                  </div>
                )}
                {profile.workLocation && (
                  <div>
                    <span className="text-[#6B7280] block">
                      Office Location
                    </span>
                    <span className="font-bold text-[#111827] mt-0.5 block">
                      {profile.workLocation}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                {profile.practiceName && (
                  <div>
                    <span className="text-[#6B7280] block">
                      Practice / Brand
                    </span>
                    <span className="font-bold text-[#111827] mt-0.5 block">
                      {profile.practiceName}
                    </span>
                  </div>
                )}
                {profile.workLocation && (
                  <div>
                    <span className="text-[#6B7280] block">
                      Geographical Service Area
                    </span>
                    <span className="font-bold text-[#111827] mt-0.5 block">
                      {profile.workLocation}
                    </span>
                  </div>
                )}
              </>
            )}
            {profile.yearsOfExperience && (
              <div className="flex justify-between items-center py-1.5 border-t border-[#E5E7EB] mt-2">
                <span className="text-[#6B7280]">Total Experience</span>
                <span className="font-bold text-[#111827]">
                  {profile.yearsOfExperience} Years
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Core Skills & Certifications */}
      {(profile.skills?.length > 0 || profile.certifications?.length > 0) && (
        <section className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 grid gap-6 sm:grid-cols-2">
          {profile.skills?.length > 0 && (
            <div className="space-y-3">
              <span className="text-3xs uppercase tracking-[0.2em] font-bold text-[#6B7280]">
                Core Expertise
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-[#2563EB]/5 border border-[#2563EB]/10 text-3xs font-semibold text-[#2563EB]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {profile.certifications?.length > 0 && (
            <div className="space-y-3">
              <span className="text-3xs uppercase tracking-[0.2em] font-bold text-[#6B7280]">
                Credentials & Certifications
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-purple-500/5 border border-purple-500/10 text-3xs font-semibold text-purple-600"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. Social Links Row */}
      {profile.socialLinks &&
        Object.values(profile.socialLinks).some(Boolean) && (
          <section className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 flex flex-wrap gap-2.5">
            {Object.entries(profile.socialLinks).map(([key, value]) => {
              if (!value || key === "customLinks") return null;
              return (
                <a
                  key={key}
                  href={value}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FCFCFD] border border-[#E5E7EB] hover:bg-slate-50 text-xs font-bold text-[#111827] transition-all select-none shadow-3xs"
                >
                  <span className="capitalize">{key}</span>
                </a>
              );
            })}
          </section>
        )}

      {/* 5. Experience Timeline, Lead Form, & Directory */}
      <section className="grid md:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        {/* Left Column: Timeline & History */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-3xs uppercase tracking-[0.25em] text-[#6B7280] font-bold block">
                TIMELINE
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
                Milestones & Work History
              </h2>
            </div>

            {profile.experience?.length ? (
              <div className="relative pl-6 space-y-8 border-l border-slate-100 ml-2">
                {profile.experience.map((exp, idx) => (
                  <div key={idx} className="relative space-y-1.5">
                    {/* Timeline bullet dot */}
                    <span className="absolute left-[-29px] top-1.5 h-3.5 w-3.5 rounded-full border bg-white flex items-center justify-center border-[#2563EB] shadow-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
                    </span>

                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-sm font-bold text-[#111827] leading-tight">
                        {exp.title}
                      </h4>
                      <span className="text-3xs text-[#6B7280] font-bold uppercase shrink-0 mt-0.5">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#6B7280] block">
                      {exp.company}
                    </span>
                    {exp.description && (
                      <p className="text-xs text-[#6B7280] mt-2 leading-relaxed whitespace-pre-wrap">
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
          </div>
        </div>

        {/* Right Column: Lead Form & Hours */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-3xs uppercase tracking-[0.25em] text-[#6B7280] font-bold block">
                CONNECT
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
                Start A Professional Inquiry
              </h2>
            </div>

            {leadForm}

            <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4 text-3xs text-[#6B7280] font-bold uppercase tracking-wide">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Quick
                Callback
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Direct
                Messaging
              </div>
            </div>
          </div>

          {/* Location details card */}
          {(profile.location?.address ||
            profile.location?.city ||
            profile.location?.country ||
            profile.location?.mapsEmbedUrl) && (
            <div className="bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px] p-6 space-y-4">
              <div className="border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2563EB]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Location Directory
                </h4>
              </div>
              <div className="text-xs space-y-3.5">
                {profile.location?.address && (
                  <div>
                    <span className="text-3xs text-[#6B7280] uppercase font-bold tracking-wider">
                      Address
                    </span>
                    <span className="font-semibold text-[#111827] mt-1 block leading-normal">
                      {profile.location.address}
                    </span>
                  </div>
                )}
                {(profile.location?.city || profile.location?.country) && (
                  <div>
                    <span className="text-3xs text-[#6B7280] uppercase font-bold tracking-wider">
                      Region
                    </span>
                    <span className="font-semibold text-[#111827] mt-1 block">
                      {[profile.location.city, profile.location.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
                {profile.location?.mapsEmbedUrl && (
                  <div className="h-40 w-full rounded-2xl overflow-hidden border border-[#E5E7EB] mt-2 bg-slate-50">
                    <iframe
                      title="Location Map"
                      src={profile.location.mapsEmbedUrl}
                      className="w-full h-full border-0 grayscale opacity-80"
                      allowFullScreen=""
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Working Hours */}
          {Object.keys(workingHours).length > 0 &&
            Object.values(workingHours).some((h) => h.enabled) && (
              <div className="bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px] p-6 space-y-4">
                <div className="border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2563EB]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                    Available Hours
                  </h4>
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

          {/* Custom Link booklets */}
          {profile.socialLinks?.customLinks?.length ? (
            <div className="bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px] p-6 space-y-4">
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
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-[#E5E7EB] hover:bg-slate-100 transition-all text-xs font-bold text-[#111827] gap-3"
                    >
                      <div className="flex items-center gap-2">
                        {renderCustomLinkIcon(parsed.icon)}
                        <span>{parsed.title}</span>
                      </div>
                      <span className="text-[#2563EB]">➔</span>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
