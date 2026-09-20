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
      <div className="py-8 text-center text-xs text-[#879289]">
        No recent activities recorded yet. Share your card to start tracking engagement.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-5">
      {/* Central line track */}
      <div className="absolute left-2.5 top-2 bottom-2 w-px bg-black/[0.08]" />

      {activities.map((act, i) => (
        <motion.div
          key={act._id || i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: i * 0.04 }}
          className="relative flex gap-3.5 items-start group"
        >
          {/* Timeline node */}
          <div className="absolute -left-6.5 mt-0.5 h-6 w-6 rounded-full border border-black/[0.08] bg-[#F6F5EE] flex items-center justify-center text-xs shadow-2xs z-10 group-hover:border-[#163300] transition-colors">
            {getActivityIcon(act.type)}
          </div>

          <div className="flex-1 space-y-0.5 min-w-0">
            <p className="text-xs text-[#121814] font-medium group-hover:text-[#163300] transition-colors leading-relaxed">
              {act.description}
            </p>
            <span className="block text-[10px] font-mono text-[#879289] uppercase tracking-wider">
              {getRelativeTime(act.createdAt)}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

