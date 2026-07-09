import clsx from "clsx";

export function ThemeCard({ theme, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        "rounded-3xl border p-5 text-left transition-all duration-300 ease-out select-none relative overflow-hidden group",
        selected
          ? "border-brand-500/40 bg-brand-500/[0.03] shadow-[0_8px_30px_rgba(79,140,255,0.06)]"
          : "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.12] hover:-translate-y-0.5",
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-bold text-white tracking-tight">{theme.name}</div>
          <div className="mt-0.5 text-xs text-slate-400 leading-relaxed">{theme.description}</div>
        </div>
        <div className="flex gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/[0.05]">
          <span
            className="h-4 w-4 rounded-full border border-white/10"
            style={{ backgroundColor: theme.primary }}
          />
          <span
            className="h-4 w-4 rounded-full border border-white/10"
            style={{ backgroundColor: theme.accent }}
          />
        </div>
      </div>
      
      {/* Visual theme mock mockup inside card */}
      <div className="mt-4 rounded-2xl border border-white/[0.05] bg-black/40 p-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-xl pointer-events-none opacity-20" style={{ backgroundColor: theme.primary }} />
        
        <div className="text-3xs uppercase tracking-[0.25em] text-slate-500 font-semibold">
          Preview
        </div>
        
        <div className="mt-2 text-md font-bold tracking-tight text-white flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.primary }} />
          oneprofile.id
        </div>
        
        <div className="mt-1.5 flex gap-1.5">
          <div className="h-4 px-2 rounded-md bg-white/[0.04] border border-white/[0.06] text-3xs font-semibold flex items-center text-slate-300">
            Portfolio
          </div>
          <div 
            className="h-4 px-2 rounded-md text-3xs font-bold flex items-center shadow-sm" 
            style={{ backgroundColor: theme.primary, color: theme.mode === 'light' ? '#090a0f' : '#ffffff' }}
          >
            Connect
          </div>
        </div>
      </div>
    </button>
  );
}
