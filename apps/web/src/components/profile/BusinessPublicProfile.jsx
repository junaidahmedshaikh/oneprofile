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
  Download,
  Building,
  Sparkles,
  Globe,
  Award,
} from "lucide-react";
import React, { useState } from "react";
import {
  parseCustomLink,
  renderCustomLinkIcon,
} from "../../lib/customLinkHelper";
import { downloadVCardFile } from "../../lib/vcardHelper";
import { formatINR } from "../../lib/formatCurrency";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";

function getOperatingStatus(workingHours) {
  if (!workingHours || Object.keys(workingHours).length === 0) return null;
  const now = new Date();
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const currentDay = dayNames[now.getDay()];
  const todayHours = workingHours[currentDay];

  if (!todayHours || !todayHours.enabled)
    return { isOpen: false, text: "Closed Today" };

  const [openH, openM] = (todayHours.open || "09:00").split(":").map(Number);
  const [closeH, closeM] = (todayHours.close || "18:00").split(":").map(Number);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = openH * 60 + (openM || 0);
  const closeMinutes = closeH * 60 + (closeM || 0);

  if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
    return { isOpen: true, text: `Open Now • Closes at ${todayHours.close}` };
  }
  return { isOpen: false, text: `Closed • Opens at ${todayHours.open}` };
}

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
  const openStatus = getOperatingStatus(workingHours);

  const handleScrollToContact = () => {
    const whatsAppTarget =
      profile?.contactDetails?.whatsAppNumber || profile?.contactDetails?.phone;
    const phoneNumber = profile?.contactDetails?.phone;
    const email = profile?.contactDetails?.email;
    const companyName =
      profile?.companyName || profile?.title || "your business";

    const message = `Hello,
I'm interested in connecting with ${companyName}.
Could you please share more details about your offerings, pricing, and availability?
Thank you.`;

    if (whatsAppTarget) {
      const cleanWhatsApp = whatsAppTarget.replace(/[^0-9]/g, "");
      const encodedMessage = encodeURIComponent(message);
      window.open(
        `https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`,
        "_blank",
      );
    } else if (phoneNumber) {
      window.location.href = `tel:${phoneNumber.replace(/[\s\(\)-]/g, "")}`;
    } else if (email) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Inquiry for ${companyName}`)}&body=${encodeURIComponent(message)}`;
    } else {
      const elem = document.getElementById("contact-section");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleInquiry = (item, type) => {
    const whatsAppTarget =
      profile?.contactDetails?.whatsAppNumber || profile?.contactDetails?.phone;
    const phoneNumber = profile?.contactDetails?.phone;
    const email = profile?.contactDetails?.email;

    let message = "";
    if (type === "service") {
      message = `Hello,
I'm interested in your service.
Service: ${item.title}
${item.description ? `Description: ${item.description}\n` : ""}${item.price ? `Price: ${item.price}\n` : ""}
Could you please provide more details, pricing, availability, and next steps?
Thank you.`;
    } else if (type === "product") {
      message = `Hello,
I'm interested in this product.
Product: ${item.title}
${item.description ? `Description: ${item.description}\n` : ""}${item.price ? `Price: ${item.price}\n` : ""}
Could you please share more details about availability, delivery, and ordering process?
Thank you.`;
    } else {
      message = `Hello,
I'm interested in inquiring about ${item?.title || "your services"}.
Could you please provide more information?
Thank you.`;
    }

    if (whatsAppTarget) {
      const cleanWhatsApp = whatsAppTarget.replace(/[^0-9]/g, "");
      const encodedMessage = encodeURIComponent(message);
      window.open(
        `https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`,
        "_blank",
      );
    } else if (phoneNumber) {
      window.location.href = `tel:${phoneNumber.replace(/[\s\(\)-]/g, "")}`;
    } else if (email) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Inquiry for ${item?.title || "Services"}`)}&body=${encodeURIComponent(message)}`;
    } else {
      const elem = document.getElementById("contact-section");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="space-y-10 font-sans">
      {/* 1. Enhanced Hero Identity & Branding Banner */}
      <section className="relative">
        <div className="relative h-72 sm:h-80 lg:h-96 w-full overflow-hidden rounded-[28px] border border-[#E5E7EB] shadow-sm">
          {profile.coverImageUrl ? (
            <img
              src={profile.coverImageUrl}
              alt={profile.companyName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent pointer-events-none" />
              <Sparkles className="w-10 h-10 text-blue-400/40 mb-2 animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
                OneProfile Verified Business Identity
              </span>
            </div>
          )}
        </div>

        {/* Floating Identity & Call-to-Action Card */}
        <div className="-mt-16 sm:-mt-20 lg:-mt-24 mx-4 sm:mx-8 relative z-10 bg-white border border-[#E5E7EB] shadow-[0_12px_40px_rgba(0,0,0,0.05)] rounded-[28px] p-6 sm:p-8 lg:p-10 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {profile.logoUrl || profile.avatarUrl ? (
                <img
                  src={profile.logoUrl || profile.avatarUrl}
                  alt={profile.companyName}
                  className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl object-cover border-4 border-white bg-white shadow-xl shrink-0 -mt-10 sm:-mt-14"
                />
              ) : (
                <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl border-4 border-white bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-xl flex items-center justify-center text-4xl sm:text-5xl font-black text-white shrink-0 select-none -mt-10 sm:-mt-14">
                  {(profile.companyName || "B").charAt(0).toUpperCase()}
                </div>
              )}

              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#111827]">
                    {profile.companyName || "Business Profile"}
                  </h1>
                  <span className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold tracking-wider text-emerald-700 shadow-2xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
                    <span className="hidden sm:inline">Verified</span>
                  </span>
                </div>

                <p className="text-sm sm:text-base font-bold text-[#2563EB]">
                  {profile.headline ||
                    profile.tagline ||
                    "Trusted Professional Services & Quality Offerings"}
                </p>

                {/* Social Proof Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#6B7280]">
                  {profile.businessCategory && (
                    <span className="font-semibold text-[#111827] px-2.5 py-0.5 rounded-md ">
                      {profile.businessCategory}
                    </span>
                  )}
                  {"•"}
                  {profile.location?.city && (
                    <span className="flex items-center gap-1 font-semibold text-[#111827]">
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      {profile.location.city}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick conversion CTA buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2.5 shrink-0 w-full lg:w-auto pt-2 lg:pt-0">
              {profile.contactDetails?.phone && (
                <a
                  href={`tel:${profile.contactDetails.phone.replace(/[\s\(\)-]/g, "")}`}
                  className="h-11 sm:h-12 px-4 sm:px-5 rounded-full border border-[#E5E7EB] hover:bg-slate-50 text-[#111827] text-xs font-bold flex items-center gap-2 transition-all active:scale-[0.98] shadow-2xs"
                  title="Call Phone"
                >
                  <Phone className="w-4 h-4 text-[#2563EB]" />
                  <span className="sm:hidden">Call</span>
                  <span className="hidden sm:inline">Call Now</span>
                </a>
              )}
              <button
                type="button"
                onClick={handleScrollToContact}
                className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold flex items-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-[#2563EB]/20"
              >
                <span>Inquire Online ➔</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Full-Width Company Background & Key Credentials Section */}
      {(profile.bio ||
        profile.description ||
        profile.industry ||
        profile.businessCategory ||
        profile.gstNumber ||
        profile.registrationDetails ||
        profile.foundedYear ||
        profile.teamSize ||
        profile.serviceArea) && (
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            {/* Left Column (65% / 8 Cols): Complete Business Bio & Description */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="space-y-1 border-b border-slate-100 pb-3">
                  <span className="text-3xs uppercase tracking-[0.25em] text-[#6B7280] font-bold block">
                    BACKGROUND
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
                    About Us & Overview
                  </h2>
                </div>

                <div className="space-y-2 pt-1">
                  {/* <span className="text-3xs font-bold uppercase tracking-wider text-[#2563EB] block">
                    About Us & Overview
                  </span> */}
                  {profile.bio || profile.description ? (
                    <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed whitespace-pre-wrap font-normal">
                      {profile.bio || profile.description}
                    </p>
                  ) : (
                    <p className="text-xs text-[#9CA3AF] italic">
                      No company background details added yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (35% / 4 Cols): Premium Key Credentials Card */}
            <div className="md:col-span-5 lg:col-span-4 bg-slate-50/90 border border-[#E5E7EB] rounded-2xl p-5 sm:p-6 space-y-4 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="border-b border-slate-200/80 pb-2.5 mb-3 flex items-center justify-between">
                  <span className="text-3xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#2563EB]" />
                    Business Information
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  {profile.industry && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
                      <span className="text-3xs text-[#6B7280] block font-bold uppercase">
                        Industry
                      </span>
                      <span className="font-bold text-[#111827] mt-0.5 block truncate">
                        {profile.industry}
                      </span>
                    </div>
                  )}

                  {profile.serviceArea && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs ">
                      <span className="text-3xs text-[#6B7280] block font-bold uppercase">
                        Service Area
                      </span>
                      <span className="font-bold text-[#111827] mt-0.5 block truncate">
                        {profile.serviceArea}
                      </span>
                    </div>
                  )}
                  {profile.foundedYear && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs ">
                      <span className="text-3xs text-[#6B7280] block font-bold uppercase">
                        Founded Year
                      </span>
                      <span className="font-bold text-[#111827] mt-0.5 block">
                        {profile.foundedYear}
                      </span>
                    </div>
                  )}
                  {profile.teamSize && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
                      <span className="text-3xs text-[#6B7280] block font-bold uppercase">
                        Team Size
                      </span>
                      <span className="font-bold text-[#2563EB] mt-0.5 block">
                        {profile.teamSize} Experts
                      </span>
                    </div>
                  )}
                  {profile.gstNumber && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs sm:col-span-2">
                      <span className="text-3xs text-[#6B7280] block font-bold uppercase">
                        GSTIN Verified
                      </span>
                      <span className="font-bold text-[#111827] mt-0.5 block truncate">
                        {profile.gstNumber}
                      </span>
                    </div>
                  )}
                  {profile.registrationDetails && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs sm:col-span-2">
                      <span className="text-3xs text-[#6B7280] block font-bold uppercase">
                        Registration / CIN
                      </span>
                      <span className="font-bold text-[#111827] mt-0.5 block truncate">
                        {profile.registrationDetails}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* 3. Responsive 12-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Main Offerings & Services (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* A. Professional Services Section */}
          {profile.services?.length ? (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6"
            >
              <div className="space-y-1">
                <span className="text-3xs uppercase tracking-[0.25em] text-[#6B7280] font-bold block">
                  SERVICES
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
                  Our Professional Offerings
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Inquire about any service to receive a tailored response or
                  quote.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {profile.services.map((srv, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedItem(srv);
                      setSelectedItemType("service");
                    }}
                    className="cursor-pointer bg-slate-50 border border-[#E5E7EB] hover:border-[#2563EB]/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between select-none shadow-2xs"
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
                        <span className="text-3xs text-[#6B7280] font-bold uppercase tracking-wider block">
                          Price
                        </span>
                        <span className="text-xs font-black text-[#2563EB]">
                          {srv.price ? formatINR(srv.price) : "Contact Us"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInquiry(srv, "service");
                        }}
                        className="h-8 px-4 rounded-full font-bold bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs tracking-wider transition-all shadow-2xs"
                      >
                        Inquire ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ) : null}

          {/* B. Products Gallery & Catalog */}
          {profile.products?.length ? (
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6"
            >
              <div className="space-y-1">
                <span className="text-3xs uppercase tracking-[0.25em] text-[#6B7280] font-bold block">
                  CATALOG
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#111827]">
                  Product Gallery & Catalog
                </h2>
                <p className="text-xs text-[#6B7280]">
                  Click card to view details or click order to message on
                  WhatsApp.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {profile.products.map((prod, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedItem(prod);
                      setSelectedItemType("product");
                    }}
                    className="cursor-pointer group bg-slate-50 border border-[#E5E7EB] rounded-2xl overflow-hidden transition-all duration-300 flex flex-col select-none shadow-2xs hover:-translate-y-0.5"
                  >
                    <div className="overflow-hidden bg-white relative aspect-[4/3] border-b border-[#E5E7EB]">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
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
                          <span className="text-3xs text-[#6B7280] font-bold uppercase tracking-wider block">
                            Rate
                          </span>
                          <span className="text-sm font-extrabold text-[#2563EB]">
                            {prod.price ? formatINR(prod.price) : "Inquire"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInquiry(prod, "product");
                          }}
                          className="h-8 px-4 rounded-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-bold tracking-wider transition-all shadow-2xs flex items-center gap-1"
                        >
                          Order ➔
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ) : null}

          {/* C. Social Links Section */}
          {profile.socialLinks &&
            Object.values(profile.socialLinks).some(Boolean) && (
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-white border border-[#E5E7EB] rounded-[28px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4"
              >
                <span className="text-3xs uppercase tracking-[0.2em] font-bold text-[#6B7280] block">
                  Connect & Social Channels
                </span>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(profile.socialLinks).map(([key, value]) => {
                    if (!value || key === "customLinks") return null;
                    return (
                      <a
                        key={key}
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-[#E5E7EB] hover:bg-slate-100 hover:border-slate-300 text-xs font-bold text-[#111827] transition-all select-none shadow-2xs hover:-translate-y-0.5"
                      >
                        <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span className="capitalize">{key}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </a>
                    );
                  })}
                </div>
              </motion.section>
            )}
        </div>

        {/* RIGHT COLUMN: Sticky Reach & Availability Sidebar (4 Cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-6">
          {/* Get In Touch & Lead Form Card */}
          {leadForm}

          {/* Address & Location Card (Clean Format - Map Removed) */}
          {(profile.location?.address ||
            profile.location?.city ||
            profile.location?.country) && (
            <div className="bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[28px] p-6 space-y-4">
              <div className="border-b border-[#E5E7EB] pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2563EB]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Address & Location
                </h4>
              </div>
              <div className="text-xs space-y-3.5">
                {profile.location?.address && (
                  <div>
                    <span className="text-3xs text-[#6B7280] uppercase font-bold tracking-wider block">
                      Address
                    </span>
                    <span className="font-semibold text-[#111827] mt-1 block leading-normal">
                      {profile.location.address}
                    </span>
                  </div>
                )}
                {/* {(profile.location?.city || profile.location?.country) && (
                  <div>
                    <span className="text-3xs text-[#6B7280] uppercase font-bold tracking-wider block">
                      Region
                    </span>
                    <span className="font-semibold text-[#111827] mt-1 block">
                      {[profile.location.city, profile.location.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )} */}
              </div>
            </div>
          )}

          {/* Working Hours Card with Live Open/Closed Status */}
          {Object.keys(workingHours).length > 0 &&
            Object.values(workingHours).some((h) => h.enabled) && (
              <div className="bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[28px] p-6 space-y-4">
                <div className="border-b border-[#E5E7EB] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2563EB]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                      Working Hours
                    </h4>
                  </div>
                  {openStatus && (
                    <span
                      className={clsx(
                        "px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-1 border",
                        openStatus.isOpen
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200",
                      )}
                    >
                      <span
                        className={clsx(
                          "w-1.5 h-1.5 rounded-full",
                          openStatus.isOpen
                            ? "bg-emerald-500 animate-ping"
                            : "bg-amber-500",
                        )}
                      />
                      {openStatus.isOpen ? "Open Now" : "Closed"}
                    </span>
                  )}
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

          {/* Resources & Custom Links */}
          {profile.socialLinks?.customLinks?.length ? (
            <div className="bg-white border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[28px] p-6 space-y-4">
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
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-[#E5E7EB] hover:bg-slate-100 hover:border-slate-300 transition-all text-xs font-bold text-[#111827] gap-3 group"
                    >
                      <div className="flex items-center gap-2">
                        {renderCustomLinkIcon(parsed.icon)}
                        <span>{parsed.title}</span>
                      </div>
                      <span className="text-[#2563EB] group-hover:translate-x-0.5 transition-transform">
                        ➔
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

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

                {/* Price Display */}
                <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-4">
                  <div>
                    <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest block">
                      Pricing / Rate
                    </span>
                    <span className="text-base font-extrabold text-[#2563EB]">
                      {selectedItem.price
                        ? formatINR(selectedItem.price)
                        : "Contact for Quote"}
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
