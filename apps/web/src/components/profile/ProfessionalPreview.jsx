export function ProfessionalPreview({ values }) {
  const { title, bio, avatarUrl, coverImageUrl, designation, companyName, skillsRaw = "", experience = [] } = values;

  return (
    <div className="space-y-5 animate-fadeUp">
      {/* Cover Banner Image */}
      {coverImageUrl ? (
        <img src={coverImageUrl} alt="Cover" className="h-20 w-full object-cover rounded-xl border border-white/10" />
      ) : (
        <div className="h-20 w-full bg-gradient-to-tr from-brand-500/20 to-brand-400/5 rounded-xl border border-white/5 flex items-center justify-center text-3xs font-extrabold uppercase text-slate-500 select-none">
          Cover Banner Image
        </div>
      )}

      {/* Profile Photo Header */}
      <div className="flex items-center gap-3.5">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-12 w-12 rounded-2xl object-cover border border-white/10 shadow"
          />
        ) : (
          <div className="h-12 w-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center font-bold text-brand-300">
            {(title || "U").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-sm font-bold text-white truncate">{title || "Professional Name"}</div>
          <div className="text-3xs text-slate-400 mt-0.5 truncate max-w-[160px]">
            {designation || "Designation"} {companyName ? `@ ${companyName}` : ""}
          </div>
        </div>
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* Biography */}
      <div className="space-y-1">
        <span className="text-3xs uppercase tracking-[0.25em] text-slate-500 font-bold">Biography</span>
        <p className="text-2xs text-slate-300 leading-relaxed truncate-3-lines">
          {bio || "Tell visitors about your professional background, certifications, and expertise details."}
        </p>
      </div>

      {/* Skills Tags */}
      {skillsRaw && (
        <div className="space-y-1">
          <span className="text-3xs uppercase tracking-[0.25em] text-slate-500 font-bold block">Top Skills</span>
          <div className="flex flex-wrap gap-1">
            {skillsRaw.split(",").slice(0, 4).map((s, i) => (
              <span key={i} className="text-4xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">{s.trim()}</span>
            ))}
          </div>
        </div>
      )}

      {/* Experience milestone counter */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
        <span className="text-3xs font-semibold text-slate-500 block">Experience History</span>
        <span className="text-sm font-bold text-white mt-1 block">{experience.length} Milestones</span>
      </div>
    </div>
  );
}
