import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { profileApi } from "../lib/profileApi";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import clsx from "clsx";
import { BusinessPublicProfile } from "../components/profile/BusinessPublicProfile";
import { ProfessionalPublicProfile } from "../components/profile/ProfessionalPublicProfile";

const themeStyles = {
  aurora: {
    bg: "bg-[#090a0f]",
    card: "bg-white/[0.02] border-white/[0.05]",
    text: "text-slate-100",
    textMuted: "text-slate-400",
    brandText: "text-[#4F8CFF]",
    primaryBtn: "bg-gradient-to-r from-[#4F8CFF] to-[#22D3EE] text-slate-950 hover:opacity-90",
    accentGlow: "bg-[#4F8CFF]/15"
  },
  midnight: {
    bg: "bg-[#050409]",
    card: "bg-white/[0.01] border-white/[0.04]",
    text: "text-slate-200",
    textMuted: "text-slate-500",
    brandText: "text-[#A78BFA]",
    primaryBtn: "bg-gradient-to-r from-[#A78BFA] to-[#60A5FA] text-slate-950 hover:opacity-90",
    accentGlow: "bg-[#A78BFA]/10"
  },
  sunrise: {
    bg: "bg-[#fefbf6]",
    card: "bg-white border-slate-200/80 shadow-md",
    text: "text-slate-800",
    textMuted: "text-slate-500",
    brandText: "text-[#F97316]",
    primaryBtn: "bg-gradient-to-r from-[#F97316] to-[#FACC15] text-white hover:opacity-90",
    accentGlow: "bg-[#F97316]/5"
  },
  mono: {
    bg: "bg-[#111216]",
    card: "bg-white/[0.02] border-white/[0.05]",
    text: "text-slate-100",
    textMuted: "text-slate-400",
    brandText: "text-[#E2E8F0]",
    primaryBtn: "bg-white text-slate-950 hover:bg-slate-200",
    accentGlow: "bg-[#E2E8F0]/10"
  }
};

export function PublicProfilePage() {
  const { slug } = useParams();

  // 1. Fetch Public Profile
  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["profile", "public", slug],
    queryFn: async () => {
      const response = await profileApi.getPublic(slug);
      return response.data.data;
    },
    enabled: !!slug
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090a0f] grid place-items-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Alert variant="error" title="Profile Not Found">
            {error?.response?.data?.message || "The requested profile page could not be located or is set to private."}
          </Alert>
        </div>
      </div>
    );
  }

  const themeKey = profile.theme?.key || "aurora";
  const st = themeStyles[themeKey] || themeStyles.aurora;
  const isLight = themeKey === "sunrise";

  const leadForm = (
    <Card className={clsx("p-6 sm:p-8 space-y-5 relative overflow-hidden", st.card)} hoverEffect={false}>
      <div className="space-y-1 border-b border-white/[0.05] pb-4">
        <h3 className={clsx("font-display text-md font-bold tracking-tight", isLight ? "text-slate-800" : "text-white")}>
          Get In Touch
        </h3>
        <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">
          Connect directly via email, phone, or messaging
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {profile.contactDetails?.email && (
          <a
            href={`mailto:${profile.contactDetails.email}`}
            className={clsx("w-full h-11 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98", st.primaryBtn)}
          >
            Send Email ✉️
          </a>
        )}

        {profile.contactDetails?.phone && (
          <a
            href={`tel:${profile.contactDetails.phone}`}
            className="w-full h-11 rounded-2xl text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            Call Us 📞
          </a>
        )}

        {profile.contactDetails?.whatsAppNumber && (
          <a
            href={`https://wa.me/${profile.contactDetails.whatsAppNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="w-full h-11 rounded-2xl text-xs font-bold bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#25D366] flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            WhatsApp Chat 💬
          </a>
        )}
      </div>
    </Card>
  );

  return (
    <div className={clsx("min-h-screen transition-colors duration-500 relative pb-16 overflow-hidden", st.bg, st.text)}>
      {/* Background Glow Blobs */}
      <div className={clsx("glow-blob w-[450px] h-[450px] top-[-10%] left-[-10%]", st.accentGlow)} />
      <div className={clsx("glow-blob w-[500px] h-[500px] bottom-[-15%] right-[-10%]", st.accentGlow)} />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        {profile.profileType === "professional" ? (
          <ProfessionalPublicProfile profile={profile} st={st} isLight={isLight} leadForm={leadForm} />
        ) : (
          <BusinessPublicProfile profile={profile} st={st} isLight={isLight} themeStyles={themeStyles} leadForm={leadForm} />
        )}
      </div>
    </div>
  );
}
