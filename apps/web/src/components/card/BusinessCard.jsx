import clsx from "clsx";
import { ShieldCheck, Phone, Mail, Globe, MessageSquare, Share2, QrCode, Download, MapPin, Linkedin } from "lucide-react";
import React from "react";

export function BusinessCard({ profile, st, onOpenShare, onOpenQr }) {
  const isProfessional = profile.profileType === "professional";
  const name = isProfessional
    ? profile.title || "Professional"
    : profile.companyName || "Business";
  const subtitle = isProfessional
    ? profile.designation || profile.professionalCategory || "Independent Professional"
    : profile.tagline || profile.businessCategory || "Premium Services";
  const avatar = isProfessional
    ? profile.avatarUrl
    : profile.logoUrl || profile.avatarUrl;

  const whatsAppNumber = profile.contactDetails?.whatsAppNumber;
  const phoneNumber = profile.contactDetails?.phone;
  const email = profile.contactDetails?.email;
  const website = profile.socialLinks?.website;
  const linkedin = profile.socialLinks?.linkedin;

  const vcardUrl = `/api/v1/profiles/public/${profile.slug}/vcard`;

  // General Inquiry Message
  const message = `Hello,

I'm interested in connecting with ${name}.

Could you please share more details about your professional services and offerings?

Thank you.`;

  const handleWhatsApp = () => {
    if (whatsAppNumber) {
      const cleanWhatsApp = whatsAppNumber.replace(/[^0-9]/g, "");
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`, "_blank");
    } else if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Premium White Card Container */}
      <div className="bg-white border border-[#E5E7EB] shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_48px_rgba(0,0,0,0.05)] flex flex-col">
        {/* Cover / Banner Image Header */}
        <div className="h-36 w-full bg-slate-100 relative overflow-hidden">
          {profile.coverImageUrl ? (
            <img
              src={profile.coverImageUrl}
              alt="Cover Banner"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-tr from-slate-100 to-slate-50" />
          )}
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Profile Avatar / Logo overlapping cover */}
        <div className="px-6 pb-6 relative">
          <div className="relative -mt-12 mb-4 inline-block">
            {avatar ? (
              <div className="p-1 rounded-2xl bg-white border border-[#E5E7EB] shadow-md">
                <img
                  src={avatar}
                  alt={name}
                  className="h-20 w-20 rounded-xl object-cover bg-white animate-floating"
                />
              </div>
            ) : (
              <div className="h-20 w-20 rounded-2xl border border-[#E5E7EB] bg-slate-50 flex items-center justify-center text-3xl font-black text-[#2563EB] shadow-md animate-floating">
                {name.charAt(0)}
              </div>
            )}
          </div>

          {/* Identity & Subtitle details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-xl font-extrabold text-[#111827] tracking-tight leading-tight">
                {name}
              </h2>
              {profile.isVerified && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-4xs font-bold uppercase tracking-wider text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-[#2563EB]">
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-3xs text-[#6B7280] font-medium pt-1">
              {isProfessional && profile.companyName && (
                <span className="flex items-center gap-1">🏢 {profile.companyName}</span>
              )}
              {profile.location?.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> {profile.location.city}
                </span>
              )}
            </div>
          </div>

          {/* Contact Methods Action Row */}
          <div className="grid grid-cols-4 gap-2 pt-6 mt-6 border-t border-[#E5E7EB] justify-items-center">
            {/* Phone */}
            {phoneNumber ? (
              <a
                href={`tel:${phoneNumber}`}
                className="h-11 w-11 rounded-full bg-[#FCFCFD] border border-[#E5E7EB] hover:bg-slate-50 flex items-center justify-center text-[#111827] transition-all hover:scale-105 active:scale-95"
                title="Call phone"
              >
                <Phone className="w-4 h-4 text-[#2563EB]" />
              </a>
            ) : (
              <div className="h-11 w-11 rounded-full bg-slate-50 border border-slate-100 opacity-20 flex items-center justify-center" aria-hidden="true">
                <Phone className="w-4 h-4 text-[#6B7280]" />
              </div>
            )}

            {/* Email */}
            {email ? (
              <a
                href={`mailto:${email}`}
                className="h-11 w-11 rounded-full bg-[#FCFCFD] border border-[#E5E7EB] hover:bg-slate-50 flex items-center justify-center text-[#111827] transition-all hover:scale-105 active:scale-95"
                title="Send email"
              >
                <Mail className="w-4 h-4 text-[#2563EB]" />
              </a>
            ) : (
              <div className="h-11 w-11 rounded-full bg-slate-50 border border-slate-100 opacity-20 flex items-center justify-center" aria-hidden="true">
                <Mail className="w-4 h-4 text-[#6B7280]" />
              </div>
            )}

            {/* Website */}
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="h-11 w-11 rounded-full bg-[#FCFCFD] border border-[#E5E7EB] hover:bg-slate-50 flex items-center justify-center text-[#111827] transition-all hover:scale-105 active:scale-95"
                title="Visit website"
              >
                <Globe className="w-4 h-4 text-[#2563EB]" />
              </a>
            ) : (
              <div className="h-11 w-11 rounded-full bg-slate-50 border border-slate-100 opacity-20 flex items-center justify-center" aria-hidden="true">
                <Globe className="w-4 h-4 text-[#6B7280]" />
              </div>
            )}

            {/* LinkedIn (Optional fallback for Professionals) */}
            {linkedin ? (
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="h-11 w-11 rounded-full bg-[#FCFCFD] border border-[#E5E7EB] hover:bg-slate-50 flex items-center justify-center text-[#111827] transition-all hover:scale-105 active:scale-95 text-3xs font-extrabold uppercase tracking-wider text-[#2563EB]"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4 text-[#2563EB]" />
              </a>
            ) : (
              <div className="h-11 w-11 rounded-full bg-slate-50 border border-slate-100 opacity-20 flex items-center justify-center text-3xs font-bold text-[#6B7280]" aria-hidden="true">
                <Linkedin className="w-4 h-4 text-[#6B7280]" />
              </div>
            )}
          </div>

          {/* Primary Action Call buttons */}
          <div className="space-y-3 mt-6 border-t border-[#E5E7EB] pt-6">
            <button
              onClick={handleWhatsApp}
              className="h-12 w-full rounded-ds-btn text-xs font-bold bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4 text-[#128C7E]" /> WhatsApp Chat
            </button>

            <a
              href={vcardUrl}
              download
              className={clsx(
                "h-12 w-full rounded-ds-btn text-xs font-extrabold flex items-center justify-center gap-2 select-none active:scale-[0.98] transition-all hover:scale-[1.01] hover:shadow-lg shadow-ds-card",
                st?.primaryBtn || "bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
              )}
            >
              <Download className="w-4 h-4" /> Save Contact
            </a>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onOpenShare}
                className="h-11 bg-white border border-[#E5E7EB] hover:bg-slate-50 text-[#111827] rounded-ds-btn text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Share2 className="w-3.5 h-3.5 text-[#6B7280]" /> Share
              </button>
              <button
                type="button"
                onClick={onOpenQr}
                className="h-11 bg-white border border-[#E5E7EB] hover:bg-slate-50 text-[#111827] rounded-ds-btn text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <QrCode className="w-3.5 h-3.5 text-[#6B7280]" /> QR Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Powered by Branding Footer */}
      <div className="text-center pt-6 pb-2 space-y-1 select-none opacity-45">
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B7280] block">
          Powered by OneProfile
        </span>
        <span className="text-[9px] font-medium text-slate-500 block">
          Digital Identity Platform
        </span>
      </div>
    </div>
  );
}
