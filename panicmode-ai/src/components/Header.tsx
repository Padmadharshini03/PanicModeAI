import React from 'react';
import { Sun, Moon, TriangleAlert, Plus, Search, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activePanicScore: number;
  onOpenNewTask?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  activePanicScore,
  onOpenNewTask,
  onLogout
}) => {
  return (
    <header className={`relative z-20 px-6 py-3.5 border-b transition-colors duration-500 flex items-center justify-between ${
      theme === 'dark' 
        ? 'border-white/10 bg-[#130d1e]/90 text-white backdrop-blur-xl' 
        : 'border-slate-200/80 bg-[#f8f6f0]/90 text-slate-900 shadow-xs backdrop-blur-xl'
    }`}>
      {/* Brand: Clean Logo & Title centered vertically */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#ff5773] shadow-md shadow-[#ff5773]/30">
          <TriangleAlert className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#ff5773]">
          PanicMode AI
        </h1>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex flex-1 max-w-lg mx-8">
        <div className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-full border text-xs sm:text-sm transition-all ${
          theme === 'dark'
            ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus-within:border-[#ff5773]/50'
            : 'bg-white border-slate-200/80 text-slate-900 shadow-inner focus-within:border-[#ff5773]'
        }`}>
          <Search className="w-4 h-4 opacity-50 shrink-0" />
          <input
            type="text"
            placeholder="Search tasks, resources, or help..."
            className="w-full bg-transparent border-none focus:outline-hidden text-xs sm:text-sm font-medium"
          />
        </div>
      </div>

      {/* Right Controls: + New Task, Theme Toggle, Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* + New Task Pill Button */}
        {onOpenNewTask && (
          <button
            onClick={onOpenNewTask}
            className="px-4 sm:px-5 py-2.5 rounded-full bg-[#ff5773] hover:bg-[#ff4060] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-[#ff5773]/25 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Task</span>
          </button>
        )}

        {/* Global Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle Theme"
          className={`relative p-2.5 rounded-xl border transition-all duration-300 overflow-hidden group ${
            theme === 'dark'
              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-300'
              : 'bg-white text-amber-500 hover:bg-slate-100 border-slate-200 shadow-xs'
          }`}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 group-hover:scale-110 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 group-hover:scale-110 transition-transform" />
            )}
          </motion.div>
        </button>

        {/* User Avatar / Logout */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Log Out / Lock Workspace"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#ff5773]/40 overflow-hidden bg-gradient-to-tr from-[#ff5773] to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-sm hover:scale-105 transition-transform"
          >
            ST
          </button>
        )}
      </div>
    </header>
  );
};
