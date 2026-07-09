import { motion } from "framer-motion";

const getActivityIcon = (type = "") => {
  switch (type) {
    case "profile_view":
      return "👁️";
    case "card_shared":
      return "🎴";
    case "lead_captured":
      return "⚡";
    case "onboarding_step":
      return "⚙️";
    case "onboarding_published":
      return "🚀";
    case "appointment_booked":
      return "📅";
    default:
      return "✨";
  }
};

const getRelativeTime = (dateStr) => {
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export function ActivityTimeline({ activities = [] }) {
  if (!activities.length) {
    return (
      <div className="py-6 text-center text-xs text-slate-500">
        No recent activities recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6">
      {/* Central line track */}
      <div className="absolute left-2.5 top-2 bottom-2 w-px bg-white/[0.06]" />

      {activities.map((act, i) => (
        <motion.div
          key={act._id || i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="relative flex gap-4 items-start group"
        >
          {/* Timeline node */}
          <div className="absolute -left-6.5 mt-0.5 h-5.5 w-5.5 rounded-full bg-[#12141c] border border-white/[0.08] flex items-center justify-center text-2xs shadow-sm z-10 group-hover:border-brand-500/30 transition-colors">
            {getActivityIcon(act.type)}
          </div>

          <div className="flex-1 space-y-1">
            <p className="text-xs text-slate-300 font-semibold group-hover:text-white transition-colors">
              {act.description}
            </p>
            <span className="block text-3xs text-slate-500 font-bold uppercase tracking-wider">
              {getRelativeTime(act.createdAt)}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
