import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { profileApi } from "../lib/profileApi";
import { Spinner } from "../components/ui/Spinner";
import { Alert } from "../components/ui/Alert";
import { BusinessPublicProfile } from "../components/profile/BusinessPublicProfile";
import { ProfessionalPublicProfile } from "../components/profile/ProfessionalPublicProfile";
import { ShieldCheck, MessageSquare, Phone, Mail } from "lucide-react";
import React from "react";

export function PublicProfilePage() {
  const { slug } = useParams();

  // 1. Fetch Public Profile
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile", "public", slug],
    queryFn: async () => {
      const response = await profileApi.getPublic(slug);
      return response.data.data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FCFCFD] grid place-items-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#FCFCFD] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Alert variant="error" title="Profile Not Found">
            {error?.response?.data?.message ||
              "The requested profile page could not be located or is set to private."}
          </Alert>
        </div>
      </div>
    );
  }

  const handleScrollToContact = () => {
    const whatsAppNumber = profile?.contactDetails?.whatsAppNumber;
    const phoneNumber = profile?.contactDetails?.phone;
    const companyName =
      profile?.companyName || profile?.title || "your business";

    const message = `Hello,

I'm interested in connecting with ${companyName}.

Could you please share more details about your offerings, pricing, and availability?

Thank you.`;

    if (whatsAppNumber) {
      const cleanWhatsApp = whatsAppNumber.replace(/[^0-9]/g, "");
      const encodedMessage = encodeURIComponent(message);
      window.open(
        `https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`,
        "_blank",
      );
    } else if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const leadForm = (
    <div
      id="contact-section"
      className="bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[24px] p-6 sm:p-8 space-y-5 relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
    >
      <div className="space-y-1 border-b border-[#E5E7EB] pb-4">
        <h3 className="font-display text-md font-bold tracking-tight text-[#111827]">
          Get In Touch
        </h3>
        <p className="text-3xs text-[#6B7280] font-bold uppercase tracking-wider">
          Connect directly via email, phone, or messaging
        </p>
      </div>

      <div className="flex gap-3">
        {profile.contactDetails?.email && (
          <a
            href={`mailto:${profile.contactDetails.email}`}
            className="w-full h-12 rounded-full text-xs font-bold bg-[#2563EB] hover:bg-[#1d4ed8] text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
          >
            <Mail className="w-3.5 h-3.5" /> Email
          </a>
        )}

        {profile.contactDetails?.phone && (
          <a
            href={`tel:${profile.contactDetails.phone}`}
            className="w-full h-12 rounded-full text-xs font-bold bg-white border border-[#E5E7EB] hover:bg-slate-50 text-[#111827] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
        )}

        {profile.contactDetails?.whatsAppNumber && (
          <a
            href={`https://wa.me/${profile.contactDetails.whatsAppNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="w-full h-12 rounded-full text-xs font-bold bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#128C7E] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCFCFD] text-[#111827] selection:bg-[#2563EB]/10 relative pb-24 overflow-x-hidden font-sans">
      {/* Main Profile Page Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {profile.profileType === "professional" ? (
          <ProfessionalPublicProfile profile={profile} leadForm={leadForm} />
        ) : (
          <BusinessPublicProfile profile={profile} leadForm={leadForm} />
        )}
      </main>

      {/* Mobile Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-[#E5E7EB] flex gap-3 z-30 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        {profile.contactDetails?.phone && (
          <a
            href={`tel:${profile.contactDetails.phone}`}
            className="flex-1 h-12 rounded-full text-xs font-bold bg-white border border-[#E5E7EB] text-[#111827] flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Phone className="w-4 h-4" /> Call
          </a>
        )}
        {profile.contactDetails?.whatsAppNumber && (
          <a
            href={`https://wa.me/${profile.contactDetails.whatsAppNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 h-12 rounded-full text-xs font-bold bg-[#25D366] text-white flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4" /> WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
