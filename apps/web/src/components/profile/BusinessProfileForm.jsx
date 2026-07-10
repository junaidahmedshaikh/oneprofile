import { useState } from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";

export function BusinessProfileForm({ form, activeTab }) {
  const { register, watch, setValue, formState } = form;
  const visibility = watch("visibility");
  const services = watch("services") || [];
  const products = watch("products") || [];
  const socialLinks = watch("socialLinks") || {};
  const customLinks = socialLinks.customLinks || [];

  const [newService, setNewService] = useState({ title: "", description: "", price: "" });
  const [newProduct, setNewProduct] = useState({ title: "", description: "", price: "", imageUrl: "" });
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const addService = () => {
    if (!newService.title) return;
    setValue("services", [...services, newService], { shouldDirty: true });
    setNewService({ title: "", description: "", price: "" });
  };

  const removeService = (index) => {
    const updated = services.filter((_, idx) => idx !== index);
    setValue("services", updated, { shouldDirty: true });
  };

  const addProduct = () => {
    if (!newProduct.title) return;
    setValue("products", [...products, newProduct], { shouldDirty: true });
    setNewProduct({ title: "", description: "", price: "", imageUrl: "" });
  };

  const removeProduct = (index) => {
    const updated = products.filter((_, idx) => idx !== index);
    setValue("products", updated, { shouldDirty: true });
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
      {activeTab === "business" && (
        <div className="space-y-5 animate-fadeUp">
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-white tracking-tight">Business Details</h3>
            <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Configure your organization and company card parameters</p>
          </div>

          <div className="grid gap-4.5 sm:grid-cols-2">
            <Input
              label="Company / Brand Name *"
              placeholder="E.g., Connor Security Consultants"
              {...register("companyName")}
              error={formState.errors.companyName?.message}
            />
            <Input
              label="Company Logo Image URL"
              placeholder="https://cloudinary.com/logo.jpg"
              {...register("logoUrl")}
              error={formState.errors.logoUrl?.message}
            />
          </div>

          <Input
            label="Company Tagline"
            placeholder="E.g., Securing the future of cloud computing pipelines"
            {...register("tagline")}
            error={formState.errors.tagline?.message}
            hint="A concise one-line tagline showing your business specialty."
          />

          <Textarea
            label="Business Description Summary"
            placeholder="Provide a comprehensive summary detailing your business packages, focus areas, and values..."
            {...register("description")}
            error={formState.errors.description?.message}
            hint="Detail your business operations clearly. Keep it legible."
          />

          <hr className="border-white/[0.05]" />

          <div className="space-y-4">
            <span className="text-3xs font-bold uppercase tracking-wider text-brand-400">Advanced Organization Credentials</span>
            <div className="grid gap-4.5 sm:grid-cols-2">
              <Input
                label="GST Identification Number (GSTIN) - Optional"
                placeholder="E.g., 22AAAAA0000A1Z5"
                {...register("gstNumber")}
                error={formState.errors.gstNumber?.message}
              />
              <Input
                label="Business Registration Details - Optional"
                placeholder="E.g., CIN or Trade License Number"
                {...register("registrationDetails")}
                error={formState.errors.registrationDetails?.message}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Service Area / Geographical Coverage"
                  placeholder="E.g., North America, EMEA Region, or Local (San Francisco)"
                  {...register("serviceArea")}
                  error={formState.errors.serviceArea?.message}
                />
              </div>
              <Input
                label="Founded Year"
                type="number"
                placeholder="E.g., 2018"
                {...register("foundedYear", { valueAsNumber: true })}
                error={formState.errors.foundedYear?.message}
              />
              <Input
                label="Team Size (Employees count)"
                type="number"
                placeholder="E.g., 25"
                {...register("teamSize", { valueAsNumber: true })}
                error={formState.errors.teamSize?.message}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === "offerings" && (
        <div className="space-y-8 animate-fadeUp">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-white tracking-tight">Professional Services</h3>
              <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Configure booking rates and packages</p>
            </div>

            <div className="p-4.5 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-4">
              <span className="text-3xs font-bold uppercase tracking-wider text-brand-400">Add service offering</span>
              <div className="grid gap-4.5 sm:grid-cols-2">
                <Input
                  label="Service Title *"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  placeholder="E.g., 1-on-1 Consultation"
                />
                <Input
                  label="Pricing (E.g., $150 / hr)"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  placeholder="E.g., Free or $99"
                />
              </div>
              <Textarea
                label="Service Description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="Describe what is included in this service package..."
              />
              <Button type="button" variant="secondary" className="text-xs w-full" onClick={addService}>
                Add Service Package
              </Button>
            </div>

            <div className="space-y-3">
              {services.length ? (
                services.map((srv, index) => (
                  <div key={index} className="flex justify-between items-start gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition-all">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-bold text-white leading-snug">{srv.title}</h4>
                        {srv.price ? <span className="text-xs font-bold text-brand-300">{srv.price}</span> : null}
                      </div>
                      {srv.description && (
                        <p className="text-3xs text-slate-400 leading-relaxed mt-2">{srv.description}</p>
                      )}
                    </div>
                    <button type="button" onClick={() => removeService(index)} className="h-8 w-8 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center transition-all shrink-0">
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-500">No service packages added yet.</div>
              )}
            </div>
          </div>

          <hr className="border-white/[0.05]" />

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-white tracking-tight">Products Catalog</h3>
              <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Feature digital downloads, books, or physical assets</p>
            </div>

            <div className="p-4.5 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-4">
              <span className="text-3xs font-bold uppercase tracking-wider text-brand-400">Add catalog product</span>
              <div className="grid gap-4.5 sm:grid-cols-2">
                <Input
                  label="Product Name *"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="E.g., Masterclass Video Course"
                />
                <Input
                  label="Price (E.g., $49)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  placeholder="E.g., $19.99"
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Product Image URL (optional)"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    placeholder="https://cloudinary.com/product.jpg"
                  />
                </div>
              </div>
              <Textarea
                label="Product Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Detail product features, specs, download files, or links..."
              />
              <Button type="button" variant="secondary" className="text-xs w-full" onClick={addProduct}>
                Add Product Item
              </Button>
            </div>

            <div className="grid gap-4.5 sm:grid-cols-2">
              {products.length ? (
                products.map((prod, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] transition-all relative group">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.title} className="h-16 w-16 rounded-xl object-cover border border-white/10 shrink-0" />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-lg shrink-0">📦</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white truncate">{prod.title}</div>
                      <div className="text-xs font-bold text-brand-300 mt-0.5">{prod.price || "Free"}</div>
                      <p className="text-3xs text-slate-400 leading-normal mt-1.5 truncate-2-lines">{prod.description}</p>
                    </div>
                    <button type="button" onClick={() => removeProduct(index)} className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shrink-0">
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="sm:col-span-2 py-6 text-center text-xs text-slate-500">No catalog product items added yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "contact" && (
        <div className="space-y-6 animate-fadeUp">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-white tracking-tight">Business Contact Channels</h3>
              <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider">Configure active contact channels and address directories</p>
            </div>
            <div className="grid gap-4.5 sm:grid-cols-2">
              <Input label="Business Email" placeholder="hello@company.com" {...register("contactDetails.email")} error={formState.errors.contactDetails?.email?.message} />
              <Input label="Direct Phone Number" placeholder="+15551234" {...register("contactDetails.phone")} error={formState.errors.contactDetails?.phone?.message} />
              <Input label="WhatsApp Direct Number" placeholder="+15551234" {...register("contactDetails.whatsAppNumber")} hint="Includes country code, digits only" />
              <Input label="Company Website URL" placeholder="https://company.com" {...register("socialLinks.website")} />
              <Input label="Physical Address" placeholder="123 Main St, San Francisco, CA" {...register("location.address")} />
              <Input label="Google Maps Embed / URL" placeholder="https://maps.google.com/..." {...register("location.mapsEmbedUrl")} />
            </div>
          </div>

          <hr className="border-white/[0.05]" />

          <div className="space-y-4">
            <span className="text-3xs font-bold uppercase tracking-wider text-brand-400">Social Connections</span>
            <div className="grid gap-4.5 sm:grid-cols-2">
              <Input label="LinkedIn URL" placeholder="https://linkedin.com/company/..." {...register("socialLinks.linkedin")} />
              <Input label="Instagram Page URL" placeholder="https://instagram.com/..." {...register("socialLinks.instagram")} />
              <Input label="Facebook Business Link" placeholder="https://facebook.com/..." {...register("socialLinks.facebook")} />
              <Input label="Twitter / X Profile Link" placeholder="https://twitter.com/..." {...register("socialLinks.twitter")} />
              <Input label="YouTube Channel URL" placeholder="https://youtube.com/..." {...register("socialLinks.youtube")} />
              <Input label="GitHub Organization Link" placeholder="https://github.com/..." {...register("socialLinks.github")} />
            </div>
          </div>

          <hr className="border-white/[0.05]" />

          <div className="space-y-4">
            <span className="text-3xs font-bold uppercase tracking-wider text-brand-400">External Custom booklet URLs</span>
            <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-4">
              <div className="grid gap-4.5 sm:grid-cols-2">
                <Input label="Link Label Title" value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} placeholder="E.g., Read Our Brochure" />
                <Input label="Destination URL" value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} placeholder="E.g., https://brochure.com" />
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
              placeholder="E.g., Connor Security Consultants | Cloud Architectures"
              {...register("seo.metaTitle")}
              error={formState.errors.seo?.metaTitle?.message}
            />

            <Textarea
              label="Meta Description"
              placeholder="Connor security advisory organization. Specializing in cloud infrastructure protection..."
              {...register("seo.metaDescription")}
              error={formState.errors.seo?.metaDescription?.message}
              hint="Search engines truncate descriptions longer than 160 characters."
            />

            <Input
              label="SEO Search Keywords (Comma separated)"
              placeholder="E.g., Security, Cloud Audit, IT Consultancy"
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
