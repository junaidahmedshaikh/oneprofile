import clsx from "clsx";

export function BusinessCardActions({ profile }) {
  return (
    <div className="grid grid-cols-5 gap-2 border-t border-white/[0.04] pt-6 justify-items-center">
      {/* 📞 Call */}
      <div className="flex flex-col items-center gap-2">
        {profile.contactDetails?.phone ? (
          <a
            href={`tel:${profile.contactDetails.phone}`}
            className="h-12 w-12 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-primary/40 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(79,140,255,0.15)] text-slate-200 hover:text-white flex items-center justify-center text-md transition-all duration-300 hover:scale-105 active:scale-95"
            title="Call Phone"
            aria-label="Call Phone"
          >
            📞
          </a>
        ) : (
          <div className="h-12 w-12 rounded-full bg-white/[0.01] border border-white/[0.02] opacity-20 flex items-center justify-center text-md select-none" aria-hidden="true">
            📞
          </div>
        )}
        <span className="text-5xs font-bold uppercase tracking-wider text-slate-500">Call</span>
      </div>

      {/* 💬 WhatsApp */}
      <div className="flex flex-col items-center gap-2">
        {profile.contactDetails?.whatsAppNumber ? (
          <a
            href={`https://wa.me/${profile.contactDetails.whatsAppNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="h-12 w-12 rounded-full bg-[#25D366]/5 border border-[#25D366]/15 text-[#25D366] hover:bg-[#25D366]/15 hover:shadow-[0_0_15px_rgba(37,211,102,0.15)] flex items-center justify-center text-md transition-all duration-300 hover:scale-105 active:scale-95"
            title="Chat on WhatsApp"
            aria-label="Send WhatsApp message"
          >
            💬
          </a>
        ) : (
          <div className="h-12 w-12 rounded-full bg-white/[0.01] border border-white/[0.02] opacity-20 flex items-center justify-center text-md select-none" aria-hidden="true">
            💬
          </div>
        )}
        <span className="text-5xs font-bold uppercase tracking-wider text-slate-500">WhatsApp</span>
      </div>

      {/* 📧 Email */}
      <div className="flex flex-col items-center gap-2">
        {profile.contactDetails?.email ? (
          <a
            href={`mailto:${profile.contactDetails.email}`}
            className="h-12 w-12 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-primary/40 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(79,140,255,0.15)] text-slate-200 hover:text-white flex items-center justify-center text-md transition-all duration-300 hover:scale-105 active:scale-95"
            title="Send Email"
            aria-label="Send Email"
          >
            ✉️
          </a>
        ) : (
          <div className="h-12 w-12 rounded-full bg-white/[0.01] border border-white/[0.02] opacity-20 flex items-center justify-center text-md select-none" aria-hidden="true">
            ✉️
          </div>
        )}
        <span className="text-5xs font-bold uppercase tracking-wider text-slate-500">Email</span>
      </div>

      {/* 🌐 Visit Website */}
      <div className="flex flex-col items-center gap-2">
        {profile.socialLinks?.website ? (
          <a
            href={profile.socialLinks.website}
            target="_blank"
            rel="noreferrer"
            className="h-12 w-12 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-primary/40 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(79,140,255,0.15)] text-slate-200 hover:text-white flex items-center justify-center text-md transition-all duration-300 hover:scale-105 active:scale-95"
            title="Visit Website"
            aria-label="Visit Website"
          >
            🌐
          </a>
        ) : (
          <div className="h-12 w-12 rounded-full bg-white/[0.01] border border-white/[0.02] opacity-20 flex items-center justify-center text-md select-none" aria-hidden="true">
            🌐
          </div>
        )}
        <span className="text-5xs font-bold uppercase tracking-wider text-slate-500">Website</span>
      </div>

      {/* 🗺️ Open Google Maps */}
      <div className="flex flex-col items-center gap-2">
        {profile.location?.address ? (
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(profile.location.address)}`}
            target="_blank"
            rel="noreferrer"
            className="h-12 w-12 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-primary/40 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(79,140,255,0.15)] text-slate-200 hover:text-white flex items-center justify-center text-md transition-all duration-300 hover:scale-105 active:scale-95"
            title="Open Maps Location"
            aria-label="Directions on Google Maps"
          >
            📍
          </a>
        ) : (
          <div className="h-12 w-12 rounded-full bg-white/[0.01] border border-white/[0.02] opacity-20 flex items-center justify-center text-md select-none" aria-hidden="true">
            📍
          </div>
        )}
        <span className="text-5xs font-bold uppercase tracking-wider text-slate-500">Address</span>
      </div>
    </div>
  );
}
