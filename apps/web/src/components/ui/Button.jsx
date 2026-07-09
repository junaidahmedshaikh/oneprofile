import { forwardRef } from "react";
import clsx from "clsx";

const styles = {
  primary: "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-400 hover:to-brand-500 shadow-[0_4px_20px_rgba(79,140,255,0.25)] hover:shadow-[0_6px_24px_rgba(79,140,255,0.4)] border border-brand-500/20 active:scale-[0.98]",
  secondary: "bg-white/[0.03] text-slate-100 hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.15] backdrop-blur-md active:scale-[0.98]",
  ghost: "bg-transparent text-slate-300 hover:text-white hover:bg-white/[0.04] active:scale-[0.98]",
  destructive: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 active:scale-[0.98]",
  premium: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(139,92,246,0.25)] border border-violet-500/20 active:scale-[0.98]"
};

export const Button = forwardRef(function Button(
  {
    className,
    variant = "primary",
    loading = false,
    children,
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={clsx(
        "inline-flex min-h-11 items-center justify-center gap-2.5 rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40 select-none",
        styles[variant],
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      ) : null}
      <span className="truncate">{children}</span>
    </button>
  );
});
