import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardApi } from "../lib/dashboardApi";
import { profileApi } from "../lib/profileApi";
import { Card } from "../components/ui/Card";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { ActivityTimeline } from "../components/dashboard/ActivityTimeline";
import { AppointmentList } from "../components/dashboard/AppointmentList";
import { TaskChecklist } from "../components/dashboard/TaskChecklist";
import { ShareModal } from "../components/dashboard/ShareModal";

export function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Fetch Owner Profile details for QR/slug sharing
  const { data: profile } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: async () => {
      const response = await profileApi.me();
      return response.data.data;
    },
  });

  // 1. Fetch Dashboard Summary Data
  const {
    data: summary,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: async () => {
      const response = await dashboardApi.summary();
      return response.data.data;
    },
  });

  // 2. Fetch Recent Activities
  const { data: activities = [] } = useQuery({
    queryKey: ["dashboard", "activities"],
    queryFn: async () => {
      const response = await dashboardApi.activity();
      return response.data.data;
    },
  });

  // 3. Fetch Recent Appointments
  const { data: appointments = [] } = useQuery({
    queryKey: ["dashboard", "appointments"],
    queryFn: async () => {
      const response = await dashboardApi.appointments();
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8 select-none animate-pulse">
        {/* Header Skeleton */}
        <div className="h-10 w-64 bg-white/[0.03] border border-white/[0.04] rounded-2xl" />

        {/* Stats Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-28 rounded-3xl bg-white/[0.02] border border-white/[0.04]"
            />
          ))}
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <div className="h-64 rounded-3xl bg-white/[0.02] border border-white/[0.04]" />
            <div className="h-48 rounded-3xl bg-white/[0.02] border border-white/[0.04]" />
          </div>
          <div className="space-y-6">
            <div className="h-44 rounded-3xl bg-white/[0.02] border border-white/[0.04]" />
            <div className="h-44 rounded-3xl bg-white/[0.02] border border-white/[0.04]" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 max-w-md mx-auto">
        <Alert variant="error" title="Dashboard Error">
          Unable to pull dashboard summaries. Please check connection and
          refresh.
        </Alert>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const {
    user = {},
    statistics = {},
    viewsChart = [],
    healthScore = 0,
    subscription = {},
    aiSuggestions = [],
    tasks = [],
    popularLinks = [],
    todayInsights = {},
  } = summary;

  // Dynamic statistics rendering array based on profileType
  const statsList =
    user.profileType === "professional"
      ? [
          {
            label: "Profile Views",
            value: statistics.profileViews || 0,
            trend: "Total traffic",
            icon: "👁️",
          },
          {
            label: "Card Shares",
            value: statistics.cardShares || 0,
            trend: "Total shares",
            icon: "🔗",
          },
          {
            label: "Expertise Skills",
            value: statistics.skillsCount || 0,
            trend: "Core skills",
            icon: "👤",
          },
          {
            label: "Experience Nodes",
            value: statistics.experienceCount || 0,
            trend: "Work history",
            icon: "💼",
          },
        ]
      : [
          {
            label: "Profile Views",
            value: statistics.profileViews || 0,
            trend: "Total traffic",
            icon: "👁️",
          },
          {
            label: "Card Shares",
            value: statistics.cardShares || 0,
            trend: "Total shares",
            icon: "🔗",
          },
          {
            label: "Services",
            value: statistics.servicesCount || 0,
            trend: "Booking packages",
            icon: "🏷️",
          },
          {
            label: "Products",
            value: statistics.productsCount || 0,
            trend: "Catalog items",
            icon: "📦",
          },
        ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 min-w-0 pb-12"
    >
      {/* Header bar and greeting summary */}
      <div className="flex flex-col gap-4.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome,{" "}
            <span className="text-gradient-brand">
              {user.name?.split(" ")[0]}
            </span>{" "}
            👋
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Here is a live performance audit of your digital identity card.
          </p>
        </div>

        {/* Today's quick insight tag */}
        <div className="px-4 py-2.5 rounded-2xl bg-brand-500/[0.02] border border-brand-500/15 flex items-center gap-2 max-w-xs shrink-0 select-none">
          <span className="text-md">💡</span>
          <span className="text-3xs font-semibold text-slate-300 leading-snug">
            {todayInsights.summaryText}
          </span>
        </div>
      </div>

      {/* 1. Quick Statistics Row */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsList.map((stat, i) => (
          <Card
            key={i}
            hoverEffect
            className="relative overflow-hidden group rounded-ds-card border border-oneprofile-700 bg-oneprofile-900/40"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500/5  blur-xl group-hover:bg-brand-500/10 transition-all duration-150" />
            <div className="flex items-center justify-between">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
                {stat.label}
              </span>
              <span className="text-md">{stat.icon}</span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-4 font-display tracking-tight">
              {stat.value}
            </div>
            <div className="text-3xs text-slate-500 font-semibold mt-1">
              {stat.trend}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions Panel */}
      <Card className="p-5.5 space-y-4" hoverEffect={false}>
        <div className="flex items-center gap-2">
          <span className="text-md">⚡</span>
          <h4 className="text-xs font-bold text-slate-300 dark:text-white uppercase tracking-wider">
            Quick Actions
          </h4>
        </div>
        <div className="grid gap-9 grid-cols-1 sm:grid-cols-3">
          {user.profileType === "professional" ? (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  navigate("/identity");
                  setTimeout(() => {
                    window.location.hash = "#personal";
                  }, 100);
                }}
                className="text-xs font-bold w-full"
              >
                + Add Skill
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  navigate("/identity");
                  setTimeout(() => {
                    window.location.hash = "#experience";
                  }, 100);
                }}
                className="text-xs font-bold w-full"
              >
                + Add Experience
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsShareOpen(true)}
                className="text-xs font-bold w-full"
              >
                Share Card 🎴
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  navigate("/identity");
                  setTimeout(() => {
                    window.location.hash = "#offerings";
                  }, 100);
                }}
                className="text-xs font-bold w-full"
              >
                Create Service
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  navigate("/identity");
                  setTimeout(() => {
                    window.location.hash = "#offerings";
                  }, 100);
                }}
                className="text-xs font-bold w-full"
              >
                Add Product
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setIsShareOpen(true)}
                className="text-xs font-bold w-full"
              >
                Share Card 🎴
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Main split content area */}
      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] items-start">
        {/* LEFT COLUMN: Charts, Timelines */}
        <div className="space-y-8 min-w-0">
          {/* Recent Activity Timeline Widget */}
          <Card className="space-y-5" hoverEffect={false}>
            <div>
              <h3 className="font-display text-md font-bold text-white tracking-tight">
                Recent Workspace Activity
              </h3>
              <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                Timeline track of system operations
              </p>
            </div>
            <div className="pt-2">
              <ActivityTimeline activities={activities} />
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Business Health, AI tips, Bookings, Checklist */}
        <div className="space-y-8 shrink-0">
          {/* Business Health & Profile completion */}
          <Card
            className="space-y-4 relative overflow-hidden"
            hoverEffect={false}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Business Health Score
                </h4>
                <p className="text-3xs text-slate-500 mt-0.5">
                  System calculation index
                </p>
              </div>
              <span className="text-xl">🏆</span>
            </div>

            {/* Visual radial/percentage bar */}
            <div className="flex items-center gap-4.5 pt-2">
              <div className="relative h-16 w-16 rounded-full border-4 border-white/[0.04] flex items-center justify-center font-display font-black text-white text-lg shadow-inner">
                <div
                  className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin-slow pointer-events-none"
                  style={{ transform: `rotate(${healthScore * 3.6}deg)` }}
                />
                {healthScore}%
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-white">
                  Status: Excellent
                </div>
                <div className="text-3xs text-slate-400 leading-normal">
                  Your digital card is fully set up, receiving views, and
                  generating conversions.
                </div>
              </div>
            </div>
          </Card>

          {/* AI Suggestions Center */}
          <Card className="space-y-4" hoverEffect={false}>
            <div className="flex items-center gap-2">
              <span className="text-md">✨</span>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                AI Suggestion Center
              </h4>
            </div>

            <div className="space-y-3">
              {aiSuggestions.length ? (
                aiSuggestions.map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white/[0.01] border border-white/[0.04] space-y-2 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {item.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-3xs font-extrabold uppercase tracking-wide ${item.urgency === "high" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"}`}
                      >
                        {item.urgency}
                      </span>
                    </div>
                    <p className="text-2xs text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                    <a
                      href={item.action}
                      className="inline-block text-3xs font-bold text-brand-400 hover:underline"
                    >
                      Resolve Suggestion →
                    </a>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-500">
                  Profile optimized! No current suggestions.
                </div>
              )}
            </div>
          </Card>

          {/* Upcoming Appointment Bookings */}
          <Card className="space-y-4" hoverEffect={false}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-md">📅</span>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Recent Appointments
                </h4>
              </div>
              <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider">
                2 Scheduled
              </span>
            </div>

            <AppointmentList appointments={appointments} />
          </Card>

          {/* Subscription widget */}
          <Card
            className="p-5 border-brand-500/15 bg-brand-500/[0.01] relative overflow-hidden"
            hoverEffect={false}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-3xs font-bold uppercase tracking-wider text-slate-400">
                  Subscription Tier
                </span>
                <h4 className="text-md font-bold text-white mt-0.5 capitalize">
                  {subscription.tier} plan
                </h4>
              </div>
              <span className="text-xs font-extrabold uppercase bg-brand-500/10 border border-brand-500/25 px-2.5 py-0.5 rounded-full text-brand-400">
                Upgrade
              </span>
            </div>

            <p className="text-2xs text-slate-400 leading-relaxed mb-4">
              Your free quota allows 1 published profile card. Upgrade to unlock
              custom SEO domains, multi-site booking, and unlimited AI content.
            </p>

            <Button
              variant="secondary"
              className="w-full text-xs border-white/[0.08]"
            >
              Upgrade Plan
            </Button>
          </Card>
        </div>
      </div>
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        profile={profile}
      />
    </motion.div>
  );
}
