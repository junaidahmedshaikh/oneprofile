import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import clsx from "clsx";
import React from "react";

export function QRCodeModal({ isOpen, onClose, profile }) {
  if (!profile) return null;

  const name = profile.profileType === "professional" ? (profile.title || "Professional") : (profile.companyName || "Business");

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
    window.print();
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

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-[24px] p-6 shadow-2xl pointer-events-auto flex flex-col items-center text-center space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between w-full border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-[#111827] font-display">Scan QR Code</span>
                <button
                  onClick={onClose}
                  aria-label="Close QR Code Modal"
                  className="h-7 w-7 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] transition-all active:scale-95"
                >
                  ✕
                </button>
              </div>

              {/* QR Image Card wrapper */}
              <div className="bg-white p-5 rounded-[20px] inline-block border border-[#E5E7EB] shadow-sm my-2">
                {profile.qrCodeUrl ? (
                  <img src={profile.qrCodeUrl} alt="QR Code" className="w-52 h-52 object-contain select-none" />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs font-bold bg-slate-50 rounded-xl">
                    Generating QR...
                  </div>
                )}
              </div>

              <p className="text-3xs text-[#6B7280] leading-normal max-w-xs font-medium">
                Scan this code with a mobile camera to instantly view and save {name}'s profile card.
              </p>

              {/* Control buttons */}
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleDownloadQr}
                  disabled={!profile.qrCodeUrl}
                  aria-label="Download QR Code image"
                  className="flex-1 h-10 rounded-full bg-slate-50 border border-[#E5E7EB] hover:bg-slate-100 text-[#111827] text-3xs font-bold transition-all active:scale-95 disabled:opacity-50"
                >
                  Download PNG
                </button>
                <button
                  onClick={handlePrint}
                  aria-label="Print QR Code"
                  className="flex-1 h-10 rounded-full bg-[#111827] hover:bg-[#1f2937] text-white text-3xs font-bold transition-all active:scale-95"
                >
                  Print QR
                </button>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
