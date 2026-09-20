import { forwardRef } from "react";
import clsx from "clsx";

export const Input = forwardRef(function Input(
  { label, error, hint, className, type = "text", dark = false, ...props },
  ref,
) {
  return (
    <div className="w-full space-y-1.5 text-left">
      {label ? (
        <label
          className={clsx(
            "block text-xs font-semibold tracking-[-0.01em] select-none",
            dark ? "text-slate-300" : "text-[#2B342D]",
          )}
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          ref={ref}
          type={type}
          className={clsx(
            "w-full rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-150 outline-none shadow-xs font-normal",
            dark
              ? "border-white/10 bg-white/[0.04] text-white placeholder:text-slate-500 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/30 hover:border-white/20"
              : "border-black/[0.1] bg-white text-[#121814] placeholder:text-[#879289] focus:border-[#163300] focus:ring-2 focus:ring-[#163300]/10 hover:border-black/[0.18]",
            error && "border-red-400 focus:border-red-500 focus:ring-red-100",
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-red-600 flex items-center gap-1.5 font-medium animate-fadeUp">
          <svg
            className="h-3.5 w-3.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{error}</span>
        </p>
      ) : null}
      {hint && !error ? (
        <p className="text-xs text-slate-500 font-normal">{hint}</p>
      ) : null}
    </div>
  );
});
