import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingApi } from "../lib/onboardingApi";
import {
  hydrateOnboarding,
  setActiveStep,
  setOnboardingError,
  setSaving,
} from "../store/onboardingSlice";
import { setCredentials } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { OnboardingStepper } from "../components/onboarding/OnboardingStepper";
import { OnboardingProgress } from "../components/onboarding/OnboardingProgress";

const stepOrder = [
  "industry", // profileType selection
  "category", // businessType / professionalCategory selection
  "company", // industry selection
  "logo", // details & logo/photo
  "theme", // theme selection
  "content", // ai copywriter & contacts
];

const companySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  legalName: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  tagline: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  gstNumber: z.string().optional().or(z.literal("")),
  registrationDetails: z.string().optional().or(z.literal("")),
  serviceArea: z.string().optional().or(z.literal("")),
  foundedYear: z.number().nullable().optional(),
  teamSize: z.number().nullable().optional(),
});

const themeList = [
  {
    key: "aurora",
    name: "Aurora",
    primary: "#4F8CFF",
    accent: "#22D3EE",
    mode: "dark",
  },
  {
    key: "midnight",
    name: "Midnight",
    primary: "#A78BFA",
    accent: "#60A5FA",
    mode: "dark",
  },
  {
    key: "sunrise",
    name: "Sunrise",
    primary: "#F97316",
    accent: "#FACC15",
    mode: "light",
  },
  {
    key: "mono",
    name: "Mono",
    primary: "#E2E8F0",
    accent: "#94A3B8",
    mode: "dark",
  },
];

