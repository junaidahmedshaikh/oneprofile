import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { OnboardingStepper } from "../components/onboarding/OnboardingStepper";
import { OnboardingProgress } from "../components/onboarding/OnboardingProgress";
import { ThemeCard } from "../components/onboarding/ThemeCard";
import { onboardingApi } from "../lib/onboardingApi";
import {
  hydrateOnboarding,
  setActiveStep,
  setOnboardingError,
  setSaving,
} from "../store/onboardingSlice";
import { setCredentials } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const stepOrder = [
  "industry",
  "category",
  "company",
  "logo",
  "theme",
  "content",
];

const companySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  legalName: z.string().optional().or(z.literal("")),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  tagline: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
});

const contentSchema = z.object({
  headline: z.string().optional().or(z.literal("")),
  summary: z.string().optional().or(z.literal("")),
  ctaLabel: z.string().optional().or(z.literal("")),
});

const themeList = [
  {
    key: "aurora",
    name: "Aurora",
    primary: "#4F8CFF",
    accent: "#22D3EE",
    mode: "dark",
    description: "Clean, luminous, and high-trust.",
  },
  {
    key: "midnight",
    name: "Midnight",
    primary: "#A78BFA",
    accent: "#60A5FA",
    mode: "dark",
    description: "Elegant and deeply minimal.",
  },
  {
    key: "sunrise",
    name: "Sunrise",
    primary: "#F97316",
    accent: "#FACC15",
    mode: "light",
    description: "Warm, bright, and energetic.",
  },
  {
    key: "mono",
    name: "Mono",
    primary: "#E2E8F0",
    accent: "#94A3B8",
    mode: "dark",
    description: "Editorial, restrained, premium.",
  },
];

function normalizeDraft(summary) {
  const draft = summary?.draft || {};
  return {
    industry: draft.industry || { key: "", label: "" },
    businessCategory: draft.businessCategory || { key: "", label: "" },
    companyDetails: draft.companyDetails || {},
    logo: draft.logo || {},
    theme: draft.theme || themeList[0],
    aiContent: draft.aiContent || {},
    progress: summary?.progress || 0,
    currentStep: summary?.currentStep || "industry",
    completedSteps: summary?.completedSteps || [],
    skippedSteps: summary?.skippedSteps || [],
    readyToPublish: summary?.readyToPublish || false,
    stepLabels: summary?.stepLabels || {},
  };
}

function buildCompanyDefaults(draft) {
  return {
    companyName: draft.companyDetails?.companyName || "",
    legalName: draft.companyDetails?.legalName || "",
    website: draft.companyDetails?.website || "",
    email: draft.companyDetails?.email || "",
    phone: draft.companyDetails?.phone || "",
    city: draft.companyDetails?.city || "",
    country: draft.companyDetails?.country || "",
    tagline: draft.companyDetails?.tagline || "",
    description: draft.companyDetails?.description || "",
  };
}

const getIndustryEmoji = (key = "") => {
  const lower = key.toLowerCase();
  if (lower.includes("tech") || lower.includes("software") || lower.includes("it")) return "💻";
  if (lower.includes("finance") || lower.includes("consult") || lower.includes("legal") || lower.includes("professional")) return "📊";
  if (lower.includes("medical") || lower.includes("health") || lower.includes("wellness")) return "🩺";
  if (lower.includes("creative") || lower.includes("art") || lower.includes("design") || lower.includes("media")) return "🎨";
  if (lower.includes("education") || lower.includes("coach") || lower.includes("teach")) return "🎓";
  if (lower.includes("estate") || lower.includes("construct") || lower.includes("build")) return "🏠";
  if (lower.includes("food") || lower.includes("restaurant") || lower.includes("hotel") || lower.includes("hospitality")) return "🍳";
  return "✨";
};

