import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import clsx from "clsx";

export function QRCodeModal({ isOpen, onClose, profile, st }) {
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
            className="fixed inset-0 z-40 bg-[#000000]/65 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-sm bg-[#0e0f16]/95 border border-white/[0.08] rounded-3xl p-6 shadow-2xl pointer-events-auto flex flex-col items-center text-center space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between w-full border-b border-white/[0.05] pb-3">
                <span className="text-xs font-bold text-white font-display">Scan QR Code</span>
                <button
                  onClick={onClose}
                  className="h-7 w-7 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center border border-white/[0.05] text-slate-400 hover:text-white transition-all active:scale-95"
                >
                  ✕
                </button>
              </div>

              {/* QR Image Card wrapper */}
              <div className="bg-white p-5 rounded-3xl inline-block border border-slate-200 shadow-xl my-2">
                {profile.qrCodeUrl ? (
                  <img src={profile.qrCodeUrl} alt="QR Code" className="w-52 h-52 object-contain select-none" />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-slate-500 text-xs font-bold bg-slate-900 rounded-xl">
                    Generating QR...
                  </div>
                )}
              </div>

              <p className="text-3xs text-slate-400 leading-normal max-w-xs">
                Scan this code with a mobile camera to instantly view and save {name}'s profile card.
              </p>

              {/* Control buttons */}
              <div className="flex gap-3 w-full">
                <Button
                  variant="secondary"
                  className="flex-1 text-3xs font-bold rounded-xl h-10 border-white/[0.08]"
                  onClick={handleDownloadQr}
                  disabled={!profile.qrCodeUrl}
                >
                  Download PNG
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 text-3xs font-bold rounded-xl h-10 border-white/[0.08]"
                  onClick={handlePrint}
                >
                  Print QR Code
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
