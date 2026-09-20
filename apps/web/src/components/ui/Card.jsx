import clsx from "clsx";

export function Card({
  className,
  children,
  variant = "default",
  hoverEffect = false,
  ...props
}) {
  const variants = {
    default:
      "bg-white border border-black/[0.08] text-[#121814] shadow-[0_2px_8px_-2px_rgba(18,24,20,0.03)]",
    paper:
      "bg-[#F6F5EE] border border-black/[0.06] text-[#121814]",
    subtle:
      "bg-[#FAFAF7] border border-black/[0.06] text-[#121814]",
    dark: "bg-[#163300] border border-[#163300] text-[#FAFAF7] shadow-md",
    glass:
      "bg-white/90 backdrop-blur-md border border-black/[0.08] shadow-sm",
  };

  return (
    <div
      className={clsx(
        "relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 transition-all duration-200",
        variants[variant] || variants.default,
        hoverEffect &&
          "hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(18,24,20,0.06)] hover:border-black/[0.14]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={clsx("mb-5 space-y-1.5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={clsx(
        "font-display text-xl font-bold tracking-tight text-[#121814]",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={clsx(
        "text-sm text-[#576159] leading-relaxed",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={clsx("relative", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={clsx(
        "mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

