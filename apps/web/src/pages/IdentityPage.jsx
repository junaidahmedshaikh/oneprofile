import { useEffect, useState, useMemo } from "react";
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
  tagline: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
  gstNumber: z.string().optional().or(z.literal("")),
  registrationDetails: z.string().optional().or(z.literal("")),
  serviceArea: z.string().optional().or(z.literal("")),
  foundedYear: z.number().nullable().optional(),
  teamSize: z.number().nullable().optional(),
  visibility: z.enum(["public", "private", "unlisted"]).default("public"),
  employmentType: z
    .enum(["self_employed", "employed"])
    .optional()
    .default("self_employed"),
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
  const [activeTab, setActiveTab] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
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
          { id: "personal", label: "Personal Info", icon: "👤" },
          { id: "experience", label: "Experience", icon: "💼" },
          { id: "contact", label: "Hours & Links", icon: "🔗" },
          { id: "seo", label: "SEO & Privacy", icon: "⚙️" },
        ]
      : [
          { id: "business", label: "Business Details", icon: "🏢" },
          { id: "offerings", label: "Offerings & Pricing", icon: "🏷️" },
          { id: "contact", label: "Hours & Links", icon: "🔗" },
          { id: "seo", label: "SEO & Privacy", icon: "⚙️" },
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
      tagline: "",
      description: "",
      logoUrl: "",
      gstNumber: "",
      registrationDetails: "",
      serviceArea: "",
      foundedYear: null,
      teamSize: null,
      visibility: "public",
      employmentType: "self_employed",
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
      tagline: profile.tagline || "",
      description: profile.description || "",
      logoUrl: profile.logoUrl || "",
      gstNumber: profile.gstNumber || "",
      registrationDetails: profile.registrationDetails || "",
      serviceArea: profile.serviceArea || "",
      foundedYear: profile.foundedYear || null,
      teamSize: profile.teamSize || null,
      visibility: profile.visibility || "public",
      employmentType: profile.employmentType || "self_employed",
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
      delete payload.seo.keywordsRaw;

      return profileApi.save(payload);
    },
    onSuccess: () => {
      setSaveSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      setTimeout(() => {
        setSaveSuccess(false);
        navigate("/dashboard");
      }, 1000);
    },
  });

  const onSubmit = form.handleSubmit((values) => saveMutation.mutate(values));

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
  const publicUrl = profile?.slug
    ? `${window.location.origin}/p/${profile.slug}`
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
    <div className="space-y-8 min-w-0 select-none">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1.5">
          <span className="text-2xs uppercase tracking-[0.25em] text-brand-400 font-bold">
            Identity Configuration
          </span>
          {/* <h1 className="font-display text-sm font-extrabold tracking-tight text-white sm:text-4xl">
            Edit Professional Profile
          </h1> */}

          {/* Autosaving beacon status */}
          <div className="flex items-center gap-2 pt-1">
            <span
              className={clsx(
                "h-2 w-2 rounded-full",
                isAutosaving ? "bg-amber-400 animate-pulse" : "bg-emerald-400",
              )}
            />
            <span className="text-3xs text-slate-400 font-bold uppercase tracking-wider">
              {isAutosaving ? "Autosaving changes..." : "All changes autosaved"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Draft vs Published visibility switcher */}
          <button
            type="button"
            onClick={toggleVisibility}
            className={`px-3.5 py-2 rounded-xl text-3xs font-extrabold uppercase tracking-wide border flex items-center gap-1.5 transition-all select-none active:scale-[0.98] ${
              watchedValues.visibility === "public"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-white/5 border-white/10 text-slate-400"
            }`}
          >
            {watchedValues.visibility === "public"
              ? "🌐 Published Live"
              : "🔒 Private Draft"}
          </button>

          {profile?.slug ? (
            <>
              <a
                href={`/p/${profile.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] px-4 text-xs font-bold text-slate-300 hover:text-white transition-all select-none"
              >
                Public Profile Link ↗
              </a>
              <a
                href={`/p/${profile.slug}/card`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 hover:bg-brand-500/20 px-4 text-xs font-bold text-brand-300 transition-all select-none"
              >
                Digital Card 🎴
              </a>
            </>
          ) : null}

          <Button
            onClick={onSubmit}
            loading={saveMutation.isPending}
            className="rounded-xl h-10 min-h-10 text-xs font-bold px-5"
          >
            Save All Changes
          </Button>
        </div>
      </div>

      {saveSuccess ? (
        <Alert variant="success">
          All settings saved successfully to your public profile.
        </Alert>
      ) : null}
      {saveMutation.isError ? (
        <Alert variant="error">
          {saveMutation.error?.response?.data?.message ||
            "Failed to update profile changes. Review slug claiming handle."}
        </Alert>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
        {/* LEFT COLUMN: Tab Navigation and Fields */}
        <div className="space-y-6">
          {/* Progress bar widget */}
          <Card className="p-4 relative overflow-hidden" hoverEffect={false}>
            <div className="flex justify-between items-center text-3xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              <span>Profile Setup Completion</span>
              <span className="text-brand-400">{completionPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </Card>

          <div className="rounded-[28px] border border-white/[0.05] bg-white/[0.02] p-4 backdrop-blur-xl">
            <nav className="flex flex-wrap gap-2">
              {currentTabList.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all relative ${
                    activeTab === tab.id
                      ? "bg-brand-500/10 text-white border border-brand-500/25"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <Card className="p-6 sm:p-8" hoverEffect={false}>
            <form onSubmit={onSubmit} noValidate className="space-y-6">
              <div>
                {profile?.profileType === "professional" ? (
                  <ProfessionalProfileForm form={form} activeTab={activeTab} />
                ) : (
                  <BusinessProfileForm form={form} activeTab={activeTab} />
                )}
              </div>

              {/* Bottom Step Navigation Footer */}
              <div className="flex justify-between items-center pt-6 border-t border-white/[0.05]">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={
                    currentTabList.length > 0 &&
                    activeTab === currentTabList[0].id
                  }
                  onClick={handlePrevTab}
                  className="text-xs"
                >
                  ← Previous Tab
                </Button>

                {activeTab === "seo" ? (
                  <Button
                    type="submit"
                    loading={saveMutation.isPending}
                    className="text-xs font-bold"
                  >
                    Save Configuration ✓
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNextTab}
                    className="text-xs"
                  >
                    Next Tab →
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* RIGHT COLUMN: Preview, Sharing & QR Codes */}
        <div className="space-y-6 shrink-0 lg:sticky lg:top-24">
          {/* Live Mobile View Preview */}
          {/* <Card
            className="p-0 border-white/[0.06] bg-black overflow-hidden relative"
            hoverEffect={false}
          > */}
          {/* <div className="absolute inset-0 pointer-events-none rounded-[28px] border border-white/10 z-30" /> */}

          {/* Speaker bar */}
          {/* <div className="w-full bg-[#090a0f] py-2.5 flex justify-center border-b border-white/[0.04] relative z-20">
              <div className="w-16 h-3.5 rounded-full bg-black/80 flex items-center justify-center gap-1.5 px-3">
                <span className="h-1 w-1 rounded-full bg-slate-800" />
                <span className="h-1 w-5 rounded-full bg-slate-800" />
              </div>
            </div> */}

          {/* Mobile View */}
          {/* <div className="p-5 min-h-[440px] max-h-[480px] overflow-y-auto bg-[#12141c] text-white space-y-5 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-5">
                {profile?.profileType === "professional" ? (
                  <ProfessionalPreview values={watchedValues} />
                ) : (
                  <BusinessPreview values={watchedValues} />
                )}
              </div>
            </div> */}
          {/* </Card> */}

          {/* Share & QR Code Actions Card */}
          {profile?.slug ? (
            <Card className="p-5 space-y-5" hoverEffect={false}>
              <div className="border-b border-white/[0.05] pb-3.5">
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-500">
                  Live share credentials
                </span>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mt-0.5">
                  Share Digital Profile
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                {/* Copy profile url */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                  <span className="text-3xs font-bold text-slate-400 select-all truncate flex-1">
                    {publicUrl}
                  </span>
                  <Button
                    variant="secondary"
                    className="px-3 min-h-8 h-8 text-2xs"
                    onClick={handleCopyLink}
                  >
                    {copied ? "Copied! ✓" : "Copy Link"}
                  </Button>
                </div>

                {/* Share platforms row */}
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent("Checkout my oneprofile digital identity card: " + publicUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center p-2.5 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] rounded-xl text-center select-none"
                  >
                    <span className="text-md">💬</span>
                    <span className="text-3xs font-bold text-slate-400 mt-1">
                      WhatsApp
                    </span>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center p-2.5 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] rounded-xl text-center select-none"
                  >
                    <span className="text-md">💼</span>
                    <span className="text-3xs font-bold text-slate-400 mt-1">
                      LinkedIn
                    </span>
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent("Digital Business Profile")}&body=${encodeURIComponent("Here is my digital business card: " + publicUrl)}`}
                    className="flex flex-col items-center justify-center p-2.5 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] rounded-xl text-center select-none"
                  >
                    <span className="text-md">✉️</span>
                    <span className="text-3xs font-bold text-slate-400 mt-1">
                      Email
                    </span>
                  </a>
                </div>

                {/* QR Code toggle action */}
                <Button
                  variant="secondary"
                  className="w-full text-xs"
                  onClick={() => setShowQr((prev) => !prev)}
                >
                  {showQr ? "Hide QR Code ✕" : "Generate QR Code 📱"}
                </Button>

                <AnimatePresence>
                  {showQr ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-4 rounded-2xl bg-white flex flex-col items-center gap-3"
                    >
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="h-36 w-36 object-contain"
                      />
                      <a
                        href={qrCodeUrl}
                        download="oneprofile-qr-code.png"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-9 h-9 items-center justify-center rounded-xl bg-slate-900 text-white px-4 text-3xs font-bold hover:bg-slate-800"
                      >
                        Download QR Code PNG 💾
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
