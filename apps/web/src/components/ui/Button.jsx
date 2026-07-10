import { forwardRef } from "react";
import clsx from "clsx";

const styles = {
  primary: "bg-primary text-slate-950 hover:bg-primary-hover active:bg-primary-active shadow-ds-card hover:shadow-ds-hover border border-transparent font-extrabold",
  secondary: "bg-[#ffffff]/[0.02] text-slate-100 hover:bg-[#ffffff]/[0.06] border border-white/[0.08] hover:border-white/[0.15] backdrop-blur-md active:scale-[0.98] font-semibold",
  ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-white/[0.03] active:scale-[0.98]",
  outline: "bg-transparent text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/[0.15] active:scale-[0.98]",
  destructive: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 active:scale-[0.98]",
  success: "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 active:scale-[0.98]",
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
        "inline-flex min-h-11 items-center justify-center gap-2.5 rounded-ds-btn px-5 py-2.5 text-xs font-bold transition-all duration-150 ease-ds-out disabled:cursor-not-allowed disabled:opacity-40 select-none active:scale-[0.98]",
        styles[variant],
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/20 border-t-slate-950" />
      ) : null}
      <span className="truncate">{children}</span>
    </button>
  );
});
