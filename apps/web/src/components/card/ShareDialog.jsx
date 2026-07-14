import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import {
  Link2,
  Share,
  MessageSquare,
  Mail,
  Smartphone,
  Linkedin,
  Twitter,
  Send,
  Download,
  Image,
  X,
} from "lucide-react";
import React from "react";

export function ShareDialog({ isOpen, onClose, profile }) {
  const [toastMessage, setToastMessage] = useState("");

  if (!profile) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const name =
    profile.profileType === "professional"
      ? profile.title || "Professional"
      : profile.companyName || "Business";
  const subtitle =
    profile.profileType === "professional"
      ? profile.designation || ""
      : profile.tagline || "";
  const cardUrl = `${window.location.origin}/p/${profile.slug}/card`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      showToast("✅ Profile link copied successfully.");
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
    showToast("✅ QR Code downloaded successfully.");
  };

  const handleDownloadVcard = () => {
    const link = document.createElement("a");
    link.href = `/api/v1/profiles/public/${profile.slug}/vcard`;
    link.download = `${name.replace(/[^a-zA-Z0-9]+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✅ Contact downloaded successfully.");
  };

  const shareText = encodeURIComponent(
    `Check out my digital business card: ${name} - ${subtitle}`,
  );
  const shareUrl = encodeURIComponent(cardUrl);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${shareText}%20${shareUrl}`,
    email: `mailto:?subject=${encodeURIComponent(name)}&body=${shareText}%20${shareUrl}`,
    sms: `sms:?body=${shareText}%20${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
    telegram: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`,
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: subtitle,
          url: cardUrl,
        });
        showToast("✅ Shared successfully.");
      } catch (err) {
        // Ignored
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          {/* Glass Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-[#000000]/60 backdrop-blur-md"
          />

          {/* Modal / Bottom Sheet container */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            {/* Desktop Modal / Mobile Bottom Sheet */}
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="w-full sm:max-w-lg bg-white border-t sm:border border-[#E5E7EB] sm:rounded-[24px] p-6 shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] sm:max-h-auto overflow-y-auto rounded-t-[28px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div>
                  <h3 className="font-display text-sm font-extrabold tracking-tight text-[#111827]">
                    Share & Save Details
                  </h3>
                  <p className="text-3xs text-[#6B7280] font-bold uppercase tracking-wider mt-0.5">
                    Connect instantly with one click
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close Share Dialog"
                  className="h-8 w-8 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] transition-all active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Toast message display */}
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-3xs font-bold rounded-2xl mb-4 text-center"
                  >
                    {toastMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Grid of sharing networks */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-4xs font-bold uppercase tracking-widest text-[#6B7280] block">
                    Sharing Actions
                  </span>
                  <div className="grid grid-cols-4 gap-3.5">
                    {/* Copy Link */}
                    <button
                      onClick={handleCopyLink}
                      aria-label="Copy digital card URL link to clipboard"
                      className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] transition-all text-center select-none active:scale-95 group"
                    >
                      <Link2 className="w-5 h-5 text-[#2563EB] group-hover:scale-105 transition-transform" />
                      <span className="text-xs font-semibold  tracking-wider mt-2 text-[#6B7280]">
                        Copy Link
                      </span>
                    </button>

                    {/* Native Share */}
                    <button
                      onClick={handleShareNative}
                      aria-label="Share digital card using native device share sheet"
                      className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] transition-all text-center select-none active:scale-95 group"
                    >
                      <Share className="w-5 h-5 text-[#2563EB] group-hover:scale-105 transition-transform" />
                      <span className="text-xs font-semibold tracking-wider mt-2 text-[#6B7280]">
                        Share Sheet
                      </span>
                    </button>

                    {/* WhatsApp */}
                    <a
                      href={shareLinks.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Share digital card link via WhatsApp"
                      className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] transition-all text-center group"
                    >
                      <MessageSquare className="w-5 h-5 text-emerald-600 group-hover:scale-105 transition-transform" />
                      <span className="text-xs font-semibold  tracking-wider mt-2 text-[#6B7280]">
                        WhatsApp
                      </span>
                    </a>

                    {/* Email */}
                    <a
                      href={shareLinks.email}
                      aria-label="Share digital card link via Email"
                      className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-[#E5E7EB] transition-all text-center group"
                    >
                      <Mail className="w-5 h-5 text-[#2563EB] group-hover:scale-105 transition-transform" />
                      <span className="text-xs font-semibold  tracking-wider mt-2 text-[#6B7280]">
                        Email
                      </span>
                    </a>
                  </div>
                </div>

                {/* Direct File Downloads */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-4xs font-bold uppercase tracking-widest text-[#6B7280] block">
                    Direct Downloads
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownloadVcard}
                      aria-label="Download vCard contact file"
                      className="flex-1 h-11 bg-slate-50 border border-[#E5E7EB] hover:bg-slate-100 text-[#111827] rounded-2xl text-3xs font-bold flex items-center justify-center gap-2 select-none active:scale-95 transition-all"
                    >
                      <Download className="w-4 h-4 text-[#6B7280]" /> Save vCard
                      (.vcf)
                    </button>
                    <button
                      onClick={handleDownloadQr}
                      disabled={!profile.qrCodeUrl}
                      aria-label="Download QR Code image file"
                      className="flex-1 h-11 bg-slate-50 border border-[#E5E7EB] hover:bg-slate-100 text-[#111827] rounded-2xl text-3xs font-bold flex items-center justify-center gap-2 select-none active:scale-95 transition-all"
                    >
                      <Image className="w-4 h-4 text-[#6B7280]" /> Download QR
                      Code
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
