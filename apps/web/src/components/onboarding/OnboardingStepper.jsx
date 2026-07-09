import clsx from 'clsx';

const steps = [
  { id: 'industry', label: 'Industry' },
  { id: 'category', label: 'Category' },
  { id: 'company', label: 'Company' },
  { id: 'logo', label: 'Logo' },
  { id: 'theme', label: 'Theme' },
  { id: 'content', label: 'Content' }
];

export function OnboardingStepper({ activeStep, completedSteps = [], onStepClick }) {
  return (
    <nav aria-label="Onboarding steps" className="overflow-x-auto py-1">
      <ol className="flex min-w-max gap-2.5">
        {steps.map((step, index) => {
          const isActive = step.id === activeStep;
          const isComplete = completedSteps.includes(step.id);
          return (
            <li key={step.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                className={clsx(
                  'flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-left transition-all duration-200 border select-none active:scale-[0.98]',
                  isActive && 'border-brand-500/40 bg-brand-500/10 shadow-[0_4px_16px_rgba(79,140,255,0.06)]',
                  !isActive && isComplete && 'border-emerald-500/25 bg-emerald-500/5',
                  !isActive && !isComplete && 'border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/[0.08]'
                )}
              >
                <span className={clsx(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  isComplete ? 'bg-emerald-400 text-slate-950' : isActive ? 'bg-brand-400 text-slate-950' : 'bg-white/10 text-slate-400'
                )}>
                  {isComplete ? (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : index + 1}
                </span>
                <span className="text-xs font-semibold text-white tracking-wide">{step.label}</span>
              </button>
              {index < steps.length - 1 ? (
                <div className={clsx(
                  'hidden h-px w-6 md:block transition-colors',
                  isComplete ? 'bg-emerald-500/30' : 'bg-white/[0.06]'
                )} />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
