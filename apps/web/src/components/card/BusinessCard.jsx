import clsx from "clsx";
import { BusinessCardHeader } from "./BusinessCardHeader";
import { BusinessCardActions } from "./BusinessCardActions";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export function BusinessCard({ profile, st, onOpenShare, onOpenQr }) {
  const isProd = profile.profileType === "professional";
  const name = isProd ? (profile.title || "Professional") : (profile.companyName || "Business");
  const subtitle = isProd ? (profile.designation || profile.professionalCategory || "") : (profile.tagline || profile.businessCategory || "");
  const bioText = isProd ? (profile.bio || "") : (profile.description || "");

  const hasSocials = Object.entries(profile.socialLinks || {}).some(([k, v]) => k !== "customLinks" && v);

  // vCard download link helper
  const vcardUrl = `/api/v1/profiles/public/${profile.slug}/vcard`;

  return (
    <div className="space-y-6">
      {/* 1. Glassmorphism Card Container */}
      <Card className={clsx("p-0 overflow-hidden relative border transition-all duration-300 hover:border-white/10 hover:shadow-[0_0_50px_rgba(79,140,255,0.05)]", st.card)} hoverEffect={false}>
        {/* Header Block */}
        <BusinessCardHeader profile={profile} st={st} />

        {/* Inner Content wrapper */}
        <div className="p-6 space-y-6">
          {/* Action Bar */}
          <BusinessCardActions profile={profile} />

          {/* Premium Action Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4 border-t border-white/[0.04] pt-5">
            <a
              href={vcardUrl}
              download
              className={clsx("h-11 rounded-2xl text-3xs font-bold flex items-center justify-center gap-2 select-none active:scale-[0.98] transition-all", st.primaryBtn)}
            >
              📥 Save Contact
            </a>
            <button
              onClick={onOpenShare}
              className="h-11 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl text-3xs font-bold flex items-center justify-center gap-2 select-none active:scale-[0.98] transition-all"
            >
              🔗 Share Card
            </button>
          </div>

          {/* About Section */}
          {(bioText || profile.tagline) && (
            <div className="space-y-2 border-t border-white/[0.04] pt-5">
              <span className="text-5xs font-bold uppercase tracking-widest text-slate-500 block">About Me</span>
              {profile.tagline && (
                <p className="text-xs font-bold text-white leading-snug">{profile.tagline}</p>
              )}
              {bioText && (
                <p className="text-2xs text-slate-400 leading-relaxed whitespace-pre-line">{bioText}</p>
              )}
            </div>
          )}

          {/* Contacts Information List */}
          <div className="space-y-2 border-t border-white/[0.04] pt-5">
            <span className="text-5xs font-bold uppercase tracking-widest text-slate-500 block">Direct Contacts</span>
            <div className="space-y-3 text-2xs">
              {profile.contactDetails?.phone && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.01] border border-white/[0.04] select-all">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider text-4xs">Phone</span>
                  <span className="font-bold text-white">{profile.contactDetails.phone}</span>
                </div>
              )}
              {profile.contactDetails?.email && (
                <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.01] border border-white/[0.04] select-all">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider text-4xs">Email</span>
                  <span className="font-bold text-white">{profile.contactDetails.email}</span>
                </div>
              )}
              {profile.location?.address && (
                <div className="flex flex-col gap-1 p-3 rounded-2xl bg-white/[0.01] border border-white/[0.04] select-all">
                  <span className="text-slate-500 font-semibold uppercase tracking-wider text-4xs">Address</span>
                  <span className="font-bold text-white leading-normal">{profile.location.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Configured Social Network Channels */}
          {hasSocials && (
            <div className="space-y-2 border-t border-white/[0.04] pt-5">
              <span className="text-5xs font-bold uppercase tracking-widest text-slate-500 block">Social Networks</span>
              <div className="flex flex-wrap gap-2">
                {profile.socialLinks?.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="px-3.5 py-2 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:text-white text-slate-300 rounded-xl text-3xs font-semibold select-none transition-all">LinkedIn</a>
                )}
                {profile.socialLinks?.instagram && (
                  <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="px-3.5 py-2 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:text-white text-slate-300 rounded-xl text-3xs font-semibold select-none transition-all">Instagram</a>
                )}
                {profile.socialLinks?.facebook && (
                  <a href={profile.socialLinks.facebook} target="_blank" rel="noreferrer" className="px-3.5 py-2 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:text-white text-slate-300 rounded-xl text-3xs font-semibold select-none transition-all">Facebook</a>
                )}
                {profile.socialLinks?.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="px-3.5 py-2 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:text-white text-slate-300 rounded-xl text-3xs font-semibold select-none transition-all">Twitter / X</a>
                )}
                {profile.socialLinks?.youtube && (
                  <a href={profile.socialLinks.youtube} target="_blank" rel="noreferrer" className="px-3.5 py-2 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:text-white text-slate-300 rounded-xl text-3xs font-semibold select-none transition-all">YouTube</a>
                )}
                {profile.socialLinks?.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="px-3.5 py-2 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] hover:text-white text-slate-300 rounded-xl text-3xs font-semibold select-none transition-all">GitHub</a>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 2. Compact QR Code Portal Trigger */}
      <Card className={clsx("p-6 space-y-4 border text-center relative overflow-hidden", st.card)} hoverEffect={false}>
        <div className="space-y-1">
          <h3 className="font-display text-sm font-bold text-white tracking-tight">QR Scanner Portal</h3>
          <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Tap to scan or download to share offline</p>
        </div>

        <div onClick={onOpenQr} className="cursor-pointer bg-white p-4.5 rounded-3xl inline-block border border-slate-200 shadow-xl mx-auto my-2 hover:scale-[1.03] transition-all">
          {profile.qrCodeUrl ? (
            <img src={profile.qrCodeUrl} alt="QR Code" className="w-36 h-36 object-contain select-none" />
          ) : (
            <div className="w-36 h-36 flex items-center justify-center text-slate-500 text-xs font-bold bg-slate-900 rounded-xl">
              Generating QR...
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="w-full text-3xs font-bold rounded-xl h-10 border-white/[0.08]"
            onClick={onOpenQr}
          >
            Manage QR Code Settings
          </Button>
        </div>
      </Card>
    </div>
  );
}
