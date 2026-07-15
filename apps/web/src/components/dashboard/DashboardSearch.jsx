import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Settings, Compass, Search } from "lucide-react";
import React from "react";

const commandItems = [
  {
    id: "dash",
    title: "Go to Dashboard",
    category: "Navigation",
    path: "/dashboard",
    icon: <BarChart2 className="w-4 h-4 text-indigo-400" />,
  },
  {
    id: "ident",
    title: "Edit Identity Settings",
    category: "Navigation",
    path: "/identity",
    icon: <Settings className="w-4 h-4 text-slate-400" />,
  },
  {
    id: "onboard",
    title: "Resume Profile Onboarding",
    category: "Setup",
    path: "/onboarding",
    icon: <Compass className="w-4 h-4 text-purple-400" />,
  },
];

export function DashboardSearch() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce the input search query to optimize filtering and prevent redundant rendering
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setQuery(inputValue);
    }, 150);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  // Command palette toggle keyboard listener (Ctrl + K or Cmd + K)
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        if (!isOpen && inputRef.current) {
          inputRef.current.focus();
        }
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleGlobalKeys);
    return () => window.removeEventListener("keydown", handleGlobalKeys);
  }, [isOpen]);

  // Click outside detector to close the dropdown palette
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter commands list based on debounced query
  const filteredCommands = commandItems.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Reset selected index when the query shifts
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item) => {
    navigate(item.path);
    setIsOpen(false);
    setInputValue("");
    setQuery("");
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <>
      {/* Backdrop overlay for focus context */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-[#06070a]/40 backdrop-blur-[1.5px] transition-all cursor-default"
        />
      )}

      {/* Main Search Input Container */}
      <div 
        ref={containerRef} 
        className={`search-container relative w-full ${isOpen ? "z-50" : "z-10"}`}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-owns="search-results-listbox"
      >
        <div className="relative flex items-center">
          <Search 
            className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none select-none" 
            aria-hidden="true" 
          />
          
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search workspace... (⌘K)"
            className="w-full pl-10 pr-12 py-2 text-xs font-semibold rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] focus:bg-white/[0.05] focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/30 text-white placeholder-slate-500 transition-all select-text"
            aria-autocomplete="list"
            aria-controls="search-results-listbox"
          />

          <kbd 
            className="absolute right-3.5 text-3xs font-extrabold bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded-md text-slate-500 pointer-events-none select-none hidden sm:inline-block"
            aria-hidden="true"
          >
            ⌘K
          </kbd>
        </div>

        {/* Dropdown Menu Listbox */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="search-results-listbox"
              role="listbox"
              aria-label="Search Workspace Suggestions"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="absolute left-0 right-0 mt-1.5 border border-oneprofile-700 bg-[#0c0d14] rounded-2xl shadow-2xl p-1.5 max-h-[280px] overflow-y-auto space-y-0.5 backdrop-blur-xl"
            >
              {filteredCommands.length ? (
                filteredCommands.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      id={`option-${item.id}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                        isSelected
                          ? "bg-white/[0.04] text-white border border-white/[0.08] shadow-sm shadow-black/50"
                          : "text-slate-400 hover:text-white border border-transparent"
                      }`}
                    >
                      <span className="shrink-0" aria-hidden="true">
                        {item.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold truncate leading-tight">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                          {item.category}
                        </div>
                      </div>
                      {isSelected && (
                        <span 
                          className="text-[10px] font-extrabold text-brand-400 shrink-0 bg-brand-500/10 px-2 py-0.5 rounded-md border border-brand-500/20 hidden xs:inline-block select-none"
                          aria-hidden="true"
                        >
                          ⏎ Jump
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-5 text-center text-xs text-slate-500 font-medium select-none" role="status">
                  No matching workspace actions found.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
