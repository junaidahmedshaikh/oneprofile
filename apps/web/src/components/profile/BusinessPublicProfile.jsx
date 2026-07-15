import clsx from "clsx";
import {
  ShieldCheck,
  MapPin,
  Users,
  Calendar,
  Clock,
  Star,
  Phone,
  MessageSquare,
  ExternalLink,
  Mail,
  CheckCircle2,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { parseCustomLink, renderCustomLinkIcon, getSafeMapUrl } from "../../lib/customLinkHelper";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";

export function BusinessPublicProfile({ profile, leadForm }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState(null);
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const workingHours = profile.workingHours || {};

  const handleScrollToContact = () => {
    const whatsAppNumber = profile?.contactDetails?.whatsAppNumber;
    const phoneNumber = profile?.contactDetails?.phone;
    const companyName =
      profile?.companyName || profile?.title || "your business";

    const message = `Hello,
I'm interested in connecting with ${companyName}.
Could you please share more details about your offerings, pricing, and availability?
Thank you.`;

    if (whatsAppNumber) {
      const cleanWhatsApp = whatsAppNumber.replace(/[^0-9]/g, "");
      const encodedMessage = encodeURIComponent(message);
      window.open(
        `https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`,
        "_blank",
      );
    } else if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleInquiry = (item, type) => {
    const whatsAppNumber = profile.contactDetails?.whatsAppNumber;
    const phoneNumber = profile.contactDetails?.phone;

    let message = "";
    if (type === "service") {
      message = `Hello,
I'm interested in your service.
Service:
${item.title}
${item.description ? `\nDescription:\n${item.description}\n` : ""}${item.price ? `\nStarting Price:\n${item.price}\n` : ""}
Could you please provide more details, pricing, availability, and the next steps?
Thank you.`;
    } else if (type === "product") {
      message = `Hello,
I'm interested in this product.
Product:
${item.title}
${item.description ? `\nDescription:\n${item.description}\n` : ""}${item.price ? `\nPrice:\n${item.price}\n` : ""}
Could you please share more details about availability, delivery, customization options, and ordering process?
Thank you.`;
    }

    if (whatsAppNumber) {
      const cleanWhatsApp = whatsAppNumber.replace(/[^0-9]/g, "");
      const encodedMessage = encodeURIComponent(message);
      window.open(
        `https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`,
        "_blank",
      );
    } else if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  console.log("BusinessPublicProfile Rendered", profile);

  return (
    <div className="space-y-12">
      {/* 1. Hero Identity & Branding Banner */}
      <section className="relative">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-3xl border border-[#E5E7EB] shadow-sm">
          {profile.coverImageUrl ? (
            <img
              src={profile.coverImageUrl}
              alt={profile.companyName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-slate-100 to-slate-50 flex items-center justify-center text-[#6B7280]">
              OneProfile Premium Business Identity
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Floating Identity & Call-to-Action Card */}
        <div className="-mt-16 sm:-mt-20 mx-4 sm:mx-8 relative z-10 bg-white border border-[#E5E7EB] shadow-[0_10px_30px_rgba(0,0,0,0.04)] rounded-[24px] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {profile.logoUrl || profile.avatarUrl ? (
                <img
                  src={profile.logoUrl || profile.avatarUrl}
                  alt={profile.companyName}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border border-[#E5E7EB] bg-white shadow-sm shrink-0 animate-floating"
                />
              ) : (
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border border-[#E5E7EB] bg-slate-50 flex items-center justify-center text-4xl font-black text-[#2563EB] shrink-0 select-none animate-floating">
                  {(profile.companyName || "B").charAt(0).toUpperCase()}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
                    {profile.companyName || "Business Profile"}
                  </h1>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm font-semibold uppercase tracking-wider text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/15" />{" "}
                    Verified
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#2563EB]">
                  {profile.tagline ||
                    "Trusted Professional Services & Quality Offerings"}
                </p>

                {/* Social Proof Header */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#6B7280]">
                  {profile.businessCategory && (
                    <span className="font-semibold text-[#111827]">
                      {profile.businessCategory}
                    </span>
                  )}
                  {profile.location?.city && (
                    <>
                      {profile.businessCategory && <span>•</span>}
                      <span className="flex items-center gap-1 font-semibold text-[#111827]">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />{" "}
                        {profile.location.city}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick conversion CTA buttons */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-3 shrink-0">
              {profile.contactDetails?.phone && (
                <a
                  href={`tel:${profile.contactDetails.phone}`}
                  className="h-12 px-6 rounded-full border border-[#E5E7EB] hover:bg-slate-50 text-[#111827] text-xs font-bold flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4 text-[#2563EB]" /> Call Now
                </a>
              )}
              <button
                onClick={handleScrollToContact}
                className="h-12 px-6 rounded-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-[0.98] shadow-sm shadow-[#2563EB]/10"
              >
                Inquire Online ➔
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. About us & Credibility highlights Grid */}
      <section className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 grid md:grid-cols-[1.5fr_1fr] gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-[0.25em] text-[#6B7280] font-bold block">
              ABOUT US
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
              Company Overview & Experience
            </h2>
          </div>
          <p className="text-sm text-[#6B7280] leading-relaxed whitespace-pre-wrap">
            {profile.description ||
              "Learn more about our organizational background, products, and core operational goals."}
          </p>
        </div>

        {/* Verification & Trust Badges */}
        <div className="bg-slate-50 border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" /> Verified
            Credentials
          </h4>
          <div className="space-y-3.5 text-xs">
            {profile.gstNumber && (
              <div className="flex justify-between items-center py-1.5 border-b border-[#E5E7EB]">
                <span className="text-[#6B7280]">GSTIN Verified</span>
                <span className="font-bold text-[#111827]">
                  {profile.gstNumber}
                </span>
              </div>
            )}
            {profile.registrationDetails && (
              <div className="flex justify-between items-center py-1.5 border-b border-[#E5E7EB]">
                <span className="text-[#6B7280]">Registration CIN</span>
                <span className="font-bold text-[#111827]">
                  {profile.registrationDetails}
                </span>
              </div>
            )}
            {profile.foundedYear && (
              <div className="flex justify-between items-center py-1.5 border-b border-[#E5E7EB]">
                <span className="text-[#6B7280]">Founded In</span>
                <span className="font-bold text-[#111827]">
                  {profile.foundedYear}
                </span>
              </div>
            )}
            {profile.teamSize && (
              <div className="flex justify-between items-center py-1.5 border-b border-[#E5E7EB]">
                <span className="text-[#6B7280]">Team Size</span>
                <span className="font-bold text-[#111827]">
                  {profile.teamSize} Experts
                </span>
              </div>
            )}
            {profile.serviceArea && (
              <div className="flex justify-between items-start py-1.5">
                <span className="text-[#6B7280] shrink-0">Service Area</span>
                <span className="font-bold text-[#111827] text-right">
                  {profile.serviceArea}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Professional Services Section (With Direct Inquiries) */}
      {profile.services?.length ? (
        <section className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-[0.25em] text-[#6B7280] font-bold block">
              SERVICES
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
              Our Professional Offerings
            </h2>
            <p className="text-xs text-[#6B7280]">
              Inquire about any service to receive a tailored response or quote.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {profile.services.map((srv, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedItem(srv);
                  setSelectedItemType("service");
                }}
                className="cursor-pointer bg-slate-50 border border-[#E5E7EB] hover:border-[#2563EB]/20 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between select-none"
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-[#111827] tracking-tight leading-snug">
                    {srv.title}
                  </h3>
                  {srv.description && (
                    <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3">
                      {srv.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <span className="text-sm text-[#6B7280] font-semibold tracking-wider block">
                      Price
                    </span>
                    <span className="text-xs font-black text-[#2563EB]">
                      {srv.price || "Contact Us"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem(srv);
                      setSelectedItemType("service");
                    }}
                    className="h-8 px-3.5 rounded-full font-semibold bg-white border border-[#E5E7EB] hover:bg-slate-50 text-[#111827] text-xs tracking-wider transition-all"
                  >
                    Inquire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* 4. Products Catalog Section */}
      {profile.products?.length ? (
        <section className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-3xs uppercase tracking-[0.25em] text-[#6B7280] font-bold block">
              CATALOG
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
              Product Gallery & Catalog
            </h2>
            <p className="text-xs text-[#6B7280]">
              Click inquire to request quotes, features, or shipping details.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {profile.products.map((prod, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedItem(prod);
                  setSelectedItemType("product");
                }}
                className="cursor-pointer group bg-slate-50 border border-[#E5E7EB] rounded-2xl overflow-hidden transition-all duration-300 flex flex-col select-none"
              >
                <div className="overflow-hidden bg-white relative aspect-[4/3] border-b border-[#E5E7EB]">
                  {prod.imageUrl ? (
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-102"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl select-none text-slate-300 bg-slate-50">
                      📦
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-[#111827] truncate">
                      {prod.title}
                    </h3>
                    {prod.description && (
                      <p className="text-3xs text-[#6B7280] line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                    <div>
                      <span className="text-sm text-[#6B7280] font-semibold tracking-wider block">
                        Rate
                      </span>
                      <span className="text-sm font-extrabold text-[#2563EB]">
                        {prod.price || "Inquire"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(prod);
                        setSelectedItemType("product");
                      }}
                      className="h-8 px-3.5 rounded-full bg-white border border-[#E5E7EB] hover:bg-slate-50 text-[#111827] text-xs font-semibold tracking-wider"
                    >
                      Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* 5. Contact Form, Hours & Map Grid */}
      <section className="grid md:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
        {/* Left Column: Conversion Center */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <span className="text-3xs uppercase tracking-[0.25em] text-[#6B7280] font-bold block">
                COMMUNICATE
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
                Submit Your Business Inquiry
              </h2>
            </div>

            {leadForm}

            <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4 text-3xs text-[#6B7280] font-bold uppercase tracking-wide">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Response
                under 2 Hours
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified
                business partner
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Operating Hours & Map */}
        <div className="space-y-6">
          {/* Location details card */}
          {(profile.location?.address ||
            profile.location?.city ||
            profile.location?.country ||
            profile.location?.mapsEmbedUrl) && (
            <div className="bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px] p-6 space-y-4">
              <div className="border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2563EB]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Location Directory
                </h4>
              </div>
              <div className="text-xs space-y-3.5">
                {profile.location?.address && (
                  <div>
                    <span className="text-3xs text-[#6B7280] uppercase font-bold tracking-wider">
                      Address
                    </span>
                    <span className="font-semibold text-[#111827] mt-1 block leading-normal">
                      {profile.location.address}
                    </span>
                  </div>
                )}
                {(profile.location?.city || profile.location?.country) && (
                  <div>
                    <span className="text-3xs text-[#6B7280] uppercase font-bold tracking-wider">
                      Region
                    </span>
                    <span className="font-semibold text-[#111827] mt-1 block">
                      {[profile.location.city, profile.location.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
                {profile.location?.mapsEmbedUrl && (
                  <div className="h-40 w-full rounded-2xl overflow-hidden border border-[#E5E7EB] mt-2 bg-slate-50">
                    <iframe
                      title="Location Map"
                      src={getSafeMapUrl(profile.location.mapsEmbedUrl)}
                      className="w-full h-full border-0 grayscale opacity-80"
                      allowFullScreen=""
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Working Hours */}
          {Object.keys(workingHours).length > 0 &&
            Object.values(workingHours).some((h) => h.enabled) && (
              <div className="bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px] p-6 space-y-4">
                <div className="border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2563EB]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                    Working Hours
                  </h4>
                </div>
                <div className="space-y-2 text-xs">
                  {days.map((day) => {
                    const hour = workingHours[day];
                    if (!hour || !hour.enabled) return null;
                    return (
                      <div
                        key={day}
                        className="flex justify-between items-center py-1.5 border-b border-slate-50 last:border-0"
                      >
                        <span className="capitalize text-[#6B7280] font-semibold">
                          {day}
                        </span>
                        <span className="font-bold text-[#111827]">
                          {hour.open} - {hour.close}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* Custom Link booklets */}
          {profile.socialLinks?.customLinks?.length ? (
            <div className="bg-white border border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[24px] p-6 space-y-4">
              <div className="border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2563EB]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Resources & Links
                </h4>
              </div>
              <div className="space-y-2">
                {profile.socialLinks.customLinks.map((link, idx) => {
                  const parsed = parseCustomLink(link.title);
                  return (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-[#E5E7EB] hover:bg-slate-100 transition-all text-xs font-bold text-[#111827] gap-3"
                    >
                      <div className="flex items-center gap-2">
                        {renderCustomLinkIcon(parsed.icon)}
                        <span>{parsed.title}</span>
                      </div>
                      <span className="text-[#2563EB]">➔</span>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedItem(null);
                setSelectedItemType(null);
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-white border border-[#E5E7EB] shadow-2xl rounded-3xl overflow-hidden flex flex-col z-10"
              role="dialog"
              aria-modal="true"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedItem(null);
                  setSelectedItemType(null);
                }}
                className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Image Header if Product and Image exists */}
              {selectedItemType === "product" && selectedItem.imageUrl ? (
                <div className="w-full h-56 bg-slate-100 relative overflow-hidden border-b border-[#E5E7EB]">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-4 bg-gradient-to-r from-blue-500 to-indigo-500" />
              )}

              {/* Content area */}
              <div className="p-6 sm:p-8 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-3xs uppercase tracking-widest bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                      {selectedItemType}
                    </span>
                    {selectedItem.category && (
                      <span className="text-3xs uppercase tracking-widest bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                        {selectedItem.category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-[#111827] leading-snug pt-1">
                    {selectedItem.title}
                  </h3>
                </div>

                {/* Description */}
                {selectedItem.description && (
                  <div className="space-y-1.5">
                    <h4 className="text-3xs font-bold text-slate-400 uppercase tracking-widest">
                      Description
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed max-h-36 overflow-y-auto pr-1">
                      {selectedItem.description}
                    </p>
                  </div>
                )}

                {/* Features list (if any exist) */}
                {selectedItem.features && Array.isArray(selectedItem.features) && selectedItem.features.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-3xs font-bold text-slate-400 uppercase tracking-widest">
                      Key Features
                    </h4>
                    <ul className="grid gap-1.5 sm:grid-cols-2 text-xs text-slate-600">
                      {selectedItem.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                          <span className="truncate">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Price Display */}
                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">
                      Pricing / Rate
                    </span>
                    <span className="text-base font-extrabold text-[#2563EB]">
                      {selectedItem.price || "Contact for Quote"}
                    </span>
                  </div>

                  <Button
                    onClick={() => {
                      handleInquiry(selectedItem, selectedItemType);
                      setSelectedItem(null);
                      setSelectedItemType(null);
                    }}
                    className="rounded-full px-5 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1d4ed8]"
                  >
                    Inquire Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
