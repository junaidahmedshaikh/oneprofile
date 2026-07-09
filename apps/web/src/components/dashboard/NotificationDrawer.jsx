import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "../../lib/dashboardApi";
import clsx from "clsx";

export function NotificationDrawer({ isOpen, onClose }) {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["dashboard", "notifications"],
    queryFn: async () => {
      const response = await dashboardApi.notifications();
      return response.data.data;
    },
    enabled: isOpen,
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => dashboardApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "notifications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[380px] bg-[#12141c] border-l border-white/[0.06] p-6 shadow-2xl flex flex-col justify-between"
          >
            <div className="space-y-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight">
                    Notifications
                  </h3>
                  <p className="text-3xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    Latest system alerts
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center border border-white/[0.05] text-slate-400 hover:text-white transition-all active:scale-95"
                >
                  ✕
                </button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-16 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse" />
                  ))}
                </div>
              ) : null}

              {!isLoading && !notifications.length ? (
                <div className="py-12 text-center space-y-2">
                  <span className="text-2xl block">🔔</span>
                  <p className="text-xs text-slate-400">All caught up! No new notifications.</p>
                </div>
              ) : null}

              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif._id}
                    className={clsx(
                      "p-4 rounded-2xl border transition-all flex items-start gap-3 relative group",
                      notif.isRead 
                        ? "bg-white/[0.01] border-white/[0.03]" 
                        : "bg-brand-500/[0.02] border-brand-500/20 shadow-sm"
                    )}
                  >
                    {!notif.isRead ? (
                      <span className="h-2 w-2 rounded-full bg-brand-400 shrink-0 mt-1.5" />
                    ) : null}
                    
                    <div className="flex-1 space-y-1">
                      <div className="text-xs font-bold text-white leading-snug">
                        {notif.title}
                      </div>
                      <div className="text-2xs text-slate-400 leading-relaxed">
                        {notif.message}
                      </div>
                      
                      {!notif.isRead ? (
                        <button
                          onClick={() => markReadMutation.mutate(notif._id)}
                          className="mt-2 text-3xs font-bold text-brand-400 hover:underline flex items-center gap-1 select-none"
                        >
                          Mark as read ✓
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.05] pt-4 mt-6">
              <Button variant="secondary" className="w-full text-xs" onClick={onClose}>
                Close Panel
              </Button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
