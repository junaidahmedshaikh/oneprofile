import { forwardRef, useId } from "react";
import clsx from "clsx";

export const Switch = forwardRef(function Switch(
  {
    label,
    description,
    checked,
    onChange,
    disabled,
    id: customId,
    className,
    error,
    ...props
  },
  ref,
) {
  const defaultId = useId();
  const switchId = customId || defaultId;

  return (
    <div className={clsx("flex items-center justify-between gap-4", className)}>
      {label || description ? (
        <div className="flex flex-col">
          {label ? (
            <label
              htmlFor={switchId}
              className="text-xs font-bold text-white cursor-pointer select-none"
            >
              {label}
            </label>
          ) : null}
          {description ? (
            <span className="text-3xs text-slate-400">{description}</span>
          ) : null}
        </div>
      ) : null}
      <button
        type="button"
        role="switch"
        ref={ref}
        id={switchId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={clsx(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary" : "bg-white/10",
        )}
        {...props}
      >
        <span
          className={clsx(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
            checked ? "translate-x-5 bg-slate-950" : "translate-x-0 bg-slate-300",
          )}
        />
      </button>
    </div>
  );
});
