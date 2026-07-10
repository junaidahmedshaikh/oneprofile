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
    <nav aria-label="Onboarding steps" className="overflow-x-auto py-1">
      <ol className="flex min-w-max items-center gap-1.5 md:gap-3">
        {steps.map((step, index) => {
          const isActive = step.id === activeStep;
          const isComplete = completedSteps.includes(step.id);
          return (
            <li key={step.id} className="flex items-center gap-1.5 md:gap-3">
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                className={clsx(
                  'flex items-center gap-2 rounded-xl px-3 py-1.5 text-left transition-all duration-200 border select-none active:scale-[0.98]',
                  isActive && 'border-brand-500/20 bg-brand-500/5 shadow-[0_2px_8px_rgba(79,140,255,0.04)]',
                  !isActive && isComplete && 'border-emerald-500/15 bg-emerald-500/[0.02]',
                  !isActive && !isComplete && 'border-transparent bg-transparent opacity-50 hover:opacity-100'
                )}
              >
                <span className={clsx(
                  'flex h-4.5 w-4.5 items-center justify-center rounded-full text-4xs font-black transition-colors',
                  isComplete ? 'bg-emerald-400 text-slate-950' : isActive ? 'bg-brand-500 text-white' : 'bg-white/10 text-slate-400'
                )}>
                  {isComplete ? (
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : index + 1}
                </span>
                <span className={clsx(
                  'text-3xs font-bold tracking-wide uppercase',
                  isActive ? 'text-white' : 'text-slate-400'
                )}>{step.label}</span>
              </button>
              {index < steps.length - 1 ? (
                <div className={clsx(
                  'hidden h-px w-4 md:block transition-colors',
                  isComplete ? 'bg-emerald-500/20' : 'bg-white/[0.04]'
                )} />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
