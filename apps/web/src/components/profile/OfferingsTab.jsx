import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

export function OfferingsTab({ watch, setValue }) {
  const services = watch("services") || [];
  const products = watch("products") || [];

  const [newService, setNewService] = useState({ title: "", description: "", price: "" });
  const [newProduct, setNewProduct] = useState({ title: "", description: "", price: "", imageUrl: "" });

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

  return (
    <div className="space-y-8 animate-fadeUp">
      {/* 1. Services Section */}
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
          <Button variant="secondary" className="text-xs w-full" onClick={addService}>
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
                  {srv.description ? (
                    <p className="text-3xs text-slate-400 leading-relaxed mt-2">{srv.description}</p>
                  ) : null}
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

      {/* 2. Products Section */}
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
          <Button variant="secondary" className="text-xs w-full" onClick={addProduct}>
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
  );
}
