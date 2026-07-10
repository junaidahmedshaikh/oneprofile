import clsx from "clsx";

export function BusinessCardActions({ profile }) {
  return (
    <div className="grid grid-cols-5 gap-1 border-t border-white/[0.04] pt-5">
      {/* 📞 Call */}
      <div className="flex flex-col items-center gap-1.5">
        {profile.contactDetails?.phone ? (
          <a
            href={`tel:${profile.contactDetails.phone}`}
            className="h-11 w-11 rounded-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.1] text-slate-200 hover:text-white flex items-center justify-center text-md transition-all duration-200 active:scale-90"
            title="Call Phone"
          >
            📞
          </a>
        ) : (
          <div className="h-11 w-11 rounded-full bg-white/[0.01] border border-white/[0.02] opacity-20 flex items-center justify-center text-md select-none">
            📞
          </div>
        )}
        <span className="text-5xs font-bold uppercase tracking-wider text-slate-500">Call</span>
      </div>

      {/* 💬 WhatsApp */}
      <div className="flex flex-col items-center gap-1.5">
        {profile.contactDetails?.whatsAppNumber ? (
          <a
            href={`https://wa.me/${profile.contactDetails.whatsAppNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="h-11 w-11 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 flex items-center justify-center text-md transition-all duration-200 active:scale-90"
            title="Chat on WhatsApp"
          >
            💬
          </a>
        ) : (
          <div className="h-11 w-11 rounded-full bg-white/[0.01] border border-white/[0.02] opacity-20 flex items-center justify-center text-md select-none">
            💬
          </div>
        )}
        <span className="text-5xs font-bold uppercase tracking-wider text-slate-500">WhatsApp</span>
      </div>

      {/* 📧 Email */}
      <div className="flex flex-col items-center gap-1.5">
        {profile.contactDetails?.email ? (
          <a
            href={`mailto:${profile.contactDetails.email}`}
            className="h-11 w-11 rounded-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.1] text-slate-200 hover:text-white flex items-center justify-center text-md transition-all duration-200 active:scale-90"
            title="Send Email"
          >
            ✉️
          </a>
        ) : (
          <div className="h-11 w-11 rounded-full bg-white/[0.01] border border-white/[0.02] opacity-20 flex items-center justify-center text-md select-none">
            ✉️
          </div>
        )}
        <span className="text-5xs font-bold uppercase tracking-wider text-slate-500">Email</span>
      </div>

      {/* 🌐 Visit Website */}
      <div className="flex flex-col items-center gap-1.5">
        {profile.socialLinks?.website ? (
          <a
            href={profile.socialLinks.website}
            target="_blank"
            rel="noreferrer"
            className="h-11 w-11 rounded-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.1] text-slate-200 hover:text-white flex items-center justify-center text-md transition-all duration-200 active:scale-90"
            title="Visit Website"
          >
            🌐
          </a>
        ) : (
          <div className="h-11 w-11 rounded-full bg-white/[0.01] border border-white/[0.02] opacity-20 flex items-center justify-center text-md select-none">
            🌐
          </div>
        )}
        <span className="text-5xs font-bold uppercase tracking-wider text-slate-500">Website</span>
      </div>

      {/* 🗺️ Open Google Maps */}
      <div className="flex flex-col items-center gap-1.5">
        {profile.location?.address ? (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(profile.location.address)}`}
            target="_blank"
            rel="noreferrer"
            className="h-11 w-11 rounded-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.1] text-slate-200 hover:text-white flex items-center justify-center text-md transition-all duration-200 active:scale-90"
            title="Open Maps Location"
          >
            📍
          </a>
        ) : (
          <div className="h-11 w-11 rounded-full bg-white/[0.01] border border-white/[0.02] opacity-20 flex items-center justify-center text-md select-none">
            📍
          </div>
        )}
        <span className="text-5xs font-bold uppercase tracking-wider text-slate-500">Directions</span>
      </div>
    </div>
  );
}
