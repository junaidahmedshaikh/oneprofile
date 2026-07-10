import { forwardRef } from "react";
import clsx from "clsx";

export const Input = forwardRef(function Input(
  { label, error, hint, className, type = "text", ...props },
  ref,
) {
  return (
    <div className="w-full space-y-2">
      {label ? (
        <label className="block text-2xs font-semibold uppercase tracking-[0.2em] text-slate-400 select-none">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={clsx(
            "w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs leading-5 text-white placeholder:text-slate-500 transition-all duration-200 focus:border-brand-500/40 focus:bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-brand-500/10 hover:border-white/[0.15]",
            error && "border-red-500/50 focus:border-red-500/40 focus:ring-red-500/10",
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-2xs text-red-400 flex items-center gap-1.5 animate-fadeUp">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </p>
      ) : null}
      {hint && !error ? <p className="text-2xs text-slate-400">{hint}</p> : null}
    </div>
  );
});
