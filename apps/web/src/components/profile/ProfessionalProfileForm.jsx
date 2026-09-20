import { useState } from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { CoverImageUpload } from "./CoverImageUpload";
import { AvatarImageUpload } from "./AvatarImageUpload";

export function ProfessionalProfileForm({ form, activeTab }) {
  const { register, watch, setValue, formState } = form;
  const visibility = watch("visibility");
  const experienceList = watch("experience") || [];
  const socialLinks = watch("socialLinks") || {};
  const customLinks = socialLinks.customLinks || [];

  const [newExp, setNewExp] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  });
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const handleAddExperience = () => {
    if (!newExp.title || !newExp.company || !newExp.startDate) return;
    setValue("experience", [...experienceList, newExp], { shouldDirty: true });
    setNewExp({
      title: "",
      company: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });
  };

  const handleRemoveExperience = (index) => {
    const updated = experienceList.filter((_, idx) => idx !== index);
    setValue("experience", updated, { shouldDirty: true });
  };

  const addCustomLink = () => {
    if (!newLink.title || !newLink.url) return;
    setValue("socialLinks.customLinks", [...customLinks, newLink], {
      shouldDirty: true,
    });
    setNewLink({ title: "", url: "" });
  };

  const removeCustomLink = (idx) => {
    const updated = customLinks.filter((_, i) => i !== idx);
    setValue("socialLinks.customLinks", updated, { shouldDirty: true });
  };

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="space-y-6">
      {activeTab === "personal" && (
        <div className="space-y-5 animate-fadeUp">
          <div className="space-y-1">
            <h3 className="font-parafina text-lg font-bold text-slate-900 tracking-tight">
              Personal Details
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Configure your profile header biography and core professional details
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2 grid gap-6 sm:grid-cols-3">
              <Input
                label="Full Name *"
                placeholder="E.g., Sarah Connor"
                {...register("title")}
                error={formState.errors.title?.message}
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
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Professional Headline / Value Proposition"
                placeholder="E.g., Senior Cloud Architect & DevOps Consultant"
                {...register("tagline")}
                error={formState.errors.tagline?.message}
                hint="A concise one-line headline summarizing your professional expertise."
              />
            </div>
            <div className="sm:col-span-2 grid gap-4.5 sm:grid-cols-2">
              <AvatarImageUpload
                value={watch("avatarUrl")}
                onChange={(val) =>
                  setValue("avatarUrl", val, { shouldDirty: true })
                }
              />
              <CoverImageUpload
                value={watch("coverImageUrl")}
                onChange={(val) =>
                  setValue("coverImageUrl", val, { shouldDirty: true })
                }
              />
            </div>

            <Input
              label="Job Title *"
              required
              placeholder="Senior Consultant"
              {...register("designation")}
            />
            <Input
              label="Department (Optional)"
              placeholder="Security Operations"
              {...register("department")}
            />
            <Input
              label="Work Location / Service Area (Optional)"
              placeholder="Mumbai, MH, India"
              {...register("workLocation")}
            />
            <Input
              label="Languages"
              placeholder="English, Spanish"
              {...register("languagesRaw")}
              error={formState.errors.languagesRaw?.message}
              hint="Comma separated values"
            />
          </div>

          <Textarea
            label="Biography"
            placeholder="Briefly tell your profile visitors about your credentials, background, and achievements..."
            {...register("bio")}
            error={formState.errors.bio?.message}
            hint="Write a brief overview. Highlight accomplishments and core credentials."
          />

          <div className="grid gap-6 sm:grid-cols-2">
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
            <h3 className="font-parafina text-lg font-bold text-slate-900 tracking-tight">
              Work History & Experience
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Configure your career milestones, historical roles, and achievements
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#163300]">
              Add Experience Milestone
            </span>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label="Job Title *"
                value={newExp.title}
                onChange={(e) =>
                  setNewExp({ ...newExp, title: e.target.value })
                }
                placeholder="E.g., Senior Designer"
              />
              <Input
                label="Company Name *"
                value={newExp.company}
                onChange={(e) =>
                  setNewExp({ ...newExp, company: e.target.value })
                }
                placeholder="E.g., Acme Labs"
              />
              <Input
                label="Start Date *"
                value={newExp.startDate}
                onChange={(e) =>
                  setNewExp({ ...newExp, startDate: e.target.value })
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
                className="rounded border-slate-300 text-[#163300] focus:ring-[#9FE870]"
              />
              <span className="text-xs text-slate-700 font-bold">
                Current Position
              </span>
            </label>

            <Textarea
              label="Role Description"
              value={newExp.description}
              onChange={(e) =>
                setNewExp({ ...newExp, description: e.target.value })
              }
              placeholder="Detail your responsibilities and achievements in this role..."
            />

            <Button
              type="button"
              variant="outline"
              className="text-xs font-bold w-full"
              onClick={handleAddExperience}
            >
              + Add Experience Node
            </Button>
          </div>

          <div className="space-y-2.5">
            {experienceList.length ? (
              experienceList.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-4 rounded-2xl bg-white border border-slate-200/90 text-xs shadow-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">
                      {exp.title}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5 font-medium">
                      {exp.company} • {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExperience(idx)}
                    className="h-8 w-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-slate-400 font-medium">
                No experience milestones added yet.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "contact" && (
        <div className="space-y-6 animate-fadeUp">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-parafina text-lg font-bold text-slate-900 tracking-tight">
                Professional Contact Channels
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Configure direct channels for clients to connect with you
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Email Address"
                placeholder="sarah@connor.com"
                {...register("contactDetails.email")}
                error={formState.errors.contactDetails?.email?.message}
              />
              <Input
                label="Direct Phone Connection"
                placeholder="+91 98765 43210"
                {...register("contactDetails.phone")}
                error={formState.errors.contactDetails?.phone?.message}
              />
              <Input
                label="WhatsApp Direct Connection"
                placeholder="+91 98765 43210"
                {...register("contactDetails.whatsAppNumber")}
              />
              <Input
                label="Personal Website URL"
                placeholder="https://sarahconnor.com"
                {...register("socialLinks.website")}
              />
              <Input
                label="Physical Address / Office Location"
                placeholder="E.g., Mumbai, Maharashtra, India"
                {...register("location.address")}
              />
              <Input
                label="Google Maps Link"
                placeholder="https://maps.google.com/..."
                {...register("location.mapsEmbedUrl")}
              />
            </div>
          </div>

          <hr className="border-slate-200/80" />

          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#163300]">
              Social & Developer Profiles
            </span>
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="LinkedIn Profile URL"
                placeholder="https://linkedin.com/in/..."
                {...register("socialLinks.linkedin")}
              />
              <Input
                label="Instagram Profile URL"
                placeholder="https://instagram.com/..."
                {...register("socialLinks.instagram")}
              />
              <Input
                label="Facebook Profile URL"
                placeholder="https://facebook.com/..."
                {...register("socialLinks.facebook")}
              />
              <Input
                label="Twitter / X Profile Link"
                placeholder="https://twitter.com/..."
                {...register("socialLinks.twitter")}
              />
              <Input
                label="YouTube Channel URL"
                placeholder="https://youtube.com/..."
                {...register("socialLinks.youtube")}
              />
              <Input
                label="GitHub Profile Link"
                placeholder="https://github.com/..."
                {...register("socialLinks.github")}
              />
            </div>
          </div>

          <hr className="border-slate-200/80" />

          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#163300]">
              External Custom Links
            </span>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Link Label Title"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                  placeholder="E.g., Read My Portfolio"
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
                type="button"
                variant="outline"
                className="text-xs font-bold w-full"
                onClick={addCustomLink}
              >
                + Add Custom Link Node
              </Button>
            </div>

            <div className="space-y-2">
              {customLinks.map((l, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3.5 rounded-2xl bg-white border border-slate-200/90 text-xs shadow-xs"
                >
                  <div className="truncate min-w-0">
                    <span className="font-bold text-slate-900 block text-sm">
                      {l.title}
                    </span>
                    <span className="text-xs text-slate-500 truncate block mt-0.5">
                      {l.url}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCustomLink(i)}
                    className="h-8 w-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-slate-200/80" />

          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#163300]">
              Weekly Operating Working Hours
            </span>
            <div className="grid-cols-1 sm:grid-cols-2 grid gap-3">
              {days.map((day) => (
                <div
                  key={day}
                  className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs"
                >
                  <label className="flex items-center gap-2.5 font-bold text-slate-800 capitalize select-none cursor-pointer">
                    <input
                      type="checkbox"
                      {...register(`workingHours.${day}.enabled`)}
                      className="rounded border-slate-300 text-[#163300] focus:ring-[#9FE870]"
                    />
                    {day}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="09:00"
                      {...register(`workingHours.${day}.open`)}
                      className="w-20 h-9 text-center rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:border-[#163300] focus:ring-2 focus:ring-[#9FE870]/30 shadow-inner"
                    />
                    <span className="text-slate-400 font-medium">to</span>
                    <input
                      type="text"
                      placeholder="17:00"
                      {...register(`workingHours.${day}.close`)}
                      className="w-20 h-9 text-center rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:border-[#163300] focus:ring-2 focus:ring-[#9FE870]/30 shadow-inner"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "seo" && (
        <div className="space-y-8 animate-fadeUp">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-parafina text-lg font-bold text-slate-900 tracking-tight">
                Privacy & Visibility
              </h3>
              <p className="text-xs text-slate-500">
                Configure search engine visibility and accessibility for your profile
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  id: "public",
                  title: "Public",
                  desc: "Indexed by search engines and visible to anyone with your link.",
                },
                {
                  id: "unlisted",
                  title: "Unlisted",
                  desc: "Visible only to people who have your direct link. Hidden from search.",
                },
                {
                  id: "private",
                  title: "Private",
                  desc: "Only visible to you while signed in. Disabled for public visitors.",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setValue("visibility", item.id, { shouldDirty: true })
                  }
                  className={`rounded-2xl border p-4 text-left transition select-none active:scale-[0.98] ${
                    visibility === item.id
                      ? "border-[#163300] bg-[#9FE870]/15 ring-1 ring-[#163300] shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {item.title}
                    </span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        visibility === item.id
                          ? "border-[#163300] bg-[#163300]"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {visibility === item.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9FE870]" />
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-200/80" />

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-parafina text-lg font-bold text-slate-900 tracking-tight">
                Custom Profile URL
              </h3>
              <p className="text-xs text-slate-500">
                Claim your unique URL handle link on oneprofile.in
              </p>
            </div>

            <Input
              label="Profile Username / Slug URL *"
              placeholder="e.g. sarah-connor"
              {...register("slug")}
              error={formState.errors.slug?.message}
              hint="Must be lowercase letters, numbers, and dashes only. Claiming this changes your public URL."
            />
          </div>

          <hr className="border-slate-200/80" />

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-parafina text-lg font-bold text-slate-900 tracking-tight">
                Search Engine Optimization (SEO)
              </h3>
              <p className="text-xs text-slate-500">
                Customize meta descriptors for Google and social sharing link previews
              </p>
            </div>

            <Input
              label="Meta Title"
              placeholder="e.g. Sarah Connor | Senior Cybersecurity Consultant"
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
              placeholder="e.g. Security Consulting, CISSP, Cybersecurity"
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
