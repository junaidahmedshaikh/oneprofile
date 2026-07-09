import clsx from 'clsx';

const variants = {
  info: 'border-blue-500/20 bg-blue-500/5 text-blue-200',
  success: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200',
  warning: 'border-amber-500/20 bg-amber-500/5 text-amber-200',
  error: 'border-red-500/20 bg-red-500/5 text-red-200'
};

const icons = {
  info: (
    <svg className="h-5 w-5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="h-5 w-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

export function Alert({ variant = 'info', title, children }) {
  return (
    <div className={clsx('flex gap-3 rounded-2xl border p-4.5 text-sm backdrop-blur-md animate-fadeUp', variants[variant])}>
      {icons[variant]}
      <div className="space-y-1">
        {title ? <div className="font-semibold text-white">{title}</div> : null}
        <div className="leading-relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
}
