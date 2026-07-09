import clsx from "clsx";

const statusStyles = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  qualified: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  converted: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  archived: "bg-white/5 text-slate-400 border-white/10"
};

export function LeadRow({ lead, onSelect }) {
  return (
    <div 
      onClick={() => onSelect?.(lead)}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 text-sm font-bold text-slate-300">
          {lead.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 space-y-0.5">
          <div className="text-xs font-bold text-white group-hover:text-brand-400 transition-colors truncate">
            {lead.name}
          </div>
          <div className="text-3xs text-slate-400 truncate max-w-[200px]">
            {lead.company || "Individual Customer"} • {lead.email}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
        <span className={clsx("px-2.5 py-0.5 rounded-full border text-3xs font-bold uppercase tracking-wider", statusStyles[lead.status])}>
          {lead.status}
        </span>
        
        <span className="text-3xs text-slate-500 font-bold uppercase tracking-wider">
          {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}
