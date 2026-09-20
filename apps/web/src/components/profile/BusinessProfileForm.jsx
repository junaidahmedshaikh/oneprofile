import { useState } from "react";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { CoverImageUpload } from "./CoverImageUpload";
import { LogoImageUpload } from "./LogoImageUpload";

export function BusinessProfileForm({ form, activeTab }) {
  const { register, watch, setValue, formState } = form;
  const visibility = watch("visibility");
  const services = watch("services") || [];
  const products = watch("products") || [];
  const socialLinks = watch("socialLinks") || {};
  const customLinks = socialLinks.customLinks || [];

  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
  });
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
      {activeTab === "business" && (
        <div className="space-y-6 animate-fadeUp">
          <div className="space-y-1">
            <h3 className="font-parafina text-lg font-bold text-slate-900 tracking-tight">
              Business Details
            </h3>
            <p className="text-xs text-slate-500">
              Configure your organization and company card parameters
            </p>
          </div>

          <div className="grid gap-4.5 sm:grid-cols-1">
            <Input
              label="Company / Brand Name *"
              placeholder="e.g. Connor Security Consultants"
              {...register("companyName")}
              error={formState.errors.companyName?.message}
            />
          </div>
          <LogoImageUpload
            value={watch("logoUrl")}
            onChange={(val) => setValue("logoUrl", val, { shouldDirty: true })}
          />

          <CoverImageUpload
            value={watch("coverImageUrl")}
            onChange={(val) =>
              setValue("coverImageUrl", val, { shouldDirty: true })
            }
          />

          <Input
            label="Company Headline"
            placeholder="e.g. Securing the future of cloud computing pipelines"
            {...register("headline")}
            error={formState.errors.headline?.message}
            hint="A concise one-line headline showing your business specialty."
          />

          <Textarea
            label="Business Bio"
            placeholder="Share your business story, vision, and core operations background..."
            {...register("bio")}
            error={formState.errors.bio?.message}
            hint="A detailed overview of your organization background."
          />

          <Textarea
            label="Business Description Summary"
            placeholder="Provide a comprehensive summary detailing your business packages, focus areas, and values..."
            {...register("description")}
            error={formState.errors.description?.message}
            hint="Detail your business operations clearly. Keep it legible."
          />

          <hr className="border-slate-200/80" />

          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#163300]">
              Advanced Organization Credentials
            </span>
            <div className="grid gap-4.5 sm:grid-cols-2">
              <Input
                label="GST Identification Number (GSTIN)"
                placeholder="e.g. 22AAAAA0000A1Z5"
                {...register("gstNumber")}
                error={formState.errors.gstNumber?.message}
              />
              <Input
                label="Business Registration Details (Optional)"
                placeholder="e.g. CIN or Trade License Number"
                {...register("registrationDetails")}
                error={formState.errors.registrationDetails?.message}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Service Area / Geographical Coverage"
                  placeholder="e.g. Mumbai, Maharashtra, India"
                  {...register("serviceArea")}
                  error={formState.errors.serviceArea?.message}
                />
              </div>
              <Input
                label="Founded Year"
                type="number"
                placeholder="e.g. 2018"
                {...register("foundedYear", { valueAsNumber: true })}
                error={formState.errors.foundedYear?.message}
              />
              <Input
                label="Team Size (Employees count)"
                type="number"
                placeholder="e.g. 25"
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
              <h3 className="font-parafina text-lg font-bold text-slate-900 tracking-tight">
                Professional Services
              </h3>
              <p className="text-xs text-slate-500">
                Configure booking rates, packages, and service options
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#163300]">
                Add service package
              </span>
              <div className="grid gap-4.5 sm:grid-cols-2">
                <Input
                  label="Service Title *"
                  value={newService.title}
                  onChange={(e) =>
                    setNewService({ ...newService, title: e.target.value })
                  }
                  placeholder="e.g. 1-on-1 Consultation"
                />
                <Input
                  label="Pricing (e.g. ₹1,500 / hr)"
                  value={newService.price}
                  onChange={(e) =>
                    setNewService({ ...newService, price: e.target.value })
                  }
                  placeholder="e.g. Free or ₹999"
                />
              </div>
              <Textarea
                label="Service Description"
                value={newService.description}
                onChange={(e) =>
                  setNewService({ ...newService, description: e.target.value })
                }
                placeholder="Describe what is included in this service package..."
              />
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={addService}
              >
                Add Service Package
              </Button>
            </div>

            <div className="space-y-3">
              {services.length ? (
                services.map((srv, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {srv.title}
                        </h4>
                        {srv.price ? (
                          <span className="text-xs font-bold text-[#163300] bg-[#9FE870]/20 px-2.5 py-0.5 rounded-md">
                            {srv.price}
                          </span>
                        ) : null}
                      </div>
                      {srv.description && (
                        <p className="text-xs text-slate-500 leading-relaxed mt-2">
                          {srv.description}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="h-8 w-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-all shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  No service packages added yet.
                </div>
              )}
            </div>
          </div>

          <hr className="border-slate-200/80" />

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-parafina text-lg font-bold text-slate-900 tracking-tight">
                Products Catalog
              </h3>
              <p className="text-xs text-slate-500">
                Feature digital downloads, books, goods, or physical assets
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#163300]">
                Add catalog product
              </span>
              <div className="grid gap-4.5 sm:grid-cols-2">
                <Input
                  label="Product Name *"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                  placeholder="e.g. Masterclass Video Course"
                />
                <Input
                  label="Price (e.g. ₹1,499)"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  placeholder="e.g. ₹1,999"
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Product Image URL (optional)"
                    value={newProduct.imageUrl}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, imageUrl: e.target.value })
                    }
                    placeholder="https://images.example.com/product.jpg"
                  />
                </div>
              </div>
              <Textarea
                label="Product Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder="Detail product features, specs, download files, or links..."
              />
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={addProduct}
              >
                Add Product Item
              </Button>
            </div>

            <div className="grid gap-4.5 sm:grid-cols-2">
              {products.length ? (
                products.map((prod, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all relative group"
                  >
                    {prod.imageUrl ? (
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="h-16 w-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shrink-0">
                        📦
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {prod.title}
                      </div>
                      <div className="text-xs font-bold text-[#163300] mt-0.5">
                        {prod.price || "Free"}
                      </div>
                      <p className="text-xs text-slate-500 leading-normal mt-1 line-clamp-2">
                        {prod.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="sm:col-span-2 py-6 text-center text-xs text-slate-400">
                  No catalog product items added yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "contact" && (
        <div className="space-y-8 animate-fadeUp">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-parafina text-lg font-bold text-slate-900 tracking-tight">
                Business Contact Channels
              </h3>
              <p className="text-xs text-slate-500">
                Configure direct communication channels and physical address coordinates
              </p>
            </div>
            <div className="grid gap-4.5 sm:grid-cols-2">
              <Input
                label="Business Email"
                placeholder="hello@company.com"
                {...register("contactDetails.email")}
                error={formState.errors.contactDetails?.email?.message}
              />
              <Input
                label="Business Phone Number"
                placeholder="+1 555 123 4567"
                {...register("contactDetails.phone")}
                error={formState.errors.contactDetails?.phone?.message}
              />
              <Input
                label="WhatsApp Direct Number"
                placeholder="+1 555 123 4567"
                {...register("contactDetails.whatsAppNumber")}
              />
              <Input
                label="Company Website URL"
                placeholder="https://company.com"
                {...register("socialLinks.website")}
              />
              <Input
                label="Physical Address"
                placeholder="123 Corporate Tower, Mumbai, India"
                {...register("location.address")}
              />
              <Input
                label="Google Maps Embed / URL"
                placeholder="https://maps.google.com/..."
                {...register("location.mapsEmbedUrl")}
              />
            </div>
          </div>

          <hr className="border-slate-200/80" />

          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#163300]">
              Social Media Connections
            </span>
            <div className="grid gap-4.5 sm:grid-cols-2">
              <Input
                label="LinkedIn URL"
                placeholder="https://linkedin.com/company/..."
                {...register("socialLinks.linkedin")}
              />
              <Input
                label="Instagram Page URL"
                placeholder="https://instagram.com/..."
                {...register("socialLinks.instagram")}
              />
              <Input
                label="Facebook Business Link"
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
                label="GitHub Organization Link"
                placeholder="https://github.com/..."
                {...register("socialLinks.github")}
              />
            </div>
          </div>

          <hr className="border-slate-200/80" />

          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#163300]">
              External Custom Links & Brochures
            </span>
            <div className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200 space-y-4">
              <div className="grid gap-4.5 sm:grid-cols-2">
                <Input
                  label="Link Label Title"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                  placeholder="e.g. Read Our Brochure"
                />
                <Input
                  label="Destination URL"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                  placeholder="e.g. https://brochure.com"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={addCustomLink}
              >
                Add Custom Link
              </Button>
            </div>

            <div className="space-y-2">
              {customLinks.map((l, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-3.5 rounded-xl bg-white border border-slate-200 text-xs shadow-xs"
                >
                  <div className="truncate min-w-0">
                    <span className="font-bold text-slate-900 block">
                      {l.title}
                    </span>
                    <span className="text-xs text-slate-500 truncate block mt-0.5">
                      {l.url}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCustomLink(i)}
                    className="h-7 w-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center text-xs shrink-0"
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
            <div className="space-y-2.5">
              {days.map((day) => (
                <div
                  key={day}
                  className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-2xl bg-white border border-slate-200 text-xs shadow-xs"
                >
                  <label className="flex items-center gap-2.5 font-semibold text-slate-800 capitalize select-none cursor-pointer">
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
                      className="w-20 h-8.5 text-center rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:border-[#163300] focus:outline-none"
                    />
                    <span className="text-slate-400">to</span>
                    <input
                      type="text"
                      placeholder="17:00"
                      {...register(`workingHours.${day}.close`)}
                      className="w-20 h-8.5 text-center rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:border-[#163300] focus:outline-none"
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
                Configure search engine visibility and accessibility for your company profile
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
                Claim your unique business URL handle link on oneprofile.in
              </p>
            </div>

            <Input
              label="Profile Username / Slug URL *"
              placeholder="e.g. connor-consultants"
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
                Customize meta descriptors for Google Search indexes and social previews
              </p>
            </div>

            <Input
              label="Meta Title"
              placeholder="e.g. Connor Security Consultants | Cloud Architectures"
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
              placeholder="e.g. Security, Cloud Audit, IT Consultancy"
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
