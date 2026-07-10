import { useState } from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";

export function ProfessionalProfileForm({ form, activeTab }) {
  const { register, watch, setValue, formState } = form;
  const visibility = watch("visibility");
  const experienceList = watch("experience") || [];
  const socialLinks = watch("socialLinks") || {};
  const customLinks = socialLinks.customLinks || [];
  const employmentType = watch("employmentType") || "self_employed";

  const [newExp, setNewExp] = useState({ title: "", company: "", startDate: "", endDate: "", current: false, description: "" });
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const handleAddExperience = () => {
    if (!newExp.title || !newExp.company || !newExp.startDate) return;
    setValue("experience", [...experienceList, newExp], { shouldDirty: true });
    setNewExp({ title: "", company: "", startDate: "", endDate: "", current: false, description: "" });
  };

  const handleRemoveExperience = (index) => {
    const updated = experienceList.filter((_, idx) => idx !== index);
    setValue("experience", updated, { shouldDirty: true });
  };

  const addCustomLink = () => {
    if (!newLink.title || !newLink.url) return;
    setValue("socialLinks.customLinks", [...customLinks, newLink], { shouldDirty: true });
    setNewLink({ title: "", url: "" });
  };

  const removeCustomLink = (idx) => {
    const updated = customLinks.filter((_, i) => i !== idx);
    setValue("socialLinks.customLinks", updated, { shouldDirty: true });
  };

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  return (
    <div className="space-y-6">
      {activeTab === "personal" && (
        <div className="space-y-5 animate-fadeUp">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-white tracking-tight">Personal Details</h3>
            <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Configure your profile header biography</p>
          </div>

          <div className="grid gap-4.5 sm:grid-cols-2">
            <Input
              label="Full Name *"
              placeholder="E.g., Sarah Connor"
              {...register("title")}
              error={formState.errors.title?.message}
            />
            <Input
              label="Avatar Image URL"
              placeholder="https://cloudinary.com/avatar.jpg"
              {...register("avatarUrl")}
              error={formState.errors.avatarUrl?.message}
            />
            <Input
              label="Industry"
              placeholder="E.g., Cybersecurity / Healthcare / Finance"
              {...register("industry")}
              error={formState.errors.industry?.message}
            />
            <Input
              label="Years of Experience"
              type="number"
              placeholder="E.g., 8"
              {...register("yearsOfExperience", { valueAsNumber: true })}
              error={formState.errors.yearsOfExperience?.message}
            />
            <div className="sm:col-span-2">
              <Input
                label="Profile Cover Banner URL"
                placeholder="https://cloudinary.com/cover.jpg"
                {...register("coverImageUrl")}
                error={formState.errors.coverImageUrl?.message}
                hint="Displays as a horizontal banner background behind your profile avatar."
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Employment Status</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input type="radio" value="self_employed" checked={employmentType === "self_employed"} onChange={() => setValue("employmentType", "self_employed", { shouldDirty: true })} className="text-brand-500 bg-white/5 border-white/10" />
                  Self-Employed / Freelance
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-white">
                  <input type="radio" value="employed" checked={employmentType === "employed"} onChange={() => setValue("employmentType", "employed", { shouldDirty: true })} className="text-brand-500 bg-white/5 border-white/10" />
                  Employed
                </label>
              </div>
            </div>

            {employmentType === "employed" ? (
              <>
                <Input label="Company / Organization Name *" placeholder="Connor Inc." {...register("companyName")} />
                <Input label="Designation / Job Title *" placeholder="Senior Consultant" {...register("designation")} />
                <Input label="Department (Optional)" placeholder="Security Operations" {...register("department")} />
                <Input label="Work Location (Optional)" placeholder="San Francisco, CA" {...register("workLocation")} />
              </>
            ) : (
              <>
                <Input label="Practice / Brand Name (Optional)" placeholder="Connor Advisory" {...register("practiceName")} />
                <Input label="Service Area / Geographical Coverage" placeholder="E.g., Worldwide or Local" {...register("workLocation")} />
              </>
            )}
          </div>

          <Textarea
            label="Biography"
            placeholder="Briefly tell your profile visitors about your credentials, background, and achievements..."
            {...register("bio")}
            error={formState.errors.bio?.message}
            hint="Write a brief overview. Highlight accomplishments and core credentials."
          />

          <div className="grid gap-4.5 sm:grid-cols-3">
            <Input
              label="Languages"
              placeholder="English, Spanish"
              {...register("languagesRaw")}
              error={formState.errors.languagesRaw?.message}
              hint="Comma separated values"
            />
            <Input
              label="Core Skills"
              placeholder="React, AWS, Risk Audit"
              {...register("skillsRaw")}
              error={formState.errors.skillsRaw?.message}
              hint="Comma separated values"
            />
            <Input
              label="Certifications"
              placeholder="CISSP, PMP"
              {...register("certificationsRaw")}
              error={formState.errors.certificationsRaw?.message}
              hint="Comma separated values"
            />
          </div>
        </div>
      )}

      {activeTab === "experience" && (
        <div className="space-y-6 animate-fadeUp">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-white tracking-tight">Work History & Experience</h3>
            <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Configure your historical professional roles and achievements</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-3.5">
            <span className="text-3xs font-bold uppercase tracking-wider text-brand-400">Add experience milestone</span>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Job Title *" value={newExp.title} onChange={(e) => setNewExp({ ...newExp, title: e.target.value })} placeholder="E.g., Senior Designer" />
              <Input label="Company Name *" value={newExp.company} onChange={(e) => setNewExp({ ...newExp, company: e.target.value })} placeholder="E.g., Connor Inc." />
              <Input label="Start Date *" value={newExp.startDate} onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })} placeholder="E.g., Jan 2021" />
              <Input label="End Date" value={newExp.endDate} disabled={newExp.current} onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })} placeholder="E.g., Present" />
            </div>

            <label className="flex items-center gap-2 select-none cursor-pointer">
              <input type="checkbox" checked={newExp.current} onChange={(e) => setNewExp({ ...newExp, current: e.target.checked, endDate: e.target.checked ? "Present" : "" })} className="rounded bg-white/5 border-white/10 text-brand-500" />
              <span className="text-3xs text-slate-400 font-bold uppercase">Current Job</span>
            </label>

            <Textarea label="Role Description" value={newExp.description} onChange={(e) => setNewExp({ ...newExp, description: e.target.value })} placeholder="Detail your responsibilities and achievements in this role..." />

            <Button type="button" variant="secondary" className="text-xs w-full" onClick={handleAddExperience}>
              Add Experience Node
            </Button>
          </div>

          <div className="space-y-2">
            {experienceList.length ? (
              experienceList.map((exp, idx) => (
                <div key={idx} className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] text-xs">
                  <div>
                    <span className="font-bold text-white block">{exp.title}</span>
                    <span className="text-3xs text-slate-500 block mt-0.5">{exp.company} • {exp.startDate} - {exp.endDate}</span>
                  </div>
                  <button type="button" onClick={() => handleRemoveExperience(idx)} className="h-7 w-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center text-xs">✕</button>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">No experience milestones added yet.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === "contact" && (
        <div className="space-y-6 animate-fadeUp">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-white tracking-tight">Professional Contact Channels</h3>
              <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Configure active channels for client inquiries</p>
            </div>
            <div className="grid gap-4.5 sm:grid-cols-2">
              <Input label="Email Address" placeholder="sarah@connor.com" {...register("contactDetails.email")} error={formState.errors.contactDetails?.email?.message} />
              <Input label="Direct Phone Connection" placeholder="+15551234" {...register("contactDetails.phone")} error={formState.errors.contactDetails?.phone?.message} />
              <Input label="WhatsApp Direct Connection" placeholder="+15551234" {...register("contactDetails.whatsAppNumber")} hint="Includes country code, digits only" />
              <Input label="Personal Website URL" placeholder="https://sarahconnor.com" {...register("socialLinks.website")} />
              <Input label="Physical Address / Office Location" placeholder="123 Main St, San Francisco, CA" {...register("location.address")} />
              <Input label="Google Maps Link" placeholder="https://maps.google.com/..." {...register("location.mapsEmbedUrl")} />
            </div>
          </div>

          <hr className="border-white/[0.05]" />

          <div className="space-y-4">
            <span className="text-3xs font-bold uppercase tracking-wider text-brand-400">Social Connections</span>
            <div className="grid gap-4.5 sm:grid-cols-2">
              <Input label="LinkedIn Profile URL" placeholder="https://linkedin.com/in/..." {...register("socialLinks.linkedin")} />
              <Input label="Instagram Profile URL" placeholder="https://instagram.com/..." {...register("socialLinks.instagram")} />
              <Input label="Facebook Profile URL" placeholder="https://facebook.com/..." {...register("socialLinks.facebook")} />
              <Input label="Twitter / X Profile Link" placeholder="https://twitter.com/..." {...register("socialLinks.twitter")} />
              <Input label="YouTube Channel URL" placeholder="https://youtube.com/..." {...register("socialLinks.youtube")} />
              <Input label="GitHub Profile Link" placeholder="https://github.com/..." {...register("socialLinks.github")} />
            </div>
          </div>

          <hr className="border-white/[0.05]" />

          <div className="space-y-4">
            <span className="text-3xs font-bold uppercase tracking-wider text-brand-400">External Custom Links</span>
            <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-4">
              <div className="grid gap-4.5 sm:grid-cols-2">
                <Input label="Link Label Title" value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} placeholder="E.g., Read My Portfolio" />
                <Input label="Destination URL" value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} placeholder="E.g., https://my-portfolio.com" />
              </div>
              <Button type="button" variant="secondary" className="text-xs w-full" onClick={addCustomLink}>
                Add Custom Link Node
              </Button>
            </div>

            <div className="space-y-2">
              {customLinks.map((l, i) => (
                <div key={i} className="flex justify-between items-center p-3.5 rounded-xl bg-white/[0.01] border border-white/[0.04] text-xs">
                  <div className="truncate min-w-0">
                    <span className="font-bold text-white block">{l.title}</span>
                    <span className="text-3xs text-slate-500 truncate block mt-0.5">{l.url}</span>
                  </div>
                  <button type="button" onClick={() => removeCustomLink(i)} className="h-7 w-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center text-xs shrink-0">✕</button>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-white/[0.05]" />

          <div className="space-y-4">
            <span className="text-3xs font-bold uppercase tracking-wider text-brand-400">Weekly Operating Working Hours</span>
            <div className="space-y-3.5">
              {days.map((day) => (
                <div key={day} className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] text-xs">
                  <label className="flex items-center gap-2.5 font-semibold text-white capitalize select-none cursor-pointer">
                    <input type="checkbox" {...register(`workingHours.${day}.enabled`)} className="rounded bg-white/5 border-white/10 text-brand-500" />
                    {day}
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="text" placeholder="09:00" {...register(`workingHours.${day}.open`)} className="w-16 h-8 text-center rounded-lg bg-white/5 border border-white/10 text-xs text-white" />
                    <span className="text-slate-500">to</span>
                    <input type="text" placeholder="17:00" {...register(`workingHours.${day}.close`)} className="w-16 h-8 text-center rounded-lg bg-white/5 border border-white/10 text-xs text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "seo" && (
        <div className="space-y-6 animate-fadeUp">
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

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-white tracking-tight">Search Engine Optimization (SEO)</h3>
              <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Customize meta descriptors for Google Search indexes</p>
            </div>

            <Input
              label="Meta Title"
              placeholder="E.g., Sarah Connor | Senior Cybersecurity Consultant"
              {...register("seo.metaTitle")}
              error={formState.errors.seo?.metaTitle?.message}
            />

            <Textarea
              label="Meta Description"
              placeholder="Professional biography of Sarah Connor. Specializing in cyberdefense and security consulting..."
              {...register("seo.metaDescription")}
              error={formState.errors.seo?.metaDescription?.message}
              hint="Search engines truncate descriptions longer than 160 characters."
            />

            <Input
              label="SEO Search Keywords (Comma separated)"
              placeholder="E.g., Security Consulting, CISSP, Cybersecurity"
              {...register("seo.keywordsRaw")}
              error={formState.errors.seo?.keywordsRaw?.message}
              hint="Keywords visitors use to search your profile page."
            />
          </div>
        </div>
      )}
    </div>
  );
}
