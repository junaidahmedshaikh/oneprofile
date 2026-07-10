import clsx from "clsx";
import { Card } from "../ui/Card";

export function ProfessionalPublicProfile({ profile, st, isLight, leadForm }) {
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const workingHours = profile.workingHours || {};

  return (
    <div className="space-y-10">
      {/* 1. Professional Header Card */}
      <Card className={clsx("p-0 overflow-hidden", st.card)} hoverEffect={false}>
        {profile.coverImageUrl ? (
          <img src={profile.coverImageUrl} alt="Professional Banner" className="h-44 sm:h-52 w-full object-cover border-b border-white/[0.05]" />
        ) : (
          <div className="h-28 w-full bg-gradient-to-tr from-brand-500/20 to-brand-400/5 border-b border-white/[0.05]" />
        )}

        <div className="p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.title}
                  className="h-24 w-24 rounded-3xl object-cover border border-white/10 shadow-lg -mt-16 sm:-mt-20 relative z-10 bg-slate-900"
                />
              ) : (
                <div className={clsx("h-24 w-24 rounded-3xl border flex items-center justify-center text-3xl font-black shadow-inner bg-brand-500/10 border-brand-500/20 -mt-16 sm:-mt-20 relative z-10 bg-slate-900", st.brandText)}>
                  {(profile.title || "U").charAt(0).toUpperCase()}
                </div>
              )}

              <div className="space-y-2">
                <h1 className={clsx("font-display text-3xl font-extrabold tracking-tight", isLight ? "text-slate-800" : "text-white")}>
                  {profile.title || "Professional Profile"}
                </h1>
                
                <p className={clsx("text-sm font-semibold tracking-wide", st.brandText)}>
                  {profile.designation || "Independent Professional"}
                  {profile.companyName ? ` @ ${profile.companyName}` : ""}
                </p>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1 text-slate-400">
                  {profile.professionalCategory && (
                    <span className="rounded-full bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 text-4xs font-bold uppercase tracking-wider">
                      👤 {profile.professionalCategory}
                    </span>
                  )}
                  {profile.industry && (
                    <span className="rounded-full bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 text-4xs font-bold uppercase tracking-wider">
                      💼 {profile.industry}
                    </span>
                  )}
                  {profile.yearsOfExperience && (
                    <span className="rounded-full bg-white/[0.04] border border-white/[0.08] px-2.5 py-0.5 text-4xs font-bold uppercase tracking-wider">
                      ⏳ {profile.yearsOfExperience} Yrs Exp
                    </span>
                  )}
                </div>

                {/* Languages pills */}
                {profile.languages?.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1.5">
                    {profile.languages.map((lang, idx) => (
                      <span key={idx} className="rounded-full bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-3xs font-semibold text-slate-400">
                        {lang}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio Description */}
          <div className="border-t border-white/[0.05] pt-6 space-y-4">
            <h3 className={clsx("text-xs font-bold uppercase tracking-wider", st.textMuted)}>Biography</h3>
            <p className="text-sm leading-relaxed opacity-90 whitespace-pre-wrap">{profile.bio || "Provide professional biography details."}</p>
          </div>

          {/* Employment status highlights */}
          {(profile.employmentType || profile.practiceName || profile.department || profile.workLocation) && (
            <div className="border-t border-white/[0.05] pt-6 grid gap-4.5 sm:grid-cols-2 text-xs">
              <div>
                <span className="text-3xs text-slate-500 font-semibold uppercase">Employment Status</span>
                <span className="font-bold text-white mt-1 block capitalize">{profile.employmentType === "employed" ? "Employed" : "Self-Employed / Independent"}</span>
              </div>
              {profile.employmentType === "employed" ? (
                <>
                  {profile.department && (
                    <div>
                      <span className="text-3xs text-slate-500 font-semibold uppercase">Department</span>
                      <span className="font-bold text-white mt-1 block">{profile.department}</span>
                    </div>
                  )}
                  {profile.workLocation && (
                    <div className="sm:col-span-2">
                      <span className="text-3xs text-slate-500 font-semibold uppercase">Office Work Location</span>
                      <span className="font-bold text-white mt-1 block">{profile.workLocation}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {profile.practiceName && (
                    <div>
                      <span className="text-3xs text-slate-500 font-semibold uppercase">Practice / Brand Name</span>
                      <span className="font-bold text-white mt-1 block">{profile.practiceName}</span>
                    </div>
                  )}
                  {profile.workLocation && (
                    <div className="sm:col-span-2">
                      <span className="text-3xs text-slate-500 font-semibold uppercase">Geographical Service Area</span>
                      <span className="font-bold text-white mt-1 block">{profile.workLocation}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Core Skills & Certifications row */}
          {(profile.skills?.length > 0 || profile.certifications?.length > 0) ? (
            <div className="border-t border-white/[0.05] pt-6 grid gap-6 sm:grid-cols-2">
              {profile.skills?.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-3xs uppercase tracking-[0.2em] font-bold text-slate-500">Core Expertise</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-xl bg-brand-500/10 border border-brand-500/20 text-3xs font-bold text-brand-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              
              {profile.certifications?.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-3xs uppercase tracking-[0.2em] font-bold text-slate-500">Certifications</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map((cert, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-3xs font-bold text-purple-300">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

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
        {/* Left Column: Experience history timeline */}
        <div className="space-y-8 min-w-0">
          {profile.experience?.length ? (
            <Card className={clsx("p-6 sm:p-8 space-y-6", st.card)} hoverEffect={false}>
              <h3 className={clsx("text-xs font-bold uppercase tracking-wider border-b border-white/[0.05] pb-3", st.textMuted)}>
                Experience History
              </h3>
              <div className="relative pl-6 space-y-6 border-l border-white/[0.05] ml-2">
                {profile.experience.map((exp, idx) => (
                  <div key={idx} className="relative space-y-1.5">
                    {/* Timeline bullet dot */}
                    <span className="absolute left-[-29px] top-1.5 h-3.5 w-3.5 rounded-full border bg-slate-900 flex items-center justify-center border-brand-500 shadow">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                    </span>
                    
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-sm font-bold text-white leading-tight">{exp.title}</h4>
                      <span className="text-3xs text-slate-500 font-bold uppercase shrink-0 mt-0.5">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 block">{exp.company}</span>
                    {exp.description && (
                      <p className="text-3xs text-slate-400 mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">No experience milestones added yet.</div>
          )}
        </div>

        {/* Right Column: Contacts, Map, Hours, custom links */}
        <div className="space-y-8">
          {leadForm}
          {/* Location details card */}
          {(profile.location?.address || profile.location?.city || profile.location?.country || profile.location?.mapsEmbedUrl) && (
            <Card className={clsx("p-6 space-y-5", st.card)} hoverEffect={false}>
              <div className="border-b border-white/[0.05] pb-3">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-500">Find Me</span>
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
