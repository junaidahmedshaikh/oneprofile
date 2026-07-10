export function BusinessPreview({ values }) {
  const { companyName, tagline, description, logoUrl, services = [], products = [] } = values;

  return (
    <div className="space-y-5 animate-fadeUp">
      {/* Company Cover Banner */}
      <div className="h-20 w-full bg-gradient-to-tr from-brand-500/20 to-brand-400/5 rounded-xl border border-white/5 flex items-center justify-center text-3xs font-extrabold uppercase text-slate-500 select-none">
        Corporate Banner
      </div>

      {/* Brand Header */}
      <div className="flex items-center gap-3.5">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="Logo"
            className="h-12 w-12 rounded-2xl object-cover border border-white/10 shadow"
          />
        ) : (
          <div className="h-12 w-12 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center font-bold text-brand-300">
            {(companyName || "B").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <div className="text-sm font-bold text-white truncate">{companyName || "Business Name"}</div>
          <div className="text-3xs text-slate-400 mt-0.5 truncate max-w-[160px]">
            {tagline || "Brand Tagline"}
          </div>
        </div>
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* Description Summary */}
      <div className="space-y-1">
        <span className="text-3xs uppercase tracking-[0.25em] text-slate-500 font-bold">About Us</span>
        <p className="text-2xs text-slate-300 leading-relaxed truncate-3-lines">
          {description || "Provide details about your business offerings and organization goals."}
        </p>
      </div>

      {/* Catalog Counts */}
      <div className="grid grid-cols-2 gap-3.5 py-1">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
          <span className="text-3xs font-semibold text-slate-500 block">Services</span>
          <span className="text-sm font-bold text-white mt-1 block">{services.length} Packages</span>
        </div>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
          <span className="text-3xs font-semibold text-slate-500 block">Products</span>
          <span className="text-sm font-bold text-white mt-1 block">{products.length} Items</span>
        </div>
      </div>
    </div>
  );
}
