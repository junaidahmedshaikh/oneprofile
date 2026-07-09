import clsx from "clsx";

export function TaskChecklist({ tasks = [] }) {
  if (!tasks.length) return null;

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.01] border border-white/[0.04] select-none"
        >
          <div className={clsx(
            "h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors duration-200",
            task.done 
              ? "bg-brand-500/20 border-brand-400 text-brand-400" 
              : "border-white/10 bg-white/[0.02]"
          )}>
            {task.done ? (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : null}
          </div>
          <span className={clsx(
            "text-xs font-semibold transition-all",
            task.done ? "text-slate-500 line-through" : "text-slate-300"
          )}>
            {task.title}
          </span>
        </div>
      ))}
    </div>
  );
}
