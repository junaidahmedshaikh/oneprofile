import clsx from "clsx";

export function BusinessCardHeader({ profile, st }) {
  const isProd = profile.profileType === "professional";
  const name = isProd ? (profile.title || "Professional") : (profile.companyName || "Business");
  const subtitle = isProd ? (profile.designation || profile.professionalCategory || "") : (profile.tagline || profile.businessCategory || "");
  const avatar = isProd ? profile.avatarUrl : (profile.logoUrl || profile.avatarUrl);

  return (
    <div className="relative">
      {/* Banner / Cover Image */}
      <div className="h-36 w-full bg-slate-800 relative overflow-hidden">
        {profile.coverImageUrl ? (
          <img
            src={profile.coverImageUrl}
            alt="Cover Banner"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900" />
        )}
        {/* Soft glass overlay */}
        <div className="absolute inset-0 bg-[#000000]/15 backdrop-blur-[1px]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#07080d]/80 to-transparent" />
      </div>

      {/* Profile Details Container */}
      <div className="px-6 pb-2 relative pt-0">
        {/* Overlapping Avatar Photo */}
        <div className="relative -mt-12 mb-4.5 inline-block">
          {avatar ? (
            <div className="p-1 rounded-3xl bg-gradient-to-tr from-[#4F8CFF] to-[#22D3EE] shadow-xl">
              <img
                src={avatar}
                alt={name}
                className="h-20 w-20 rounded-[22px] object-cover bg-slate-950 border-2 border-slate-950"
              />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-3xl bg-slate-900 border-4 border-slate-950 flex items-center justify-center text-3xl font-extrabold text-brand-400 shadow-xl">
              {name.charAt(0)}
            </div>
          )}
        </div>

        {/* Identity Texts */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display text-xl font-extrabold text-white tracking-tight leading-tight">
              {name}
            </h2>
            {/* Verification Badge */}
            {profile.isVerified && (
              <span className="h-4.5 w-4.5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white select-none" title="Verified Professional">
                ✓
              </span>
            )}
          </div>

          {subtitle && (
            <p className={clsx("text-xs font-semibold leading-relaxed", st.brandText)}>
              {subtitle}
            </p>
          )}

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-4xs text-slate-500 font-bold uppercase tracking-wider">
            {isProd && profile.companyName && (
              <span>{profile.companyName}</span>
            )}
            {profile.industry && (
              <span className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-slate-600" />
                {profile.industry}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
