import clsx from "clsx";
import { Card } from "../ui/Card";

export function BusinessPublicProfile({ profile, st, isLight, themeStyles, leadForm }) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const workingHours = profile.workingHours || {};

  return (
    <div className="space-y-10">
      {/* 1. Brand Profile Header */}
      <Card className={clsx("p-0 overflow-hidden", st.card)} hoverEffect={false}>
        {profile.coverImageUrl ? (
          <img src={profile.coverImageUrl} alt="Business Banner" className="h-44 sm:h-52 w-full object-cover border-b border-white/[0.05]" />
        ) : (
          <div className="h-28 w-full bg-gradient-to-tr from-brand-500/20 to-brand-400/5 border-b border-white/[0.05]" />
        )}

        <div className="p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {profile.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt={profile.companyName}
                  className="h-24 w-24 rounded-[2rem] object-cover border border-white/10 shadow-lg -mt-16 sm:-mt-20 relative z-10 bg-slate-900"
                />
              ) : (
                <div className={clsx("h-24 w-24 rounded-[2rem] border flex items-center justify-center text-3xl font-black shadow-inner bg-brand-500/10 border-brand-500/20 -mt-16 sm:-mt-20 relative z-10 bg-slate-900", st.brandText)}>
                  {(profile.companyName || "B").charAt(0).toUpperCase()}
                </div>
              )}

              <div className="space-y-2">
                <h1 className={clsx("font-display text-3xl font-extrabold tracking-tight", isLight ? "text-slate-800" : "text-white")}>
                  {profile.companyName || "Business Profile"}
                </h1>
                <p className={clsx("text-sm font-semibold tracking-wide", st.brandText)}>
                  {profile.tagline || "Brand Tagline"}
                </p>
                {profile.businessCategory && (
                  <span className="inline-block rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-3xs font-semibold text-slate-400">
                    🏢 {profile.businessCategory}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-white/[0.05] pt-6 space-y-4">
            <h3 className={clsx("text-xs font-bold uppercase tracking-wider", st.textMuted)}>About Us</h3>
            <p className="text-sm leading-relaxed opacity-90 whitespace-pre-wrap">{profile.description || "Provide details about your business offerings."}</p>
          </div>

          {/* Social Links Chips row */}
          {profile.socialLinks && Object.values(profile.socialLinks).some(Boolean) ? (
            <div className="pt-6 border-t border-white/[0.05] flex flex-wrap gap-2.5">
              {Object.entries(profile.socialLinks).map(([key, value]) => {
                if (!value || key === "customLinks") return null;
                return (
                  <a
                    key={key}
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] text-xs font-semibold text-slate-300 hover:text-white transition-all select-none"
                  >
                    <span className="capitalize">{key}</span>
                  </a>
                );
              })}
            </div>
          ) : null}
        </div>
      </Card>

      <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] items-start">
        {/* Left Column */}
        <div className="space-y-8 min-w-0">
          {/* Advanced Credentials */}
          {(profile.gstNumber || profile.registrationDetails || profile.foundedYear || profile.teamSize || profile.serviceArea) && (
            <Card className={clsx("p-6 sm:p-8 space-y-6", st.card)} hoverEffect={false}>
              <h3 className={clsx("text-xs font-bold uppercase tracking-wider border-b border-white/[0.05] pb-3", st.textMuted)}>
                Organization Details
              </h3>
              <div className="grid gap-4.5 sm:grid-cols-2 text-xs">
                {profile.gstNumber && (
                  <div>
                    <span className="text-3xs text-slate-500 font-semibold block uppercase">GSTIN</span>
                    <span className="font-bold text-white mt-1 block">{profile.gstNumber}</span>
                  </div>
                )}
                {profile.registrationDetails && (
                  <div>
                    <span className="text-3xs text-slate-500 font-semibold block uppercase">Registration CIN</span>
                    <span className="font-bold text-white mt-1 block">{profile.registrationDetails}</span>
                  </div>
                )}
                {profile.foundedYear && (
                  <div>
                    <span className="text-3xs text-slate-500 font-semibold block uppercase">Founded Year</span>
                    <span className="font-bold text-white mt-1 block">{profile.foundedYear}</span>
                  </div>
                )}
                {profile.teamSize && (
                  <div>
                    <span className="text-3xs text-slate-500 font-semibold block uppercase">Team Size</span>
                    <span className="font-bold text-white mt-1 block">{profile.teamSize} Employees</span>
                  </div>
                )}
                {profile.serviceArea && (
                  <div className="sm:col-span-2">
                    <span className="text-3xs text-slate-500 font-semibold block uppercase">Service / Geographical Area</span>
                    <span className="font-bold text-white mt-1 block">{profile.serviceArea}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Services Offered */}
          {profile.services?.length ? (
            <Card className={clsx("p-6 sm:p-8 space-y-6", st.card)} hoverEffect={false}>
              <h3 className={clsx("text-xs font-bold uppercase tracking-wider border-b border-white/[0.05] pb-3", st.textMuted)}>
                Professional Services
              </h3>
              <div className="space-y-4">
                {profile.services.map((srv, idx) => (
                  <div key={idx} className="p-4.5 rounded-2xl bg-white/[0.01] border border-white/[0.04]">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-sm font-bold text-white leading-tight">{srv.title}</h4>
                      {srv.price && <span className={clsx("text-xs font-bold shrink-0", st.brandText)}>{srv.price}</span>}
                    </div>
                    {srv.description && (
                      <p className="text-3xs text-slate-400 mt-2 leading-relaxed">{srv.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {/* Products Catalog */}
          {profile.products?.length ? (
            <Card className={clsx("p-6 sm:p-8 space-y-6", st.card)} hoverEffect={false}>
              <h3 className={clsx("text-xs font-bold uppercase tracking-wider border-b border-white/[0.05] pb-3", st.textMuted)}>
                Products Catalog
              </h3>
              <div className="grid gap-4.5 sm:grid-cols-2">
                {profile.products.map((prod, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04]">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.title} className="h-16 w-16 rounded-xl object-cover border border-white/10 shrink-0" />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-lg shrink-0">📦</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{prod.title}</h4>
                      <span className={clsx("text-xs font-bold mt-0.5 block", st.brandText)}>{prod.price || "Free"}</span>
                      {prod.description && <p className="text-3xs text-slate-400 mt-1 truncate-2-lines">{prod.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
        </div>

        {/* Right Column: Contacts, Address, Location Map, and Hours */}
        <div className="space-y-8">
          {leadForm}
          {/* Location details card */}
          {(profile.location?.address || profile.location?.city || profile.location?.country || profile.location?.mapsEmbedUrl) && (
            <Card className={clsx("p-6 space-y-5", st.card)} hoverEffect={false}>
              <div className="border-b border-white/[0.05] pb-3">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-500">Find Us</span>
                <h4 className="text-xs font-bold text-white mt-0.5">Location Directory</h4>
              </div>
              <div className="text-xs space-y-3.5">
                {profile.location?.address && (
                  <div>
                    <span className="text-3xs text-slate-500 uppercase font-semibold">Street Address</span>
                    <span className="font-bold text-white mt-1 block leading-normal">{profile.location.address}</span>
                  </div>
                )}
                {(profile.location?.city || profile.location?.country) && (
                  <div>
                    <span className="text-3xs text-slate-500 uppercase font-semibold">Region</span>
                    <span className="font-bold text-white mt-1 block">
                      {[profile.location.city, profile.location.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
                {profile.location?.mapsEmbedUrl && (
                  <div className="h-40 w-full rounded-xl overflow-hidden border border-white/10 mt-2 bg-slate-950">
                    <iframe
                      title="Location Map"
                      src={profile.location.mapsEmbedUrl}
                      className="w-full h-full border-0 grayscale invert opacity-80"
                      allowFullScreen=""
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Working Hours */}
          {Object.keys(workingHours).length > 0 && Object.values(workingHours).some(h => h.enabled) && (
            <Card className={clsx("p-6 space-y-5", st.card)} hoverEffect={false}>
              <div className="border-b border-white/[0.05] pb-3">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-500">Operation Times</span>
                <h4 className="text-xs font-bold text-white mt-0.5">Working Hours</h4>
              </div>
              <div className="space-y-3 text-xs">
                {days.map((day) => {
                  const hour = workingHours[day];
                  if (!hour || !hour.enabled) return null;
                  return (
                    <div key={day} className="flex justify-between items-center py-0.5 border-b border-white/[0.02] last:border-0">
                      <span className="capitalize text-slate-400 font-semibold">{day}</span>
                      <span className="font-bold text-white">{hour.open} - {hour.close}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Custom Link booklets */}
          {profile.socialLinks?.customLinks?.length ? (
            <Card className={clsx("p-6 space-y-4", st.card)} hoverEffect={false}>
              <div className="border-b border-white/[0.05] pb-3">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-500">Resources</span>
                <h4 className="text-xs font-bold text-white mt-0.5">Custom Booklets</h4>
              </div>
              <div className="space-y-2.5">
                {profile.socialLinks.customLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all text-xs font-bold text-white"
                  >
                    <span>{link.title}</span>
                    <span className={clsx("text-xs", st.brandText)}>➔</span>
                  </a>
                ))}
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
