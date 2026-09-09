import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Shield, ChevronDown, Menu, X, Globe } from "lucide-react";

export function LandingNavbar({ activeSegment, onSegmentChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresDropdownOpen, setFeaturesDropdownOpen] = useState(false);
  const { accessToken } = useSelector((state) => state.auth);

  return (
    <header className="w-full bg-white sticky top-0 z-50">
      {/* 1. Top Announcement Bar */}
      {/* <div className="bg-white border-b border-[#EAECEF] py-2 px-4 text-xs font-medium text-[#163300] flex items-center justify-center gap-1.5 text-center">
        <span className="inline-block text-xs">🌿</span>
        <span>Zero paper waste. 100% digital ROI. Never lose a networking contact again.</span>
        <a
          href="#interactive-calculator"
          className="font-semibold underline underline-offset-2 hover:text-[#255203] transition-colors"
        >
          Calculate savings
        </a>
      </div> */}

      {/* 2. Main Navigation Bar */}
      <nav className="max-w-[1240px] mx-auto px-4 sm:px-8 h-[76px] flex items-center justify-between">
        {/* Left: Brand Logo + Capsule Switcher (Personal | Business) */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            {/* Wise Diagonal Fast Flag Arrow Geometric Mark */}
            <div className="flex items-center gap-2">
              <svg
                className="w-7 h-7 text-[#163300] group-hover:scale-105 transition-transform"
                viewBox="0 0 32 32"
                fill="currentColor"
              >
                <path d="M4 8h16l-5 8h13L14 30l3.5-10H5L4 8z" />
              </svg>
              <span className="font-parafina font-black text-2xl tracking-[-0.04em] text-[#163300] lowercase leading-none">
                oneprofile<span className="text-[#255203]">.in</span>
              </span>
            </div>
          </Link>

          {/* Capsule Switcher: [Personal | Business] - Exact Wise Reference */}
          <div className="hidden sm:flex items-center p-1 bg-[#F2F4F7] rounded-full text-xs font-bold select-none">
            <button
              type="button"
              onClick={() => onSegmentChange("personal")}
              className={`px-4 py-1.5 rounded-full transition-all duration-150 ${
                activeSegment === "personal"
                  ? "bg-[#9FE870] text-[#163300] font-extrabold shadow-sm"
                  : "text-[#556947] hover:text-[#163300]"
              }`}
            >
              Personal
            </button>
            <button
              type="button"
              onClick={() => onSegmentChange("business")}
              className={`px-4 py-1.5 rounded-full transition-all duration-150 ${
                activeSegment === "business"
                  ? "bg-[#9FE870] text-[#163300] font-extrabold shadow-sm"
                  : "text-[#556947] hover:text-[#163300]"
              }`}
            >
              Business
            </button>
          </div>
        </div>

        {/* Right Navigation: [Features ▾] [Pricing] [Help] [🌐 EN ▾] [Log in] [Register] */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#163300]">
          {/* Features Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setFeaturesDropdownOpen(!featuresDropdownOpen)}
              className="flex items-center gap-1 hover:text-[#255203] py-2 transition-colors"
            >
              Features
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${featuresDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {featuresDropdownOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-black/10 p-3 z-50"
                onMouseLeave={() => setFeaturesDropdownOpen(false)}
              >
                <a
                  href="#identity-everywhere"
                  className="p-3 rounded-xl hover:bg-[#F2F4F7] flex flex-col transition-colors"
                  onClick={() => setFeaturesDropdownOpen(false)}
                >
                  <span className="font-bold text-sm text-[#163300]">
                    Digital Profile Card
                  </span>
                  <span className="text-xs text-slate-500">
                    Live mobile mini-website with vCard
                  </span>
                </a>
                <a
                  href="#smart-nfc"
                  className="p-3 rounded-xl hover:bg-[#F2F4F7] flex flex-col transition-colors"
                  onClick={() => setFeaturesDropdownOpen(false)}
                >
                  <span className="font-bold text-sm text-[#163300]">
                    Smart NFC Cards
                  </span>
                  <span className="text-xs text-slate-500">
                    Contactless tap business cards
                  </span>
                </a>
                <a
                  href="#interactive-calculator"
                  className="p-3 rounded-xl hover:bg-[#F2F4F7] flex flex-col transition-colors"
                  onClick={() => setFeaturesDropdownOpen(false)}
                >
                  <span className="font-bold text-sm text-[#163300]">
                    Cost & Savings Calculator
                  </span>
                  <span className="text-xs text-slate-500">
                    Paper cards vs digital identity
                  </span>
                </a>
                <a
                  href="#enterprise"
                  className="p-3 rounded-xl hover:bg-[#F2F4F7] flex flex-col transition-colors"
                  onClick={() => setFeaturesDropdownOpen(false)}
                >
                  <span className="font-bold text-sm text-[#163300]">
                    Enterprise & Teams
                  </span>
                  <span className="text-xs text-slate-500">
                    Centralized corporate management
                  </span>
                </a>
              </div>
            )}
          </div>

          <Link
            to="/pricing"
            className="hover:text-[#255203] transition-colors"
          >
            Pricing
          </Link>

          {/* Authentication Actions */}
          {accessToken ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="text-xs font-bold text-[#163300] hover:text-[#255203] transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/onboarding"
                className="px-6 py-2.5 rounded-full text-xs font-extrabold text-[#163300] bg-[#9FE870] hover:bg-[#8DE05B] shadow-sm transition-all"
              >
                My Profile
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-bold text-[#163300] hover:text-[#255203] transition-colors"
              >
                Log in
              </Link>
              <Link
                to={activeSegment === "business" ? "/signup?type=business" : "/signup"}
                className="px-6 py-2.5 rounded-full text-sm font-extrabold text-[#163300] bg-[#9FE870] hover:bg-[#8DE05B] shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {activeSegment === "business" ? "Get for Teams" : "Claim Your Handle"}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-3">
          <Link
            to={activeSegment === "business" ? "/signup?type=business" : "/signup"}
            className="px-4 py-1.5 rounded-full text-xs font-extrabold text-[#163300] bg-[#9FE870]"
          >
            {activeSegment === "business" ? "Teams" : "Claim Handle"}
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#163300] hover:bg-[#F2F4F7]"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#EAECEF] px-4 pt-3 pb-6 space-y-4 shadow-xl">
          <div className="flex items-center p-1 bg-[#F2F4F7] rounded-full text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                onSegmentChange("personal");
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 rounded-full text-center transition-all ${
                activeSegment === "personal"
                  ? "bg-[#9FE870] text-[#163300] font-extrabold shadow-sm"
                  : "text-[#556947]"
              }`}
            >
              Personal
            </button>
            <button
              type="button"
              onClick={() => {
                onSegmentChange("business");
                setMobileMenuOpen(false);
              }}
              className={`flex-1 py-2 rounded-full text-center transition-all ${
                activeSegment === "business"
                  ? "bg-[#9FE870] text-[#163300] font-extrabold shadow-sm"
                  : "text-[#556947]"
              }`}
            >
              Business
            </button>
          </div>

          <div className="flex flex-col gap-2 font-bold text-sm text-[#163300]">
            <a
              href="#identity-everywhere"
              className="py-2.5 px-3 rounded-xl hover:bg-[#F2F4F7]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <Link
              to="/pricing"
              className="py-2.5 px-3 rounded-xl hover:bg-[#F2F4F7]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <a
              href="#smart-nfc"
              className="py-2.5 px-3 rounded-xl hover:bg-[#F2F4F7]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Smart NFC Cards
            </a>
            <a
              href="#testimonials"
              className="py-2.5 px-3 rounded-xl hover:bg-[#F2F4F7]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Customer Stories
            </a>
            <a
              href="#security"
              className="py-2.5 px-3 rounded-xl hover:bg-[#F2F4F7]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Security
            </a>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/login"
              className="w-full py-3 rounded-full text-center text-xs font-bold border border-[#163300] text-[#163300]"
            >
              Log in
            </Link>
            <Link
              to={activeSegment === "business" ? "/signup?type=business" : "/signup"}
              className="w-full py-3 rounded-full text-center text-xs font-extrabold bg-[#9FE870] text-[#163300]"
            >
              {activeSegment === "business" ? "Get for Teams" : "Claim Your Handle Free"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
