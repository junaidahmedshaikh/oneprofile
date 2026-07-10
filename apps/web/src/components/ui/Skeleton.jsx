import clsx from "clsx";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-xl bg-white/[0.02] border border-white/[0.04]",
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCircle({ className, size = "h-12 w-12", ...props }) {
  return (
    <Skeleton
      className={clsx("rounded-full shrink-0", size, className)}
      {...props}
    />
  );
}

export function SkeletonText({ className, lines = 1, ...props }) {
  return (
    <div className="space-y-2.5 w-full">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={clsx(
            "h-3.5",
            i === lines - 1 && lines > 1 ? "w-4/5" : "w-full",
            className
          )}
          {...props}
        />
      ))}
    </div>
  );
}
