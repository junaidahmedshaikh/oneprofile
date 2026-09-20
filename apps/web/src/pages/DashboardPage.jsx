import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardApi } from "../lib/dashboardApi";
import { profileApi } from "../lib/profileApi";
import { Card } from "../components/ui/Card";
import { Alert } from "../components/ui/Alert";
import { Button } from "../components/ui/Button";
import { AppointmentList } from "../components/dashboard/AppointmentList";
import { TaskChecklist } from "../components/dashboard/TaskChecklist";
import { ShareModal } from "../components/dashboard/ShareModal";
import {
  Eye,
  Share2,
  Award,
  Briefcase,
  Tag,
  Box,
  Lightbulb,
  Zap,
} from "lucide-react";

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
        <div className="h-10 w-64 bg-slate-200 rounded-2xl" />

        {/* Stats Grid Skeleton */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-32 rounded-3xl bg-slate-200/80 border border-slate-200"
            />
          ))}
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="h-64 rounded-3xl bg-slate-200/80 border border-slate-200" />
            <div className="h-48 rounded-3xl bg-slate-200/80 border border-slate-200" />
          </div>
          <div className="space-y-6">
            <div className="h-44 rounded-3xl bg-slate-200/80 border border-slate-200" />
            <div className="h-44 rounded-3xl bg-slate-200/80 border border-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 max-w-md mx-auto space-y-4">
        <Alert variant="error" title="Dashboard Error">
          Unable to pull dashboard summaries. Please check connection and try again.
        </Alert>
        <div className="flex justify-center">
          <Button variant="primary" onClick={() => refetch()}>
            Try Again
          </Button>
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

  const statsList =
    user.profileType === "professional"
      ? [
          {
            label: "Profile Views",
            value: statistics.profileViews || 0,
            trend: "Total profile impressions",
            icon: <Eye className="w-5 h-5 text-blue-600" />,
            badge: "Live",
          },
          {
            label: "Card Shares",
            value: statistics.cardShares || 0,
            trend: "Total link & NFC shares",
            icon: <Share2 className="w-5 h-5 text-emerald-600" />,
            badge: "98% rate",
          },
          {
            label: "Expertise Skills",
            value: statistics.skillsCount || 0,
            trend: "Active skill tags",
            icon: <Award className="w-5 h-5 text-[#163300]" />,
            badge: "Public",
          },
          {
            label: "Experience Nodes",
            value: statistics.experienceCount || 0,
            trend: "Career milestones",
            icon: <Briefcase className="w-5 h-5 text-indigo-600" />,
            badge: "Verified",
          },
        ]
      : [
          {
            label: "Profile Views",
            value: statistics.profileViews || 0,
            trend: "Total business traffic",
            icon: <Eye className="w-5 h-5 text-blue-600" />,
            badge: "Live",
          },
          {
            label: "Card Shares",
            value: statistics.cardShares || 0,
            trend: "NFC taps & shares",
            icon: <Share2 className="w-5 h-5 text-emerald-600" />,
            badge: "98% rate",
          },
          {
            label: "Services",
            value: statistics.servicesCount || 0,
            trend: "Active offerings",
            icon: <Tag className="w-5 h-5 text-amber-600" />,
            badge: "Booking",
          },
          {
            label: "Products",
            value: statistics.productsCount || 0,
            trend: "Catalog items",
            icon: <Box className="w-5 h-5 text-cyan-600" />,
            badge: "Active",
          },
        ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-8 min-w-0 pb-12"
    >
      {/* Header bar and greeting summary */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#163300] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#576159]">
              Workspace Overview
            </span>
          </div>
          <h1 className="font-display text-2.5xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#121814]">
            Welcome back, {user.name?.split(" ")[0]}
          </h1>
          <p className="text-xs sm:text-sm text-[#576159] mt-1">
            Real-time engagement metrics, card shares, and identity readiness.
          </p>
        </div>

        {todayInsights?.summaryText ? (
          <div className="px-4 py-2.5 rounded-xl bg-[#F6F5EE] border border-black/[0.08] shadow-2xs flex items-center gap-2.5 max-w-sm shrink-0">
            <Lightbulb className="w-4 h-4 text-[#163300] shrink-0" />
            <span className="text-xs font-medium text-[#121814] leading-snug">
              {todayInsights.summaryText}
            </span>
          </div>
        ) : null}
      </div>

      {/* 1. Quick Statistics Row */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsList.map((stat, i) => (
          <Card
            key={i}
            hoverEffect
            className="p-5 sm:p-6 bg-white border border-black/[0.08] rounded-2xl shadow-[0_4px_20px_rgba(18,24,20,0.02)] hover:border-black/[0.15]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#879289]">
                {stat.label}
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#F6F5EE] border border-black/[0.06] flex items-center justify-center shrink-0">
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-display font-bold text-[#121814] mt-3 tracking-tight">
              {stat.value}
            </div>
            <div className="flex items-center justify-between text-xs text-[#576159] mt-1 pt-1 border-t border-black/[0.04]">
              <span className="text-[11px] truncate">{stat.trend}</span>
              <span className="text-[10px] font-mono font-medium text-[#163300] bg-[#F6F5EE] px-2 py-0.5 rounded-full border border-black/[0.06] shrink-0">
                {stat.badge}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main split grid: Quick Actions & Activity vs Health & AI Center */}
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
        {/* LEFT COLUMN: Quick Actions & Live Activity */}
        <div className="space-y-8">
          {/* Quick Actions Panel */}
          <Card className="p-6 bg-white border border-black/[0.08] rounded-2xl shadow-[0_4px_20px_rgba(18,24,20,0.02)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F6F5EE] border border-black/[0.08] flex items-center justify-center text-[#163300]">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-display text-base font-bold text-[#121814]">
                  Quick Actions
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#879289] uppercase tracking-wider">
                Identity Controls
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 pt-1">
              {user.profileType === "professional" ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      navigate("/identity");
                      setTimeout(() => {
                        window.location.hash = "#personal";
                      }, 100);
                    }}
                    className="text-xs font-semibold w-full h-10"
                  >
                    + Add Skill
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      navigate("/identity");
                      setTimeout(() => {
                        window.location.hash = "#experience";
                      }, 100);
                    }}
                    className="text-xs font-semibold w-full h-10"
                  >
                    + Add Experience
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setIsShareOpen(true)}
                    className="text-xs font-semibold w-full h-10"
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />
                    Share Card
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      navigate("/identity");
                      setTimeout(() => {
                        window.location.hash = "#offerings";
                      }, 100);
                    }}
                    className="text-xs font-semibold w-full h-10"
                  >
                    + Add Service
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      navigate("/identity");
                      setTimeout(() => {
                        window.location.hash = "#offerings";
                      }, 100);
                    }}
                    className="text-xs font-semibold w-full h-10"
                  >
                    + Add Product
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setIsShareOpen(true)}
                    className="text-xs font-semibold w-full h-10"
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />
                    Share Card
                  </Button>
                </>
              )}
            </div>
          </Card>

        </div>

        {/* RIGHT COLUMN: Health Score, AI suggestions, Subscription */}
        <div className="space-y-8">
          {/* Health Score */}
          <Card className="p-6 bg-white border border-black/[0.08] rounded-2xl shadow-[0_4px_20px_rgba(18,24,20,0.02)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-[#121814]">
                  Profile Health Score
                </h3>
                <p className="text-xs text-[#576159] mt-0.5">
                  Completeness & conversion readiness
                </p>
              </div>
              <span className="text-xl">🏆</span>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="relative h-15 w-15 rounded-xl bg-[#163300] text-[#9FE870] font-display font-bold text-xl flex items-center justify-center shrink-0 shadow-2xs">
                {healthScore || 95}%
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#121814] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#163300]" />
                  Status: Highly Optimized
                </div>
                <p className="text-xs text-[#576159] leading-relaxed">
                  Your profile card is published, mobile-responsive, and ready for NFC exchange.
                </p>
              </div>
            </div>
          </Card>

          {/* AI Suggestions Center */}
          <Card className="p-6 bg-white border border-black/[0.08] rounded-2xl shadow-[0_4px_20px_rgba(18,24,20,0.02)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">✨</span>
                <h3 className="font-display text-base font-bold text-[#121814]">
                  AI Growth Insights
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#879289] uppercase tracking-wider">
                Automated
              </span>
            </div>

            <div className="space-y-3">
              {aiSuggestions.length ? (
                aiSuggestions.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-[#F6F5EE] border border-black/[0.06] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#121814]">
                        {item.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider ${
                          item.urgency === "high"
                            ? "bg-rose-50 border border-rose-200 text-rose-700"
                            : "bg-[#163300]/[0.06] border border-black/[0.08] text-[#163300]"
                        }`}
                      >
                        {item.urgency}
                      </span>
                    </div>
                    <p className="text-xs text-[#576159] leading-relaxed">
                      {item.description}
                    </p>
                    <a
                      href={item.action}
                      className="inline-block text-xs font-semibold text-[#163300] hover:underline"
                    >
                      Resolve Suggestion →
                    </a>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-[#879289]">
                  Profile fully optimized. No pending suggestions.
                </div>
              )}
            </div>
          </Card>

          {/* Subscription / Plan Widget */}
          <Card className="p-6 bg-[#121814] text-white rounded-2xl border border-black/[0.12] shadow-md space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#9FE870]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div>
                <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#9FE870]">
                  Subscription Tier
                </span>
                <h4 className="font-display text-xl font-bold text-white capitalize mt-0.5">
                  {subscription.tier || "Pro"} Plan
                </h4>
              </div>
              <span className="text-[11px] font-mono uppercase bg-white/[0.08] border border-white/10 px-3 py-1 rounded-full text-[#9FE870]">
                Active
              </span>
            </div>

            <p className="text-xs text-[#879289] leading-relaxed relative z-10">
              Your plan includes custom link-in-bio, NFC digital card sync, unlimited views, and analytics tracking.
            </p>

            <Button
              variant="primary"
              onClick={() => navigate("/pricing")}
              className="w-full text-xs font-semibold bg-[#9FE870] hover:bg-[#8fd860] text-[#163300] border-none shadow-xs relative z-10"
            >
              Manage / Upgrade Plan
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

