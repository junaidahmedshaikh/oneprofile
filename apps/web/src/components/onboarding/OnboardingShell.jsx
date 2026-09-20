import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { OneProfileLogo } from "../ui/OneProfileLogo";
import { AmbientBackground } from "../ui/AmbientBackground";

export function OnboardingShell({ children }) {
  return (
    <div className="relative min-h-screen bg-[#FAFAF7] text-[#121814] flex flex-col justify-between overflow-x-hidden">
      {/* Ambient background with quiet paper depth */}
      <AmbientBackground />

      {/* Header bar */}
      <header className="relative z-20 border-b border-black/[0.08] bg-[#FAFAF7]/85 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <OneProfileLogo size="sm" variant="primary" showDomain={true} />
            <span className="hidden sm:inline-block h-3.5 w-px bg-black/[0.12] mx-1" />
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-wider uppercase text-[#576159]">
              Identity Studio
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#F6F5EE] border border-black/[0.08] px-3.5 py-1.5 rounded-full shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#163300] animate-pulse" />
            <span className="text-[11px] font-medium tracking-wide text-[#121814]">
              Autosave Active
            </span>
          </div>
        </div>
      </header>

      {/* Onboarding content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 lg:px-8 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-black/[0.08] bg-white/95 backdrop-blur-sm p-6 sm:p-10 shadow-[0_20px_50px_rgba(18,24,20,0.03)] relative overflow-hidden"
        >
          {/* Subtle top interior hairline */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#9FE870]/40 to-transparent pointer-events-none" />
          <div className="relative z-10">{children || <Outlet />}</div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mx-auto w-full max-w-7xl px-6 py-6 text-center">
        <p className="text-[11px] font-mono uppercase tracking-wider text-[#879289]">
          © {new Date().getFullYear()} OneProfile Technologies. All progress is securely encrypted and synced.
        </p>
      </footer>
    </div>
  );
}