const getCategoryEmoji = (key = "") => {
  const lower = key.toLowerCase();
  if (lower.includes("agency") || lower.includes("firm")) return "🏢";
  if (lower.includes("freelance") || lower.includes("consultant")) return "👤";
  if (lower.includes("startup") || lower.includes("founder")) return "🚀";
  if (lower.includes("store") || lower.includes("shop") || lower.includes("retail")) return "🛒";
  if (lower.includes("service") || lower.includes("provider")) return "🛠️";
  return "⭐";
};

export function OnboardingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authUser = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const onboardingState = useSelector((state) => state.onboarding);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(themeList[0]);
  const [logoPreview, setLogoPreview] = useState("");
  const [activeStep, setLocalStep] = useState("industry");
  const [resumeMessage, setResumeMessage] = useState("");

  const lookupsQuery = useQuery({
    queryKey: ["onboarding", "lookups"],
    queryFn: async () => {
      const response = await onboardingApi.lookups();
      return response.data.data;
    },
  });

  const stateQuery = useQuery({
    queryKey: ["onboarding", "me"],
    queryFn: async () => {
      const response = await onboardingApi.me();
      return normalizeDraft(response.data.data);
    },
  });

  const companyForm = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: buildCompanyDefaults(stateQuery.data || {}),
  });

  const contentForm = useForm({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      headline: stateQuery.data?.aiContent?.headline || "",
      summary: stateQuery.data?.aiContent?.summary || "",
      ctaLabel: stateQuery.data?.aiContent?.ctaLabel || "",
    },
  });
  const watchedCompany = companyForm.watch();
  const watchedContent = contentForm.watch();
  const companySnapshot = JSON.stringify(watchedCompany);
  const contentSnapshot = JSON.stringify(watchedContent);

  useEffect(() => {
    if (!stateQuery.data) return;
    dispatch(hydrateOnboarding(stateQuery.data));
    setLocalStep(stateQuery.data.currentStep || "industry");
    setSelectedIndustry(stateQuery.data.industry?.key || "");
    setSelectedCategory(stateQuery.data.businessCategory?.key || "");
    setSelectedTheme(stateQuery.data.theme || themeList[0]);
    companyForm.reset(buildCompanyDefaults(stateQuery.data));
    contentForm.reset({
      headline: stateQuery.data.aiContent?.headline || "",
      summary: stateQuery.data.aiContent?.summary || "",
      ctaLabel: stateQuery.data.aiContent?.ctaLabel || "",
    });
    setLogoPreview(stateQuery.data.logo?.url || "");
  }, [companyForm, contentForm, dispatch, stateQuery.data]);

  const selectedCategories = useMemo(() => {
    const industries = lookupsQuery.data?.categories || {};
    return industries[selectedIndustry] || [];
  }, [lookupsQuery.data, selectedIndustry]);

  const saveMutation = useMutation({
    mutationFn: (payload) => onboardingApi.save(payload),
    onMutate: () => dispatch(setSaving(true)),
    onSuccess: async () => {
      dispatch(setOnboardingError(null));
      await queryClient.invalidateQueries({ queryKey: ["onboarding", "me"] });
    },
    onError: (error) =>
      dispatch(
        setOnboardingError(
          error?.response?.data?.message || "Unable to save onboarding draft",
        ),
      ),
    onSettled: () => dispatch(setSaving(false)),
  });

  const completeMutation = useMutation({
    mutationFn: (payload) => onboardingApi.completeStep(payload),
    onSuccess: async () => {
      dispatch(setOnboardingError(null));
      await queryClient.invalidateQueries({ queryKey: ["onboarding", "me"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
    onError: (error) =>
      dispatch(
        setOnboardingError(
          error?.response?.data?.message || "Unable to complete step",
        ),
      ),
  });

  const skipMutation = useMutation({
    mutationFn: (payload) => onboardingApi.skipStep(payload),
    onSuccess: async () => {
      dispatch(setOnboardingError(null));
      await queryClient.invalidateQueries({ queryKey: ["onboarding", "me"] });
    },
    onError: (error) =>
      dispatch(
        setOnboardingError(
          error?.response?.data?.message || "Unable to skip step",
        ),
      ),
  });

  const logoMutation = useMutation({
    mutationFn: (payload) => onboardingApi.uploadLogo(payload),
    onSuccess: async () => {
      dispatch(setOnboardingError(null));
      await queryClient.invalidateQueries({ queryKey: ["onboarding", "me"] });
    },
    onError: (error) =>
      dispatch(
        setOnboardingError(
          error?.response?.data?.message || "Unable to upload logo",
        ),
      ),
  });

  const contentMutation = useMutation({
    mutationFn: () => onboardingApi.generateContent(),
    onSuccess: async (response) => {
      dispatch(setOnboardingError(null));
      const draft = response.data.data.draft;
      contentForm.reset({
        headline: draft.aiContent?.headline || "",
        summary: draft.aiContent?.summary || "",
        ctaLabel: draft.aiContent?.ctaLabel || "",
      });
      await queryClient.invalidateQueries({ queryKey: ["onboarding", "me"] });
    },
    onError: (error) =>
      dispatch(
        setOnboardingError(
          error?.response?.data?.message || "Unable to generate content",
        ),
      ),
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      await onboardingApi.save({
        currentStep: activeStep,
        industry: selectedIndustry
          ? { key: selectedIndustry, label: selectedIndustryLabel }
          : undefined,
        businessCategory: selectedCategory
          ? { key: selectedCategory, label: selectedCategoryLabel }
          : undefined,
        companyDetails: watchedCompany,
        theme: selectedTheme,
        aiContent: watchedContent,
        completedSteps: onboardingState.completedSteps,
        skippedSteps: onboardingState.skippedSteps,
      });
      return onboardingApi.publish();
    },
    onSuccess: async () => {
      dispatch(setOnboardingError(null));
      dispatch(
        setCredentials({
          user: {
            ...(authUser || {}),
            onboardingStatus: "published",
            onboardingProgress: 100,
          },
          accessToken,
        }),
      );
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      navigate("/dashboard", { replace: true });
    },
    onError: (error) =>
      dispatch(
        setOnboardingError(
          error?.response?.data?.message || "Unable to publish profile",
        ),
      ),
  });

  const resumeMutation = useMutation({
    mutationFn: () => onboardingApi.resumeLater(),
    onSuccess: () => {
      dispatch(setOnboardingError(null));
      setResumeMessage(
        "Your onboarding draft has been saved. You can return here whenever you are ready.",
      );
    },
  });

  useEffect(() => {
    if (!stateQuery.data) return;
    const timeout = window.setTimeout(() => {
      saveMutation.mutate({
        currentStep: activeStep,
        industry: selectedIndustry
          ? {
              key: selectedIndustry,
              label:
                lookupsQuery.data?.industries?.find(
                  (item) => item.key === selectedIndustry,
                )?.label || "",
            }
          : undefined,
        businessCategory: selectedCategory
          ? {
              key: selectedCategory,
              label:
                selectedCategories.find((item) => item.key === selectedCategory)
                  ?.label || "",
            }
          : undefined,
        companyDetails: watchedCompany,
        theme: selectedTheme,
        aiContent: watchedContent,
        completedSteps: onboardingState.completedSteps,
        skippedSteps: onboardingState.skippedSteps,
      });
    }, 900);
    return () => window.clearTimeout(timeout);
  }, [
    activeStep,
    companySnapshot,
    contentSnapshot,
    lookupsQuery.data,
    onboardingState.completedSteps,
    onboardingState.skippedSteps,
    saveMutation.mutate,
    selectedCategories,
    selectedCategory,
    selectedIndustry,
    selectedTheme,
  ]);

  const completeStep = async (step) => {
    if (step === "industry" && !selectedIndustry) return;
    if (step === "category" && !selectedCategory) return;
    if (step === "company") {
      const valid = await companyForm.trigger();
      if (!valid) return;
    }
    if (step === "theme" && !selectedTheme) return;
    if (step === "content") {
      const valid = await contentForm.trigger();
      if (!valid) return;
    }

    const companyValues = companyForm.getValues();
    const contentValues = contentForm.getValues();
    await completeMutation.mutateAsync({
      step,
      industry: selectedIndustry
        ? {
            key: selectedIndustry,
            label:
              lookupsQuery.data?.industries?.find(
                (item) => item.key === selectedIndustry,
              )?.label || "",
          }
        : undefined,
      businessCategory: selectedCategory
        ? {
            key: selectedCategory,
            label:
              selectedCategories.find((item) => item.key === selectedCategory)
                ?.label || "",
          }
        : undefined,
      companyDetails: companyValues,
      theme: selectedTheme,
      aiContent: contentValues,
    });
    const nextIndex = stepOrder.indexOf(step) + 1;
    const nextStep = stepOrder[Math.min(nextIndex, stepOrder.length - 1)];
    setLocalStep(nextStep);
    dispatch(setActiveStep(nextStep));
  };

  const skipCurrent = async () => {
    await skipMutation.mutateAsync({ step: activeStep });
    const nextIndex = stepOrder.indexOf(activeStep) + 1;
    const nextStep = stepOrder[Math.min(nextIndex, stepOrder.length - 1)];
    setLocalStep(nextStep);
    dispatch(setActiveStep(nextStep));
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      dispatch(setOnboardingError("Please upload an image file."));
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      setLogoPreview(String(reader.result || ""));
      await logoMutation.mutateAsync({ dataUri: String(reader.result || "") });
      const nextStep = "theme";
      setLocalStep(nextStep);
      dispatch(setActiveStep(nextStep));
    };
    reader.readAsDataURL(file);
  };

  const publishReady = Boolean(
    onboardingState.readyToPublish ||
    stateQuery.data?.readyToPublish ||
    (selectedIndustry &&
      selectedCategory &&
      watchedCompany.companyName &&
      selectedTheme?.key),
  );

  if (stateQuery.isLoading || lookupsQuery.isLoading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Spinner />
      </div>
    );
  }

  if (stateQuery.isError || lookupsQuery.isError) {
    return (
      <Alert variant="error">
        Unable to load onboarding data. Please refresh the page.
      </Alert>
    );
  }

  const industries = lookupsQuery.data?.industries || [];
  const selectedIndustryLabel =
    industries.find((item) => item.key === selectedIndustry)?.label ||
    selectedIndustry ||
    "Industry";
  const selectedCategoryLabel =
    selectedCategories.find((item) => item.key === selectedCategory)?.label ||
    selectedCategory ||
    "Category";

  return (
    <div className="space-y-8 min-w-0">
      {onboardingState.error ? (
        <Alert variant="error">{onboardingState.error}</Alert>
      ) : null}
      {resumeMessage ? <Alert variant="success">{resumeMessage}</Alert> : null}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1.5">
          <span className="text-2xs uppercase tracking-[0.25em] text-brand-400 font-bold">Workspace setup</span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Get published in under 5 minutes.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
            Let's structure your digital business card and profile. Your steps are saved automatically in real-time.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Button
            variant="secondary"
            loading={resumeMutation.isPending}
            onClick={() => resumeMutation.mutate()}
            className="rounded-xl h-10 min-h-10 text-xs font-bold border-white/[0.08]"
          >
            Save & Exit
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setLocalStep("content")}
            className="rounded-xl h-10 min-h-10 text-xs font-bold"
          >
            Review Step
          </Button>
          <Button
            loading={publishMutation.isPending}
            disabled={!publishReady}
            onClick={() => publishMutation.mutate()}
            className="rounded-xl h-10 min-h-10 text-xs font-bold"
          >
            Publish Workspace
          </Button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/[0.05] bg-gradient-to-b from-white/[0.02] to-transparent p-5 backdrop-blur-xl space-y-5">
        <OnboardingProgress
          progress={stateQuery.data?.progress || onboardingState.progress || 0}
        />
        <OnboardingStepper
          activeStep={activeStep}
          completedSteps={
            onboardingState.completedSteps.length
              ? onboardingState.completedSteps
              : stateQuery.data?.completedSteps || []
          }
          onStepClick={(step) => {
            setLocalStep(step);
            dispatch(setActiveStep(step));
          }}
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr] items-start">
        {/* Main interactive step module card */}
        <Card className="space-y-6 min-w-0" hoverEffect={false}>
          <AnimatePresence mode="wait">
            {activeStep === "industry" ? (
              <motion.div
                key="industry"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-white tracking-tight">
                    Select your primary industry
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    This tailors your design templates, layout elements, and AI copywriting suggestions.
                  </p>
                </div>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {industries.map((industry) => {
                    const isSelected = selectedIndustry === industry.key;
                    return (
                      <button
                        key={industry.key}
                        type="button"
                        onClick={() => {
                          setSelectedIndustry(industry.key);
                          setSelectedCategory("");
                        }}
                        className={`rounded-2xl border p-4.5 text-left transition-all duration-200 flex items-start gap-4 select-none active:scale-[0.98] ${isSelected ? "border-brand-500/40 bg-brand-500/[0.03] shadow-sm" : "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.12]"}`}
                      >
                        <span className="text-xl bg-white/[0.03] border border-white/[0.05] p-2 rounded-xl shrink-0">
                          {getIndustryEmoji(industry.key)}
                        </span>
                        <div>
                          <div className="font-semibold text-white text-sm">{industry.label}</div>
                          <div className="mt-0.5 text-2xs text-slate-400">
                            Custom layouts & tags
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : null}

            {activeStep === "category" ? (
              <motion.div
                key="category"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-white tracking-tight">
                    Pick a business category
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Choose the best category match to set up default buttons, CTA link structures, and portfolios.
                  </p>
                </div>
                
                {selectedCategories.length ? (
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {selectedCategories.map((category) => {
                      const isSelected = selectedCategory === category.key;
                      return (
                        <button
                          key={category.key}
                          type="button"
                          onClick={() => setSelectedCategory(category.key)}
                          className={`rounded-2xl border p-4.5 text-left transition-all duration-200 flex items-start gap-4 select-none active:scale-[0.98] ${isSelected ? "border-brand-500/40 bg-brand-500/[0.03] shadow-sm" : "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.12]"}`}
                        >
                          <span className="text-xl bg-white/[0.03] border border-white/[0.05] p-2 rounded-xl shrink-0">
                            {getCategoryEmoji(category.key)}
                          </span>
                          <div>
                            <div className="font-semibold text-white text-sm">{category.label}</div>
                            <div className="mt-0.5 text-2xs text-slate-400">
                              Matches profile structure
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center text-xs text-slate-400">
                    Please select an industry in the previous step first.
                  </div>
                )}
              </motion.div>
            ) : null}

            {activeStep === "company" ? (
              <motion.form
                key="company"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-white tracking-tight">
                    Add business identity details
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Provide clear information for your profile. You can edit this information in the workspace at any time.
                  </p>
                </div>
                <div className="grid gap-4.5 sm:grid-cols-2">
                  <Input
                    label="Company name"
                    placeholder="E.g., Stripe Inc."
                    {...companyForm.register("companyName")}
                    error={companyForm.formState.errors.companyName?.message}
                  />
                  <Input
                    label="Legal entity name"
                    placeholder="E.g., Stripe Technologies LLC"
                    {...companyForm.register("legalName")}
                    error={companyForm.formState.errors.legalName?.message}
                  />
                  <Input
                    label="Website URL"
                    placeholder="https://company.com"
                    {...companyForm.register("website")}
                    error={companyForm.formState.errors.website?.message}
                  />
                  <Input
                    label="Work email"
                    placeholder="hello@company.com"
                    {...companyForm.register("email")}
                    error={companyForm.formState.errors.email?.message}
                  />
                  <Input
                    label="Phone number"
                    placeholder="+1 (555) 0123"
                    {...companyForm.register("phone")}
                    error={companyForm.formState.errors.phone?.message}
                  />
                  <Input label="City" placeholder="San Francisco" {...companyForm.register("city")} />
                  <Input label="Country" placeholder="United States" {...companyForm.register("country")} />
                  <Input label="Tagline" placeholder="AI-powered billing infrastructure" {...companyForm.register("tagline")} />
                </div>
                <Textarea
                  label="Business description"
                  placeholder="Tell your prospective clients or visitors exactly what you do..."
                  {...companyForm.register("description")}
                  hint="Keep it concise. Visitors scan this text in under 3 seconds."
                />
              </motion.form>
            ) : null}

            {activeStep === "logo" ? (
              <motion.div
                key="logo"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-white tracking-tight">
                    Upload your digital logo
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Square PNG, JPG, or SVG vector file formats work best.
                  </p>
                </div>
                
                <div className="flex flex-col items-center justify-center p-1 rounded-[32px] bg-white/[0.01] border border-white/[0.05] relative overflow-hidden">
                  <label className="flex w-full min-h-48 cursor-pointer flex-col items-center justify-center p-6 text-center transition-all rounded-[28px] hover:bg-white/[0.03] select-none">
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleLogoUpload}
                    />
                    
                    <div className="relative">
                      {logoPreview ? (
                        <div className="relative group">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="h-20 w-20 rounded-2xl object-cover border border-white/10 shadow-lg"
                          />
                          <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-3xs font-bold text-white uppercase tracking-wider">Change</span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-lg shadow-inner">
                          📂
                        </div>
                      )}
                    </div>
                    
                    <span className="text-sm font-bold text-white mt-4">
                      {logoPreview ? "Replace Logo Image" : "Upload Logo Asset"}
                    </span>
                    <span className="mt-1 text-2xs text-slate-400 max-w-xs">
                      Drag & drop your image or click to browse. Max size 1MB.
                    </span>
                  </label>
                </div>
              </motion.div>
            ) : null}

            {activeStep === "theme" ? (
              <motion.div
                key="theme"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-white tracking-tight">
                    Choose public profile theme
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Themes define the color systems, buttons, and typography applied to your mini website.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {themeList.map((theme) => (
                    <ThemeCard
                      key={theme.key}
                      theme={theme}
                      selected={selectedTheme.key === theme.key}
                      onSelect={() => setSelectedTheme(theme)}
                    />
                  ))}
                </div>
              </motion.div>
            ) : null}

            {activeStep === "content" ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-white tracking-tight">
                    AI-assisted copywriter
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Generate an optimized hero headline and landing page summary using your input metadata.
                  </p>
                </div>
                
                <div className="flex items-center gap-3 p-4.5 rounded-2xl bg-brand-500/[0.03] border border-brand-500/20">
                  <span className="text-lg bg-brand-500/10 p-2 rounded-xl text-brand-400 shrink-0">✨</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">Generate with AI Builder</div>
                    <div className="text-3xs text-slate-400 mt-0.5">Fills in headline, summary, and call-to-actions instantly.</div>
                  </div>
                  <Button
                    variant="primary"
                    loading={contentMutation.isPending}
                    onClick={() => contentMutation.mutate()}
                    className="min-h-9 h-9 rounded-xl text-xs font-bold"
                  >
                    Generate Copy
                  </Button>
                </div>

                <div className="space-y-4 pt-2">
                  <Input
                    label="Profile Headline"
                    placeholder="Empowering businesses with modern infrastructure"
                    {...contentForm.register("headline")}
                  />
                  <Textarea
                    label="Profile Summary Paragraph"
                    placeholder="We build software solutions that help MSMEs scale billing pipelines..."
                    {...contentForm.register("summary")}
                  />
                  <Input
                    label="Primary CTA Button Label"
                    placeholder="Contact Us"
                    {...contentForm.register("ctaLabel")}
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between border-t border-white/[0.05] pt-5 gap-3">
            <div>
              {["logo", "content"].includes(activeStep) ? (
                <Button 
                  variant="ghost" 
                  onClick={() => skipCurrent()}
                  className="rounded-xl h-10 min-h-10 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Skip Step
                </Button>
              ) : (
                <div />
              )}
            </div>
            
            <div className="flex gap-2">
              {activeStep !== "industry" ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    const prevIndex = stepOrder.indexOf(activeStep) - 1;
                    const prevStep = stepOrder[Math.max(prevIndex, 0)];
                    setLocalStep(prevStep);
                    dispatch(setActiveStep(prevStep));
                  }}
                  className="rounded-xl h-10 min-h-10 text-xs font-bold border-white/[0.08]"
                >
                  Back
                </Button>
              ) : null}
              
              <Button
                onClick={() => completeStep(activeStep)}
                loading={completeMutation.isPending}
                className="rounded-xl h-10 min-h-10 text-xs font-bold"
              >
                {activeStep === "content" ? "Save & Review" : "Continue"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Live Mockup Smartphone Preview Column */}
        <div className="space-y-6 shrink-0">
          <Card className="p-0 border-white/[0.06] bg-black overflow-hidden relative" hoverEffect={false}>
            {/* Ambient chassis lighting */}
            <div className="absolute inset-0 pointer-events-none rounded-[28px] border border-white/10 z-30" />
            
            {/* Phone header speaker/notch mockup */}
            <div className="w-full bg-[#090a0f] py-2.5 flex justify-center border-b border-white/[0.04] relative z-20">
              <div className="w-16 h-3.5 rounded-full bg-black/80 flex items-center justify-center gap-1.5 px-3">
                <span className="h-1 w-1 rounded-full bg-slate-800" />
                <span className="h-1 w-5 rounded-full bg-slate-800" />
              </div>
            </div>

            {/* Mock phone body */}
            <div 
              className={`p-5 min-h-[360px] flex flex-col justify-between transition-colors duration-500 relative z-10 ${
                selectedTheme.mode === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#12141c] text-white'
              }`}
            >
              {/* Dynamic Theme ambient indicator */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: selectedTheme.primary }} />

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white/10 border border-white/10 shadow-inner">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className={`text-md font-black ${selectedTheme.mode === 'light' ? 'text-slate-700' : 'text-brand-400'}`}>OP</span>
                    )}
                  </div>
                  <div>
                    <div className="text-md font-bold truncate max-w-[150px]">
                      {companyForm.watch("companyName") || "Your Company Name"}
                    </div>
                    <div className="text-xs text-slate-400 truncate max-w-[170px] mt-0.5">
                      {companyForm.watch("tagline") || "Your tagline slogan"}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/[0.06]" />

                <div className="space-y-2">
                  <div className="text-3xs uppercase tracking-[0.25em] text-slate-500 font-bold">About us</div>
                  <div className="text-xs leading-relaxed opacity-85 truncate-3-lines">
                    {contentForm.watch("summary") ||
                      companyForm.watch("description") ||
                      "Write details or click AI content builder to fill this space dynamically."}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="rounded-full bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 text-3xs font-semibold text-brand-300">
                    {selectedIndustryLabel}
                  </span>
                  <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-3xs font-semibold text-slate-300">
                    {selectedCategoryLabel}
                  </span>
                </div>
              </div>

              {/* Theme dynamic button mockup */}
              <div className="mt-8">
                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 text-xs font-bold rounded-xl shadow-sm transition-all text-center flex items-center justify-center gap-1.5 select-none"
                  style={{
                    backgroundColor: selectedTheme.primary,
                    color: selectedTheme.mode === 'light' ? '#090a0f' : '#ffffff'
                  }}
                >
                  <span>{contentForm.watch("ctaLabel") || "Connect Profile"}</span>
                  <span>✨</span>
                </button>
              </div>
            </div>
          </Card>

          {/* Quick tips list */}
          <Card className="space-y-4" hoverEffect={false}>
            <div className="flex items-center gap-2">
              <span className="text-md">💡</span>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast track setup</h4>
            </div>
            
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">1.</span>
                <span>Select matching classification tags.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">2.</span>
                <span>Upload a brand logo and fill in profile metadata.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-400 font-bold">3.</span>
                <span>Trigger AI, select theme skin, and tap publish!</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
