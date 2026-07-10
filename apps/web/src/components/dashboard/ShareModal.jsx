import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "../ui/Button";

export function ShareModal({ isOpen, onClose, profile }) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyNfcSuccess, setCopyNfcSuccess] = useState(false);

  if (!profile) return null;

  const name = profile.profileType === "professional" ? (profile.title || "Professional") : (profile.companyName || "Business");
  const subtitle = profile.profileType === "professional" ? (profile.designation || "") : (profile.tagline || "");
  
  // Construct card URL pointing to the card view page
  const cardUrl = `${window.location.origin}/p/${profile.slug}/card`;
  const publicUrl = profile.publicProfileUrl || `${window.location.origin}/p/${profile.slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Ignored
    }
  };

  const handleCopyNfc = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopyNfcSuccess(true);
      setTimeout(() => setCopyNfcSuccess(false), 2000);
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
    // Open the card page in print mode
    const printWindow = window.open(cardUrl, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
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
      } catch (err) {
        // Cancelled
      }
    } else {
      handleCopyLink();
    }
  };

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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed inset-x-4 top-[10%] bottom-[10%] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:max-w-lg bg-[#12141c] border border-white/[0.06] rounded-3xl p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
          >
            <div className="space-y-6 flex-1">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                <div>
                  <h3 className="font-display text-md font-bold text-white tracking-tight">
                    Share Digital Card
                  </h3>
                  <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    Distribute professional business identifier
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center border border-white/[0.05] text-slate-400 hover:text-white transition-all active:scale-95 select-none"
                >
                  ✕
                </button>
              </div>

              {/* Grid content split: QR Code and Action list */}
              <div className="grid gap-6 sm:grid-cols-[150px_1fr] items-start">
                {/* QR Code Container */}
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white p-3 rounded-2xl border border-white/10 shadow-lg inline-block">
                    {profile.qrCodeUrl ? (
                      <img src={profile.qrCodeUrl} alt="QR Code" className="w-28 h-28 object-contain select-none" />
                    ) : (
                      <div className="w-28 h-28 flex items-center justify-center text-slate-500 text-3xs font-bold bg-slate-900 rounded-xl">
                        Generating...
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <Button
                      variant="secondary"
                      className="text-4xs font-bold rounded-xl h-8 w-full"
                      onClick={handleDownloadQr}
                      disabled={!profile.qrCodeUrl}
                    >
                      Save QR PNG
                    </Button>
                    <Button
                      variant="secondary"
                      className="text-4xs font-bold rounded-xl h-8 w-full"
                      onClick={handlePrint}
                    >
                      Print QR Code
                    </Button>
                  </div>
                </div>

                {/* Sharing links & action icons */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-4xs font-bold uppercase tracking-widest text-slate-500 block">Copy Share URL</span>
                    <div className="p-2.5 bg-white/[0.01] border border-white/[0.04] rounded-xl flex items-center justify-between gap-4">
                      <span className="truncate text-3xs text-slate-400 font-mono select-all">
                        {cardUrl}
                      </span>
                      <button
                        onClick={handleCopyLink}
                        className="text-4xs font-bold uppercase tracking-wider text-brand-400 hover:text-white shrink-0 select-none transition-colors"
                      >
                        {copySuccess ? "Copied" : "Copy Link"}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-4xs font-bold uppercase tracking-widest text-slate-500 block">Instant Sharing</span>
                    <div className="grid grid-cols-4 gap-2">
                      <a href={shareLinks.whatsapp} target="_blank" rel="noreferrer" className="flex flex-col items-center p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.03] transition-colors text-center">
                        <span className="text-md">💬</span>
                        <span className="text-5xs font-bold uppercase tracking-wider mt-1 text-slate-400">WhatsApp</span>
                      </a>
                      <a href={shareLinks.email} className="flex flex-col items-center p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.03] transition-colors text-center">
                        <span className="text-md">✉️</span>
                        <span className="text-5xs font-bold uppercase tracking-wider mt-1 text-slate-400">Email</span>
                      </a>
                      <a href={shareLinks.sms} className="flex flex-col items-center p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.03] transition-colors text-center">
                        <span className="text-md">📱</span>
                        <span className="text-5xs font-bold uppercase tracking-wider mt-1 text-slate-400">SMS</span>
                      </a>
                      <button onClick={handleShareNative} className="flex flex-col items-center p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.03] transition-colors text-center select-none active:scale-95">
                        <span className="text-md">🔗</span>
                        <span className="text-5xs font-bold uppercase tracking-wider mt-1 text-slate-400">Share Sheet</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* NFC programming instructions */}
              <div className="border-t border-white/[0.05] pt-4.5 space-y-2">
                <span className="text-4xs font-bold uppercase tracking-widest text-brand-400 block">NFC Hardware Tag Programming</span>
                <p className="text-4xs text-slate-500 leading-normal">
                  Write this public profile URL to a physical NFC card to instantly tap-and-share with smartphones:
                </p>
                <div className="p-2.5 bg-white/[0.01] border border-white/[0.04] rounded-xl flex items-center justify-between gap-4">
                  <span className="truncate text-3xs text-slate-500 select-all font-mono">
                    {publicUrl}
                  </span>
                  <button
                    onClick={handleCopyNfc}
                    className="text-4xs font-bold uppercase tracking-wider text-slate-400 hover:text-white shrink-0 select-none transition-colors"
                  >
                    {copyNfcSuccess ? "Copied" : "Copy URL"}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-white/[0.05] pt-4 mt-6 flex gap-3">
              <a
                href={cardUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 h-10 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-xl text-3xs font-bold flex items-center justify-center hover:bg-brand-500/20 select-none transition-all"
              >
                👁️ View Digital Card
              </a>
              <Button variant="secondary" className="flex-1 text-3xs" onClick={onClose}>
                Close Panel
              </Button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
