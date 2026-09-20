import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { profileApi } from "../lib/profileApi";
import { Spinner } from "../components/ui/Spinner";
import { Alert } from "../components/ui/Alert";
import { BusinessPublicProfile } from "../components/profile/BusinessPublicProfile";
import { ProfessionalPublicProfile } from "../components/profile/ProfessionalPublicProfile";
import { ShieldCheck, MessageSquare, Phone, Mail, Download, CheckCircle2 } from "lucide-react";
import React from "react";
import { downloadVCardFile } from "../lib/vcardHelper";

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
      <div className="min-h-screen bg-[#FAFAF7] grid place-items-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center p-6">
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

  const whatsAppNumber =
    profile?.contactDetails?.whatsAppNumber ||
    profile?.contactDetails?.phone;

  const leadForm = (
    <div
      id="contact-section"
      className="bg-white border border-black/[0.08] shadow-[0_8px_30px_rgba(18,24,20,0.03)] rounded-2xl p-6 sm:p-8 space-y-6"
    >
      <div className="space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#879289] block">
          COMMUNICATE
        </span>
        <h2 className="text-xl sm:text-2xl font-display font-bold text-[#121814]">
          Get In Touch
        </h2>
        <p className="text-xs text-[#576159] leading-relaxed">
          Send a direct inquiry or reach out instantly using any of the quick contact channels below.
        </p>
      </div>

      {/* Quick Direct Contact Action Buttons (Call, Email, WhatsApp, Save Contact) */}
      <div className="flex flex-row flex-wrap items-center gap-2.5">
        {profile?.contactDetails?.phone && (
          <a
            href={`tel:${profile.contactDetails.phone.replace(/[\s\(\)-]/g, "")}`}
            className="h-10 px-4 rounded-xl border border-black/[0.08] hover:border-black/[0.15] bg-white text-[#121814] text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0"
            title="Call Phone"
          >
            <Phone className="w-3.5 h-3.5 text-[#163300]" />
            <span>Call</span>
          </a>
        )}
        {profile?.contactDetails?.email && (
          <a
            href={`mailto:${profile.contactDetails.email}`}
            className="h-10 px-4 rounded-xl border border-black/[0.08] hover:border-black/[0.15] bg-white text-[#121814] text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0"
            title="Send Email"
          >
            <Mail className="w-3.5 h-3.5 text-[#121814]" />
            <span>Email</span>
          </a>
        )}
        {whatsAppNumber && (
          <a
            href={`https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="h-10 px-4 rounded-xl border border-black/[0.08] bg-[#F6F5EE] hover:bg-[#eae8de] text-[#163300] text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0"
            title="Message on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#163300]" />
            <span>WhatsApp</span>
          </a>
        )}
        <button
          type="button"
          onClick={() => downloadVCardFile(profile)}
          className="h-10 px-4 rounded-xl bg-[#163300] hover:bg-[#121814] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0 shadow-2xs"
          title="Save Contact (vCard)"
        >
          <Download className="w-3.5 h-3.5 text-[#9FE870]" />
          <span>Save Contact</span>
        </button>
      </div>

      <div className="pt-4 border-t border-black/[0.06] grid grid-cols-2 gap-4 text-[10px] font-mono text-[#879289] uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#163300]" /> Direct Response
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#163300]" /> Confidential Inquiry
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF7] text-[#121814] selection:bg-[#9FE870] selection:text-[#163300] relative pb-24 overflow-x-hidden font-sans">
      {/* Main Profile Page Content */}
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {profile.profileType === "professional" ? (
          <ProfessionalPublicProfile profile={profile} leadForm={leadForm} />
        ) : (
          <BusinessPublicProfile profile={profile} leadForm={leadForm} />
        )}
      </main>

      {/* Mobile Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#FAFAF7]/90 backdrop-blur-md border-t border-black/[0.08] flex gap-3 z-30 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
        {profile.contactDetails?.phone && (
          <a
            href={`tel:${profile.contactDetails.phone.replace(/[\s\(\)-]/g, "")}`}
            className="flex-1 h-11 rounded-xl text-xs font-semibold bg-white border border-black/[0.08] text-[#121814] flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Phone className="w-3.5 h-3.5 text-[#163300]" /> Call
          </a>
        )}
        {whatsAppNumber && (
          <a
            href={`https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 h-11 rounded-xl text-xs font-semibold bg-[#163300] text-white flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#9FE870]" />
            <span className="sm:hidden">WhatsApp</span>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        )}
      </div>
    </div>
  );
}
