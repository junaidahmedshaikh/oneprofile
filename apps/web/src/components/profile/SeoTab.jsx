import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

export function SeoTab({ register, watch, setValue, formState }) {
  const visibility = watch("visibility");

  return (
    <div className="space-y-6 animate-fadeUp">
      {/* 1. Privacy Settings */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">Privacy & Visibility</h3>
          <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Configure search engine visibility and accessibility</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {["public", "unlisted", "private"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setValue("visibility", mode, { shouldDirty: true })}
              className={`rounded-2xl border p-4 text-left transition select-none active:scale-[0.98] ${
                visibility === mode 
                  ? "border-brand-500/40 bg-brand-500/[0.03] shadow-sm" 
                  : "border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.12]"
              }`}
            >
              <div className="font-bold text-white text-xs capitalize">{mode}</div>
              <p className="text-3xs text-slate-400 mt-1 leading-normal">
                {mode === "public" ? "Indexed by search engines & visible to all." : ""}
                {mode === "unlisted" ? "Visible to users with slug link, hidden from search." : ""}
                {mode === "private" ? "Only visible to you. Disabled for public viewers." : ""}
              </p>
            </button>
          ))}
        </div>
      </div>

      <hr className="border-white/[0.05]" />

      {/* 2. Slug claiming */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">Custom Profile URL</h3>
          <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Claim your unique URL handle link</p>
        </div>

        <Input
          label="Profile Username / Slug URL *"
          placeholder="E.g., sarah-connor"
          {...register("slug")}
          error={formState.errors.slug?.message}
          hint="Must be lowercase letters, numbers, and dashes only. Claiming this changes your public URL."
        />
      </div>

      <hr className="border-white/[0.05]" />

      {/* 3. SEO Meta Tags */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">Search Engine Optimization (SEO)</h3>
          <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Customize meta descriptors for Google Search indexes</p>
        </div>

        <Input
          label="Meta Title"
          placeholder="E.g., Sarah Connor | Senior Security Specialist & Architect"
          {...register("seo.metaTitle")}
          error={formState.errors.seo?.metaTitle?.message}
        />

        <Textarea
          label="Meta Description"
          placeholder="Professional profile of Sarah Connor. Specializing in cyberdefense and security infrastructure architectures..."
          {...register("seo.metaDescription")}
          error={formState.errors.seo?.metaDescription?.message}
          hint="Search engines truncate descriptions longer than 160 characters."
        />

        <Input
          label="SEO Search Keywords (Comma separated)"
          placeholder="E.g., Cybersecurity, Security Architect, Cloud Defense"
          {...register("seo.keywordsRaw")}
          error={formState.errors.seo?.keywordsRaw?.message}
          hint="Keywords visitors use to search your profile page."
        />
      </div>
    </div>
  );
}
