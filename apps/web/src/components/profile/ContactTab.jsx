import { useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const daysList = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" }
];

export function ContactTab({ register, watch, setValue, formState }) {
  const workingHours = watch("workingHours") || {};
  const customLinks = watch("socialLinks.customLinks") || [];
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const handleWorkingHourToggle = (dayKey, checked) => {
    setValue(`workingHours.${dayKey}.enabled`, checked, { shouldDirty: true });
  };

  const addCustomLink = () => {
    if (!newLink.title || !newLink.url) return;
    setValue("socialLinks.customLinks", [...customLinks, newLink], { shouldDirty: true });
    setNewLink({ title: "", url: "" });
  };

  const removeCustomLink = (index) => {
    const updated = customLinks.filter((_, idx) => idx !== index);
    setValue("socialLinks.customLinks", updated, { shouldDirty: true });
  };

  return (
    <div className="space-y-6 animate-fadeUp">
      {/* 1. Contact Info */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">Contact Channels</h3>
          <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Configure client communication details</p>
        </div>

        <div className="grid gap-4.5 sm:grid-cols-3">
          <Input
            label="Public Contact Email"
            placeholder="hello@company.com"
            {...register("contactDetails.email")}
            error={formState.errors.contactDetails?.email?.message}
          />
          <Input
            label="Public Phone Number"
            placeholder="+1 (555) 012-3456"
            {...register("contactDetails.phone")}
          />
          <Input
            label="WhatsApp Connection Number"
            placeholder="E.g., +15550123456"
            {...register("contactDetails.whatsAppNumber")}
            hint="Include country code, digits only."
          />
        </div>
      </div>

      <hr className="border-white/[0.05]" />

      {/* 2. Social Links */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">Social Accounts</h3>
          <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Link handles to show connection buttons</p>
        </div>

        <div className="grid gap-4.5 sm:grid-cols-2">
          <Input
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/username"
            {...register("socialLinks.linkedin")}
          />
          <Input
            label="Instagram URL"
            placeholder="https://instagram.com/username"
            {...register("socialLinks.instagram")}
          />
          <Input
            label="Facebook URL"
            placeholder="https://facebook.com/username"
            {...register("socialLinks.facebook")}
          />
          <Input
            label="X (Twitter) URL"
            placeholder="https://twitter.com/username"
            {...register("socialLinks.twitter")}
          />
          <Input
            label="YouTube Channel URL"
            placeholder="https://youtube.com/@channel"
            {...register("socialLinks.youtube")}
          />
          <Input
            label="GitHub URL"
            placeholder="https://github.com/username"
            {...register("socialLinks.github")}
          />
          <div className="sm:col-span-2">
            <Input
              label="Corporate Website Link"
              placeholder="https://mywebsite.com"
              {...register("socialLinks.website")}
            />
          </div>
        </div>
      </div>

      <hr className="border-white/[0.05]" />

      {/* 3. Additional Custom Links */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">Additional Custom Links</h3>
          <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Add links to your portfolio, blog, or document files</p>
        </div>

        <div className="p-4.5 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-4">
          <span className="text-3xs font-bold uppercase tracking-wider text-brand-400">Add custom URL node</span>
          <div className="grid gap-4.5 sm:grid-cols-2">
            <Input
              label="Link Title *"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              placeholder="E.g., Read My Portfolio Booklet"
            />
            <Input
              label="Destination URL *"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              placeholder="E.g., https://my-portfolio.com"
            />
          </div>
          <Button variant="secondary" className="text-xs w-full" onClick={addCustomLink}>
            Add Custom Link Node
          </Button>
        </div>

        <div className="space-y-3">
          {customLinks.length ? (
            customLinks.map((link, idx) => (
              <div 
                key={idx}
                className="flex justify-between items-center gap-4 p-4.5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition-all"
              >
                <div>
                  <h4 className="text-xs font-bold text-white leading-snug">{link.title}</h4>
                  <span className="text-3xs text-slate-500 font-bold select-all truncate block max-w-[250px] mt-0.5">{link.url}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomLink(idx)}
                  className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center transition-all shrink-0"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="py-4 text-center text-xs text-slate-500">No custom links added yet.</div>
          )}
        </div>
      </div>

      <hr className="border-white/[0.05]" />

      {/* 4. Location & Google Maps */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">Office Location & Map</h3>
          <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Embed business address details</p>
        </div>

        <div className="grid gap-4.5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Street Address"
              placeholder="123 Creator Lane, Suite 100"
              {...register("location.address")}
            />
          </div>
          <Input
            label="City"
            placeholder="San Francisco"
            {...register("location.city")}
          />
          <Input
            label="Country"
            placeholder="United States"
            {...register("location.country")}
          />
          <div className="sm:col-span-2">
            <Input
              label="Google Maps iframe Embed Source URL (src)"
              placeholder="https://www.google.com/maps/embed?pb=..."
              {...register("location.mapsEmbedUrl")}
              hint="Paste the src link from the Share -> Embed Map iframe code"
            />
          </div>
        </div>
      </div>

      <hr className="border-white/[0.05]" />

      {/* 5. Working Hours */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold text-white tracking-tight">Office Working Hours</h3>
          <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Set weekly availability schedules</p>
        </div>

        <div className="space-y-3.5">
          {daysList.map((day) => {
            const dayConfig = workingHours[day.key] || { enabled: false, open: "09:00", close: "17:00" };
            return (
              <div 
                key={day.key} 
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.01] border border-white/[0.04]"
              >
                <label className="flex items-center gap-3 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!dayConfig.enabled}
                    onChange={(e) => handleWorkingHourToggle(day.key, e.target.checked)}
                    className="rounded border-white/10 bg-white/5 text-brand-500 h-4.5 w-4.5"
                  />
                  <span className="text-xs font-bold text-white">{day.label}</span>
                </label>

                {dayConfig.enabled ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="09:00"
                      className="h-8.5 w-20 rounded-lg bg-white/5 border border-white/10 text-center text-xs text-white focus:outline-none focus:border-brand-500"
                      {...register(`workingHours.${day.key}.open`)}
                    />
                    <span className="text-xs text-slate-500">to</span>
                    <input
                      type="text"
                      placeholder="17:00"
                      className="h-8.5 w-20 rounded-lg bg-white/5 border border-white/10 text-center text-xs text-white focus:outline-none focus:border-brand-500"
                      {...register(`workingHours.${day.key}.close`)}
                    />
                  </div>
                ) : (
                  <span className="text-2xs font-extrabold uppercase text-slate-500 px-3 py-1 bg-white/[0.02] border border-white/[0.04] rounded-lg select-none">
                    Closed / Out of office
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
