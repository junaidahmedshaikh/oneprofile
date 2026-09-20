import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UserCheck,
  Globe,
  ExternalLink,
  LogOut,
  Sparkles,
  Smartphone,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/Button";
import { authApi } from "../../lib/authApi";
import { dashboardApi } from "../../lib/dashboardApi";
import { profileApi } from "../../lib/profileApi";
import { clearAuth } from "../../store/authSlice";
import { DashboardSearch } from "../dashboard/DashboardSearch";
import { OneProfileLogo } from "../ui/OneProfileLogo";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/identity",
    label: "Identity Studio",
    icon: UserCheck,
  },
];

import { AmbientBackground } from "../ui/AmbientBackground";

export function AppShell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const authUser = useSelector((state) => state.auth.user);

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await authApi.me();
      return response.data.data.user;
    },
    enabled: !!authUser,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["dashboard", "notifications"],
    queryFn: async () => {
      const response = await dashboardApi.notifications();
      return response.data.data;
    },
    enabled: !!authUser,
  });

  const displayUser = meQuery.data || authUser;

  const { data: profile } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      const response = await profileApi.me();
      return response.data.data;
    },
    enabled: !!authUser,
  });

  const liveSlug = profile?.slug || displayUser?.publishedProfileSlug || displayUser?.username;

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      dispatch(clearAuth());
      navigate("/login", { replace: true });
    },
  });

  return (
    <div className="relative min-h-screen bg-[#FAFAF7] text-[#121814] flex flex-col selection:bg-[#9FE870] selection:text-[#163300]">
      <AmbientBackground />

      {/* Sticky Editorial Workspace Header */}
      <header className="sticky top-0 z-30 border-b border-black/[0.07] bg-[#FAFAF7]/90 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          {/* Brand Logo & Context Label */}
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <OneProfileLogo size="md" variant="primary" showDomain={true} />
            </Link>
            <span className="hidden sm:inline-block h-3.5 w-px bg-black/[0.12] mx-1" />
            <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-[0.16em] text-[#879289]">
              Workspace
            </span>
          </div>

          {/* Center search command bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <DashboardSearch />
          </div>

          {/* Right actions: Live Profile pill, user badge, sign out */}
          <div className="flex items-center gap-3">
            {liveSlug ? (
              <a
                href={`/p/${liveSlug}`}
                target="_blank"
                rel="noreferrer"
                title="View your public digital profile in new tab"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#163300] text-[#9FE870] hover:bg-[#0E2100] text-xs font-semibold transition-all shadow-xs shrink-0"
              >
                <Globe className="w-3.5 h-3.5 text-[#9FE870]" />
                <span className="hidden sm:inline">oneprofile.in/p/{liveSlug}</span>
                <span className="sm:hidden">Live Profile</span>
                <ExternalLink className="w-3 h-3 text-[#9FE870]/80" />
              </a>
            ) : null}

            {displayUser ? (
              <div
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-white/90 border border-black/[0.08] shadow-xs"
                aria-label={`Logged in as ${displayUser.name}`}
              >
                <div className="w-6 h-6 rounded-full bg-[#163300] text-[#9FE870] font-display font-black text-xs flex items-center justify-center shrink-0">
                  {displayUser.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-xs font-semibold text-[#121814] hidden lg:inline-block truncate max-w-[110px]">
                  {displayUser.name}
                </span>
              </div>
            ) : null}

            <Button
              variant="ghost"
              size="sm"
              aria-label="Sign out of account"
              className="h-9 rounded-xl px-3 text-xs font-semibold text-[#576159] hover:text-rose-600 hover:bg-rose-50"
              loading={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="block md:hidden px-4 pt-4">
        <DashboardSearch />
      </div>

      {/* Main split grid */}
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-8 flex-1 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Navigation Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-3xl border border-black/[0.07] bg-white/80 backdrop-blur-sm p-4 sm:p-5 shadow-xs space-y-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#879289] font-bold px-2">
              Workspace
            </div>

            <nav className="space-y-1" aria-label="Sidebar Navigation">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    aria-label={`Go to ${item.label}`}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-[#163300] text-[#FAFAF7] shadow-xs"
                        : "text-[#576159] hover:text-[#121814] hover:bg-black/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent
                        className={`w-4 h-4 ${
                          isActive ? "text-[#9FE870]" : "text-[#879289]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9FE870]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-black/20" />
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Smart NFC Card Promo Widget */}
          <div className="rounded-3xl border border-black/[0.08] bg-[#121814] p-5 text-white shadow-md space-y-3.5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#9FE870]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#9FE870] uppercase tracking-wider">
                <Smartphone className="w-4 h-4" />
                <span>NFC Hardware</span>
              </div>
              <span className="text-[10px] font-mono text-white/50">NFC v2.4</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Tap your physical metallic card to any modern smartphone to transmit your digital profile in 1 tap.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center w-full py-2 px-3 rounded-xl bg-[#9FE870] hover:bg-[#8DE05B] text-[#163300] font-bold text-xs transition-colors shadow-xs"
            >
              Order NFC Card →
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="space-y-8 min-w-0" aria-label="Main Workspace Content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

