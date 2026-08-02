import { forwardRef, useId, useState } from "react";
import clsx from "clsx";

export const TagsInput = forwardRef(function TagsInput(
  {
    label,
    error,
    hint,
    value = [],
    onChange,
    placeholder = "Add items...",
    className,
    id: customId,
    disabled,
    ...props
  },
  ref,
) {
  const defaultId = useId();
  const tagsId = customId || defaultId;
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim().replace(/^,|,$/g, "");
      if (newTag && !value.includes(newTag)) {
        onChange?.([...value, newTag]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange?.(value.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    onChange?.(value.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="w-full space-y-2">
      {label ? (
        <label
          htmlFor={tagsId}
          className="block text-3xs font-semibold uppercase tracking-[0.2em] text-slate-500 select-none cursor-pointer"
        >
          {label}
        </label>
      ) : null}
      <div
        className={clsx(
          "min-h-11 w-full rounded-ds-input border border-white/[0.08] bg-white/[0.02] p-2 text-xs leading-5 text-white transition-all duration-150 ease-ds-out focus-within:border-primary focus-within:bg-white/[0.04] focus-within:ring-2 focus-within:ring-primary/10 hover:border-white/[0.15] flex flex-wrap gap-1.5 items-center",
          error && "border-red-500/50 focus-within:border-red-500/40 focus-within:ring-red-500/10",
          className,
        )}
      >
        {value.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium text-white"
          >
            {tag}
            {!disabled ? (
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label={`Remove ${tag}`}
              >
                &times;
              </button>
            ) : null}
          </span>
        ))}
        <input
          ref={ref}
          id={tagsId}
          type="text"
          disabled={disabled}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent px-1 py-0.5 text-xs text-white placeholder:text-slate-500 focus:outline-none min-w-[120px]"
          {...props}
        />
      </div>
      {error ? (
        <p role="alert" className="text-3xs text-red-400 flex items-center gap-1.5 animate-fadeUp">
          <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </p>
      ) : null}
      {hint && !error ? <p className="text-3xs text-slate-500">{hint}</p> : null}
    </div>
  );
});
