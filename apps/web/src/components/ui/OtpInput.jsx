import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export function OtpInput({ length = 6, value = "", onChange, error }) {
  const [cells, setCells] = useState(
    Array.from({ length }, (_, i) => value[i] || ""),
  );
  const refs = useRef([]);

  useEffect(() => {
    setCells(Array.from({ length }, (_, i) => value[i] || ""));
  }, [length, value]);

  useEffect(() => {
    // Auto focus first input on mount
    refs.current[0]?.focus();
  }, []);

  const updateCell = (index, next) => {
    const copy = [...cells];
    copy[index] = next;
    setCells(copy);
    onChange?.(copy.join(""));
    if (next && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .trim();
    if (pastedData) {
      const pasteValues = pastedData.slice(0, length).split("");
      const nextCells = Array.from({ length }, (_, i) => pasteValues[i] || "");
      setCells(nextCells);
      onChange?.(nextCells.join(""));
      const focusIndex = Math.min(pastedData.length, length - 1);
      refs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2.5 sm:gap-3.5">
        {cells.map((cell, index) => {
          return (
            <input
              key={index}
              ref={(node) => {
                refs.current[index] = node;
              }}
              value={cell}
              onPaste={handlePaste}
              onChange={(event) =>
                updateCell(
                  index,
                  event.target.value.replace(/[^0-9]/g, "").slice(-1),
                )
              }
              onKeyDown={(event) => {
                if (event.key === "Backspace") {
                  event.preventDefault();
                  const copy = [...cells];
                  if (cell) {
                    copy[index] = "";
                    setCells(copy);
                    onChange?.(copy.join(""));
                  } else if (index > 0) {
                    copy[index - 1] = "";
                    setCells(copy);
                    onChange?.(copy.join(""));
                    refs.current[index - 1]?.focus();
                  }
                } else if (event.key === "ArrowLeft" && index > 0) {
                  refs.current[index - 1]?.focus();
                } else if (event.key === "ArrowRight" && index < length - 1) {
                  refs.current[index + 1]?.focus();
                }
              }}
              inputMode="numeric"
              maxLength={1}
              className={clsx(
                "h-12 w-12 sm:h-14 sm:w-14 rounded-xl border border-oneprofile-700 bg-oneprofile-900 text-center text-lg font-bold text-slate-300 dark:text-white transition-all duration-150 focus:border-primary focus:bg-white/[0.04] focus:outline-none focus:ring-4 focus:ring-primary/10 hover:border-white/[0.15]",
                cell && "border-primary/30 bg-primary/[0.02]",
                error &&
                  "border-red-500/50 focus:border-red-500/40 focus:ring-red-500/10",
              )}
              aria-label={`OTP digit ${index + 1}`}
            />
          );
        })}
      </div>
      {error ? (
        <p className="text-xs text-red-400 flex items-center gap-1.5 animate-fadeUp">
          <svg
            className="h-3.5 w-3.5"
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
          {error}
        </p>
      ) : null}
    </div>
  );
}
