import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { profileApi } from "../lib/profileApi";
import { Spinner } from "../components/ui/Spinner";
import { Alert } from "../components/ui/Alert";
import { BusinessCard } from "../components/card/BusinessCard";
import { ShareDialog } from "../components/card/ShareDialog";
import { QRCodeModal } from "../components/card/QRCodeModal";
import clsx from "clsx";

const themeStyles = {
  aurora: {
    bg: "bg-[#07080d]",
    card: "bg-white/[0.02] border-white/[0.05] backdrop-blur-xl shadow-2xl",
    text: "text-slate-100",
    textMuted: "text-slate-400",
    brandText: "text-[#4F8CFF]",
    primaryBtn: "bg-gradient-to-r from-[#4F8CFF] to-[#22D3EE] text-slate-950 hover:opacity-90 hover:shadow-lg hover:shadow-[#4F8CFF]/20",
    accentGlow: "bg-[#4F8CFF]/10",
    capsule: "bg-[#4F8CFF]/10 border-[#4F8CFF]/20 text-[#4F8CFF]"
  },
  midnight: {
    bg: "bg-[#040306]",
    card: "bg-white/[0.01] border-white/[0.04] backdrop-blur-xl shadow-2xl",
    text: "text-slate-200",
    textMuted: "text-slate-500",
    brandText: "text-[#A78BFA]",
    primaryBtn: "bg-gradient-to-r from-[#A78BFA] to-[#60A5FA] text-slate-950 hover:opacity-90 hover:shadow-lg hover:shadow-[#A78BFA]/20",
    accentGlow: "bg-[#A78BFA]/5",
    capsule: "bg-[#A78BFA]/10 border-[#A78BFA]/20 text-[#A78BFA]"
  },
  sunrise: {
    bg: "bg-[#f9f8f4]",
    card: "bg-white border-slate-200/80 shadow-xl",
    text: "text-slate-800",
    textMuted: "text-slate-500",
    brandText: "text-[#F97316]",
    primaryBtn: "bg-gradient-to-r from-[#F97316] to-[#FACC15] text-white hover:opacity-90 hover:shadow-lg hover:shadow-[#F97316]/20",
    accentGlow: "bg-[#F97316]/5",
    capsule: "bg-[#F97316]/10 border-[#F97316]/20 text-[#F97316]"
  },
  mono: {
    bg: "bg-[#0a0b0d]",
    card: "bg-white/[0.02] border-white/[0.05] backdrop-blur-xl shadow-2xl",
    text: "text-slate-100",
    textMuted: "text-slate-400",
    brandText: "text-[#E2E8F0]",
    primaryBtn: "bg-white text-slate-950 hover:bg-slate-200",
    accentGlow: "bg-[#E2E8F0]/10",
    capsule: "bg-white/10 border-white/20 text-[#E2E8F0]"
  }
};

export function DigitalCardPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Fetch public profile details
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
      <div className="min-h-screen bg-[#07080d] grid place-items-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#07080d] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Alert variant="error" title="Card Not Found">
            {error?.response?.data?.message || "The requested profile is private or not published yet."}
          </Alert>
        </div>
      </div>
    );
  }

  const themeKey = profile.theme?.key || "aurora";
  const st = themeStyles[themeKey] || themeStyles.aurora;

  return (
    <div className={clsx("min-h-screen transition-colors duration-500 relative pb-16 overflow-hidden print:bg-white print:pb-0", st.bg, st.text)}>
      {/* Background radial blobs */}
      <div className={clsx("glow-blob w-[450px] h-[450px] top-[-10%] left-[-10%] print:hidden", st.accentGlow)} />
      <div className={clsx("glow-blob w-[500px] h-[500px] bottom-[-15%] right-[-10%] print:hidden", st.accentGlow)} />

      <div className="relative z-10 mx-auto max-w-md px-4 py-12 sm:px-6 space-y-6 print:hidden">
        {/* Top Back Actions Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/p/${slug}`)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors select-none"
          >
            ← View Profile
          </button>
          
          <span className={clsx("text-4xs font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border", st.capsule)}>
            {profile.profileType === "professional" ? "Professional" : "Business"} Card
          </span>
        </div>

        {/* Modular BusinessCard Component */}
        <BusinessCard
          profile={profile}
          st={st}
          onOpenShare={() => setIsShareOpen(true)}
          onOpenQr={() => setIsQrOpen(true)}
        />

        {/* Modal sharing overlays */}
        <ShareDialog
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          profile={profile}
          st={st}
        />

        {/* Modal QR Scanner overlays */}
        <QRCodeModal
          isOpen={isQrOpen}
          onClose={() => setIsQrOpen(false)}
          profile={profile}
          st={st}
        />
      </div>
    </div>
  );
}
