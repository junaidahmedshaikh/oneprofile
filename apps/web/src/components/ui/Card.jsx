import clsx from "clsx";

export function Card({ className, children, hoverEffect = false, ...props }) {
  return (
    <div
      className={clsx(
        "relative rounded-[28px] border border-white/[0.05] bg-gradient-to-b from-white/[0.04] to-transparent p-6 shadow-[0_16px_48px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 ease-out sm:p-7 lg:p-8",
        hoverEffect && "hover:-translate-y-1 hover:border-white/[0.1] hover:shadow-[0_20px_50px_rgba(79,140,255,0.1)]",
        className,
      )}
      {...props}
    >
      {/* Decorative top-light reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}
