import { forwardRef } from "react";
import clsx from "clsx";

const styles = {
  primary:
    "bg-[#163300] text-[#FAFAF7] hover:bg-[#0E2100] active:scale-[0.98] shadow-sm border border-[#163300] font-semibold tracking-[-0.01em]",
  lime:
    "bg-[#9FE870] text-[#163300] hover:bg-[#8DE05B] active:scale-[0.98] shadow-sm border border-[#9FE870] font-bold tracking-[-0.01em]",
  secondary:
    "bg-white text-[#121814] hover:bg-[#F5F4EE] active:scale-[0.98] border border-black/[0.08] hover:border-black/[0.16] font-semibold shadow-xs tracking-[-0.01em]",
  ghost:
    "bg-transparent text-[#576159] hover:text-[#121814] hover:bg-black/[0.04] active:scale-[0.98] border border-transparent font-medium",
  outline:
    "bg-transparent text-[#163300] hover:bg-[#163300]/[0.04] active:scale-[0.98] border border-[#163300]/30 hover:border-[#163300] font-semibold",
  destructive:
    "bg-red-50/80 text-red-700 hover:bg-red-100 active:scale-[0.98] border border-red-200 font-semibold",
  success:
    "bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100 active:scale-[0.98] border border-emerald-200 font-semibold",
  dark:
    "bg-[#121814] text-[#FAFAF7] hover:bg-black active:scale-[0.98] border border-white/10 font-semibold shadow-sm",
  premium:
    "bg-[#163300] text-[#9FE870] hover:bg-black hover:text-white shadow-sm font-bold border border-[#163300] active:scale-[0.98]",
};

const sizes = {
  sm: "h-9 px-3.5 py-1.5 text-xs rounded-xl gap-2",
  md: "h-11 px-5 py-2.5 text-sm rounded-xl gap-2.5",
  lg: "h-12 px-6 py-3 text-sm sm:text-base rounded-xl gap-3",
  pill: "h-10 px-5 text-xs sm:text-sm rounded-full gap-2",
};

export const Button = forwardRef(function Button(
  {
    className,
    variant = "primary",
    size = "md",
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
        "inline-flex items-center justify-center transition-all duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50 select-none cursor-pointer",
        styles[variant] || styles.primary,
        sizes[size] || sizes.md,
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80 mr-2" />
      ) : null}
      <span className="inline-flex items-center justify-center gap-2.5 truncate leading-none">
        {children}
      </span>
    </button>
  );
});
