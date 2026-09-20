import { forwardRef } from "react";
import clsx from "clsx";

export const Textarea = forwardRef(function Textarea(
  { label, error, hint, className, ...props },
  ref,
) {
  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label className="block text-xs font-bold text-slate-700 select-none">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <textarea
          ref={ref}
          className={clsx(
            "min-h-24 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150 focus:border-[#163300] focus:outline-none focus:ring-4 focus:ring-[#9FE870]/25 hover:border-slate-300 resize-y leading-relaxed",
            error && "border-rose-300 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-rose-200",
            className,
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-rose-600 flex items-center gap-1.5 font-medium animate-fadeUp">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </p>
      ) : null}
      {hint && !error ? <p className="text-xs text-slate-500 leading-normal">{hint}</p> : null}
    </div>
  );
});

