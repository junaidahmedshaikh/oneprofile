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
            className="fixed inset-0 z-40 bg-[#121814]/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl bg-[#FAFAF7] border border-black/[0.1] rounded-2xl shadow-[0_24px_70px_rgba(18,24,20,0.15)] p-6 sm:p-8 relative my-auto max-h-[90vh] overflow-y-auto space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-[#121814] tracking-tight">
                    Share Digital Card
                  </h3>
                  <p className="text-xs text-[#576159] mt-0.5">
                    Instantly share your identity via live link, NFC tap, or vCard file.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg hover:bg-black/[0.05] flex items-center justify-center border border-black/[0.08] text-[#576159] hover:text-[#121814] transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Preview Card */}
              <div className="relative p-5 sm:p-6 rounded-xl overflow-hidden bg-[#121814] text-white flex items-center gap-5 border border-black/[0.12] shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#9FE870]/10 rounded-full blur-2xl pointer-events-none" />
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name}
                    className="w-14 h-14 rounded-xl object-cover border border-white/20 shrink-0 z-10"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-base font-bold font-display text-[#9FE870] shrink-0 select-none z-10">
                    {getInitials(name)}
                  </div>
                )}
                <div className="flex-1 min-w-0 z-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-display text-xl font-bold text-white truncate">
                      {name}
                    </h4>
                    {profile.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.08] border border-white/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#9FE870] select-none shrink-0">
                        <BadgeCheck className="w-3 h-3 text-[#9FE870]" />
                        Verified
                      </span>
                    )}
                  </div>
                  {designation && (
                    <p className="text-xs text-[#879289] truncate mt-0.5">
                      {designation}
                    </p>
                  )}
                  <p className="text-xs text-[#9FE870] truncate mt-1 font-mono">
                    {publicUrl.replace(/^https?:\/\//, "")}
                  </p>
                </div>
              </div>

              {/* Contact Details Grid */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#879289] block">
                  Quick Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-[#F6F5EE] border border-black/[0.06] rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-black/[0.08] flex items-center justify-center text-[#163300] shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#879289] block">
                        Phone
                      </span>
                      <span className="text-xs font-medium text-[#121814] block truncate">
                        {phoneVal}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#F6F5EE] border border-black/[0.06] rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-black/[0.08] flex items-center justify-center text-[#163300] shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#879289] block">
                        Email
                      </span>
                      <span className="text-xs font-medium text-[#121814] block truncate">
                        {emailVal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Actions Section */}
              <div className="p-5 bg-[#F6F5EE] border border-black/[0.08] rounded-xl flex flex-col sm:flex-row items-center gap-5 justify-between">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="bg-white p-2 rounded-xl border border-black/[0.08] shrink-0 shadow-2xs">
                    {profile.qrCodeUrl ? (
                      <img
                        src={profile.qrCodeUrl}
                        alt="QR Code"
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center text-[#879289] text-[10px] font-mono bg-[#FAFAF7] rounded-lg">
                        QR Ready
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#121814] flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-[#163300]" />
                      Scan or Tap Link
                    </h4>
                    <p className="text-xs text-[#576159] mt-0.5">
                      Open with any smartphone camera or NFC card reader.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                  <Button
                    onClick={handleShareNative}
                    variant="primary"
                    size="sm"
                    className="flex-1 sm:flex-none text-xs font-semibold"
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />
                    {copySuccess ? "Copied Link!" : "Share Link"}
                  </Button>
                  <Button
                    onClick={handleSaveContact}
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Save vCard
                  </Button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-black/[0.08] pt-4 flex gap-3">
                <Button
                  onClick={handleCloseAndOpenCard}
                  variant="primary"
                  className="flex-1 text-xs font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Open Live Digital Card
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 text-xs font-semibold"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

