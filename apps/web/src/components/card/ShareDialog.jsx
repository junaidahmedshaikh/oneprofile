import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";

export function ShareDialog({ isOpen, onClose, profile, st }) {
  const [toastMessage, setToastMessage] = useState("");

  if (!profile) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const name = profile.profileType === "professional" ? (profile.title || "Professional") : (profile.companyName || "Business");
  const subtitle = profile.profileType === "professional" ? (profile.designation || "") : (profile.tagline || "");
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

  const shareText = encodeURIComponent(`Check out my digital business card: ${name} - ${subtitle}`);
  const shareUrl = encodeURIComponent(cardUrl);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${shareText}%20${shareUrl}`,
    email: `mailto:?subject=${encodeURIComponent(name)}&body=${shareText}%20${shareUrl}`,
    sms: `sms:?body=${shareText}%20${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
    telegram: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: subtitle,
          url: cardUrl
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
              className={clsx(
                "w-full sm:max-w-md bg-[#0e0f16]/95 border-t sm:border border-white/[0.08] sm:rounded-3xl p-6 shadow-2xl pointer-events-auto flex flex-col max-h-[90vh] sm:max-h-auto overflow-y-auto rounded-t-[28px]",
                isLight && "bg-white border-slate-200"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 mb-5">
                <div>
                  <h3 className={clsx("font-display text-sm font-extrabold tracking-tight", isLight ? "text-slate-800" : "text-white")}>
                    Share & Save Details
                  </h3>
                  <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    Connect instantly with one click
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center border border-white/[0.05] text-slate-400 hover:text-white transition-all active:scale-95"
                >
                  ✕
                </button>
              </div>

              {/* Toast message display */}
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-3xs font-bold rounded-2xl mb-4 text-center"
                  >
                    {toastMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Grid of sharing networks */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="text-4xs font-bold uppercase tracking-widest text-slate-500 block">Sharing Actions</span>
                  <div className="grid grid-cols-4 gap-3.5">
                    {/* Copy Link */}
                    <button onClick={handleCopyLink} className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.03] hover:border-white/[0.08] transition-all text-center select-none active:scale-95 group">
                      <span className="text-xl group-hover:scale-110 transition-transform">🔗</span>
                      <span className="text-5xs font-bold uppercase tracking-wider mt-2 text-slate-400">Copy Link</span>
                    </button>

                    {/* Native Share */}
                    <button onClick={handleShareNative} className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.03] hover:border-white/[0.08] transition-all text-center select-none active:scale-95 group">
                      <span className="text-xl group-hover:scale-110 transition-transform">📤</span>
                      <span className="text-5xs font-bold uppercase tracking-wider mt-2 text-slate-400">Share Sheet</span>
                    </button>

                    {/* WhatsApp */}
                    <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer" className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.01] hover:bg-[#25D366]/10 border border-white/[0.03] hover:border-[#25D366]/20 transition-all text-center group">
                      <span className="text-xl group-hover:scale-110 transition-transform">💬</span>
                      <span className="text-5xs font-bold uppercase tracking-wider mt-2 text-slate-400">WhatsApp</span>
                    </a>

                    {/* Email */}
                    <a href={shareLinks.email} className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.01] hover:bg-[#4F8CFF]/10 border border-white/[0.03] hover:border-[#4F8CFF]/20 transition-all text-center group">
                      <span className="text-xl group-hover:scale-110 transition-transform">✉️</span>
                      <span className="text-5xs font-bold uppercase tracking-wider mt-2 text-slate-400">Email</span>
                    </a>

                    {/* SMS */}
                    <a href={shareLinks.sms} className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.01] hover:bg-slate-700/10 border border-white/[0.03] hover:border-slate-500/20 transition-all text-center group">
                      <span className="text-xl group-hover:scale-110 transition-transform">📱</span>
                      <span className="text-5xs font-bold uppercase tracking-wider mt-2 text-slate-400">SMS</span>
                    </a>

                    {/* LinkedIn */}
                    <a href={shareLinks.linkedin} target="_blank" rel="noreferrer" className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.01] hover:bg-[#0077B5]/10 border border-white/[0.03] hover:border-[#0077B5]/20 transition-all text-center group">
                      <span className="text-xl group-hover:scale-110 transition-transform">💼</span>
                      <span className="text-5xs font-bold uppercase tracking-wider mt-2 text-slate-400">LinkedIn</span>
                    </a>

                    {/* Twitter */}
                    <a href={shareLinks.twitter} target="_blank" rel="noreferrer" className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.01] hover:bg-slate-700/10 border border-white/[0.03] hover:border-slate-500/20 transition-all text-center group">
                      <span className="text-xl group-hover:scale-110 transition-transform">🐦</span>
                      <span className="text-5xs font-bold uppercase tracking-wider mt-2 text-slate-400">Twitter</span>
                    </a>

                    {/* Telegram */}
                    <a href={shareLinks.telegram} target="_blank" rel="noreferrer" className="flex flex-col items-center p-3 rounded-2xl bg-white/[0.01] hover:bg-[#0088cc]/10 border border-white/[0.03] hover:border-[#0088cc]/20 transition-all text-center group">
                      <span className="text-xl group-hover:scale-110 transition-transform">✈️</span>
                      <span className="text-5xs font-bold uppercase tracking-wider mt-2 text-slate-400">Telegram</span>
                    </a>
                  </div>
                </div>

                {/* Direct File Downloads */}
                <div className="space-y-2 pt-2 border-t border-white/[0.05]">
                  <span className="text-4xs font-bold uppercase tracking-widest text-slate-500 block">Direct Downloads</span>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDownloadVcard}
                      className="flex-1 h-11 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl text-3xs font-bold flex items-center justify-center gap-2 select-none active:scale-95 transition-all"
                    >
                      📥 Save vCard (.vcf)
                    </button>
                    <button
                      onClick={handleDownloadQr}
                      disabled={!profile.qrCodeUrl}
                      className="flex-1 h-11 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl text-3xs font-bold flex items-center justify-center gap-2 select-none active:scale-95 transition-all"
                    >
                      🖼️ Download QR Code
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
