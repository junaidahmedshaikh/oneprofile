import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { authApi } from "../../lib/authApi";
import { clearAuth } from "../../store/authSlice";

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
  {
    to: "/sessions",
    label: "Devices",
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
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    to: "/verify",
    label: "Verification",
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
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
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

  const displayUser = meQuery.data || authUser;

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      dispatch(clearAuth());
      navigate("/login", { replace: true });
    },
  });

  return (
    <div className="relative min-h-screen bg-[#090a0f] text-white flex flex-col">
      {/* Background ambient glows */}
      <div className="glow-blob w-[500px] h-[500px] bg-brand-500/10 top-[-10%] left-[-10%]" />
      <div className="glow-blob w-[600px] h-[600px] bg-purple-500/5 bottom-[-20%] right-[-10%]" />

      {/* Header bar */}
      <header className="relative z-20 border-b border-white/[0.05] bg-[#090a0f]/65 backdrop-blur-xl px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8.5 w-8.5 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-400 flex items-center justify-center shadow-[0_4px_12px_rgba(79,140,255,0.25)]">
              <span className="font-display font-black text-slate-950 text-xs tracking-tighter">
                1P
              </span>
            </div>
            <span className="font-display font-extrabold text-md tracking-tight">
              OneProfile
            </span>
            <span className="hidden sm:inline-block h-4 w-px bg-white/10 mx-2" />
            <span className="hidden sm:inline-block text-xs text-slate-400 font-medium">
              Workspace
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            {displayUser ? (
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="h-6 w-6 rounded-full bg-brand-500/20 border border-brand-500/35 flex items-center justify-center text-xs font-bold text-brand-300">
                  {displayUser.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-xs font-semibold text-slate-300 hidden md:inline-block">
                  {displayUser.name}
                </span>
              </div>
            ) : null}

            <Button
              variant="secondary"
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
        {/* Navigation Sidebar Drawer */}
        <aside className="space-y-6">
          <div className="rounded-[28px] border border-white/[0.05] bg-white/[0.02] p-p-5 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.25em] text-brand-400 font-bold px-3 mb-4">
              Menu Navigation
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-semibold transition-all relative overflow-hidden ${
                      isActive
                        ? "bg-brand-500/10 text-white border   border-brand-500/20 shadow-[0_4px_20px_rgba(79,140,255,0.08)]"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent"
                    }`}
                  >
                    <span
                      className={isActive ? "text-brand-400" : "text-slate-500"}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {isActive ? (
                      <motion.div
                        layoutId="activePill"
                        className="absolute left-0 top-3 bottom-3 w-1 bg-brand-400 rounded-full"
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
          <div className="hidden lg:block rounded-[28px] border border-white/[0.03] bg-gradient-to-br from-white/[0.02] to-transparent p-5 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/10 rounded-full blur-xl pointer-events-none" />
            <h4 className="text-xs font-bold text-white mb-2">
              Need assistance?
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Set up your custom username, digital business card, and sync with
              your local integrations securely.
            </p>
            <a
              href="mailto:support@oneprofile.id"
              className="inline-block mt-3.5 text-xs font-bold text-brand-400 hover:underline"
            >
              Email Helpdesk →
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="space-y-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
