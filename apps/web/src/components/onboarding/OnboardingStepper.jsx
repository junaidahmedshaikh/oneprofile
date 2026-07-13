import clsx from 'clsx';

export function OnboardingStepper({ activeStep, completedSteps = [], onStepClick, profileType = 'business' }) {
  const steps = [
    { id: 'industry', label: 'Profile Type' },
    { id: 'category', label: profileType === 'professional' ? 'Category' : 'Business Type' },
    ...(profileType === 'professional' ? [] : [{ id: 'company', label: 'Industry' }]),
    { id: 'logo', label: profileType === 'professional' ? 'Details & Photo' : 'Details & Logo' },
    { id: 'content', label: profileType === 'professional' ? 'AI Bio & Contact' : 'AI Copy & Contact' }
  ];

  return (
    <nav aria-label="Onboarding steps" className="w-full select-none">
      <ol className="flex flex-wrap sm:flex-nowrap items-stretch justify-between gap-3 w-full">
        {steps.map((step, index) => {
          const isActive = step.id === activeStep;
          const isComplete = completedSteps.includes(step.id);
          return (
            <li key={step.id} className="flex-1 min-w-[120px] flex">
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                className={clsx(
                  'flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-left transition-all duration-200 border w-full justify-center sm:justify-start active:scale-[0.98]',
                  isActive && 'border-brand-500/30 bg-brand-500/10 shadow-[0_2px_12px_rgba(37,99,235,0.08)]',
                  !isActive && isComplete && 'border-emerald-500/20 bg-emerald-500/[0.03]',
                  !isActive && !isComplete && 'border-white/[0.04] bg-white/[0.01] opacity-35 hover:opacity-85'
                )}
              >
                <span className={clsx(
                  'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-4xs font-black transition-colors',
                  isComplete ? 'bg-emerald-500 text-slate-950' : isActive ? 'bg-brand-500 text-white' : 'bg-white/10 text-slate-400'
                )}>
                  {isComplete ? (
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : index + 1}
                </span>
                <span className={clsx(
                  'text-3xs font-extrabold tracking-wider uppercase truncate',
                  isActive ? 'text-white' : isComplete ? 'text-emerald-400' : 'text-slate-400'
                )}>{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
