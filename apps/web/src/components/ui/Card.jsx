import clsx from "clsx";

export function Card({ className, children, hoverEffect = false, ...props }) {
  return (
    <div
      className={clsx(
        "relative rounded-ds-card border border-oneprofile-700 bg-oneprofile-900/40 shadow-ds-card backdrop-blur-xl transition-all duration-150 ease-ds-out p-6 sm:p-7.5 lg:p-9",
        hoverEffect &&
          "hover:-translate-y-0.5 hover:border-white/10 hover:shadow-ds-hover",
        className,
      )}
      {...props}
    >
      {/* Structural ambient light reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
