import { useQuery } from '@tanstack/react-query';
import { authApi } from '../lib/authApi';
import { Card } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { motion } from 'framer-motion';

export function DashboardPage() {
  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await authApi.me();
      return response.data.data.user;
    }
  });

  const displayUser = meQuery.data;

  // Mock analytics stats for premium aesthetics
  const stats = [
    { label: "Profile Views", value: "1,280", trend: "+12.3% this week", icon: "👁️" },
    { label: "Digital Card Shares", value: "342", trend: "+8.1% this week", icon: "🎴" },
    { label: "Lead Conversions", value: "48", trend: "+15.4% this week", icon: "⚡" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8"
    >
      {/* Welcome header with display name */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome back, {displayUser?.name ? <span className="text-gradient-brand">{displayUser.name.split(" ")[0]}</span> : "Professional"} ✨
          </h1>
          <p className="text-sm text-slate-400 mt-1">Here is a summary of your digital business workspace status.</p>
        </div>

        {displayUser?.onboardingStatus !== "published" ? (
          <a
            href="/onboarding"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/25 px-4 text-xs font-bold text-amber-300 hover:bg-amber-500/15 transition-all"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            Resume Profile Onboarding
          </a>
        ) : (
          <span className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3.5 text-xs font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Profile Published
          </span>
        )}
      </div>

      {meQuery.isLoading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse h-28 bg-white/[0.01] border-white/[0.04]" />
          ))}
        </div>
      ) : null}

      {meQuery.isError ? <Alert variant="error">Unable to load profile. Please refresh.</Alert> : null}

      {displayUser ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Account details card */}
          <Card className="lg:col-span-2 relative overflow-hidden" hoverEffect>
            <div className="absolute top-0 right-0 w-36 h-36 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4.5">
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-tr from-brand-500 to-brand-400 p-0.5 shadow-lg">
                <div className="h-full w-full rounded-[22px] bg-[#12141c] flex items-center justify-center text-lg font-black text-brand-400">
                  {displayUser.name?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <span className="text-2xs uppercase tracking-[0.25em] text-brand-400 font-bold">Identity Profile</span>
                <h3 className="mt-1 text-2xl font-bold text-white tracking-tight">{displayUser.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{displayUser.email || displayUser.phone}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 border-t border-white/[0.06] pt-6 sm:grid-cols-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-xs text-slate-400 font-semibold">Account Role</div>
                <div className="text-sm font-bold text-white mt-1 capitalize">{displayUser.role || "User"}</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div className="text-xs text-slate-400 font-semibold">Profile Setup Completion</div>
                <div className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-400" />
                  {displayUser.onboardingProgress || 0}% Complete
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="flex flex-col justify-between" hoverEffect>
            <div>
              <h3 className="text-lg font-bold text-white">Identity Ecosystem</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Manage different touchpoints of your business identity from this dashboard workspace.</p>
            </div>
            
            <div className="space-y-2.5 mt-6">
              <a href="/identity" className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] text-xs font-semibold text-slate-300 hover:text-white transition-all group">
                <span>Manage Public Profile</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
              <a href="/sessions" className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] text-xs font-semibold text-slate-300 hover:text-white transition-all group">
                <span>Security & Active Devices</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
            </div>
          </Card>
        </div>
      ) : null}

      {/* Mock Analytics Section */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-bold text-white tracking-tight">Growth Insights</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, i) => (
            <Card key={i} hoverEffect className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors duration-300" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">{stat.label}</span>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <div className="text-3xl font-extrabold text-white mt-4 font-display tracking-tight">{stat.value}</div>
              <div className="text-2xs text-emerald-400 font-semibold mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {stat.trend}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
