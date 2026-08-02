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
    <div className="bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px] p-6 sm:p-8 space-y-6">
      <div className="space-y-1">
        <span className="text-3xs uppercase tracking-[0.25em] text-[#6B7280] font-bold block">
          COMMUNICATE
        </span>
        <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
          Get In Touch
        </h2>
        <p className="text-xs text-[#6B7280] leading-relaxed">
          Send a direct inquiry or reach out instantly using any of the quick contact channels below.
        </p>
      </div>

      {/* Quick Direct Contact Action Buttons (Call, Email, WhatsApp, Save Contact) */}
      <div className="flex flex-row flex-wrap items-center gap-2.5">
        {profile?.contactDetails?.phone && (
          <a
            href={`tel:${profile.contactDetails.phone.replace(/[\s\(\)-]/g, "")}`}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 text-[#111827] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0"
            title="Call Phone"
          >
            <Phone className="w-4 h-4 text-[#2563EB]" />
            <span>Call</span>
          </a>
        )}
        {profile?.contactDetails?.email && (
          <a
            href={`mailto:${profile.contactDetails.email}`}
            className="h-11 px-4 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 text-[#111827] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0"
            title="Send Email"
          >
            <Mail className="w-4 h-4 text-[#2563EB]" />
            <span>Email</span>
          </a>
        )}
        {profile?.contactDetails?.whatsAppNumber && (
          <a
            href={`https://wa.me/${profile.contactDetails.whatsAppNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="h-11 px-4 rounded-xl border border-emerald-500/30 bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0"
            title="Message on WhatsApp"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </a>
        )}
        <button
          type="button"
          onClick={() => downloadVCardFile(profile)}
          className="h-11 px-4 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 text-[#111827] text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0"
          title="Save Contact (vCard)"
        >
          <Download className="w-4 h-4 text-[#2563EB]" />
          <span>Save Contact</span>
        </button>
      </div>

      <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-3xs text-[#6B7280] font-bold uppercase tracking-wide">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Direct Response
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Confidential Inquiry
        </div>
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
            href={`tel:${profile.contactDetails.phone.replace(/[\s\(\)-]/g, "")}`}
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
            <MessageSquare className="w-4 h-4" />
            <span className="sm:hidden">WA</span>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        )}
      </div>
    </div>
  );
}
