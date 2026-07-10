import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const commandItems = [
  {
    id: "dash",
    title: "Go to Dashboard",
    category: "Navigation",
    path: "/dashboard",
    icon: "📊",
  },
  {
    id: "ident",
    title: "Edit Identity Settings",
    category: "Navigation",
    path: "/identity",
    icon: "⚙️",
  },
  {
    id: "ver",
    title: "Verify Email & Phone",
    category: "Security",
    path: "/verify",
    icon: "🛡️",
  },
];

export function DashboardSearch() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Command palette toggle keyboard listener (Ctrl + K or Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filteredCommands = commandItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item) => {
    navigate(item.path);
    setIsOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) =>
          (prev - 1 + filteredCommands.length) % filteredCommands.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex]);
      }
    }
  };

  return (
    <div className="relative">
      {/* Small Inline Header Search trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] text-xs text-slate-400 font-semibold transition-all active:scale-[0.98] select-none text-left w-48 sm:w-64"
      >
        <span>🔍 Search workspace...</span>
        <span className="ml-auto text-3xs font-extrabold bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded-md text-slate-500">
          ⌘K
        </span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Dialog Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-[15%] mx-auto z-50 max-w-lg border border-oneprofile-700 bg-oneprofile-900/40 rounded-ds-modal shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Search input field */}
              <div className="p-4.5 border-b border-white/[0.05] flex items-center gap-3">
                <span className="text-sm">🔍</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or page name..."
                  autoFocus
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-3xs font-extrabold uppercase bg-white/[0.04] border border-white/[0.06] px-2 py-1 rounded-lg text-slate-400"
                >
                  ESC
                </button>
              </div>

              {/* Commands list */}
              <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                {filteredCommands.length ? (
                  filteredCommands.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-left text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-brand-500/10 text-white border border-brand-500/20"
                            : "text-slate-400 hover:text-white border border-transparent"
                        }`}
                      >
                        <span className="text-md">{item.icon}</span>
                        <div className="flex-1">
                          <div>{item.title}</div>
                          <div className="text-3xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                            {item.category}
                          </div>
                        </div>
                        {isSelected ? (
                          <span className="text-2xs font-extrabold text-brand-400">
                            ⏎ Jump
                          </span>
                        ) : null}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No matching commands or pages found.
                  </div>
                )}
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
