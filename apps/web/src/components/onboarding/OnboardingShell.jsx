import { motion } from 'framer-motion';
import { Outlet, Link } from 'react-router-dom';

export function OnboardingShell({ children }) {
  return (
    <div className="relative min-h-screen bg-[#090a0f] text-white flex flex-col justify-between overflow-x-hidden">
      {/* Background ambient glows */}
      <div className="glow-blob w-[500px] h-[500px] bg-brand-500/10 top-[-10%] left-[-10%]" />
      <div className="glow-blob w-[600px] h-[600px] bg-cyan-500/5 bottom-[-20%] right-[-10%]" />

      {/* Header bar */}
      <header className="relative z-20 border-b border-white/[0.05] bg-[#090a0f]/65 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8.5 w-8.5 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-400 flex items-center justify-center shadow-[0_4px_12px_rgba(79,140,255,0.25)]">
              <span className="font-display font-black text-slate-950 text-xs tracking-tighter">1P</span>
            </div>
            <span className="font-display font-extrabold text-md tracking-tight">OneProfile</span>
            <span className="hidden sm:inline-block h-4 w-px bg-white/10 mx-2" />
            <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">Onboarding Workspace</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-400">Autosave Active</span>
          </div>
        </div>
      </header>

      {/* Onboarding content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 lg:px-8 flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[36px] border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-9 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Top glowing line decoration */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
          <div className="relative z-10">
            {children || <Outlet />}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mx-auto w-full max-w-7xl px-6 py-6 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} OneProfile Technologies Inc. All progress is securely cached to your account.
        </p>
      </footer>
    </div>
  );
}
