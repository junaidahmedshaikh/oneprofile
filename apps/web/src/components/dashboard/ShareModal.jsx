import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "../ui/Button";
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Share2,
  Download,
  ExternalLink,
  BadgeCheck,
  X,
} from "lucide-react";

export function ShareModal({ isOpen, onClose, profile }) {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!profile) return null;

  const isProfessional = profile.profileType === "professional";
  const name = isProfessional
    ? profile.title || "Professional"
    : profile.companyName || "Business";
  const designation = isProfessional
    ? profile.designation || ""
    : profile.tagline || "";
  const avatarUrl = isProfessional
    ? profile.personalDetails?.avatarUrl
    : profile.logo;

  // Construct card URL pointing to the card view page
  const cardUrl = `${window.location.origin}/p/${profile.slug}/card`;
  const publicUrl =
    profile.publicProfileUrl || `${window.location.origin}/p/${profile.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Ignored
    }
  };

  const handleDownloadQr = () => {
    if (!profile.qrCodeUrl) return;
    const link = document.createElement("a");
    link.href = profile.qrCodeUrl;
    link.download = `${name.replace(/[^a-zA-Z0-9]+/g, "_")}_qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const printWindow = window.open(cardUrl, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: designation,
          url: cardUrl,
        });
      } catch (err) {
        // Cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSaveContact = () => {
    const vcardParts = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${name};;;;`,
      `FN:${name}`,
    ];

    if (designation) {
      vcardParts.push(`TITLE:${designation}`);
    }

    const phoneVal = profile.contactDetails?.phone || profile.phone;
    if (phoneVal) {
      vcardParts.push(`TEL;TYPE=CELL:${phoneVal}`);
    }

    const emailVal = profile.contactDetails?.email || profile.email;
    if (emailVal) {
      vcardParts.push(`EMAIL;TYPE=PREF,INTERNET:${emailVal}`);
    }

    const websiteVal =
      profile.contactDetails?.website ||
      profile.website ||
      profile.socialLinks?.website ||
      publicUrl;
    if (websiteVal) {
      vcardParts.push(`URL:${websiteVal}`);
    }

    const addressVal = profile.contactDetails?.address || profile.city;
    if (addressVal) {
      vcardParts.push(`ADR;TYPE=WORK:;;${addressVal};;;;`);
    }

    vcardParts.push("END:VCARD");
    const vcardString = vcardParts.join("\r\n");

    const blob = new Blob([vcardString], { type: "text/vcard;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${name.replace(/[^a-zA-Z0-9]+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getInitials = (str) => {
    if (!str) return "OP";
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  const handleCloseAndOpenCard = () => {
    window.open(cardUrl, "_blank");
    onClose();
  };

  const phoneVal =
    profile.contactDetails?.phone || profile.phone || "Not Available";
  const emailVal =
    profile.contactDetails?.email || profile.email || "Not Available";
  const websiteVal =
    profile.contactDetails?.website ||
    profile.website ||
    profile.socialLinks?.website ||
    "Not Available";
  const addressVal =
    profile.contactDetails?.address ||
    (profile.city
      ? [profile.city, profile.country].filter(Boolean).join(", ")
      : "") ||
    "Not Available";

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80"
          />

          {/* Layered dialog container matching AuthShell visual styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 w-[calc(100%-32px)] sm:w-full sm:max-w-[720px] max-h-[90vh] p-1 bg-oneprofile-100 border border-oneprofile-700 rounded-ds-card overflow-hidden shadow-ds-card backdrop-blur-xl flex flex-col"
          >
            {/* Inner Surface Wrapper */}
            <div className="relative p-6 sm:p-8 rounded-[20px] bg-oneprofile-900/40 overflow-y-auto flex flex-col justify-between flex-1">
              {/* Decorative blurred gradient orb */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6 sm:space-y-8 flex-1 z-10">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-oneprofile-700 pb-5">
                  <div>
                    <h3 className="font-display text-[20px] font-semibold text-white tracking-tight">
                      Share Digital Card
                    </h3>
                    <p className="text-[14px] text-oneprofile-600 mt-1">
                      Instantly share your professional identity with anyone.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="h-9 w-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center border border-oneprofile-700 text-slate-400 hover:text-white transition-all active:scale-95 select-none shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Profile Preview Card */}
                <div className="relative p-5 sm:p-6 rounded-2xl overflow-hidden bg-oneprofile-950/60 border border-oneprofile-700 flex items-center gap-5 sm:gap-6 shadow-sm">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="w-14 h-14 rounded-xl object-cover border border-oneprofile-700 shrink-0 z-10"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-oneprofile-700 flex items-center justify-center text-md font-bold text-primary shrink-0 select-none z-10">
                      {getInitials(name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0 z-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-[18px] sm:text-[20px] font-semibold text-white truncate">
                        {name}
                      </h4>
                      {profile.isVerified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-4xs font-bold uppercase tracking-wider text-emerald-400 select-none shrink-0">
                          <BadgeCheck className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    {designation && (
                      <p className="text-xs text-oneprofile-600 truncate mt-0.5">
                        {designation}
                      </p>
                    )}
                    <p className="text-[13px] text-primary truncate mt-1 font-mono">
                      {publicUrl.replace(/^https?:\/\//, "")}
                    </p>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-oneprofile-600 block">
                    Contact Information
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Card */}
                    <div className="p-4 sm:p-5 bg-oneprofile-950/60 border border-oneprofile-700 rounded-2xl flex items-start gap-4 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-oneprofile-700 flex items-center justify-center text-primary shrink-0">
                        <Phone className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-oneprofile-600 block">
                          Phone
                        </span>
                        <span className="text-[13px] font-semibold text-slate-300 block truncate mt-1 select-all">
                          {phoneVal}
                        </span>
                      </div>
                    </div>

                    {/* Email Card */}
                    <div className="p-4 sm:p-5 bg-oneprofile-950/60 border border-oneprofile-700 rounded-2xl flex items-start gap-4 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-oneprofile-700 flex items-center justify-center text-primary shrink-0">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-oneprofile-600 block">
                          Email
                        </span>
                        <span className="text-[13px] font-semibold text-slate-300 block truncate mt-1 select-all">
                          {emailVal}
                        </span>
                      </div>
                    </div>

                    {/* Website Card */}
                    <div className="p-4 sm:p-5 bg-oneprofile-950/60 border border-oneprofile-700 rounded-2xl flex items-start gap-4 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-oneprofile-700 flex items-center justify-center text-primary shrink-0">
                        <Globe className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-oneprofile-600 block">
                          Website
                        </span>
                        <a
                          href={
                            websiteVal !== "Not Available"
                              ? websiteVal.startsWith("http")
                                ? websiteVal
                                : `https://${websiteVal}`
                              : undefined
                          }
                          target="_blank"
                          rel="noreferrer"
                          className={`text-[13px] font-semibold block truncate mt-1 ${
                            websiteVal !== "Not Available"
                              ? "text-primary hover:underline"
                              : "text-oneprofile-600 pointer-events-none"
                          }`}
                        >
                          {websiteVal}
                        </a>
                      </div>
                    </div>

                    {/* Address Card */}
                    <div className="p-4 sm:p-5 bg-oneprofile-950/60 border border-oneprofile-700 rounded-2xl flex items-start gap-4 shadow-sm">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-oneprofile-700 flex items-center justify-center text-primary shrink-0">
                        <MapPin className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-oneprofile-600 block">
                          Address
                        </span>
                        <span className="text-[13px] font-semibold text-slate-300 block truncate mt-1">
                          {addressVal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Actions Section */}
                <div className="space-y-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-oneprofile-600 block">
                    QR Code Actions
                  </span>
                  <div className="p-5 sm:p-6 bg-oneprofile-950/60 border border-oneprofile-700 rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                    {/* Left Info with QR */}
                    <div className="flex items-center gap-5 w-full md:w-auto z-10">
                      {/* QR Code Container */}
                      <div className="bg-white p-2 rounded-2xl border border-oneprofile-700 shrink-0 shadow-sm">
                        {profile.qrCodeUrl ? (
                          <img
                            src={profile.qrCodeUrl}
                            alt="QR Code"
                            className="w-16 h-16 object-contain select-none"
                          />
                        ) : (
                          <div className="w-16 h-16 flex items-center justify-center text-slate-500 text-[10px] font-bold bg-slate-900 rounded-xl">
                            Generating...
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-[16px] font-semibold text-white flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-primary" />
                          Share Card
                        </h4>
                        <p className="text-[13px] text-oneprofile-600 mt-1">
                          Share your digital business card instantly.
                        </p>
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 sm:justify-end z-10">
                      <Button
                        onClick={handleShareNative}
                        className="rounded-xl h-12 text-[13px] font-bold px-5 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-slate-950 w-full sm:w-auto md:w-[180px] shadow-ds-card transition-all duration-150 active:scale-95"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Card
                      </Button>
                      <Button
                        onClick={handleSaveContact}
                        variant="secondary"
                        className="rounded-xl h-12 text-[13px] font-bold px-5 flex items-center justify-center gap-2 border border-oneprofile-700 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white w-full sm:w-auto md:w-[180px] transition-all duration-150 active:scale-95"
                      >
                        <Download className="w-4 h-4" />
                        Download Card
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="border-t border-oneprofile-700 pt-5 sm:pt-6 mt-6 flex flex-col sm:flex-row gap-3 z-10">
                <Button
                  onClick={handleCloseAndOpenCard}
                  className="flex-1 h-12 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-slate-950 transition-all duration-150 active:scale-95"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Digital Card
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 h-12 rounded-xl text-[13px] font-bold flex items-center justify-center border border-oneprofile-700 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-150 active:scale-95"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
