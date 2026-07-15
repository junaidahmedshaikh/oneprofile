import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { authApi } from "../../lib/authApi";
import { dashboardApi } from "../../lib/dashboardApi";
import { clearAuth } from "../../store/authSlice";
import { DashboardSearch } from "../dashboard/DashboardSearch";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"
        />
      </svg>
    ),
  },
  // {
  //   to: "/sessions",
  //   label: "Devices",
  //   icon: (
  //     <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  //     </svg>
  //   )
  // },

  {
    to: "/identity",
    label: "Identity Settings",
    icon: (
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

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

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const displayUser = meQuery.data || authUser;

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      dispatch(clearAuth());
      navigate("/login", { replace: true });
    },
  });

  return (
    <div className="relative min-h-screen text-white flex flex-col">
      {/* Background ambient glows */}
      <div className="glow-blob w-[500px] h-[500px] bg-brand-500/10 top-[-10%] left-[-10%]" />
      <div className="glow-blob w-[600px] h-[600px] bg-purple-500/5 bottom-[-20%] right-[-10%]" />

      {/* Header bar */}
      <header className="relative z-20 border-b border-white/[0.05] bg-[#090a0f]/10 rounded-3xl mx-10 mt-2 backdrop-blur-xl px-6 py-4 sticky top-0">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/oneprofile_logo.png"
              alt="OneProfile Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="font-display font-extrabold text-md tracking-tight hidden xs:inline-block">
              OneProfile
            </span>
            <span className="hidden sm:inline-block h-4 w-px bg-white/10 mx-2" />
          </div>

          {/* Center search command bar */}
          <div className="flex-1 max-w-sm hidden md:block">
            <DashboardSearch />
          </div>

          <div className="flex items-center gap-3">
            {displayUser ? (
              <div
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
                aria-label={`Logged in as ${displayUser.name}`}
              >
                <span className="text-xs font-semibold text-slate-300 hidden lg:inline-block truncate max-w-[100px]">
                  {displayUser.name}
                </span>
              </div>
            ) : null}

            <Button
              variant="secondary"
              aria-label="Sign out of account"
              className="min-h-9 h-9 rounded-xl px-3.5 text-xs font-bold border-white/[0.08]"
              loading={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main split grid */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 lg:px-8 flex-1 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Navigation Sidebar */}
        <aside className="space-y-8">
          <div className="rounded-ds-card border border-oneprofile-700 bg-oneprofile-900/40 p-6 backdrop-blur-xl">
            <div className="text-3xs uppercase tracking-[0.25em] text-primary font-bold px-3 mb-5">
              Menu Navigation
            </div>

            {/* Search visible on mobile sidebar */}
            <div className="block md:hidden mb-5 px-1">
              <DashboardSearch />
            </div>

            <nav className="space-y-2.5" aria-label="Sidebar Navigation">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    aria-label={`Go to ${item.label}`}
                    className={`flex items-center gap-4 rounded-ds-btn px-5 py-3.5 text-xs font-bold transition-all duration-150 ease-ds-out relative overflow-hidden ${
                      isActive
                        ? "bg-primary/10 text-white border border-primary/20 shadow-ds-card"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    <span
                      className={isActive ? "text-primary" : "text-slate-500"}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {isActive ? (
                      <motion.div
                        layoutId="activePill"
                        className="absolute left-0 top-3.5 bottom-3.5 w-1.2 bg-primary rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    ) : null}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Quick Help Card */}
          <div className="hidden lg:block rounded-ds-card border border-white/[0.03] bg-gradient-to-br from-white/[0.02] to-transparent p-5 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-xl pointer-events-none" />
            <h4 className="text-xs font-bold text-white mb-2">
              Need assistance?
            </h4>
            <p className="text-3xs leading-relaxed text-slate-500 font-semibold">
              Set up your custom username, digital business card, and sync with
              your local integrations securely.
            </p>
            <a
              href="mailto:support@oneprofile.id"
              aria-label="Contact support email address"
              className="inline-block mt-3.5 text-3xs font-bold text-primary hover:underline"
            >
              Email Helpdesk →
            </a>
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