function SearchableDropdown({
  options = [],
  value,
  onChange,
  placeholder,
  label,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      (opt.label || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  const selectedOption = options.find((opt) => opt.key === value);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".searchable-dropdown-container")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <div className="relative space-y-1.5 min-w-0 searchable-dropdown-container">
      {label && (
        <label className="text-3xs font-extrabold uppercase tracking-wider text-slate-400">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-left text-xs font-semibold text-white shadow-sm transition-all hover:bg-white/[0.04] active:scale-[0.99] select-none"
      >
        <span className={selectedOption ? "text-white" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="text-slate-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-2xl border border-white/[0.08] bg-[#0c0d12]/95 p-2 shadow-xl backdrop-blur-xl max-h-[220px] overflow-y-auto space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand-500"
          />
          <div className="space-y-0.5 max-h-[140px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    onChange(opt.key);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors ${
                    value === opt.key
                      ? "bg-brand-500 text-slate-950"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-3xs text-slate-500 font-bold uppercase">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function OnboardingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onboardingState = useSelector((state) => state.onboarding);
  const authUser = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const [activeStep, setLocalStep] = useState("industry");

  // Custom stepper parameters
  const [selectedProfileType, setSelectedProfileType] = useState("business");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProfessionalCategory, setSelectedProfessionalCategory] =
    useState("");
  const [selectedTheme, setSelectedTheme] = useState(themeList[0]);
  const [logoPreview, setLogoPreview] = useState("");
  const [resumeMessage, setResumeMessage] = useState("");

  // Experience list helper state
  const [experienceList, setExperienceList] = useState([]);
  const [newExp, setNewExp] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const currentStepOrder = useMemo(() => {
    if (selectedProfileType === "professional") {
      return ["industry", "category", "logo", "content"];
    }
    return ["industry", "category", "company", "logo", "content"];
  }, [selectedProfileType]);

  // Safety redirect to prevent landing on invalid steps (e.g. Industry step for Professionals or Theme step)
  useEffect(() => {
    if (!currentStepOrder.includes(activeStep)) {
      if (selectedProfileType === "professional" && activeStep === "company") {
        setLocalStep("logo");
        dispatch(setActiveStep("logo"));
      } else if (activeStep === "theme") {
        setLocalStep("content");
        dispatch(setActiveStep("content"));
      } else {
        setLocalStep("industry");
        dispatch(setActiveStep("industry"));
      }
    }
  }, [selectedProfileType, activeStep, currentStepOrder, dispatch]);

  // Fetch Lookups & Onboarding State
  const stateQuery = useQuery({
    queryKey: ["onboarding", "me"],
    queryFn: async () => {
      const response = await onboardingApi.me();
      return response.data.data.draft;
    },
  });

  const lookupsQuery = useQuery({
    queryKey: ["onboarding", "lookups"],
    queryFn: async () => {
      const response = await onboardingApi.lookups();
      return response.data.data;
    },
  });

  const companyForm = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: "",
      legalName: "",
      website: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      tagline: "",
      description: "",
      gstNumber: "",
      registrationDetails: "",
      serviceArea: "",
      foundedYear: null,
      teamSize: null,
    },
  });

  const contentForm = useForm({
    defaultValues: {
      headline: "",
      summary: "",
      ctaLabel: "",
      personalDetails: {
        title: "",
        bio: "",
        avatarUrl: "",
        coverImageUrl: "",
        languagesRaw: "",
        skillsRaw: "",
        certificationsRaw: "",
        employmentType: "self_employed",
        designation: "",
        yearsOfExperience: "",
        practiceName: "",
        department: "",
        workLocation: "",
        industry: "",
      },
      contactDetails: {
        email: "",
        phone: "",
        whatsAppNumber: "",
        address: "",
        mapsEmbedUrl: "",
      },
      socialLinks: {
        linkedin: "",
        twitter: "",
        github: "",
        website: "",
        instagram: "",
        facebook: "",
        youtube: "",
        customLinks: [],
      },
    },
  });

  const watchedCompany = companyForm.watch();
  const watchedContent = contentForm.watch();
  const customLinks = watchedContent.socialLinks?.customLinks || [];

  const companySnapshot = JSON.stringify(watchedCompany);
  const contentSnapshot = JSON.stringify(watchedContent);

  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate fields when draft loads from server
  useEffect(() => {
    if (!stateQuery.data || isHydrated) return;
    setIsHydrated(true);
    dispatch(hydrateOnboarding(stateQuery.data));
    setLocalStep(stateQuery.data.currentStep || "industry");
    setSelectedProfileType(stateQuery.data.profileType || "business");
    setSelectedIndustry(stateQuery.data.industry?.key || "");
    setSelectedCategory(stateQuery.data.businessCategory?.key || "");
    setSelectedProfessionalCategory(
      stateQuery.data.professionalCategory?.key || "",
    );
    setSelectedTheme(stateQuery.data.theme || themeList[0]);
    setExperienceList(stateQuery.data.experience || []);

    companyForm.reset({
      companyName: stateQuery.data.companyDetails?.companyName || "",
      legalName: stateQuery.data.companyDetails?.legalName || "",
      website: stateQuery.data.companyDetails?.website || "",
      email: stateQuery.data.companyDetails?.email || "",
      phone: stateQuery.data.companyDetails?.phone || "",
      city: stateQuery.data.companyDetails?.city || "",
      country: stateQuery.data.companyDetails?.country || "",
      tagline: stateQuery.data.companyDetails?.tagline || "",
      description: stateQuery.data.companyDetails?.description || "",
      gstNumber: stateQuery.data.companyDetails?.gstNumber || "",
      registrationDetails:
        stateQuery.data.companyDetails?.registrationDetails || "",
      serviceArea: stateQuery.data.companyDetails?.serviceArea || "",
      foundedYear: stateQuery.data.companyDetails?.foundedYear || null,
      teamSize: stateQuery.data.companyDetails?.teamSize || null,
    });

    contentForm.reset({
      headline: stateQuery.data.aiContent?.headline || "",
      summary: stateQuery.data.aiContent?.summary || "",
      ctaLabel: stateQuery.data.aiContent?.ctaLabel || "",
      personalDetails: {
        title: stateQuery.data.personalDetails?.title || "",
        bio: stateQuery.data.personalDetails?.bio || "",
        avatarUrl: stateQuery.data.personalDetails?.avatarUrl || "",
        coverImageUrl: stateQuery.data.personalDetails?.coverImageUrl || "",
        languagesRaw: (stateQuery.data.personalDetails?.languages || []).join(
          ", ",
        ),
        skillsRaw: (stateQuery.data.personalDetails?.skills || []).join(", "),
        certificationsRaw: (
          stateQuery.data.personalDetails?.certifications || []
        ).join(", "),
        employmentType:
          stateQuery.data.personalDetails?.employmentType || "self_employed",
        designation: stateQuery.data.personalDetails?.designation || "",
        yearsOfExperience:
          stateQuery.data.personalDetails?.yearsOfExperience || "",
        practiceName: stateQuery.data.personalDetails?.practiceName || "",
        department: stateQuery.data.personalDetails?.department || "",
        workLocation: stateQuery.data.personalDetails?.workLocation || "",
        industry: stateQuery.data.personalDetails?.industry || "",
      },
      contactDetails: {
        email: stateQuery.data.contactDetails?.email || "",
        phone: stateQuery.data.contactDetails?.phone || "",
        whatsAppNumber: stateQuery.data.contactDetails?.whatsAppNumber || "",
        address: stateQuery.data.contactDetails?.address || "",
        mapsEmbedUrl: stateQuery.data.contactDetails?.mapsEmbedUrl || "",
      },
      socialLinks: {
        linkedin: stateQuery.data.socialLinks?.linkedin || "",
        instagram: stateQuery.data.socialLinks?.instagram || "",
        facebook: stateQuery.data.socialLinks?.facebook || "",
        twitter: stateQuery.data.socialLinks?.twitter || "",
        youtube: stateQuery.data.socialLinks?.youtube || "",
        github: stateQuery.data.socialLinks?.github || "",
        customLinks: stateQuery.data.socialLinks?.customLinks || [],
      },
    });

    setLogoPreview(stateQuery.data.logo?.url || "");
  }, [companyForm, contentForm, dispatch, stateQuery.data]);

  const businessTypes = useMemo(() => {
    return lookupsQuery.data?.businessTypes || [];
  }, [lookupsQuery.data]);

  const professionalCategories = useMemo(() => {
    return lookupsQuery.data?.professionalCategories || [];
  }, [lookupsQuery.data]);

  const industries = useMemo(() => {
    return lookupsQuery.data?.industries || [];
  }, [lookupsQuery.data]);

  const selectedIndustryLabel = useMemo(() => {
    return (
      industries.find((i) => i.key === selectedIndustry)?.label ||
      selectedIndustry ||
      "Industry"
    );
  }, [industries, selectedIndustry]);

  const selectedCategoryLabel = useMemo(() => {
    return (
      businessTypes.find((c) => c.key === selectedCategory)?.label ||
      selectedCategory ||
      "Business Type"
    );
  }, [businessTypes, selectedCategory]);

  const selectedProfessionalCategoryLabel = useMemo(() => {
    return (
      professionalCategories.find((p) => p.key === selectedProfessionalCategory)
        ?.label ||
      selectedProfessionalCategory ||
      "Professional Category"
    );
  }, [professionalCategories, selectedProfessionalCategory]);

  // Mutations
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
    onSuccess: async (data, variables) => {
      dispatch(setOnboardingError(null));
      await queryClient.invalidateQueries({ queryKey: ["onboarding", "me"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      if (variables?.step === "content") {
        navigate("/dashboard");
      }
    },
    onError: (error) =>
      dispatch(
        setOnboardingError(
          error?.response?.data?.message || "Unable to complete step",
        ),
      ),
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      const companyValues = companyForm.getValues();
      const contentValues = contentForm.getValues();
      await onboardingApi.save({
        currentStep: activeStep,
        profileType: selectedProfileType,
        industry: selectedIndustry
          ? { key: selectedIndustry, label: selectedIndustryLabel }
          : undefined,
        businessCategory: selectedCategory
          ? { key: selectedCategory, label: selectedCategoryLabel }
          : undefined,
        professionalCategory: selectedProfessionalCategory
          ? {
              key: selectedProfessionalCategory,
              label: selectedProfessionalCategoryLabel,
            }
          : undefined,
        companyDetails: companyValues,
        theme: selectedTheme,
        completedSteps: onboardingState.completedSteps,
        skippedSteps: onboardingState.skippedSteps,
        experience: experienceList,
        aiContent: {
          headline: contentValues.headline,
          summary: contentValues.summary,
          ctaLabel: contentValues.ctaLabel,
        },
        personalDetails: {
          title: contentValues.personalDetails?.title,
          bio: contentValues.personalDetails?.bio,
          avatarUrl: contentValues.personalDetails?.avatarUrl,
          coverImageUrl: contentValues.personalDetails?.coverImageUrl,
          languages: (contentValues.personalDetails?.languagesRaw || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          skills: (contentValues.personalDetails?.skillsRaw || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          certifications: (
            contentValues.personalDetails?.certificationsRaw || ""
          )
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          employmentType:
            contentValues.personalDetails?.employmentType || "self_employed",
          designation: contentValues.personalDetails?.designation || "",
          yearsOfExperience: contentValues.personalDetails?.yearsOfExperience
            ? Number(contentValues.personalDetails.yearsOfExperience)
            : null,
          practiceName: contentValues.personalDetails?.practiceName || "",
          department: contentValues.personalDetails?.department || "",
          workLocation: contentValues.personalDetails?.workLocation || "",
          industry: contentValues.personalDetails?.industry || "",
        },
        contactDetails: contentValues.contactDetails,
        socialLinks: contentValues.socialLinks,
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

  // Debounced Autosave effect
  useEffect(() => {
    if (!stateQuery.data) return;
    const timeout = window.setTimeout(() => {
      saveMutation.mutate({
        currentStep: activeStep,
        profileType: selectedProfileType,
        industry: selectedIndustry
          ? { key: selectedIndustry, label: selectedIndustryLabel }
          : undefined,
        businessCategory: selectedCategory
          ? { key: selectedCategory, label: selectedCategoryLabel }
          : undefined,
        professionalCategory: selectedProfessionalCategory
          ? {
              key: selectedProfessionalCategory,
              label: selectedProfessionalCategoryLabel,
            }
          : undefined,
        companyDetails: watchedCompany,
        theme: selectedTheme,
        completedSteps: onboardingState.completedSteps,
        skippedSteps: onboardingState.skippedSteps,
        experience: experienceList,
        aiContent: {
          headline: watchedContent.headline,
          summary: watchedContent.summary,
          ctaLabel: watchedContent.ctaLabel,
        },
        personalDetails: {
          title: watchedContent.personalDetails?.title,
          bio: watchedContent.personalDetails?.bio,
          avatarUrl: watchedContent.personalDetails?.avatarUrl,
          coverImageUrl: watchedContent.personalDetails?.coverImageUrl,
          languages: (watchedContent.personalDetails?.languagesRaw || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          skills: (watchedContent.personalDetails?.skillsRaw || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          certifications: (
            watchedContent.personalDetails?.certificationsRaw || ""
          )
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          employmentType:
            watchedContent.personalDetails?.employmentType || "self_employed",
          designation: watchedContent.personalDetails?.designation || "",
          yearsOfExperience: watchedContent.personalDetails?.yearsOfExperience
            ? Number(watchedContent.personalDetails.yearsOfExperience)
            : null,
          practiceName: watchedContent.personalDetails?.practiceName || "",
          department: watchedContent.personalDetails?.department || "",
          workLocation: watchedContent.personalDetails?.workLocation || "",
          industry: watchedContent.personalDetails?.industry || "",
        },
        contactDetails: watchedContent.contactDetails,
        socialLinks: watchedContent.socialLinks,
      });
    }, 1500);
    return () => window.clearTimeout(timeout);
  }, [
    activeStep,
    selectedProfileType,
    companySnapshot,
    contentSnapshot,
    selectedCategory,
    selectedProfessionalCategory,
    selectedIndustry,
    selectedTheme,
    experienceList,
  ]);

  const addCustomLink = () => {
    if (!newLink.title || !newLink.url) return;
    contentForm.setValue("socialLinks.customLinks", [...customLinks, newLink]);
    setNewLink({ title: "", url: "" });
  };

  const removeCustomLink = (idx) => {
    const updated = customLinks.filter((_, i) => i !== idx);
    contentForm.setValue("socialLinks.customLinks", updated);
  };

  const handleAddExperience = () => {
    if (!newExp.title || !newExp.company || !newExp.startDate) return;
    const updated = [...experienceList, newExp];
    setExperienceList(updated);
    setNewExp({
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
  };

  const handleRemoveExperience = (idx) => {
    const updated = experienceList.filter((_, i) => i !== idx);
    setExperienceList(updated);
  };

  const completeStep = async (step) => {
    if (step === "industry" && !selectedProfileType) return;
    if (step === "category") {
      if (selectedProfileType === "business" && !selectedCategory) return;
      if (
        selectedProfileType === "professional" &&
        !selectedProfessionalCategory
      )
        return;
    }
    if (step === "company" && !selectedIndustry) return;
    if (step === "logo") {
      if (selectedProfileType === "business") {
        const valid = await companyForm.trigger();
        if (!valid) return;
      }
    }
    if (step === "theme" && !selectedTheme) return;

    const companyValues = companyForm.getValues();
    const contentValues = contentForm.getValues();

    await completeMutation.mutateAsync({
      step,
      profileType: selectedProfileType,
      industry: selectedIndustry
        ? { key: selectedIndustry, label: selectedIndustryLabel }
        : undefined,
      businessCategory: selectedCategory
        ? { key: selectedCategory, label: selectedCategoryLabel }
        : undefined,
      professionalCategory: selectedProfessionalCategory
        ? {
            key: selectedProfessionalCategory,
            label: selectedProfessionalCategoryLabel,
          }
        : undefined,
      companyDetails: companyValues,
      theme: selectedTheme,
      experience: experienceList,
      aiContent: {
        headline: contentValues.headline,
        summary: contentValues.summary,
        ctaLabel: contentValues.ctaLabel,
      },
      personalDetails: {
        title: contentValues.personalDetails?.title,
        bio: contentValues.personalDetails?.bio,
        avatarUrl: contentValues.personalDetails?.avatarUrl,
        coverImageUrl: contentValues.personalDetails?.coverImageUrl,
        languages: (contentValues.personalDetails?.languagesRaw || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        skills: (contentValues.personalDetails?.skillsRaw || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        certifications: (contentValues.personalDetails?.certificationsRaw || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        employmentType:
          contentValues.personalDetails?.employmentType || "self_employed",
        designation: contentValues.personalDetails?.designation || "",
        yearsOfExperience: contentValues.personalDetails?.yearsOfExperience
          ? Number(contentValues.personalDetails.yearsOfExperience)
          : null,
        practiceName: contentValues.personalDetails?.practiceName || "",
        department: contentValues.personalDetails?.department || "",
        workLocation: contentValues.personalDetails?.workLocation || "",
        industry: contentValues.personalDetails?.industry || "",
      },
      contactDetails: contentValues.contactDetails,
      socialLinks: contentValues.socialLinks,
    });

    if (step === "content") {
      navigate("/dashboard");
      return;
    }

    const nextIndex = currentStepOrder.indexOf(step) + 1;
    const nextStep =
      currentStepOrder[Math.min(nextIndex, currentStepOrder.length - 1)];
    setLocalStep(nextStep);
    dispatch(setActiveStep(nextStep));
  };

  const skipCurrent = async () => {
    await skipMutation.mutateAsync({ step: activeStep });
    const nextIndex = currentStepOrder.indexOf(activeStep) + 1;
    const nextStep =
      currentStepOrder[Math.min(nextIndex, currentStepOrder.length - 1)];
    setLocalStep(nextStep);
    dispatch(setActiveStep(nextStep));
  };

  const logoMutation = useMutation({
    mutationFn: (payload) => onboardingApi.uploadLogo(payload),
    onSuccess: async () => {
      dispatch(setOnboardingError(null));
      await queryClient.invalidateQueries({ queryKey: ["onboarding", "me"] });
    },
  });

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
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
    (selectedProfileType &&
      (selectedCategory || selectedProfessionalCategory) &&
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
      <div className="py-8">
        <Alert variant="error">
          Unable to load onboarding metadata. Please refresh the browser.
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 min-w-0 select-none">
      {onboardingState.error ? (
        <Alert variant="error">{onboardingState.error}</Alert>
      ) : null}
      {resumeMessage ? <Alert variant="success">{resumeMessage}</Alert> : null}

      <div className="flex flex-col gap-4.5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1 select-none">
          <span className="text-3xs uppercase tracking-[0.2em] text-brand-400 font-bold">
            Workspace setup
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Get published in under 5 minutes.
          </h1>
          <p className="max-w-xl text-xs leading-relaxed text-slate-400">
            Let's structure your digital business card and profile. Your steps
            are saved automatically in real-time.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0 select-none">
          <Button
            variant="secondary"
            loading={resumeMutation.isPending}
            onClick={() => resumeMutation.mutate()}
            className="rounded-xl h-8.5 min-h-[34px] px-3.5 text-3xs font-bold border-white/[0.08]"
          >
            Save & Exit
          </Button>
          <Button
            variant="ghost"
            onClick={() => setLocalStep("content")}
            className="rounded-xl h-8.5 min-h-[34px] px-3.5 text-3xs font-bold"
          >
            Review Step
          </Button>
          <Button
            loading={publishMutation.isPending}
            onClick={() => publishMutation.mutate()}
            className="rounded-xl h-8.5 min-h-[34px] px-3.5 text-3xs font-bold"
          >
            Publish Workspace
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] p-4 backdrop-blur-md space-y-4">
        <OnboardingProgress
          progress={stateQuery.data?.progress || onboardingState.progress || 0}
        />
        <OnboardingStepper
          activeStep={activeStep}
          completedSteps={onboardingState.completedSteps}
          profileType={selectedProfileType}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
        {/* Step configuration cards */}
        <Card
          className="p-5 sm:p-6.5 rounded-2xl border-white/[0.04]"
          hoverEffect={false}
        >
          <AnimatePresence mode="wait">
            {/* STEP 1: SELECT PROFILE TYPE */}
            {activeStep === "industry" ? (
              <motion.div
                key="industry"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="space-y-0.5">
                  <h2 className="font-display text-base font-bold text-white tracking-tight">
                    What best describes you?
                  </h2>
                  <p className="text-3xs text-slate-400 tracking-wide">
                    Choose between setting up a Business Organization card or a
                    Professional Personal card.
                  </p>
                </div>
                <div className="grid gap-4.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProfileType("business")}
                    className={`flex flex-col gap-2 rounded-2xl p-5 text-left transition-all duration-300 border ${
                      selectedProfileType === "business"
                        ? "bg-brand-500/10 border-brand-500/30 text-white shadow-[0_8px_32px_rgba(79,140,255,0.08)]"
                        : "bg-white/[0.01] border-white/[0.04] text-slate-400 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="text-2xl">🏢</span>
                    <span className="text-xs font-bold text-white">
                      Business
                    </span>
                    <span className="text-3xs text-slate-500 font-semibold leading-relaxed">
                      {" "}
                      E.g., Company, Startup, Agency, Store, Brand,
                      Organization.
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedProfileType("professional")}
                    className={`flex flex-col gap-2 rounded-2xl p-5 text-left transition-all duration-300 border ${
                      selectedProfileType === "professional"
                        ? "bg-brand-500/10 border-brand-500/30 text-white shadow-[0_8px_32px_rgba(79,140,255,0.08)]"
                        : "bg-white/[0.01] border-white/[0.04] text-slate-400 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="text-2xl">👤</span>
                    <span className="text-xs font-bold text-white">
                      Professional
                    </span>
                    <span className="text-3xs text-slate-500 font-semibold leading-relaxed">
                      {" "}
                      E.g., Doctor, Engineer, Designer, Freelancer, Consultant,
                      Coach, Trainer.
                    </span>
                  </button>
                </div>
              </motion.div>
            ) : null}

            {/* STEP 2: CATEGORY / BUSINESS TYPE / PROFESSIONAL CATEGORY */}
            {activeStep === "category" ? (
              <motion.div
                key="category"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                {selectedProfileType === "business" ? (
                  <div className="space-y-4">
                    <div className="space-y-0.5">
                      <h2 className="font-display text-base font-bold text-white tracking-tight">
                        Select Business Type
                      </h2>
                      <p className="text-3xs text-slate-400 tracking-wide">
                        Choose the organization category matching your startup,
                        brand, or store.
                      </p>
                    </div>

                    <SearchableDropdown
                      options={businessTypes}
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      placeholder="Search and select business type..."
                      label="Business Type Selector"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-0.5">
                      <h2 className="font-display text-base font-bold text-white tracking-tight">
                        Select Professional Category
                      </h2>
                      <p className="text-3xs text-slate-400 tracking-wide">
                        Choose the credential title matching your core
                        profession.
                      </p>
                    </div>

                    <SearchableDropdown
                      options={professionalCategories}
                      value={selectedProfessionalCategory}
                      onChange={setSelectedProfessionalCategory}
                      placeholder="Search and select professional category..."
                      label="Professional Category Selector"
                    />
                  </div>
                )}
              </motion.div>
            ) : null}

            {/* STEP 3: INDUSTRY SELECTION */}
            {activeStep === "company" ? (
              <motion.div
                key="company"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="space-y-0.5">
                  <h2 className="font-display text-base font-bold text-white tracking-tight">
                    Select Industry
                  </h2>
                  <p className="text-3xs text-slate-400 tracking-wide">
                    Choose the industrial sector that outlines your primary
                    field of business.
                  </p>
                </div>

                <SearchableDropdown
                  options={industries}
                  value={selectedIndustry}
                  onChange={setSelectedIndustry}
                  placeholder="Search and select industry..."
                  label="Industry Selector"
                />
              </motion.div>
            ) : null}

            {/* STEP 4: DETAILS (BUSINESS OR PROFESSIONAL) & IMAGES */}
            {activeStep === "logo" ? (
              <motion.div
                key="logo"
                className="space-y-4 max-h-[380px] overflow-y-auto pr-1"
              >
                {selectedProfileType === "business" ? (
                  <form
                    onSubmit={companyForm.handleSubmit(() =>
                      completeStep("logo"),
                    )}
                    className="space-y-4"
                  >
                    <div className="space-y-0.5">
                      <h2 className="font-display text-base font-bold text-white tracking-tight">
                        Business details & Logo
                      </h2>
                      <p className="text-3xs text-slate-400 tracking-wide">
                        Configure corporate identifiers, address coordinates,
                        and company logo.
                      </p>
                    </div>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div className="flex flex-col items-center justify-center p-1 rounded-xl bg-white/[0.01] border border-white/[0.04] relative overflow-hidden h-28 sm:col-span-2">
                        <label className="flex w-full h-full cursor-pointer flex-col items-center justify-center p-2.5 text-center rounded-lg hover:bg-white/[0.03] select-none">
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleLogoUpload}
                          />
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Logo"
                              className="h-11 w-11 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-md">
                              📁
                            </div>
                          )}
                          <span className="text-3xs font-bold uppercase tracking-wider text-white mt-1.5">
                            Upload Company Logo
                          </span>
                        </label>
                      </div>

                      <Input
                        label="Company Name *"
                        placeholder="Connor Consulting"
                        {...companyForm.register("companyName")}
                        error={
                          companyForm.formState.errors.companyName?.message
                        }
                      />
                      <Input
                        label="Corporate Website Link"
                        placeholder="https://website.com"
                        {...companyForm.register("website")}
                        error={companyForm.formState.errors.website?.message}
                      />
                      <Input
                        label="Business Email"
                        placeholder="hello@company.com"
                        {...companyForm.register("email")}
                        error={companyForm.formState.errors.email?.message}
                      />
                      <Input
                        label="Phone Number"
                        placeholder="+1 (555) 012-3456"
                        {...companyForm.register("phone")}
                        error={companyForm.formState.errors.phone?.message}
                      />

                      <Input
                        label="City"
                        placeholder="San Francisco"
                        {...companyForm.register("city")}
                      />
                      <Input
                        label="Country"
                        placeholder="United States"
                        {...companyForm.register("country")}
                      />
                      <Input
                        label="Tagline"
                        placeholder="Securing infrastructure pipelines"
                        {...companyForm.register("tagline")}
                      />

                      <Input
                        label="GST Identification Number (GSTIN) - Optional"
                        placeholder="E.g., 22AAAAA0000A1Z5"
                        {...companyForm.register("gstNumber")}
                      />
                      <Input
                        label="Business Registration Details"
                        placeholder="CIN or Trade License code"
                        {...companyForm.register("registrationDetails")}
                      />
                      <Input
                        label="Service Area"
                        placeholder="E.g., Local or Worldwide"
                        {...companyForm.register("serviceArea")}
                      />

                      <Input
                        label="Founded Year"
                        type="number"
                        placeholder="2018"
                        {...companyForm.register("foundedYear", {
                          valueAsNumber: true,
                        })}
                      />
                      <Input
                        label="Team Size"
                        type="number"
                        placeholder="25"
                        {...companyForm.register("teamSize", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <Textarea
                      label="Business Summary Description"
                      placeholder="Detailed description of your services..."
                      {...companyForm.register("description")}
                    />
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-0.5">
                      <h2 className="font-display text-base font-bold text-white tracking-tight">
                        Professional biography & photo
                      </h2>
                      <p className="text-3xs text-slate-400 tracking-wide">
                        Configure your biography credentials, experience nodes,
                        and profile avatar.
                      </p>
                    </div>

                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div className="flex flex-col items-center justify-center p-1 rounded-xl bg-white/[0.01] border border-white/[0.04] relative overflow-hidden h-28 sm:col-span-2">
                        <label className="flex w-full h-full cursor-pointer flex-col items-center justify-center p-2.5 text-center rounded-lg hover:bg-white/[0.03] select-none">
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleLogoUpload}
                          />
                          {logoPreview ? (
                            <img
                              src={logoPreview}
                              alt="Avatar"
                              className="h-11 w-11 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-md">
                              👤
                            </div>
                          )}
                          <span className="text-3xs font-bold uppercase tracking-wider text-white mt-1.5">
                            Upload Profile Photo
                          </span>
                        </label>
                      </div>

                      <Input
                        label="Full Name *"
                        placeholder="Sarah Connor"
                        {...contentForm.register("personalDetails.title")}
                      />
                      <Input
                        label="Industry"
                        placeholder="IT / Legal / Consulting"
                        {...contentForm.register("personalDetails.industry")}
                      />
                      <Input
                        label="Years of Experience"
                        type="number"
                        placeholder="5"
                        {...contentForm.register(
                          "personalDetails.yearsOfExperience",
                        )}
                      />

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-3xs font-semibold uppercase tracking-[0.2em] text-slate-400 block select-none">
                          Employment Status
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                            <input
                              type="radio"
                              value="self_employed"
                              checked={
                                watchedContent.personalDetails
                                  ?.employmentType === "self_employed"
                              }
                              onChange={() =>
                                contentForm.setValue(
                                  "personalDetails.employmentType",
                                  "self_employed",
                                )
                              }
                              className="text-brand-500 bg-white/5 border-white/10"
                            />
                            Self-Employed / Freelance
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                            <input
                              type="radio"
                              value="employed"
                              checked={
                                watchedContent.personalDetails
                                  ?.employmentType === "employed"
                              }
                              onChange={() =>
                                contentForm.setValue(
                                  "personalDetails.employmentType",
                                  "employed",
                                )
                              }
                              className="text-brand-500 bg-white/5 border-white/10"
                            />
                            Employed
                          </label>
                        </div>
                      </div>

                      {watchedContent.personalDetails?.employmentType ===
                      "employed" ? (
                        <>
                          <Input
                            label="Company / Organization Name *"
                            placeholder="Connor Inc."
                            {...contentForm.register(
                              "personalDetails.practiceName",
                            )}
                          />
                          <Input
                            label="Designation / Job Title *"
                            placeholder="Senior Consultant"
                            {...contentForm.register(
                              "personalDetails.designation",
                            )}
                          />
                          <Input
                            label="Department (Optional)"
                            placeholder="Advisory"
                            {...contentForm.register(
                              "personalDetails.department",
                            )}
                          />
                          <Input
                            label="Work Location (Optional)"
                            placeholder="San Francisco, CA"
                            {...contentForm.register(
                              "personalDetails.workLocation",
                            )}
                          />
                        </>
                      ) : (
                        <>
                          <Input
                            label="Practice / Brand Name (Optional)"
                            placeholder="Connor Consulting"
                            {...contentForm.register(
                              "personalDetails.practiceName",
                            )}
                          />
                          <Input
                            label="Service Area"
                            placeholder="E.g., Worldwide or Local"
                            {...contentForm.register(
                              "personalDetails.workLocation",
                            )}
                          />
                        </>
                      )}

                      <Input
                        label="Languages (comma separated)"
                        placeholder="English, Spanish"
                        {...contentForm.register(
                          "personalDetails.languagesRaw",
                        )}
                      />
                      <Input
                        label="Expertise Skills (comma separated)"
                        placeholder="React, Copywriting, Marketing"
                        {...contentForm.register("personalDetails.skillsRaw")}
                      />
                      <Input
                        label="Certifications (comma separated)"
                        placeholder="AWS Certified, Project Management"
                        {...contentForm.register(
                          "personalDetails.certificationsRaw",
                        )}
                      />
                    </div>

                    <Textarea
                      label="Professional biography details"
                      placeholder="Summarize your credentials, certifications, and value proposition..."
                      {...contentForm.register("personalDetails.bio")}
                    />

                    <div className="border-t border-white/[0.05] pt-4 space-y-3.5">
                      <span className="text-3xs font-bold uppercase tracking-wider text-brand-400 block">
                        Experience History builder
                      </span>
                      <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] space-y-3 text-xs">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input
                            label="Job Title"
                            value={newExp.title}
                            onChange={(e) =>
                              setNewExp({ ...newExp, title: e.target.value })
                            }
                            placeholder="E.g., Senior Designer"
                          />
                          <Input
                            label="Company Name"
                            value={newExp.company}
                            onChange={(e) =>
                              setNewExp({ ...newExp, company: e.target.value })
                            }
                            placeholder="E.g., Connor Inc."
                          />
                          <Input
                            label="Start Date"
                            value={newExp.startDate}
                            onChange={(e) =>
                              setNewExp({
                                ...newExp,
                                startDate: e.target.value,
                              })
                            }
                            placeholder="E.g., Jan 2021"
                          />
                          <Input
                            label="End Date"
                            value={newExp.endDate}
                            disabled={newExp.current}
                            onChange={(e) =>
                              setNewExp({ ...newExp, endDate: e.target.value })
                            }
                            placeholder="E.g., Present"
                          />
                        </div>
                        <label className="flex items-center gap-2 select-none cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newExp.current}
                            onChange={(e) =>
                              setNewExp({
                                ...newExp,
                                current: e.target.checked,
                                endDate: e.target.checked ? "Present" : "",
                              })
                            }
                            className="rounded bg-white/5 border-white/10"
                          />
                          <span className="text-3xs text-slate-400 font-bold uppercase">
                            Current Job
                          </span>
                        </label>
                        <Button
                          type="button"
                          variant="secondary"
                          className="w-full text-xs"
                          onClick={handleAddExperience}
                        >
                          Add Experience Node
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {experienceList.map((exp, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                          >
                            <div>
                              <h4 className="text-xs font-bold text-white">
                                {exp.title}
                              </h4>
                              <span className="text-3xs text-slate-500 block">
                                {exp.company} • {exp.startDate} - {exp.endDate}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveExperience(idx)}
                              className="h-6.5 w-6.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : null}

            {/* STEP 5: THEME SELECTION */}
            {activeStep === "theme" ? (
              <motion.div
                key="theme"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-white">
                    Choose profile color theme skin
                  </h2>
                  <p className="text-xs text-slate-400">
                    Choose a look that represents your identity.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {themeList.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setSelectedTheme(t)}
                      className={`flex flex-col gap-3 rounded-2xl p-4.5 text-left border ${
                        selectedTheme.key === t.key
                          ? "bg-brand-500/10 border-brand-500/30 text-white"
                          : "bg-white/[0.01] border-white/[0.04] text-slate-400 hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-extrabold">{t.name}</span>
                        <div className="flex gap-1">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: t.primary }}
                          />
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: t.accent }}
                          />
                        </div>
                      </div>
                      <span className="text-3xs text-slate-500 font-bold uppercase tracking-wider">
                        {t.mode} Mode theme pack
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : null}

            {/* STEP 6: AI CONTENT & CONTACTS */}
            {activeStep === "content" ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4 max-h-[380px] overflow-y-auto pr-1"
              >
                <div className="space-y-0.5">
                  <h2 className="font-display text-base font-bold text-white tracking-tight">
                    {selectedProfileType === "professional"
                      ? "AI-Assisted Bio & Contacts"
                      : "AI-Assisted Content & Contacts"}
                  </h2>
                  <p className="text-3xs text-slate-400 tracking-wide">
                    Fill in biographies, active social channels, and external
                    booklet URLs.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <span className="text-3xs font-bold uppercase tracking-wider text-brand-400 block border-b border-white/[0.05] pb-2">
                    Profile Headline Slogans
                  </span>
                  <div className="space-y-3">
                    <Input
                      label="Headline"
                      placeholder="E.g., Empowering businesses with software development"
                      {...contentForm.register("headline")}
                    />
                    <Textarea
                      label="Summary Paragraph"
                      placeholder="Provide a summary paragraph..."
                      {...contentForm.register("summary")}
                    />
                    <Input
                      label="Primary Button Link Label"
                      placeholder="Connect Profile"
                      {...contentForm.register("ctaLabel")}
                    />
                  </div>

                  <span className="text-3xs font-bold uppercase tracking-wider text-brand-400 block border-b border-white/[0.05] pb-2 mt-4">
                    Contact & Social Links
                  </span>
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <Input
                      label="Email Channel"
                      placeholder="sarah@connor.com"
                      {...contentForm.register("contactDetails.email")}
                    />
                    <Input
                      label="Phone Contact"
                      placeholder="+15551234"
                      {...contentForm.register("contactDetails.phone")}
                    />
                    <Input
                      label="WhatsApp Direct Connection Link"
                      placeholder="+15551234"
                      {...contentForm.register("contactDetails.whatsAppNumber")}
                      hint="Includes country code, digits only"
                    />
                    <Input
                      label="Personal Website URL"
                      placeholder="https://mywebsite.com"
                      {...contentForm.register("socialLinks.website")}
                    />
                    <Input
                      label="Address"
                      placeholder="123 Main St, San Francisco, CA"
                      {...contentForm.register("contactDetails.address")}
                    />
                    <Input
                      label="Google Maps Link"
                      placeholder="https://maps.google.com/..."
                      {...contentForm.register("contactDetails.mapsEmbedUrl")}
                    />

                    <Input
                      label="LinkedIn URL"
                      placeholder="https://linkedin.com/in/..."
                      {...contentForm.register("socialLinks.linkedin")}
                    />
                    <Input
                      label="Instagram URL"
                      placeholder="https://instagram.com/..."
                      {...contentForm.register("socialLinks.instagram")}
                    />
                    <Input
                      label="Facebook URL"
                      placeholder="https://facebook.com/..."
                      {...contentForm.register("socialLinks.facebook")}
                    />
                    <Input
                      label="X / Twitter URL"
                      placeholder="https://twitter.com/..."
                      {...contentForm.register("socialLinks.twitter")}
                    />
                    <Input
                      label="YouTube Channel URL"
                      placeholder="https://youtube.com/..."
                      {...contentForm.register("socialLinks.youtube")}
                    />
                    <Input
                      label="GitHub Handle Link"
                      placeholder="https://github.com/..."
                      {...contentForm.register("socialLinks.github")}
                    />
                  </div>

                  <span className="text-3xs font-bold uppercase tracking-wider text-brand-400 block border-b border-white/[0.05] pb-2 mt-4">
                    Add Custom Link Nodes
                  </span>
                  <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] space-y-3">
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <Input
                        label="Link Title"
                        value={newLink.title}
                        onChange={(e) =>
                          setNewLink({ ...newLink, title: e.target.value })
                        }
                        placeholder="E.g., Read My Portfolio Booklet"
                      />
                      <Input
                        label="Destination URL"
                        value={newLink.url}
                        onChange={(e) =>
                          setNewLink({ ...newLink, url: e.target.value })
                        }
                        placeholder="E.g., https://my-portfolio.com"
                      />
                    </div>
                    <Button
                      variant="secondary"
                      className="rounded-xl h-8.5 min-h-[34px] px-3.5 text-3xs font-bold w-full bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 border border-brand-500/20"
                      onClick={addCustomLink}
                    >
                      Add Link Node to Onboarding
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {customLinks.map((link, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            {link.title}
                          </h4>
                          <span className="text-3xs text-slate-500 block truncate max-w-[200px]">
                            {link.url}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCustomLink(idx)}
                          className="h-6.5 w-6.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between border-t border-white/[0.05] pt-4.5 gap-3 mt-4">
            <div>
              {["logo", "content"].includes(activeStep) ? (
                <Button
                  variant="ghost"
                  onClick={() => skipCurrent()}
                  className="rounded-xl h-8.5 min-h-[34px] px-3 text-3xs font-bold text-slate-400 hover:text-white"
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
                    const prevIndex = currentStepOrder.indexOf(activeStep) - 1;
                    const prevStep = currentStepOrder[Math.max(prevIndex, 0)];
                    setLocalStep(prevStep);
                    dispatch(setActiveStep(prevStep));
                  }}
                  className="rounded-xl h-8.5 min-h-[34px] px-3.5 text-3xs font-bold border-white/[0.08]"
                >
                  Back
                </Button>
              ) : null}

              <Button
                onClick={() => completeStep(activeStep)}
                loading={completeMutation.isPending}
                className="rounded-xl h-8.5 min-h-[34px] px-3.5 text-3xs font-bold"
              >
                {activeStep === "content" ? "Save" : "Continue"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Live Smartphone Chassis mockup */}
        <Card
          className="p-0 border-white/[0.06] bg-black overflow-hidden relative mx-auto lg:sticky lg:top-24 w-full max-w-[285px] rounded-3xl"
          hoverEffect={false}
        >
          <div className="absolute inset-0 pointer-events-none rounded-3xl border border-white/10 z-30" />
          <div className="w-full bg-[#090a0f] py-1.5 flex justify-center border-b border-white/[0.04]">
            <div className="w-12 h-2.5 rounded-full bg-black/80 flex items-center justify-center gap-1.5 px-3">
              <span className="h-0.75 w-0.75 rounded-full bg-slate-800" />
              <span className="h-0.75 w-3 rounded-full bg-slate-800" />
            </div>
          </div>

          <div className="p-4 min-h-[340px] max-h-[340px] overflow-y-auto bg-[#12141c] text-white space-y-3.5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4">
              {/* Dynamic Mock Header based on Profile Type */}
              <div className="flex items-center gap-3">
                {selectedProfileType === "professional" ? (
                  watchedContent.personalDetails?.avatarUrl || logoPreview ? (
                    <img
                      src={
                        watchedContent.personalDetails?.avatarUrl || logoPreview
                      }
                      alt="Avatar"
                      className="h-11 w-11 rounded-xl object-cover border border-white/10"
                    />
                  ) : (
                    <div className="h-11 w-11 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center font-bold text-xs text-brand-300">
                      {(watchedContent.personalDetails?.title || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )
                ) : logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="h-11 w-11 rounded-xl object-cover border border-white/10"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center font-bold text-xs">
                    OP
                  </div>
                )}

                <div className="min-w-0">
                  <div className="text-xs font-bold truncate max-w-[130px]">
                    {selectedProfileType === "professional"
                      ? watchedContent.personalDetails?.title || "Full Name"
                      : watchedCompany.companyName || "Company Name"}
                  </div>
                  <div className="text-3xs text-slate-400 truncate max-w-[150px] mt-0.5">
                    {selectedProfileType === "professional"
                      ? selectedProfessionalCategoryLabel ||
                        "Professional Category"
                      : selectedCategoryLabel || "Business Type"}
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/[0.06]" />

              <div className="space-y-1">
                <span className="text-3xs uppercase tracking-[0.2em] text-slate-500 font-bold block">
                  Biography
                </span>
                <p className="text-3xs text-slate-300 leading-normal truncate-3-lines">
                  {selectedProfileType === "professional"
                    ? watchedContent.personalDetails?.bio ||
                      "Describe your professional background..."
                    : watchedCompany.description ||
                      "Brief biography details..."}
                </p>
              </div>

              {selectedProfileType === "business" &&
              watchedCompany.gstNumber ? (
                <div className="p-2 rounded-lg bg-white/[0.01] border border-white/[0.04]">
                  <span className="text-3xs text-slate-500 font-bold uppercase block">
                    GSTIN
                  </span>
                  <span className="text-3xs font-bold text-white block mt-0.5">
                    {watchedCompany.gstNumber}
                  </span>
                </div>
              ) : null}

              {selectedProfileType === "professional" &&
              watchedContent.personalDetails?.skillsRaw ? (
                <div className="space-y-1">
                  <span className="text-3xs uppercase tracking-[0.2em] text-slate-500 font-bold block">
                    Skills
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {watchedContent.personalDetails.skillsRaw
                      .split(",")
                      .map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-brand-500/10 border border-brand-500/20 text-3xs font-bold text-brand-300"
                        >
                          {s.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
