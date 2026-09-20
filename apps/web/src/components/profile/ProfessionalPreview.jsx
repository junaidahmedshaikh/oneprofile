import { User, Briefcase, Mail, Phone, Download } from "lucide-react";

export function ProfessionalPreview({ values = {} }) {
  const {
    title,
    bio,
    avatarUrl,
    coverImageUrl,
    designation,
    companyName,
    skillsRaw = "",
    experience = [],
    location = {},
  } = values;

  return (
    <div className="space-y-4 select-none">
      {/* Cover Banner Image */}
      {coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt="Cover"
          className="h-24 w-full object-cover rounded-xl border border-black/[0.08]"
        />
      ) : (
        <div className="h-24 w-full bg-gradient-to-r from-[#163300] to-[#2d5214] rounded-xl relative overflow-hidden flex items-end p-3 shadow-inner">
          <div className="absolute inset-0 bg-black/10" />
          <span className="relative z-10 text-[9px] font-mono uppercase tracking-widest text-white/90 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded">
            Individual Card
          </span>
        </div>
      )}

      {/* Profile Photo Header */}
      <div className="flex items-start gap-3.5 -mt-7 px-2 relative z-10">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-14 w-14 rounded-xl object-cover border-2 border-white bg-white shadow-md shrink-0"
          />
        ) : (
          <div className="h-14 w-14 rounded-xl bg-[#163300] text-[#9FE870] border-2 border-white flex items-center justify-center font-display font-bold text-lg shadow-md shrink-0">
            {(title || "U").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 pt-7">
          <h4 className="text-base font-display font-bold text-[#121814] truncate">
            {title || "Professional Name"}
          </h4>
          <p className="text-xs text-[#576159] truncate mt-0.5">
            {designation || "Designation"} {companyName ? `@ ${companyName}` : ""}
          </p>
        </div>
      </div>

      {/* Quick Location */}
      {location?.city && (
        <div className="px-2 text-[11px] text-[#879289]">
          📍 {[location.city, location.country].filter(Boolean).join(", ")}
        </div>
      )}

      <div className="h-px bg-black/[0.06]" />

      {/* Biography */}
      <div className="px-2 space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#879289]">
          Biography
        </span>
        <p className="text-xs text-[#576159] leading-relaxed line-clamp-3">
          {bio || "Tell visitors about your professional background, certifications, and expertise details."}
        </p>
      </div>

      {/* Skills Tags */}
      {skillsRaw && (
        <div className="px-2 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#879289] block">
            Core Expertise
          </span>
          <div className="flex flex-wrap gap-1">
            {skillsRaw
              .split(",")
              .slice(0, 4)
              .map((s, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-[#F6F5EE] border border-black/[0.06] text-[#121814] font-medium"
                >
                  {s.trim()}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Experience milestone counter */}
      <div className="p-3 rounded-xl bg-[#F6F5EE] border border-black/[0.06] text-center">
        <span className="text-[10px] font-mono text-[#879289] uppercase tracking-wider block">
          Career Milestones
        </span>
        <span className="text-sm font-display font-bold text-[#121814] mt-0.5 block">
          {experience.length} Verified Positions
        </span>
      </div>

      {/* Interactive Micro Actions */}
      <div className="grid grid-cols-3 gap-1.5 pt-2">
        <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-black/[0.08] text-[#121814] text-[10px] font-medium shadow-2xs">
          <Phone className="w-3 h-3 text-[#163300]" />
          <span>Call</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-white border border-black/[0.08] text-[#121814] text-[10px] font-medium shadow-2xs">
          <Mail className="w-3 h-3 text-[#163300]" />
          <span>Email</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-[#163300] text-white text-[10px] font-medium shadow-2xs">
          <Download className="w-3 h-3 text-[#9FE870]" />
          <span>Save Card</span>
        </div>
      </div>
    </div>
  );
}
