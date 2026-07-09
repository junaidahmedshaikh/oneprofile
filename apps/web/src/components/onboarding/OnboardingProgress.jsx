export function OnboardingProgress({ progress = 0 }) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 select-none">
        <span className="uppercase tracking-wider">Setup Progress</span>
        <span className="font-bold text-white bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/[0.05]">{progress}% Completed</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.04] p-0.5 border border-white/[0.05] overflow-hidden">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(79,140,255,0.4)]" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}
