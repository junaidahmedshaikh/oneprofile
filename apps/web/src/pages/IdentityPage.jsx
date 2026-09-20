import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { profileApi } from "../lib/profileApi";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Alert } from "../components/ui/Alert";
import { Spinner } from "../components/ui/Spinner";
import clsx from "clsx";
import { BusinessProfileForm } from "../components/profile/BusinessProfileForm";
import { ProfessionalProfileForm } from "../components/profile/ProfessionalProfileForm";
import { BusinessPreview } from "../components/profile/BusinessPreview";
import { ProfessionalPreview } from "../components/profile/ProfessionalPreview";
import { BillingTab } from "../components/profile/BillingTab";
import { SecurityTab } from "../components/profile/SecurityTab";
import {
  User,
  Briefcase,
  Link2,
  Settings,
  Building2,
  Tag,
  Globe,
  Lock,
  QrCode,
  MessageSquare,
  Linkedin,
  Mail,
  Download,
  ExternalLink,
  Check,
  Save,
} from "lucide-react";

const schema = z.object({
  slug: z.string().optional().or(z.literal("")),
  title: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  avatarUrl: z.string().optional().or(z.literal("")),
  coverImageUrl: z.string().optional().or(z.literal("")),
  languagesRaw: z.string().optional().or(z.literal("")),
  skillsRaw: z.string().optional().or(z.literal("")),
  certificationsRaw: z.string().optional().or(z.literal("")),
  companyName: z.string().optional().or(z.literal("")),
  headline: z.string().optional().or(z.literal("")),
  tagline: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
  gstNumber: z.string().optional().or(z.literal("")),
  registrationDetails: z.string().optional().or(z.literal("")),
  serviceArea: z.string().optional().or(z.literal("")),
  foundedYear: z.number().nullable().optional(),
  teamSize: z.number().nullable().optional(),
  visibility: z.enum(["public", "private", "unlisted"]).default("public"),
  designation: z.string().optional().or(z.literal("")),
  yearsOfExperience: z.number().nullable().optional(),
  practiceName: z.string().optional().or(z.literal("")),
  department: z.string().optional().or(z.literal("")),
  workLocation: z.string().optional().or(z.literal("")),
  industry: z.string().optional().or(z.literal("")),
  socialLinks: z
    .object({
      linkedin: z.string().optional().or(z.literal("")),
      twitter: z.string().optional().or(z.literal("")),
      github: z.string().optional().or(z.literal("")),
      website: z.string().optional().or(z.literal("")),
      instagram: z.string().optional().or(z.literal("")),
      facebook: z.string().optional().or(z.literal("")),
      youtube: z.string().optional().or(z.literal("")),
      customLinks: z
        .array(
          z.object({
            title: z.string(),
            url: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),
  contactDetails: z
    .object({
      email: z
        .string()
        .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
          message: "Enter a valid email",
        })
        .optional()
        .or(z.literal("")),
      phone: z.string().optional().or(z.literal("")),
      whatsAppNumber: z.string().optional().or(z.literal("")),
    })
    .optional(),
  location: z
    .object({
      address: z.string().optional().or(z.literal("")),
      city: z.string().optional().or(z.literal("")),
      country: z.string().optional().or(z.literal("")),
      mapsEmbedUrl: z.string().optional().or(z.literal("")),
    })
    .optional(),
  seo: z
    .object({
      metaTitle: z.string().optional().or(z.literal("")),
      metaDescription: z.string().optional().or(z.literal("")),
      keywordsRaw: z.string().optional().or(z.literal("")),
    })
    .optional(),
});

export function IdentityPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const authUser = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [isAutosaving, setIsAutosaving] = useState(false);

  // Share & QR actions states
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // 1. Fetch Profile Details
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      const response = await profileApi.me();
      return response.data.data;
    },
  });

  const currentTabList = useMemo(() => {
    return profile?.profileType === "professional"
      ? [
          {
            id: "personal",
            label: "Personal Info",
            icon: <User className="w-4 h-4 text-indigo-400" />,
          },
          {
            id: "experience",
            label: "Experience",
            icon: <Briefcase className="w-4 h-4 text-purple-400" />,
          },
          {
            id: "contact",
            label: "Hours & Links",
            icon: <Link2 className="w-4 h-4 text-[#2563EB]" />,
          },
          {
            id: "seo",
            label: "SEO & Privacy",
            icon: <Settings className="w-4 h-4 text-[#6B7280]" />,
          },
        ]
      : [
          {
            id: "business",
            label: "Business Details",
            icon: <Building2 className="w-4 h-4 text-blue-400" />,
          },
          {
            id: "offerings",
            label: "Offerings & Pricing",
            icon: <Tag className="w-4 h-4 text-amber-400" />,
          },
          {
            id: "contact",
            label: "Hours & Links",
            icon: <Link2 className="w-4 h-4 text-[#2563EB]" />,
          },
          {
            id: "seo",
            label: "SEO & Privacy",
            icon: <Settings className="w-4 h-4 text-[#6B7280]" />,
          },
        ];
  }, [profile?.profileType]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      slug: "",
      title: "",
      bio: "",
      avatarUrl: "",
      coverImageUrl: "",
      languagesRaw: "",
      skillsRaw: "",
      certificationsRaw: "",
      companyName: "",
      headline: "",
      tagline: "",
      description: "",
      logoUrl: "",
      gstNumber: "",
      registrationDetails: "",
      serviceArea: "",
      foundedYear: null,
      teamSize: null,
      visibility: "public",
      designation: "",
      yearsOfExperience: null,
      practiceName: "",
      department: "",
      workLocation: "",
      industry: "",
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
      contactDetails: { email: "", phone: "", whatsAppNumber: "" },
      location: { address: "", city: "", country: "", mapsEmbedUrl: "" },
      seo: { metaTitle: "", metaDescription: "", keywordsRaw: "" },
    },
  });

  const { register, watch, setValue, formState, reset } = form;
  const watchedValues = watch();

  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate form states when query completes
  useEffect(() => {
    if (!profile || isHydrated) return;
    setIsHydrated(true);
    reset({
      slug: profile.slug || "",
      title: profile.title || "",
      bio: profile.bio || "",
      avatarUrl: profile.avatarUrl || "",
      coverImageUrl: profile.coverImageUrl || "",
      languagesRaw: (profile.languages || []).join(", "),
      skillsRaw: (profile.skills || []).join(", "),
      certificationsRaw: (profile.certifications || []).join(", "),
      companyName: profile.companyName || "",
      headline: profile.headline || profile.tagline || "",
      tagline: profile.tagline || profile.headline || "",
      description: profile.description || "",
      logoUrl: profile.logoUrl || "",
      gstNumber: profile.gstNumber || "",
      registrationDetails: profile.registrationDetails || "",
      serviceArea: profile.serviceArea || "",
      foundedYear: profile.foundedYear || null,
      teamSize: profile.teamSize || null,
      visibility: profile.visibility || "public",
      designation: profile.designation || "",
      yearsOfExperience: profile.yearsOfExperience || null,
      practiceName: profile.practiceName || "",
      department: profile.department || "",
      workLocation: profile.workLocation || "",
      industry: profile.industry || "",
      socialLinks: {
        linkedin: profile.socialLinks?.linkedin || "",
        twitter: profile.socialLinks?.twitter || "",
        github: profile.socialLinks?.github || "",
        website: profile.socialLinks?.website || "",
        instagram: profile.socialLinks?.instagram || "",
        facebook: profile.socialLinks?.facebook || "",
        youtube: profile.socialLinks?.youtube || "",
        customLinks: profile.socialLinks?.customLinks || [],
      },
      contactDetails: {
        email: profile.contactDetails?.email || "",
        phone: profile.contactDetails?.phone || "",
        whatsAppNumber: profile.contactDetails?.whatsAppNumber || "",
      },
      location: {
        address: profile.location?.address || "",
        city: profile.location?.city || "",
        country: profile.location?.country || "",
        mapsEmbedUrl: profile.location?.mapsEmbedUrl || "",
      },
      seo: {
        metaTitle: profile.seo?.metaTitle || "",
        metaDescription: profile.seo?.metaDescription || "",
        keywordsRaw: (profile.seo?.keywords || []).join(", "),
      },
      experience: profile.experience || [],
      services: profile.services || [],
      products: profile.products || [],
      workingHours: profile.workingHours || {},
    });
    const hash = window.location.hash.replace("#", "");
    if (
      hash &&
      [
        "personal",
        "business",
        "experience",
        "offerings",
        "contact",
        "seo",
        "security",
        "billing",
      ].includes(hash)
    ) {
      setActiveTab(hash);
    } else if (!activeTab && profile.profileType) {
      setActiveTab(
        profile.profileType === "professional" ? "personal" : "business",
      );
    }
  }, [profile, reset, activeTab]);

  // 2. Save profile changes
  const saveMutation = useMutation({
    mutationFn: (values) => {
      const payload = {
        ...values,
        languages: (values.languagesRaw || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        skills: (values.skillsRaw || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        certifications: (values.certificationsRaw || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        seo: {
          ...values.seo,
          keywords: (values.seo.keywordsRaw || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        experience: form.getValues("experience") || [],
        services: form.getValues("services") || [],
        products: form.getValues("products") || [],
        workingHours: form.getValues("workingHours") || {},
      };

      delete payload.languagesRaw;
      delete payload.skillsRaw;
      delete payload.certificationsRaw;
      if (payload.seo) {
        delete payload.seo.keywordsRaw;
      }

      return profileApi.save(payload);
    },
    onSuccess: () => {
      setSaveSuccess(true);
      setSaveErrorMessage("");
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3500);
    },
    onError: (err) => {
      setSaveSuccess(false);
      setSaveErrorMessage(
        err?.response?.data?.message || "Failed to update profile changes. Please review fields."
      );
    },
  });

  const onSubmit = form.handleSubmit(
    (values) => {
      setSaveErrorMessage("");
      saveMutation.mutate(values);
    },
    (errors) => {
      console.warn("Form validation errors:", errors);
      setSaveErrorMessage("Please review and fix invalid fields in the form before saving.");
    }
  );

  // 3. Background Debounced Auto-save Effect
  useEffect(() => {
    if (!formState.isDirty) return;

    setIsAutosaving(true);
    const timer = setTimeout(() => {
      const values = form.getValues();
      const payload = {
        ...values,
        languages: (values.languagesRaw || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        skills: (values.skillsRaw || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        certifications: (values.certificationsRaw || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        seo: {
          ...values.seo,
          keywords: (values.seo.keywordsRaw || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        experience: form.getValues("experience") || [],
        services: form.getValues("services") || [],
        products: form.getValues("products") || [],
        workingHours: form.getValues("workingHours") || {},
      };

      delete payload.languagesRaw;
      delete payload.skillsRaw;
      delete payload.certificationsRaw;
      delete payload.seo.keywordsRaw;

      profileApi
        .save(payload)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
        })
        .finally(() => {
          setIsAutosaving(false);
        });
    }, 3000); // 3 seconds silence

    return () => clearTimeout(timer);
  }, [watchedValues, formState.isDirty]);

  // Tab wizard handlers
  const handlePrevTab = () => {
    const currentIndex = currentTabList.findIndex((t) => t.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(currentTabList[currentIndex - 1].id);
    }
  };

  const handleNextTab = () => {
    const currentIndex = currentTabList.findIndex((t) => t.id === activeTab);
    if (currentIndex < currentTabList.length - 1) {
      setActiveTab(currentTabList[currentIndex + 1].id);
    }
  };

  // Profile completion calculation
  const calculateCompletion = () => {
    if (!profile) return 0;
    let score = 0;

    // Personal details (Max 30%)
    if (watchedValues.title) score += 10;
    if (watchedValues.bio) score += 10;
    if (watchedValues.avatarUrl) score += 10;

    // Business details (Max 20%)
    if (watchedValues.companyName) score += 10;
    if (watchedValues.tagline) score += 10;

    // Timeline & Skills (Max 20%)
    if ((watchedValues.experience || []).length > 0) score += 10;
    if (watchedValues.skillsRaw) score += 10;

    // Contact & Hours (Max 20%)
    if (
      watchedValues.contactDetails?.phone ||
      watchedValues.contactDetails?.email
    )
      score += 10;
    const hours = watchedValues.workingHours || {};
    const hasHours = Object.values(hours).some((h) => h.enabled);
    if (hasHours) score += 10;

    // Social accounts (Max 10%)
    const socialLinks = watchedValues.socialLinks || {};
    const hasSocials = Object.entries(socialLinks).some(
      ([k, v]) => k !== "customLinks" && !!v,
    );
    if (hasSocials) score += 10;

    return Math.min(100, score);
  };

  const completionPercentage = calculateCompletion();
  const activeSlug = profile?.slug || authUser?.publishedProfileSlug;
  const publicUrl = activeSlug
    ? `${window.location.origin}/p/${activeSlug}`
    : "";
  const digitalCardUrl = activeSlug
    ? `${window.location.origin}/p/${activeSlug}/card`
    : "";
  const qrCodeUrl = publicUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicUrl)}`
    : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleVisibility = () => {
    const nextMode =
      watchedValues.visibility === "public" ? "private" : "public";
    setValue("visibility", nextMode, { shouldDirty: true });
  };

  if (isLoading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 max-w-md mx-auto">
        <Alert variant="error" title="Profile Error">
          Unable to retrieve profile configurations. Please check connection and
          refresh.
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 min-w-0 select-none pb-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-black/[0.08] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#163300] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#576159]">
              Identity Studio
            </span>
          </div>
          <h1 className="font-display text-2.5xl sm:text-3xl font-bold tracking-tight text-[#121814]">
            Profile & Digital Card Studio
          </h1>

          {/* Autosaving beacon status */}
          <div className="flex items-center gap-2 pt-0.5">
            <span
              className={clsx(
                "h-1.5 w-1.5 rounded-full",
                isAutosaving ? "bg-amber-500 animate-pulse" : "bg-[#163300]",
              )}
            />
            <span className="text-xs text-[#879289] font-medium">
              {isAutosaving ? "Autosaving changes..." : "All changes encrypted and synced"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Draft vs Published visibility switcher */}
          <button
            type="button"
            onClick={toggleVisibility}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all select-none active:scale-[0.98] ${
              watchedValues.visibility === "public"
                ? "bg-[#F6F5EE] border-black/[0.08] text-[#121814] shadow-2xs"
                : "bg-white border-black/[0.08] text-[#879289]"
            }`}
          >
            {watchedValues.visibility === "public" ? (
              <>
                <Globe className="w-3.5 h-3.5 text-[#163300]" /> Published Live
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#879289]" /> Private Draft
              </>
            )}
          </button>

          {/* View Profile Button */}
          {activeSlug ? (
            <a
              href={`/p/${activeSlug}`}
              target="_blank"
              rel="noreferrer"
              title="Open your live public profile page in a new tab"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-white border border-black/[0.08] hover:border-black/[0.15] px-3.5 text-xs font-semibold text-[#121814] transition-all shadow-2xs active:scale-[0.98]"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#879289]" />
              <span>View Profile</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Profile slug not available yet"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-black/[0.03] border border-black/[0.06] px-3.5 text-xs font-semibold text-[#879289] cursor-not-allowed opacity-60"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#879289]" />
              <span>View Profile</span>
            </button>
          )}

          {/* Digital Profile Button */}
          {activeSlug ? (
            <a
              href={`/p/${activeSlug}/card`}
              target="_blank"
              rel="noreferrer"
              title="Open your digital card and interactive NFC profile view"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-white border border-black/[0.08] hover:border-black/[0.15] px-3.5 text-xs font-semibold text-[#121814] transition-all shadow-2xs active:scale-[0.98]"
            >
              <QrCode className="w-3.5 h-3.5 text-[#163300]" />
              <span>Digital Card</span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="Digital card slug not available yet"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-black/[0.03] border border-black/[0.06] px-3.5 text-xs font-semibold text-[#879289] cursor-not-allowed opacity-60"
            >
              <QrCode className="w-3.5 h-3.5 text-[#879289]" />
              <span>Digital Card</span>
            </button>
          )}

          {/* Save Changes Button */}
          <Button
            type="button"
            onClick={onSubmit}
            loading={saveMutation.isPending}
            variant="primary"
            className={clsx(
              "h-10 px-5 text-xs font-semibold transition-all shadow-sm active:scale-[0.98]",
              saveSuccess
                ? "bg-[#163300] text-[#9FE870] border-transparent"
                : "bg-[#163300] hover:bg-[#121814] text-white"
            )}
          >
            {saveSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#9FE870] mr-1.5" />
                <span>Changes Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {saveSuccess ? (
        <Alert variant="success">
          All settings saved successfully to your live profile.
        </Alert>
      ) : null}
      {saveErrorMessage || saveMutation.isError ? (
        <Alert variant="error">
          {saveErrorMessage ||
            saveMutation.error?.response?.data?.message ||
            "Failed to update profile changes. Please review fields."}
        </Alert>
      ) : null}

      {/* Split Screen Studio: Form on Left, Live Canvas on Right */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* LEFT COLUMN: TAB NAVIGATION AND FORMS */}
        <div className="space-y-6 lg:col-span-7 xl:col-span-8">
          {/* Progress bar widget */}
          <div className="p-4 rounded-xl bg-white border border-black/[0.08] shadow-2xs space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#879289] font-mono uppercase tracking-wider text-[11px]">
                Profile Setup Completion
              </span>
              <span className="text-[#121814] font-bold font-display">{completionPercentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#F6F5EE] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#163300] transition-all duration-500 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="rounded-xl border border-black/[0.08] bg-[#F6F5EE] p-1.5 shadow-2xs">
            <nav className="flex flex-wrap gap-1">
              {currentTabList.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#163300] text-white shadow-2xs"
                        : "text-[#576159] hover:text-[#121814] hover:bg-white/60"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Form Content Card */}
          <Card
            className="p-6 sm:p-8 bg-white border border-black/[0.08] rounded-2xl shadow-[0_4px_20px_rgba(18,24,20,0.02)]"
            hoverEffect={false}
          >
            <form onSubmit={onSubmit} noValidate className="space-y-6">
              <div>
                {activeTab === "billing" ? (
                  <BillingTab />
                ) : activeTab === "security" ? (
                  <SecurityTab />
                ) : profile?.profileType === "professional" ? (
                  <ProfessionalProfileForm form={form} activeTab={activeTab} />
                ) : (
                  <BusinessProfileForm form={form} activeTab={activeTab} />
                )}
              </div>

              {/* Step Navigation Footer */}
              <div className="flex justify-between items-center pt-6 border-t border-black/[0.06]">
                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    currentTabList.length > 0 &&
                    activeTab === currentTabList[0].id
                  }
                  onClick={handlePrevTab}
                  className="text-xs font-semibold"
                >
                  ← Previous Tab
                </Button>

                {activeTab === "seo" ||
                activeTab === "billing" ||
                activeTab === "security" ? (
                  <Button
                    type="submit"
                    variant="primary"
                    loading={saveMutation.isPending}
                    className="text-xs font-semibold"
                  >
                    Save Configuration ✓
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNextTab}
                    className="text-xs font-semibold"
                  >
                    Next Tab →
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* RIGHT COLUMN: STICKY LIVE IDENTITY CANVAS */}
        <div className="space-y-6 lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
          {/* Live Studio Card Preview */}
          <Card
            className="p-5 sm:p-6 bg-white border border-black/[0.08] rounded-2xl shadow-[0_4px_20px_rgba(18,24,20,0.02)] space-y-4"
            hoverEffect={false}
          >
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#163300] animate-pulse" />
                <h4 className="font-display text-base font-bold text-[#121814]">
                  Live Studio Preview
                </h4>
              </div>
              <span className="text-[10px] font-mono text-[#879289] uppercase tracking-wider bg-[#F6F5EE] border border-black/[0.06] px-2 py-0.5 rounded">
                Real-time
              </span>
            </div>

            {profile?.profileType === "professional" ? (
              <ProfessionalPreview values={watchedValues} />
            ) : (
              <BusinessPreview values={watchedValues} />
            )}
          </Card>

          {/* Quick Share Card */}
          {profile?.slug ? (
            <Card className="p-6 bg-white border border-black/[0.08] rounded-2xl shadow-[0_4px_20px_rgba(18,24,20,0.02)] space-y-4" hoverEffect={false}>
              <div className="border-b border-black/[0.06] pb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#879289]">
                  Instant Sharing
                </span>
                <h4 className="font-display text-base font-bold text-[#121814]">
                  Share Your Live Profile
                </h4>
              </div>

              <div className="space-y-3">
                {/* Copy URL bar */}
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F6F5EE] border border-black/[0.08]">
                  <span className="text-xs font-mono text-[#576159] select-all truncate flex-1 px-2">
                    {publicUrl}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold shrink-0"
                    onClick={handleCopyLink}
                  >
                    {copied ? "Copied! ✓" : "Copy"}
                  </Button>
                </div>

                {/* Social Share Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent("Checkout my digital identity card: " + publicUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex gap-1.5 items-center justify-center p-2.5 bg-[#F6F5EE] border border-black/[0.06] hover:bg-black/[0.04] rounded-xl text-center font-semibold text-xs text-[#121814] transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#163300]" />
                    WhatsApp
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex gap-1.5 items-center justify-center p-2.5 bg-[#F6F5EE] border border-black/[0.06] hover:bg-black/[0.04] rounded-xl text-center font-semibold text-xs text-[#121814] transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-[#163300]" />
                    LinkedIn
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent("Digital Business Profile")}&body=${encodeURIComponent("Here is my digital card: " + publicUrl)}`}
                    className="flex gap-1.5 items-center justify-center p-2.5 bg-[#F6F5EE] border border-black/[0.06] hover:bg-black/[0.04] rounded-xl text-center font-semibold text-xs text-[#121814] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#121814]" />
                    Email
                  </a>
                  <Button
                    variant="outline"
                    className="w-full text-xs font-semibold flex items-center justify-center gap-1.5"
                    onClick={() => setShowQr((prev) => !prev)}
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#163300]" />
                    <span>{showQr ? "Hide QR" : "Show QR"}</span>
                  </Button>
                </div>

                <AnimatePresence>
                  {showQr ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-5 rounded-xl bg-[#F6F5EE] border border-black/[0.08] flex flex-col items-center gap-3 mt-3"
                    >
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="h-36 w-36 object-contain bg-white p-2 rounded-xl border border-black/[0.08] shadow-2xs"
                      />
                      <a
                        href={qrCodeUrl}
                        download="oneprofile-qr-code.png"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center justify-center rounded-xl bg-[#163300] text-white px-4 text-xs font-semibold hover:bg-[#121814] gap-1.5 shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" /> Download QR Code
                      </a>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

