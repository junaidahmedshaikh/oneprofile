import { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { parseCustomLink, renderCustomLinkIcon } from "../lib/customLinkHelper";
import clsx from "clsx";
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
  setProfileType,
  updateOnboardingData,
} from "../store/onboardingSlice";
import { setCredentials, setUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import { OnboardingStepper } from "../components/onboarding/OnboardingStepper";
import {
  Phone,
  MessageSquare,
  Mail,
  Download,
  CheckCircle2,
  Globe,
  MapPin,
  Sparkles,
  ExternalLink,
  Wifi,
  Battery,
  Signal,
  Eye,
  Edit3,
  Linkedin,
  Instagram,
  Twitter,
  Youtube,
  Github,
} from "lucide-react";

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
  whatsAppNumber: z.string().optional().or(z.literal("")),
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
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      (opt.label || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  const selectedOption = options.find((opt) => opt.key === value);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8 + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      setHighlightedIndex(0);
      const handleScrollResize = () => updateCoords();
      window.addEventListener("scroll", handleScrollResize, true);
      window.addEventListener("resize", handleScrollResize);
      return () => {
        window.removeEventListener("scroll", handleScrollResize, true);
        window.removeEventListener("resize", handleScrollResize);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        !e.target.closest(".searchable-dropdown-container") &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target))
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        onChange(filteredOptions[highlightedIndex].key);
        setIsOpen(false);
        setSearchTerm("");
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative space-y-1.5 min-w-0 searchable-dropdown-container">
      {label && (
        <label className="text-xs font-bold text-slate-700 block select-none">
          {label}
        </label>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left text-xs font-semibold text-slate-800 hover:border-slate-300 shadow-2xs transition-all active:scale-[0.99] select-none"
      >
        <span className={selectedOption ? "text-slate-900 font-semibold" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="text-slate-400 text-xs">▾</span>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
            }}
            className="z-[9999] mt-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl space-y-1.5 flex flex-col max-h-[280px] overflow-hidden"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search options..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#163300] focus:bg-white transition-colors duration-150"
              autoFocus
            />
            <div className="flex-1 overflow-y-auto pr-1 space-y-0.5 max-h-[200px] custom-scrollbar">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, idx) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      onChange(opt.key);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all duration-150 ${
                      value === opt.key
                        ? "bg-[#163300] text-white shadow-xs"
                        : highlightedIndex === idx
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))
              ) : (
                <div className="px-3 py-3 text-xs text-slate-400 font-medium text-center">
                  No options found
                </div>
              )}
            </div>
          </div>,
          document.body,
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
  const [mobileTab, setMobileTab] = useState("editor"); // "editor" | "preview"

  // Custom stepper parameters
  const [selectedProfileType, setSelectedProfileType] = useState("business");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProfessionalCategory, setSelectedProfessionalCategory] =
    useState("");
  const [selectedTheme, setSelectedTheme] = useState(themeList[0]);
  const [logoPreview, setLogoPreview] = useState("");
  const [resumeMessage, setResumeMessage] = useState("");

  const [initialCustomValues, setInitialCustomValues] = useState({
    profileType: "business",
    industry: "",
    category: "",
    professionalCategory: "",
    themeKey: "",
    experienceCount: 0,
  });

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
  const [newLink, setNewLink] = useState({ title: "", url: "", icon: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [showLinkFields, setShowLinkFields] = useState(false);
  const [urlError, setUrlError] = useState("");

  const isCustomDirty =
    selectedProfileType !== initialCustomValues.profileType ||
    selectedIndustry !== initialCustomValues.industry ||
    selectedCategory !== initialCustomValues.category ||
    selectedProfessionalCategory !== initialCustomValues.professionalCategory ||
    (selectedTheme?.key || "") !== (initialCustomValues.themeKey || "") ||
    experienceList.length !== initialCustomValues.experienceCount;

  const currentStepOrder = useMemo(() => {
    if (selectedProfileType === "professional") {
      return ["industry", "category", "logo", "content"];
    }
    return ["industry", "category", "company", "logo", "content"];
  }, [selectedProfileType]);

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
      whatsAppNumber: "",
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
      personalDetails: {
        title: "",
        bio: "",
        avatarUrl: "",
        coverImageUrl: "",
        languagesRaw: "",
        skillsRaw: "",
        certificationsRaw: "",
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

    const serverProfileType = stateQuery.data.profileType || "business";
    const serverStepOrder =
      serverProfileType === "professional"
        ? ["industry", "category", "logo", "content"]
        : ["industry", "category", "company", "logo", "content"];
    const serverStep = stateQuery.data.currentStep || "industry";
    const sanitizedStep = serverStep === "theme" ? "content" : serverStep;
    const validStep = serverStepOrder.includes(sanitizedStep)
      ? sanitizedStep
      : "industry";

    setLocalStep(validStep);
    dispatch(setActiveStep(validStep));
    setSelectedProfileType(serverProfileType);
    setSelectedIndustry(stateQuery.data.industry?.key || "");
    setSelectedCategory(stateQuery.data.businessCategory?.key || "");
    setSelectedProfessionalCategory(
      stateQuery.data.professionalCategory?.key || "",
    );
    setSelectedTheme(stateQuery.data.theme || themeList[0]);
    setExperienceList(stateQuery.data.experience || []);

    setInitialCustomValues({
      profileType: stateQuery.data.profileType || "business",
      industry: stateQuery.data.industry?.key || "",
      category: stateQuery.data.businessCategory?.key || "",
      professionalCategory: stateQuery.data.professionalCategory?.key || "",
      themeKey: stateQuery.data.theme?.key || "",
      experienceCount: (stateQuery.data.experience || []).length,
    });

    const remoteCompany = stateQuery.data.companyDetails || {};
    const currentCompany = companyForm.getValues();

    companyForm.reset({
      companyName:
        currentCompany.companyName || remoteCompany.companyName || "",
      legalName: currentCompany.legalName || remoteCompany.legalName || "",
      website: currentCompany.website || remoteCompany.website || "",
      email: currentCompany.email || remoteCompany.email || "",
      phone: currentCompany.phone || remoteCompany.phone || "",
      whatsAppNumber:
        currentCompany.whatsAppNumber ||
        remoteCompany.whatsAppNumber ||
        stateQuery.data.contactDetails?.whatsAppNumber ||
        "",
      city: currentCompany.city || remoteCompany.city || "",
      country: currentCompany.country || remoteCompany.country || "",
      tagline: currentCompany.tagline || remoteCompany.tagline || "",
      description:
        currentCompany.description || remoteCompany.description || "",
      gstNumber: currentCompany.gstNumber || remoteCompany.gstNumber || "",
      registrationDetails:
        currentCompany.registrationDetails ||
        remoteCompany.registrationDetails ||
        "",
      serviceArea:
        currentCompany.serviceArea || remoteCompany.serviceArea || "",
      foundedYear:
        currentCompany.foundedYear || remoteCompany.foundedYear || null,
      teamSize: currentCompany.teamSize || remoteCompany.teamSize || null,
    });

    contentForm.reset({
      headline: stateQuery.data.aiContent?.headline || "",
      summary: stateQuery.data.aiContent?.summary || "",
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

  const getMergedCompanyDetails = () => {
    const currentFormValues = companyForm.getValues();
    const reduxValues = onboardingState.companyDetails || {};
    return {
      companyName:
        currentFormValues.companyName || reduxValues.companyName || "",
      legalName: currentFormValues.legalName || reduxValues.legalName || "",
      website: currentFormValues.website || reduxValues.website || "",
      email: currentFormValues.email || reduxValues.email || "",
      phone: currentFormValues.phone || reduxValues.phone || "",
      city: currentFormValues.city || reduxValues.city || "",
      country: currentFormValues.country || reduxValues.country || "",
      tagline: currentFormValues.tagline || reduxValues.tagline || "",
      description:
        currentFormValues.description || reduxValues.description || "",
      gstNumber: currentFormValues.gstNumber || reduxValues.gstNumber || "",
      registrationDetails:
        currentFormValues.registrationDetails ||
        reduxValues.registrationDetails ||
        "",
      serviceArea:
        currentFormValues.serviceArea || reduxValues.serviceArea || "",
      foundedYear:
        currentFormValues.foundedYear || reduxValues.foundedYear || null,
      teamSize: currentFormValues.teamSize || reduxValues.teamSize || null,
    };
  };

  // Manual/Autosave draft helper
  const saveDraft = async () => {
    const companyValues = getMergedCompanyDetails();
    const contentValues = contentForm.getValues();

    await saveMutation.mutateAsync({
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
      companyDetails: {
        ...companyValues,
        tagline:
          selectedProfileType === "professional"
            ? contentValues.headline || companyValues.tagline || ""
            : companyValues.tagline || "",
      },
      theme: selectedTheme,
      completedSteps: onboardingState.completedSteps,
      skippedSteps: onboardingState.skippedSteps,
      experience: experienceList,
      aiContent: {
        headline: contentValues.headline || "",
        summary: contentValues.summary || "",
      },
      personalDetails: {
        title: contentValues.personalDetails?.title || "",
        bio: contentValues.personalDetails?.bio || "",
        avatarUrl: contentValues.personalDetails?.avatarUrl || "",
        coverImageUrl: contentValues.personalDetails?.coverImageUrl || "",
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
        designation: contentValues.personalDetails?.designation || "",
        yearsOfExperience: contentValues.personalDetails?.yearsOfExperience
          ? Number(contentValues.personalDetails.yearsOfExperience)
          : null,
        practiceName: contentValues.personalDetails?.practiceName || "",
        department: contentValues.personalDetails?.department || "",
        workLocation: contentValues.personalDetails?.workLocation || "",
        industry: contentValues.personalDetails?.industry || "",
      },
      contactDetails: {
        ...(contentValues.contactDetails || {}),
        email:
          selectedProfileType === "business"
            ? companyValues.email || contentValues.contactDetails?.email || ""
            : contentValues.contactDetails?.email || "",
        phone:
          selectedProfileType === "business"
            ? companyValues.phone || contentValues.contactDetails?.phone || ""
            : contentValues.contactDetails?.phone || "",
        whatsAppNumber:
          selectedProfileType === "business"
            ? companyValues.whatsAppNumber ||
              contentValues.contactDetails?.whatsAppNumber ||
              ""
            : contentValues.contactDetails?.whatsAppNumber || "",
      },
      socialLinks: contentValues.socialLinks || {},
    });
  };

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (payload) => onboardingApi.save(payload),
    onMutate: () => dispatch(setSaving(true)),
    onSuccess: async (res) => {
      dispatch(setOnboardingError(null));
      await queryClient.invalidateQueries({ queryKey: ["onboarding", "me"] });

      // Sync Redux auth user onboardingStatus to prevent route redirection
      dispatch(
        setUser({
          ...authUser,
          onboardingStatus: "in_progress",
        }),
      );

      const draft = res?.data?.data?.draft;
      if (draft) {
        setInitialCustomValues({
          profileType: draft.profileType || "business",
          industry: draft.industry?.key || "",
          category: draft.businessCategory?.key || "",
          professionalCategory: draft.professionalCategory?.key || "",
          themeKey: draft.theme?.key || "",
          experienceCount: (draft.experience || []).length,
        });
      }
      companyForm.reset(companyForm.getValues());
      contentForm.reset(contentForm.getValues());
      setSuccessMessage("Onboarding draft saved successfully ✓");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/dashboard");
      }, 1500);
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
    onSuccess: async (res, variables) => {
      dispatch(setOnboardingError(null));
      await queryClient.invalidateQueries({ queryKey: ["onboarding", "me"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

      // Sync Redux auth user onboardingStatus
      dispatch(
        setUser({
          ...authUser,
          onboardingStatus:
            variables?.step === "content" ? "published" : "in_progress",
        }),
      );

      const draft = res?.data?.data?.draft;
      if (draft) {
        setInitialCustomValues({
          profileType: draft.profileType || "business",
          industry: draft.industry?.key || "",
          category: draft.businessCategory?.key || "",
          professionalCategory: draft.professionalCategory?.key || "",
          themeKey: draft.theme?.key || "",
          experienceCount: (draft.experience || []).length,
        });
      }
      companyForm.reset(companyForm.getValues());
      contentForm.reset(contentForm.getValues());
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
      const companyValues = getMergedCompanyDetails();
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
        companyDetails: {
          ...companyValues,
          tagline:
            selectedProfileType === "professional"
              ? contentValues.headline || companyValues.tagline || ""
              : companyValues.tagline || "",
        },
        theme: selectedTheme,
        completedSteps: onboardingState.completedSteps,
        skippedSteps: onboardingState.skippedSteps,
        experience: experienceList,
        aiContent: {
          headline: contentValues.headline || "",
          summary: contentValues.summary || "",
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
          designation: contentValues.personalDetails?.designation || "",
          yearsOfExperience: contentValues.personalDetails?.yearsOfExperience
            ? Number(contentValues.personalDetails.yearsOfExperience)
            : null,
          practiceName: contentValues.personalDetails?.practiceName || "",
          department: contentValues.personalDetails?.department || "",
          workLocation: contentValues.personalDetails?.workLocation || "",
          industry: contentValues.personalDetails?.industry || "",
        },
        contactDetails: {
          ...(contentValues.contactDetails || {}),
          email:
            selectedProfileType === "business"
              ? companyValues.email || contentValues.contactDetails?.email || ""
              : contentValues.contactDetails?.email || "",
          phone:
            selectedProfileType === "business"
              ? companyValues.phone || contentValues.contactDetails?.phone || ""
              : contentValues.contactDetails?.phone || "",
          whatsAppNumber:
            selectedProfileType === "business"
              ? companyValues.whatsAppNumber ||
                contentValues.contactDetails?.whatsAppNumber ||
                ""
              : contentValues.contactDetails?.whatsAppNumber || "",
        },
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

  // const resumeMutation = useMutation({
  //   mutationFn: () => onboardingApi.resumeLater(),
  //   onSuccess: () => {
  //     dispatch(setOnboardingError(null));
  //     setResumeMessage(
  //       "Your onboarding draft has been saved. You can return here whenever you are ready.",
  //     );
  //   },
  // navigate("/dashboard", { replace: true });
  // });

  const addCustomLink = () => {
    setUrlError("");
    if (!newLink.title || !newLink.url) {
      setUrlError("Please enter both title and URL.");
      return;
    }
    try {
      const urlWithProtocol = newLink.url.match(/^https?:\/\//i)
        ? newLink.url
        : `https://${newLink.url}`;
      new URL(urlWithProtocol); // validates URL

      const titleWithIcon = newLink.icon
        ? `[${newLink.icon}] ${newLink.title}`
        : newLink.title;
      contentForm.setValue("socialLinks.customLinks", [
        ...customLinks,
        { title: titleWithIcon, url: urlWithProtocol },
      ]);
      setNewLink({ title: "", url: "", icon: "" });
      setShowLinkFields(false);
    } catch (e) {
      setUrlError("Please enter a valid URL (e.g., https://example.com).");
    }
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
      } else {
        const valid = await contentForm.trigger("personalDetails.title");
        if (!valid) return;
      }
    }
    if (step === "theme" && !selectedTheme) return;

    const companyValues = getMergedCompanyDetails();
    const contentValues = contentForm.getValues();

    const updatedCompleted = onboardingState.completedSteps.includes(step)
      ? onboardingState.completedSteps
      : [...onboardingState.completedSteps, step];

    // Store state in Redux (Single source of truth locally)
    dispatch(
      updateOnboardingData({
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
          languagesRaw: contentValues.personalDetails?.languagesRaw,
          skillsRaw: contentValues.personalDetails?.skillsRaw,
          certificationsRaw: contentValues.personalDetails?.certificationsRaw,
          designation: contentValues.personalDetails?.designation || "",
          yearsOfExperience:
            contentValues.personalDetails?.yearsOfExperience || "",
          practiceName: contentValues.personalDetails?.practiceName || "",
          department: contentValues.personalDetails?.department || "",
          workLocation: contentValues.personalDetails?.workLocation || "",
          industry: contentValues.personalDetails?.industry || "",
        },
        contactDetails: contentValues.contactDetails,
        socialLinks: contentValues.socialLinks,
        completedSteps: updatedCompleted,
      }),
    );

    if (step === "content") {
      const valid = await contentForm.trigger();
      if (!valid) return;
      // Single API Call on completion
      publishMutation.mutate();
      return;
    }

    const nextIndex = currentStepOrder.indexOf(step) + 1;
    const nextStep =
      currentStepOrder[Math.min(nextIndex, currentStepOrder.length - 1)];
    setLocalStep(nextStep);
    dispatch(setActiveStep(nextStep));
  };

  const skipCurrent = () => {
    const updatedSkipped = onboardingState.skippedSteps.includes(activeStep)
      ? onboardingState.skippedSteps
      : [...onboardingState.skippedSteps, activeStep];
    dispatch(updateOnboardingData({ skippedSteps: updatedSkipped }));

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
    };
    reader.readAsDataURL(file);
  };

  const publishReady =
    selectedProfileType === "professional"
      ? Boolean(
          selectedProfessionalCategory &&
          watchedContent.personalDetails?.title?.trim(),
        )
      : Boolean(selectedCategory && watchedCompany.companyName?.trim());

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
      {successMessage ? (
        <Alert variant="success">{successMessage}</Alert>
      ) : null}

      <div className="flex flex-col gap-4.5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1 select-none">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#163300] font-semibold">
            Workspace setup
          </span>
          <h1 className="font-display font-bold text-2xl tracking-tight text-[#121814] sm:text-3xl">
            Get published in under 5 minutes.
          </h1>
          <p className="max-w-xl text-xs leading-relaxed text-[#576159]">
            Configure your digital identity card and mobile microsite. Click Save &
            Exit anytime to preserve your progress.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0 items-center select-none">
          <Button
            variant="outline"
            loading={saveMutation.isPending}
            onClick={() => saveDraft()}
            className="text-xs font-semibold"
          >
            {saveMutation.isPending ? "Saving..." : "Save & Exit"}
          </Button>
          <Button
            variant="primary"
            loading={publishMutation.isPending}
            disabled={!publishReady}
            onClick={() => publishMutation.mutate()}
            className="text-xs font-semibold"
          >
            Publish Workspace
          </Button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <OnboardingStepper
        activeStep={activeStep}
        completedSteps={onboardingState.completedSteps || []}
        onStepClick={(stepId) => {
          setLocalStep(stepId);
          setMobileTab("editor");
        }}
        profileType={selectedProfileType}
      />

      {/* Mobile Mode Switcher: Edit Step vs Live Mobile Preview (Only on < lg screens) */}
      <div className="flex lg:hidden items-center justify-between p-1.5 rounded-xl bg-[#F6F5EE] border border-black/[0.08] shadow-2xs">
        <button
          type="button"
          onClick={() => setMobileTab("editor")}
          className={clsx(
            "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2",
            mobileTab === "editor"
              ? "bg-white text-[#121814] shadow-xs border border-black/[0.08] font-bold"
              : "text-[#576159] hover:text-[#121814]"
          )}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Step</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={clsx(
            "flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2",
            mobileTab === "preview"
              ? "bg-[#163300] text-[#9FE870] shadow-xs font-bold"
              : "text-[#576159] hover:text-[#121814]"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#9FE870] animate-pulse" />
          <Eye className="w-3.5 h-3.5" />
          <span>Live Mobile Preview</span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px] items-start">
        {/* Step configuration cards */}
        <Card
          className={clsx(
            "p-6 sm:p-8 rounded-2xl border border-black/[0.08] bg-white/95 backdrop-blur-sm shadow-[0_4px_20px_rgba(18,24,20,0.02)] relative overflow-hidden",
            mobileTab === "preview" ? "hidden lg:block" : "block"
          )}
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
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="font-display text-lg font-bold text-[#121814] tracking-tight">
                    What best describes you?
                  </h2>
                  <p className="text-xs text-[#576159]">
                    Choose between setting up a Business Organization card or an Individual Professional card.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProfileType("business");
                      dispatch(setProfileType("business"));
                    }}
                    className={`flex flex-col gap-3 rounded-xl p-5 text-left transition-all duration-200 border ${
                      selectedProfileType === "business"
                        ? "border-[#163300] bg-[#163300]/[0.04] ring-1 ring-[#163300] text-[#121814] shadow-xs"
                        : "border-black/[0.08] bg-white hover:border-black/[0.15] text-[#576159]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F6F5EE] border border-black/[0.08] flex items-center justify-center text-xl shadow-2xs">
                      🏢
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#121814] block">Business</span>
                      <span className="text-xs text-[#576159] leading-relaxed mt-1 block">
                        Company, Startup, Agency, Store, Brand, or Organization.
                      </span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProfileType("professional");
                      dispatch(setProfileType("professional"));
                    }}
                    className={`flex flex-col gap-3 rounded-xl p-5 text-left transition-all duration-200 border ${
                      selectedProfileType === "professional"
                        ? "border-[#163300] bg-[#163300]/[0.04] ring-1 ring-[#163300] text-[#121814] shadow-xs"
                        : "border-black/[0.08] bg-white hover:border-black/[0.15] text-[#576159]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F6F5EE] border border-black/[0.08] flex items-center justify-center text-xl shadow-2xs">
                      👤
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#121814] block">Professional</span>
                      <span className="text-xs text-[#576159] leading-relaxed mt-1 block">
                        Freelancer, Consultant, Practitioner, Doctor, Engineer, or Creator.
                      </span>
                    </div>
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
                className="space-y-5"
              >
                {selectedProfileType === "business" ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h2 className="font-display text-lg font-bold text-[#121814] tracking-tight">
                        Select Business Type
                      </h2>
                      <p className="text-xs text-[#576159]">
                        Choose the organization classification matching your startup, brand, or store.
                      </p>
                    </div>

                    <SearchableDropdown
                      options={businessTypes}
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      placeholder="Search and select business type..."
                      label="Business Type"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h2 className="font-display text-lg font-bold text-[#121814] tracking-tight">
                        Select Professional Category
                      </h2>
                      <p className="text-xs text-[#576159]">
                        Choose the credential category that best describes your profession.
                      </p>
                    </div>

                    <SearchableDropdown
                      options={professionalCategories}
                      value={selectedProfessionalCategory}
                      onChange={setSelectedProfessionalCategory}
                      placeholder="Search and select professional category..."
                      label="Professional Category"
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
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="font-display text-lg font-bold text-[#121814] tracking-tight">
                    Select Industry
                  </h2>
                  <p className="text-xs text-[#576159]">
                    Choose the industrial sector that outlines your primary field of operation.
                  </p>
                </div>

                <SearchableDropdown
                  options={industries}
                  value={selectedIndustry}
                  onChange={setSelectedIndustry}
                  placeholder="Search and select industry..."
                  label="Industry Sector"
                />
              </motion.div>
            ) : null}

            {/* STEP 4: DETAILS (BUSINESS OR PROFESSIONAL) & IMAGES */}
            {activeStep === "logo" ? (
              <motion.div key="logo" className="space-y-6">
                {selectedProfileType === "business" ? (
                  <form
                    onSubmit={companyForm.handleSubmit(() =>
                      completeStep("logo"),
                    )}
                    className="space-y-5"
                  >
                    <div className="space-y-1">
                      <h2 className="font-display text-lg font-bold text-[#121814] tracking-tight">
                        Business details & Logo
                      </h2>
                      <p className="text-xs text-[#576159]">
                        Configure corporate identifiers, address coordinates, and company logo.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-slate-300 relative overflow-hidden h-32 sm:col-span-2 transition-all">
                        <label className="flex w-full h-full cursor-pointer flex-col items-center justify-center p-3 text-center rounded-xl hover:bg-white/60 select-none">
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
                              className="h-12 w-12 rounded-xl object-cover border border-slate-200 bg-white p-1"
                            />
                          ) : (
                            <div className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-2xs">
                              📁
                            </div>
                          )}
                          <span className="text-xs font-bold text-slate-700 mt-2">
                            Upload Company Logo
                          </span>
                          <span className="text-[11px] text-slate-400">
                            PNG, JPG, or WebP (Max 5MB)
                          </span>
                        </label>
                      </div>

                      <Input
                        label="Company Name *"
                        placeholder="e.g. Connor Consulting"
                        {...companyForm.register("companyName")}
                        error={
                          companyForm.formState.errors.companyName?.message
                        }
                      />
                      <Input
                        label="Business Email"
                        placeholder="hello@company.com"
                        {...companyForm.register("email")}
                        error={companyForm.formState.errors.email?.message}
                      />
                      <Input
                        label="Business Phone Number"
                        placeholder="+91 9223047765"
                        {...companyForm.register("phone")}
                        error={companyForm.formState.errors.phone?.message}
                      />
                      <Input
                        label="WhatsApp Direct Connection"
                        placeholder="+91 9223047765"
                        {...companyForm.register("whatsAppNumber")}
                        error={
                          companyForm.formState.errors.whatsAppNumber?.message
                        }
                      />

                      <Input
                        label="City"
                        placeholder="e.g. Mumbai"
                        {...companyForm.register("city")}
                      />
                      <Input
                        label="Country"
                        placeholder="e.g. India"
                        {...companyForm.register("country")}
                      />
                      <div className="sm:col-span-2">
                        <Input
                          label="Headline"
                          placeholder="e.g. Securing cloud computing infrastructure"
                          {...companyForm.register("tagline")}
                        />
                      </div>

                      <Input
                        label="GST Identification Number (GSTIN)"
                        placeholder="e.g. 22AAAAA0000A1Z5"
                        {...companyForm.register("gstNumber")}
                      />
                      <Input
                        label="Business Registration Details"
                        placeholder="e.g. CIN or Trade License code"
                        {...companyForm.register("registrationDetails")}
                      />
                      <div className="sm:col-span-2">
                        <Input
                          label="Service Area"
                          placeholder="e.g. Mumbai, India or Worldwide"
                          {...companyForm.register("serviceArea")}
                        />
                      </div>

                      <Input
                        label="Founded Year"
                        type="number"
                        placeholder="e.g. 2018"
                        {...companyForm.register("foundedYear", {
                          valueAsNumber: true,
                        })}
                      />
                      <Input
                        label="Team Size"
                        type="number"
                        placeholder="e.g. 25"
                        {...companyForm.register("teamSize", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <Textarea
                      label="Business Description"
                      placeholder="Detailed description of your services..."
                      {...companyForm.register("description")}
                    />
                  </form>
                ) : (
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <h2 className="font-display text-lg font-bold text-[#121814] tracking-tight">
                        Professional biography & photo
                      </h2>
                      <p className="text-xs text-[#576159]">
                        Configure your professional credentials, experience history, and profile photo.
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-slate-300 relative overflow-hidden h-32 sm:col-span-2 transition-all">
                        <label className="flex w-full h-full cursor-pointer flex-col items-center justify-center p-3 text-center rounded-xl hover:bg-white/60 select-none">
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
                              className="h-12 w-12 rounded-xl object-cover border border-slate-200 bg-white p-1"
                            />
                          ) : (
                            <div className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-2xs">
                              👤
                            </div>
                          )}
                          <span className="text-xs font-bold text-slate-700 mt-2">
                            Upload Profile Photo
                          </span>
                          <span className="text-[11px] text-slate-400">
                            PNG, JPG, or WebP (Max 5MB)
                          </span>
                        </label>
                      </div>

                      <Input
                        label="Full Name *"
                        placeholder="e.g. Sarah Connor"
                        {...contentForm.register("personalDetails.title", {
                          required: "Full name is required",
                        })}
                        error={
                          contentForm.formState.errors.personalDetails?.title
                            ?.message
                        }
                      />
                      <Input
                        label="Industry"
                        placeholder="e.g. Technology / Cybersecurity"
                        {...contentForm.register("personalDetails.industry")}
                      />
                      <Input
                        label="Years of Experience"
                        type="number"
                        placeholder="e.g. 8"
                        {...contentForm.register(
                          "personalDetails.yearsOfExperience",
                        )}
                      />

                      <Input
                        label="Designation / Job Title"
                        placeholder="e.g. Senior Security Consultant"
                        {...contentForm.register("personalDetails.designation")}
                      />
                      <Input
                        label="Department (Optional)"
                        placeholder="e.g. Advisory Services"
                        {...contentForm.register("personalDetails.department")}
                      />
                      <Input
                        label="Work Location (Optional)"
                        placeholder="e.g. Remote or Mumbai, India"
                        {...contentForm.register(
                          "personalDetails.workLocation",
                        )}
                      />

                      <Input
                        label="Languages (comma separated)"
                        placeholder="e.g. English, Hindi"
                        {...contentForm.register(
                          "personalDetails.languagesRaw",
                        )}
                      />
                      <Input
                        label="Expertise Skills (comma separated)"
                        placeholder="e.g. Cloud Security, CISSP, Auditing"
                        {...contentForm.register("personalDetails.skillsRaw")}
                      />
                      <div className="sm:col-span-2">
                        <Input
                          label="Certifications (comma separated)"
                          placeholder="e.g. AWS Certified Solutions Architect, CISSP"
                          {...contentForm.register(
                            "personalDetails.certificationsRaw",
                          )}
                        />
                      </div>
                    </div>

                    <Textarea
                      label="Professional Biography"
                      placeholder="Summarize your credentials, certifications, and value proposition..."
                      {...contentForm.register("personalDetails.bio")}
                    />

                    <div className="border-t border-slate-200/80 pt-4 space-y-3.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#163300] block">
                        Experience History
                      </span>
                      <div className="p-4.5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3.5 text-xs">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Input
                            label="Job Title"
                            value={newExp.title}
                            onChange={(e) =>
                              setNewExp({ ...newExp, title: e.target.value })
                            }
                            placeholder="e.g. Senior Security Consultant"
                          />
                          <Input
                            label="Company Name"
                            value={newExp.company}
                            onChange={(e) =>
                              setNewExp({ ...newExp, company: e.target.value })
                            }
                            placeholder="e.g. Connor Security Advisory"
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
                            placeholder="e.g. Jan 2021"
                          />
                          <Input
                            label="End Date"
                            value={newExp.endDate}
                            disabled={newExp.current}
                            onChange={(e) =>
                              setNewExp({ ...newExp, endDate: e.target.value })
                            }
                            placeholder="e.g. Present"
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
                            className="rounded border-slate-300 text-[#163300] focus:ring-[#9FE870]"
                          />
                          <span className="text-xs text-slate-700 font-semibold">
                            I currently work here
                          </span>
                        </label>
                        <Button
                          type="button"
                          variant="secondary"
                          className="w-full text-xs font-bold"
                          onClick={handleAddExperience}
                        >
                          Add Experience Position
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {experienceList.map((exp, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-3 rounded-xl bg-white border border-slate-200 shadow-2xs"
                          >
                            <div>
                              <h4 className="text-xs font-bold text-slate-900">
                                {exp.title}
                              </h4>
                              <span className="text-xs text-slate-500 block mt-0.5">
                                {exp.company} • {exp.startDate} - {exp.endDate}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveExperience(idx)}
                              className="h-7 w-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center text-xs shrink-0"
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
                  <h2 className="font-display text-lg font-bold text-[#121814] tracking-tight">
                    Choose profile color theme
                  </h2>
                  <p className="text-xs text-[#576159]">
                    Select an elegant color harmony that defines your brand identity.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {themeList.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setSelectedTheme(t)}
                      className={`flex flex-col gap-3 rounded-xl p-4.5 text-left border transition-all duration-200 ${
                        selectedTheme.key === t.key
                          ? "bg-[#163300]/[0.04] border-[#163300] text-[#121814] ring-1 ring-[#163300] shadow-xs"
                          : "bg-white border-black/[0.08] text-[#576159] hover:border-black/[0.15] hover:text-[#121814]"
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-bold text-[#121814]">{t.name}</span>
                        <div className="flex gap-1.5 p-1 rounded-full bg-[#F6F5EE] border border-black/[0.06]">
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: t.primary }}
                          />
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: t.accent }}
                          />
                        </div>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#879289]">
                        {t.mode} Palette
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
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="font-display text-lg font-bold text-[#121814] tracking-tight">
                    {selectedProfileType === "professional"
                      ? "Bio & Contact Channels"
                      : "Content & Contact Channels"}
                  </h2>
                  <p className="text-xs text-[#576159]">
                    Add your headline slogan, communication channels, social media, and portfolio links.
                  </p>
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#163300] block border-b border-black/[0.08] pb-2">
                    Profile Headline
                  </span>
                  <div className="space-y-3">
                    <Input
                      label="Headline"
                      placeholder="e.g. Empowering modern businesses with next-generation cloud advisory"
                      {...contentForm.register("headline")}
                    />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-[#163300] block border-b border-slate-200/80 pb-2 mt-6">
                    Contact & Social Connections
                  </span>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {selectedProfileType === "professional" && (
                      <>
                        <Input
                          label="Personal Email"
                          placeholder="sarah@example.com"
                          {...contentForm.register("contactDetails.email")}
                        />
                        <Input
                          label="Personal Phone Number"
                          placeholder="+91 9223047765"
                          {...contentForm.register("contactDetails.phone")}
                        />
                        <Input
                          label="WhatsApp Direct Connection Link"
                          placeholder="+91 9223047765"
                          {...contentForm.register(
                            "contactDetails.whatsAppNumber",
                          )}
                        />
                      </>
                    )}
                    <Input
                      label={
                        selectedProfileType === "business"
                          ? "Company Website URL"
                          : "Personal Website URL"
                      }
                      placeholder="https://example.com"
                      {...contentForm.register("socialLinks.website")}
                    />
                    <Input
                      label="Location / Address"
                      placeholder="Mumbai, Maharashtra, India"
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

                  <span className="text-xs font-bold uppercase tracking-wider text-[#163300] block border-b border-slate-200/80 pb-2 mt-6">
                    Custom Links & Booklets
                  </span>

                  {!showLinkFields ? (
                    <Button
                      variant="secondary"
                      className="w-full text-xs font-bold"
                      onClick={() => setShowLinkFields(true)}
                    >
                      + Add Custom Link
                    </Button>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-3">
                      <div className="grid gap-3.5 sm:grid-cols-3">
                        <Input
                          label="Link Title *"
                          value={newLink.title}
                          onChange={(e) =>
                            setNewLink({ ...newLink, title: e.target.value })
                          }
                          placeholder="e.g. Portfolio"
                        />
                        <Input
                          label="Destination URL *"
                          value={newLink.url}
                          onChange={(e) =>
                            setNewLink({ ...newLink, url: e.target.value })
                          }
                          placeholder="e.g. https://example.com"
                        />
                        <div className="flex flex-col space-y-1">
                          <label className="text-xs font-bold text-slate-700">
                            Optional Icon
                          </label>
                          <select
                            value={newLink.icon}
                            onChange={(e) =>
                              setNewLink({ ...newLink, icon: e.target.value })
                            }
                            className="h-10 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 px-3 focus:outline-none focus:border-[#163300]"
                          >
                            <option value="">None</option>
                            <option value="globe">Globe</option>
                            <option value="link">Link</option>
                            <option value="book">Book</option>
                            <option value="star">Star</option>
                            <option value="mail">Mail</option>
                            <option value="phone">Phone</option>
                          </select>
                        </div>
                      </div>
                      {urlError && (
                        <p className="text-xs font-semibold text-rose-600">
                          {urlError}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 text-xs font-bold"
                          onClick={() => {
                            setShowLinkFields(false);
                            setUrlError("");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          className="flex-1 text-xs font-bold"
                          onClick={addCustomLink}
                        >
                          Save Link
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mt-3">
                    {customLinks.map((link, idx) => {
                      const parsed = parseCustomLink(link.title);
                      return (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-3 rounded-xl bg-white border border-slate-200 shadow-2xs"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {renderCustomLinkIcon(parsed.icon)}
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {parsed.title}
                              </h4>
                            </div>
                            <span className="text-xs text-slate-500 block truncate max-w-[200px] mt-0.5">
                              {link.url}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomLink(idx)}
                            className="h-7 w-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center text-xs shrink-0 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between border-t border-slate-200/80 pt-5 gap-3 mt-6">
            <div>
              {["logo", "content"].includes(activeStep) ? (
                <Button
                  variant="ghost"
                  onClick={() => skipCurrent()}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  Skip Step
                </Button>
              ) : (
                <div />
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Quick Mobile Preview trigger for small screens */}
              <button
                type="button"
                onClick={() => setMobileTab("preview")}
                className="lg:hidden inline-flex items-center gap-1.5 text-xs font-bold text-[#163300] bg-[#9FE870]/25 hover:bg-[#9FE870]/40 border border-[#163300]/20 px-3 py-2 rounded-xl transition-all shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>

              {activeStep !== "industry" ? (
                <Button
                  variant="outline"
                  disabled={
                    completeMutation.isPending || saveMutation.isPending
                  }
                  onClick={() => {
                    const prevIndex = currentStepOrder.indexOf(activeStep) - 1;
                    const prevStep = currentStepOrder[Math.max(prevIndex, 0)];
                    setLocalStep(prevStep);
                    dispatch(setActiveStep(prevStep));
                  }}
                  className="text-xs font-bold"
                >
                  ← Back
                </Button>
              ) : null}

              <Button
                onClick={() => completeStep(activeStep)}
                loading={completeMutation.isPending}
                disabled={completeMutation.isPending || saveMutation.isPending}
                variant="primary"
                className="text-xs font-bold"
              >
                {activeStep === "content" ? "Save & Publish" : "Continue →"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Live Smartphone Chassis mockup - Responsive to website width and height */}
        <div
          className={clsx(
            "relative w-full max-w-[280px] sm:max-w-[295px] xl:max-w-[315px] mx-auto lg:sticky lg:top-20 select-none group",
            mobileTab === "editor" ? "hidden lg:block" : "block"
          )}
        >
          {/* Mobile Back to Editor banner (Only on < lg screens) */}
          <div className="lg:hidden flex items-center justify-between bg-white border border-black/[0.08] rounded-xl p-2.5 mb-2.5 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#163300] animate-pulse" />
              <span className="text-xs font-semibold text-[#121814]">
                Mobile Preview
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMobileTab("editor")}
              className="text-xs font-medium h-7 px-3"
            >
              ← Back to Edit
            </Button>
          </div>

          {/* Subtle Ambient Glow behind Phone */}
          <div
            className="absolute -inset-4 bg-gradient-to-b from-[#9FE870]/15 via-[#163300]/5 to-transparent rounded-[44px] blur-xl -z-10 pointer-events-none transition-opacity duration-500 opacity-70 group-hover:opacity-100"
            aria-hidden="true"
          />

          <div className="text-center mb-2 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#163300] animate-pulse" />
            <span className="text-[10px] font-mono font-medium text-[#576159] uppercase tracking-wider">
              Live Preview
            </span>
            <span className="text-[9px] font-mono text-[#879289] bg-[#F6F5EE] border border-black/[0.06] px-1.5 py-0.5 rounded">
              Synced
            </span>
          </div>

          {/* Smartphone Outer Chassis Frame */}
          <div className="p-0 border-[5px] sm:border-[6px] border-[#121814] bg-[#121814] overflow-hidden relative w-full rounded-[38px] sm:rounded-[42px] shadow-[0_24px_60px_rgba(18,24,20,0.18),0_6px_16px_rgba(0,0,0,0.08)] transition-all duration-300">
            {/* Top Bezel: Status Bar & Dynamic Island */}
            <div className="w-full bg-[#121814] text-[#879289] px-4 pt-2 pb-1.5 flex items-center justify-between text-[10px] font-medium border-b border-white/[0.04] select-none">
              <span className="font-semibold text-white/90">9:41</span>

              {/* Dynamic Island */}
              <div className="w-20 h-4 rounded-full bg-black flex items-center justify-center gap-1.5 px-2.5 border border-white/[0.06] shadow-inner">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1c241e] border border-white/[0.05]" />
                <span className="h-1.5 w-2.5 rounded-full bg-[#1c241e] border border-white/[0.05]" />
              </div>

              <div className="flex items-center gap-1 text-white/80">
                <Signal className="w-2.5 h-2.5" />
                <Wifi className="w-2.5 h-2.5" />
                <Battery className="w-3 h-3" />
              </div>
            </div>

            {/* Mobile Viewport Screen Content */}
            <div className="h-[430px] sm:h-[460px] xl:h-[490px] max-h-[calc(100vh-230px)] overflow-y-auto bg-[#FAFAF7] text-[#121814] relative custom-scrollbar">
              {/* Mobile Hero Cover Banner */}
              <div
                className="h-20 sm:h-22 w-full relative overflow-hidden flex items-end p-2.5 transition-colors duration-300"
                style={{
                  background: watchedContent.personalDetails?.coverImageUrl
                    ? `url(${watchedContent.personalDetails.coverImageUrl}) center/cover no-repeat`
                    : `linear-gradient(135deg, ${selectedTheme?.primary || "#163300"} 0%, ${selectedTheme?.accent || "#9FE870"} 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/90 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded">
                    {selectedProfileType === "professional" ? "Professional" : "Business"}
                  </span>
                  <span className="text-[9px] font-mono text-white/90 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9FE870]" />
                    Live
                  </span>
                </div>
              </div>

              {/* Avatar & Verification Header */}
              <div className="px-3 relative -mt-8 mb-2.5 flex items-end justify-between">
                {/* Avatar / Logo with border & ring */}
                <div className="relative">
                  {selectedProfileType === "professional" ? (
                    watchedContent.personalDetails?.avatarUrl || logoPreview ? (
                      <img
                        src={watchedContent.personalDetails?.avatarUrl || logoPreview}
                        alt="Avatar"
                        className="h-15 w-15 sm:h-16 sm:w-16 rounded-xl object-cover border-[2.5px] border-white bg-white shadow-md shrink-0"
                      />
                    ) : (
                      <div className="h-15 w-15 sm:h-16 sm:w-16 rounded-xl bg-[#163300] text-[#9FE870] border-[2.5px] border-white flex items-center justify-center font-bold text-base shadow-md shrink-0 font-display">
                        {(watchedContent.personalDetails?.title || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )
                  ) : logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="h-15 w-15 sm:h-16 sm:w-16 rounded-xl object-cover border-[2.5px] border-white bg-white shadow-md shrink-0"
                    />
                  ) : (
                    <div className="h-15 w-15 sm:h-16 sm:w-16 rounded-xl bg-[#163300] text-[#9FE870] border-[2.5px] border-white flex items-center justify-center font-bold text-xs shadow-md shrink-0 font-display">
                      OP
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 p-0.5 bg-white rounded-full shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#163300]" />
                  </span>
                </div>

                <div className="text-right pb-0.5">
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono text-[#163300] bg-[#F6F5EE] border border-black/[0.08] px-2 py-0.5 rounded-full shadow-2xs">
                    oneprofile.in
                  </span>
                </div>
              </div>

              {/* Identity Details */}
              <div className="px-3 space-y-0.5">
                <h3 className="text-sm font-display font-bold text-[#121814] leading-tight">
                  {selectedProfileType === "professional"
                    ? watchedContent.personalDetails?.title || "Your Full Name"
                    : watchedCompany.companyName || "Your Company Name"}
                </h3>

                <p className="text-[11px] font-medium text-[#163300]">
                  {selectedProfileType === "professional"
                    ? watchedContent.personalDetails?.designation || selectedProfessionalCategoryLabel || "Professional Category"
                    : watchedCompany.tagline || selectedCategoryLabel || "Business Category"}
                </p>

                {(watchedCompany.city || watchedContent.personalDetails?.workLocation) && (
                  <div className="flex items-center gap-1 text-[10px] text-[#576159] pt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-[#879289] shrink-0" />
                    <span className="truncate">
                      {[
                        watchedCompany.city || watchedContent.personalDetails?.workLocation,
                        watchedCompany.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile Quick Action Buttons Row */}
              <div className="px-3 pt-2.5 pb-1.5">
                <div className="grid grid-cols-4 gap-1">
                  <div
                    className={clsx(
                      "flex flex-col items-center justify-center p-1.5 rounded-lg text-center border transition-all",
                      watchedContent.contactDetails?.phone || watchedCompany.phone
                        ? "bg-white border-black/[0.08] text-[#121814] shadow-2xs"
                        : "bg-[#F6F5EE] border-dashed border-black/[0.08] text-[#879289]"
                    )}
                  >
                    <Phone className="w-3.5 h-3.5 text-[#163300] mb-0.5" />
                    <span className="text-[9px] font-medium">Call</span>
                  </div>

                  <div
                    className={clsx(
                      "flex flex-col items-center justify-center p-1.5 rounded-lg text-center border transition-all",
                      watchedContent.contactDetails?.whatsAppNumber || watchedCompany.whatsAppNumber
                        ? "bg-white border-black/[0.08] text-[#121814] shadow-2xs"
                        : "bg-[#F6F5EE] border-dashed border-black/[0.08] text-[#879289]"
                    )}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#163300] mb-0.5" />
                    <span className="text-[9px] font-medium">WhatsApp</span>
                  </div>

                  <div
                    className={clsx(
                      "flex flex-col items-center justify-center p-1.5 rounded-lg text-center border transition-all",
                      watchedContent.contactDetails?.email || watchedCompany.email
                        ? "bg-white border-black/[0.08] text-[#121814] shadow-2xs"
                        : "bg-[#F6F5EE] border-dashed border-black/[0.08] text-[#879289]"
                    )}
                  >
                    <Mail className="w-3.5 h-3.5 text-[#121814] mb-0.5" />
                    <span className="text-[9px] font-medium">Email</span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-1.5 rounded-lg text-center border bg-[#163300] border-[#163300] text-white shadow-2xs">
                    <Download className="w-3.5 h-3.5 text-[#9FE870] mb-0.5" />
                    <span className="text-[9px] font-semibold">Save</span>
                  </div>
                </div>
              </div>

              {/* Main Card Content Stack */}
              <div className="px-3 py-1.5 space-y-2">
                {/* About / Bio Card */}
                <div className="p-2.5 rounded-xl bg-white border border-black/[0.08] shadow-2xs space-y-0.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#879289] font-medium block">
                    About
                  </span>
                  <p className="text-[11px] text-[#576159] leading-relaxed">
                    {selectedProfileType === "professional"
                      ? watchedContent.personalDetails?.bio ||
                        "Describe your professional experience and specialties here..."
                      : watchedCompany.description ||
                        "Brief overview of company offerings, mission, and services..."}
                  </p>
                </div>

                {/* Business Specific Details */}
                {selectedProfileType === "business" && (
                  <div className="p-2.5 rounded-xl bg-white border border-black/[0.08] shadow-2xs space-y-1.5">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#879289] font-medium block">
                      Business Details
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                      {watchedCompany.gstNumber ? (
                        <div>
                          <span className="text-[9px] text-[#879289] block">GSTIN</span>
                          <span className="font-semibold text-[#121814] font-mono">{watchedCompany.gstNumber}</span>
                        </div>
                      ) : null}
                      {watchedCompany.foundedYear ? (
                        <div>
                          <span className="text-[9px] text-[#879289] block">Founded</span>
                          <span className="font-semibold text-[#121814]">{watchedCompany.foundedYear}</span>
                        </div>
                      ) : null}
                      {watchedCompany.teamSize ? (
                        <div>
                          <span className="text-[9px] text-[#879289] block">Team</span>
                          <span className="font-semibold text-[#121814]">{watchedCompany.teamSize}+ Members</span>
                        </div>
                      ) : null}
                      {watchedCompany.serviceArea ? (
                        <div className="col-span-2">
                          <span className="text-[9px] text-[#879289] block">Service Area</span>
                          <span className="font-semibold text-[#121814]">{watchedCompany.serviceArea}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Professional Skills / Practice */}
                {selectedProfileType === "professional" && (
                  <div className="p-2.5 rounded-xl bg-white border border-black/[0.08] shadow-2xs space-y-1.5">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#879289] font-medium block">
                      Expertise & Skills
                    </span>
                    {watchedContent.personalDetails?.skillsRaw ? (
                      <div className="flex gap-1 flex-wrap">
                        {watchedContent.personalDetails.skillsRaw
                          .split(",")
                          .map((s, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded-md bg-[#F6F5EE] border border-black/[0.06] text-[9px] font-medium text-[#121814]"
                            >
                              {s.trim()}
                            </span>
                          ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-[#879289] italic">
                        Your skills will appear here as badges...
                      </p>
                    )}
                  </div>
                )}

                {/* Social & Digital Links */}
                <div className="p-2.5 rounded-xl bg-white border border-black/[0.08] shadow-2xs space-y-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#879289] font-medium block">
                    Online Presence
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {watchedContent.socialLinks?.website || watchedCompany.website ? (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F6F5EE] border border-black/[0.06] text-[#121814] text-[9px] font-medium">
                        <Globe className="w-2.5 h-2.5 text-[#163300]" />
                        <span>Website</span>
                      </div>
                    ) : null}
                    {watchedContent.socialLinks?.linkedin && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F6F5EE] border border-black/[0.06] text-[#121814] text-[9px] font-medium">
                        <Linkedin className="w-2.5 h-2.5 text-[#163300]" />
                        <span>LinkedIn</span>
                      </div>
                    )}
                    {watchedContent.socialLinks?.instagram && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F6F5EE] border border-black/[0.06] text-[#121814] text-[9px] font-medium">
                        <Instagram className="w-2.5 h-2.5 text-[#163300]" />
                        <span>Instagram</span>
                      </div>
                    )}
                    {watchedContent.socialLinks?.twitter && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F6F5EE] border border-black/[0.06] text-[#121814] text-[9px] font-medium">
                        <Twitter className="w-2.5 h-2.5 text-[#163300]" />
                        <span>Twitter/X</span>
                      </div>
                    )}
                    {watchedContent.socialLinks?.youtube && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F6F5EE] border border-black/[0.06] text-[#121814] text-[9px] font-medium">
                        <Youtube className="w-2.5 h-2.5 text-[#163300]" />
                        <span>YouTube</span>
                      </div>
                    )}
                    {watchedContent.socialLinks?.github && (
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#121814] text-white text-[9px] font-medium">
                        <Github className="w-2.5 h-2.5" />
                        <span>GitHub</span>
                      </div>
                    )}
                    {customLinks.map((link, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F6F5EE] border border-black/[0.06] text-[#163300] text-[9px] font-medium"
                      >
                        <ExternalLink className="w-2.5 h-2.5 text-[#163300]" />
                        <span className="truncate max-w-[80px]">{link.title}</span>
                      </div>
                    ))}
                    {!watchedContent.socialLinks?.website &&
                    !watchedCompany.website &&
                    !watchedContent.socialLinks?.linkedin &&
                    !watchedContent.socialLinks?.instagram &&
                    !watchedContent.socialLinks?.twitter &&
                    !watchedContent.socialLinks?.youtube &&
                    !watchedContent.socialLinks?.github &&
                    customLinks.length === 0 ? (
                      <span className="text-[10px] text-[#879289] italic">
                        Connected links will display here...
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Footer Brand pill inside phone screen */}
                <div className="pt-1.5 pb-2 text-center">
                  <span className="inline-flex items-center gap-1 text-[8px] font-mono text-[#879289] tracking-wider uppercase">
                    ⚡ Powered by OneProfile.in
                  </span>
                </div>
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="sticky bottom-0 inset-x-0 py-1 bg-[#FAFAF7]/90 backdrop-blur-xs flex justify-center pointer-events-none">
                <div className="w-24 h-1 rounded-full bg-black/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
