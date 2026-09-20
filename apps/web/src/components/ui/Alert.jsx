import clsx from "clsx";
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

const variants = {
  info: {
    container: "bg-blue-50/80 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800/60 dark:text-blue-200",
    title: "text-blue-950 dark:text-blue-100",
    text: "text-blue-800 dark:text-blue-300",
    icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />,
  },
  success: {
    container: "bg-emerald-50/90 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-200",
    title: "text-emerald-950 dark:text-emerald-100",
    text: "text-emerald-800 dark:text-emerald-300",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
  },
  warning: {
    container: "bg-amber-50/90 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-200",
    title: "text-amber-950 dark:text-amber-100",
    text: "text-amber-800 dark:text-amber-300",
    icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
  },
  error: {
    container: "bg-rose-50/90 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-200",
    title: "text-rose-950 dark:text-rose-100",
    text: "text-rose-800 dark:text-rose-300",
    icon: <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
  },
};

export function Alert({ variant = "info", title, children, className }) {
  const current = variants[variant] || variants.info;

  return (
    <div
      role="alert"
      className={clsx(
        "flex gap-3.5 rounded-2xl border p-4 text-sm transition-all shadow-sm",
        current.container,
        className,
      )}
    >
      {current.icon}
      <div className="space-y-0.5 flex-1 min-w-0">
        {title ? (
          <div className={clsx("font-bold text-sm tracking-tight", current.title)}>
            {title}
          </div>
        ) : null}
        {children ? (
          <div className={clsx("leading-relaxed text-[13px]", current.text)}>
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

