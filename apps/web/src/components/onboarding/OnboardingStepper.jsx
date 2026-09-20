import clsx from "clsx";
import { Check } from "lucide-react";

export function OnboardingStepper({
  activeStep,
  completedSteps = [],
  onStepClick,
  profileType = "business",
}) {
  const steps = [
    { id: "industry", label: "Profile Type" },
    {
      id: "category",
      label: profileType === "professional" ? "Category" : "Business Type",
    },
    ...(profileType === "professional"
      ? []
      : [{ id: "company", label: "Industry" }]),
    {
      id: "logo",
      label:
        profileType === "professional" ? "Details & Photo" : "Details & Logo",
    },
    {
      id: "content",
      label: profileType === "professional" ? " Contact" : " Contact",
    },
  ];

  return (
    <nav aria-label="Onboarding steps" className="w-full select-none">
      <ol className="flex flex-wrap sm:flex-nowrap items-stretch justify-between gap-2 sm:gap-2.5 w-full">
        {steps.map((step, index) => {
          const isActive = step.id === activeStep;
          const isComplete = completedSteps.includes(step.id);
          return (
            <li key={step.id} className="flex-1 min-w-[120px] flex">
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                className={clsx(
                  "group flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left transition-all duration-200 border w-full justify-center sm:justify-start active:scale-[0.99] cursor-pointer",
                  isActive &&
                    "border-[#163300] bg-[#163300] text-white shadow-sm ring-1 ring-[#163300]",
                  !isActive &&
                    isComplete &&
                    "border-black/[0.08] bg-[#F6F5EE] text-[#121814] hover:border-black/[0.15]",
                  !isActive &&
                    !isComplete &&
                    "border-black/[0.06] bg-white/60 text-[#879289] hover:border-black/[0.12] hover:bg-white hover:text-[#121814]",
                )}
              >
                <span
                  className={clsx(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-mono font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#9FE870] text-[#163300] shadow-2xs scale-105 font-bold"
                      : isComplete
                        ? "bg-[#163300] text-[#9FE870]"
                        : "bg-black/[0.04] text-[#879289] group-hover:text-[#121814] group-hover:bg-black/[0.08]",
                  )}
                >
                  {isComplete ? (
                    <Check className="h-3 w-3 stroke-[3]" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={clsx(
                    "text-xs font-semibold tracking-tight truncate transition-colors duration-200",
                    isActive
                      ? "text-white font-bold"
                      : isComplete
                        ? "text-[#121814]"
                        : "text-[#576159] group-hover:text-[#121814]",
                  )}
                >
                  {step.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
