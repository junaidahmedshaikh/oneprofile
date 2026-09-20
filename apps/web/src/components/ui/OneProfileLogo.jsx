import React from "react";

/**
 * OneProfileLogo Component
 * 
 * Scalable vector brand logo for OneProfile.in.
 * 
 * @param {Object} props
 * @param {"primary" | "secondary" | "icon" | "stacked" | "black" | "white"} [props.variant="primary"]
 * @param {"sm" | "md" | "lg" | "xl"} [props.size="md"]
 * @param {boolean} [props.showDomain=true] Whether to show the '.in' domain tag
 * @param {string} [props.className] Additional CSS classnames
 */
export function OneProfileLogo({
  variant = "primary",
  size = "md",
  showDomain = true,
  casing = "lower",
  className = "",
  ...props
}) {
  const sizeMap = {
    sm: {
      textClass: "text-lg sm:text-xl",
      domainClass: "text-lg sm:text-xl",
      avatarSize: "w-7 h-7 text-xs",
    },
    md: {
      textClass: "text-2xl sm:text-[26px]",
      domainClass: "text-2xl sm:text-[26px]",
      avatarSize: "w-9 h-9 text-sm",
    },
    lg: {
      textClass: "text-3xl sm:text-4xl",
      domainClass: "text-3xl sm:text-4xl",
      avatarSize: "w-11 h-11 text-base",
    },
    xl: {
      textClass: "text-4xl sm:text-5xl",
      domainClass: "text-4xl sm:text-5xl",
      avatarSize: "w-14 h-14 text-xl",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isWhite = variant === "white";
  const isBlack = variant === "black";
  const displayDomain = showDomain && variant !== "secondary";

  // Micro square avatar for when a 1:1 container is explicitly requested (e.g. variant="icon")
  if (variant === "icon") {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl font-parafina font-black select-none ${
          currentSize.avatarSize
        } ${
          isWhite
            ? "bg-white text-[#163300]"
            : isBlack
              ? "bg-black text-white"
              : "bg-[#163300] text-white"
        } ${className}`}
        {...props}
      >
        1
      </div>
    );
  }

  const textColor = isWhite
    ? "text-white"
    : isBlack
      ? "text-black"
      : "text-[#163300]";

  const domainColor = isWhite
    ? "text-[#9FE870]"
    : isBlack
      ? "text-black/60"
      : "text-[#255203]";

  return (
    <div
      className={`inline-flex items-baseline tracking-[-0.04em] select-none ${className}`}
      {...props}
    >
      <span
        className={`font-parafina font-black ${currentSize.textClass} leading-none ${textColor}`}
      >
        {casing === "title" ? (
          <>
            One<span className="font-extrabold">Profile</span>
          </>
        ) : (
          "oneprofile"
        )}
      </span>

      {displayDomain && (
        <span
          className={`font-parafina font-black ${currentSize.domainClass} leading-none ${domainColor}`}
        >
          .in
        </span>
      )}
    </div>
  );
}
