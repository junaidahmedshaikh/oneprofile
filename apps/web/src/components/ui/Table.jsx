import clsx from "clsx";

export function Table({ className, children, ...props }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-oneprofile-700 bg-oneprofile-900/40 shadow-ds-card">
      <table
        className={clsx("w-full border-collapse text-left text-xs", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ className, children, ...props }) {
  return (
    <thead
      className={clsx(
        "border-b border-white/[0.04] bg-white/[0.01] text-3xs font-bold uppercase tracking-wider text-slate-400 select-none",
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...props }) {
  return (
    <tbody
      className={clsx("divide-y divide-white/[0.02]", className)}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({ className, children, clickable = false, ...props }) {
  return (
    <tr
      className={clsx(
        "transition-colors duration-100 ease-ds-out",
        clickable && "cursor-pointer hover:bg-white/[0.02]",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableCell({ className, children, header = false, ...props }) {
  if (header) {
    return (
      <th
        className={clsx("p-4 font-bold text-slate-400", className)}
        {...props}
      >
        {children}
      </th>
    );
  }
  return (
    <td
      className={clsx(
        "p-4 text-slate-300 font-semibold align-middle",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}
