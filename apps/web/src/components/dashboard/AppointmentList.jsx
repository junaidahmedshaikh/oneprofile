import { motion } from "framer-motion";

export function AppointmentList({ appointments = [] }) {
  if (!appointments.length) {
    return (
      <div className="py-8 text-center text-xs text-slate-500">
        No upcoming appointments scheduled.
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {appointments.map((appt, i) => {
        const apptDate = new Date(appt.dateTime);
        const timeStr = apptDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const dateStr = apptDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return (
          <motion.div
            key={appt._id || i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.03] transition-all"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex flex-col items-center justify-center shrink-0 text-brand-300 select-none">
                <span className="text-3xs font-extrabold uppercase leading-none">{apptDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className="text-xs font-bold mt-0.5 leading-none">{apptDate.getDate()}</span>
              </div>
              
              <div className="min-w-0 space-y-0.5">
                <div className="text-xs font-bold text-white truncate">
                  {appt.clientName}
                </div>
                <div className="text-3xs text-slate-400 truncate max-w-[200px]">
                  {appt.notes || "Call inquiry consultation"}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="block text-xs font-bold text-white">
                {timeStr}
              </span>
              <span className="block text-3xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                {appt.duration} min
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
