import { forwardRef, useId } from "react";
import clsx from "clsx";

export const Checkbox = forwardRef(function Checkbox(
  {
    label,
    description,
    error,
    className,
    id: customId,
    disabled,
    ...props
  },
  ref,
) {
  const defaultId = useId();
  const checkboxId = customId || defaultId;
  const errorId = `${checkboxId}-error`;
  const descId = `${checkboxId}-desc`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={checkboxId}
        className={clsx(
          "inline-flex items-start gap-3 cursor-pointer select-none",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <div className="relative flex items-center pt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              [error ? errorId : null, description ? descId : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className="peer h-4 w-4 shrink-0 rounded border border-white/20 bg-white/[0.04] text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-white/30 checked:border-primary checked:bg-primary disabled:cursor-not-allowed"
            {...props}
          />
        </div>
        {label || description ? (
          <div className="flex flex-col">
            {label ? (
              <span className="text-xs font-semibold text-white leading-tight">
                {label}
              </span>
            ) : null}
            {description ? (
              <span id={descId} className="text-3xs text-slate-400 mt-0.5">
                {description}
              </span>
            ) : null}
          </div>
        ) : null}
      </label>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-3xs text-red-400 flex items-center gap-1.5 animate-fadeUp"
        >
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
    </div>
  );
});
