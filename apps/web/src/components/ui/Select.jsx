import { forwardRef, useId } from "react";
import clsx from "clsx";

export const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    className,
    id: customId,
    required,
    disabled,
    options = [],
    children,
    ...props
  },
  ref,
) {
  const defaultId = useId();
  const selectId = customId || defaultId;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  const describedBy = [
    error ? errorId : null,
    hint && !error ? hintId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="w-full space-y-2">
      {label ? (
        <label
          htmlFor={selectId}
          className="block text-3xs font-semibold uppercase tracking-[0.2em] text-slate-500 select-none cursor-pointer"
        >
          {label}
          {required ? <span className="ml-1 text-red-400">*</span> : null}
        </label>
      ) : null}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy || undefined}
          className={clsx(
            "w-full rounded-ds-input border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-xs leading-5 text-white transition-all duration-150 ease-ds-out focus:border-primary focus:bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-primary/10 hover:border-white/[0.15] disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-9 cursor-pointer",
            error && "border-red-500/50 focus:border-red-500/40 focus:ring-red-500/10",
            className,
          )}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option
                  key={typeof opt === "object" ? opt.value : opt}
                  value={typeof opt === "object" ? opt.value : opt}
                  className="bg-slate-900 text-white"
                >
                  {typeof opt === "object" ? opt.label : opt}
                </option>
              ))
            : children}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
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
      {hint && !error ? (
        <p id={hintId} className="text-3xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
