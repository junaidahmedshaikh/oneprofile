import { motion } from "framer-motion";
import { Outlet, Link } from "react-router-dom";
import clsx from "clsx";

export function AuthShell({ eyebrow, title, subtitle, children, sideContent }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-oneprofile-950 text-oneprofile-500 flex flex-col justify-between transition-colors duration-300">
      {/* Background ambient glows */}
      <div className="glow-blob w-[500px] h-[500px] bg-primary/10 top-[-10%] left-[-10%]" />
      <div className="glow-blob w-[600px] h-[600px] bg-secondary/5 bottom-[-20%] right-[-10%] delay-3000" />
      <div className="glow-blob w-[400px] h-[400px] bg-purple-500/5 top-[30%] right-[20%] delay-5000" />

      {/* Header bar */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-6 flex items-center justify-between">
        <Link to="/login" className="flex items-center gap-2.5 group">
          <img
            src="oneprofile_vertical_logo.png"
            alt="OneProfile Logo"
            className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
          />
        </Link>
        <span className="text-xs font-bold uppercase tracking-widest text-oneprofile-600 select-none">
          v1.0.0
        </span>
      </header>

      {/* Main split grid */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        {/* Left Side: Presentation */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col justify-center h-full max-w-xl"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-slate-400/20 text-3xs font-bold uppercase tracking-wider text-primary">
              <span className="h-2 w-2 rounded-full bg-slate-600 animate-pulse" />
              {eyebrow || "Digital Identity"}
            </span>
            <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-slate-300 dark:text-white sm:text-2xl lg:text-4xl leading-[1.1]">
              {title}
            </h1>
            <p className="mt-6 text-xs leading-relaxed text-oneprofile-600 font-semibold">
              {subtitle}
            </p>
          </div>

          <div className="mt-12 hidden lg:block">
            {sideContent || (
              <div className="relative p-1 bg-oneprofile-100 border border-oneprofile-700 rounded-ds-card overflow-hidden shadow-ds-card backdrop-blur-xl">
                {/* Simulated Premium profile card */}
                <div className="relative p-6 rounded-2xl overflow-hidden bg-oneprofile-900/40">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Card head */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-primary to-cyan-400 p-0.5 shadow-lg">
                        <div className="h-full w-full rounded-md border border-oneprofile-700 bg-oneprofile-900/40 flex items-center justify-center text-xs font-bold text-primary">
                          OP
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-300 dark:text-white">
                          OneProfile Premium
                        </div>
                        <div className="text-3xs text-oneprofile-600 font-semibold">
                          oneprofile.id/sarah
                        </div>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-4xs font-bold uppercase tracking-wider text-emerald-400">
                      Verified
                    </span>
                  </div>

                  {/* Body elements representing different modules */}
                  <div className="mt-6 space-y-3">
                    <div className="h-px bg-oneprofile-700" />
                    <div className="flex items-center justify-between text-xs text-oneprofile-600 py-1">
                      <span>Digital Business Card</span>
                      <span className="text-slate-800 dark:text-slate-300 font-bold">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-oneprofile-600 py-1">
                      <span>Mini Portfolio Website</span>
                      <span className="text-slate-800 dark:text-slate-300 font-bold">
                        Published
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-oneprofile-600 py-1">
                      <span>Booking Calendar</span>
                      <span className="text-primary font-bold">Active</span>
                    </div>
                  </div>

                  {/* Visual mockup block */}
                  <div className="mt-6 bg-oneprofile-950/60 rounded-2xl border border-oneprofile-700 p-4 flex gap-4 items-center">
                    <div className="h-10 w-10 shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-lg">
                      ✨
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-20 bg-slate-400/20 rounded-full" />
                      <div className="h-1.5 w-32 bg-slate-400/10 rounded-full mt-2" />
                    </div>
                    <div className="h-5 w-14 bg-slate-300/10 border border-slate-400/20 rounded-lg" />
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
          transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
          className="w-full flex items-center justify-center"
        >
          <div className="w-full max-w-[460px] bg-oneprofile-100 rounded-ds-modal border border-oneprofile-700 p-6 sm:p-9 shadow-ds-modal backdrop-blur-xl relative overflow-hidden">
            {/* Top glowing line decoration */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="relative z-10">{children || <Outlet />}</div>
          </div>
        </motion.section>
      </div>

      {/* Footer bar */}
      <footer className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-6 text-center lg:text-left">
        <p className="text-xs text-oneprofile-600  tracking-wider">
          © {new Date().getFullYear()} OneProfile Technologies Inc. All rights
          reserved. Secure JWT encryption active.
        </p>
      </footer>
    </div>
  );
}
