import { motion } from "framer-motion";
import { Outlet, Link } from "react-router-dom";

export function AuthShell({ eyebrow, title, subtitle, children, sideContent }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#090a0f] text-white flex flex-col justify-between">
      {/* Background ambient glows */}
      <div className="glow-blob w-[500px] h-[500px] bg-brand-500/20 top-[-10%] left-[-10%]" />
      <div className="glow-blob w-[600px] h-[600px] bg-emerald-500/10 bottom-[-20%] right-[-10%] delay-3000" />
      <div className="glow-blob w-[400px] h-[400px] bg-purple-500/10 top-[30%] right-[20%] delay-5000" />

      {/* Header bar */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-6 flex items-center justify-between">
        <Link to="/login" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-400 flex items-center justify-center shadow-[0_4px_12px_rgba(79,140,255,0.3)] group-hover:scale-105 transition-transform duration-200">
            <span className="font-display font-black text-slate-950 text-base tracking-tighter">
              1P
            </span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight hover:text-brand-400 transition-colors">
            OneProfile
          </span>
        </Link>
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 select-none">
          v1.0.0
        </span>
      </header>

      {/* Main split grid */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        {/* Left Side: Editorial Presentation */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col justify-center h-full max-w-xl"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-xs font-semibold uppercase tracking-wider text-brand-400">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
              {eyebrow || "Digital Identity"}
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-[1.1]">
              {title}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-slate-400  lg:text-xs">
              {subtitle}
            </p>
          </div>

          <div className="mt-12 hidden lg:block">
            {sideContent || (
              <div className="relative p-1 bg-white/[0.02] border border-white/[0.06] rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-2xl">
                {/* Simulated Premium profile card */}
                <div className="relative bg-gradient-to-br from-white/[0.04] to-transparent p-6 rounded-[28px] overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Card head */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-brand-500 to-cyan-400 p-0.5 shadow-lg">
                        <div className="h-full w-full rounded-[14px] bg-[#12141c] flex items-center justify-center text-xs font-bold text-brand-400">
                          OP
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">
                          OneProfile Premium
                        </div>
                        <div className="text-xs text-slate-400">
                          oneprofile.id/sarah
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 text-2.5 font-bold uppercase tracking-wider text-emerald-400">
                      Verified
                    </span>
                  </div>

                  {/* Body elements representing different modules */}
                  <div className="mt-6 space-y-3">
                    <div className="h-px bg-white/[0.08]" />
                    <div className="flex items-center justify-between text-xs text-slate-400 py-1">
                      <span>Digital Business Card</span>
                      <span className="text-slate-300 font-semibold">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 py-1">
                      <span>Mini Portfolio Website</span>
                      <span className="text-slate-300 font-semibold">
                        Published
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 py-1">
                      <span>CRM & Lead Collector</span>
                      <span className="text-brand-400 font-semibold">
                        Synced
                      </span>
                    </div>
                  </div>

                  {/* Visual mockup block */}
                  <div className="mt-6 bg-[#090a0f]/60 rounded-2xl border border-white/[0.04] p-4 flex gap-4 items-center">
                    <div className="h-10 w-10 shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-lg">
                      ✨
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-20 bg-white/20 rounded-full" />
                      <div className="h-1.5 w-32 bg-white/10 rounded-full mt-2" />
                    </div>
                    <div className="h-5 w-14 bg-brand-500/10 border border-brand-500/20 rounded-lg" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.section>

        {/* Right Side: Form Content Card */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex items-center justify-center"
        >
          <div className="w-full max-w-[460px] bg-gradient-to-b from-white/[0.05] to-transparent rounded-[36px] border border-white/[0.06] p-6 sm:p-9 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            {/* Top glowing line decoration */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
            <div className="relative z-10">{children || <Outlet />}</div>
          </div>
        </motion.section>
      </div>

      {/* Footer bar */}
      <footer className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-6 text-center lg:text-left">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} OneProfile Technologies Inc. All rights
          reserved. Secure JWT encryption active.
        </p>
      </footer>
    </div>
  );
}
