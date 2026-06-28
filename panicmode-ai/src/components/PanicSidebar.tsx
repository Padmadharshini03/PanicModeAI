import React from 'react';
import { AcademicTask } from '../types';
import { AlertTriangle, Clock, Flame, ShieldCheck, Zap, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface PanicSidebarProps {
  tasks: AcademicTask[];
  activeTaskId: string;
  onSelectTask: (task: AcademicTask) => void;
  onRescueMe: (task: AcademicTask, e: React.MouseEvent) => void;
  theme: 'dark' | 'light';
}

export const PanicSidebar: React.FC<PanicSidebarProps> = ({
  tasks,
  activeTaskId,
  onSelectTask,
  onRescueMe,
  theme
}) => {
  return (
    <div className={`flex flex-col h-full rounded-2xl border backdrop-blur-md overflow-hidden transition-all duration-500 ${
      theme === 'dark'
        ? 'bg-black/40 border-white/10 text-white shadow-2xl'
        : 'bg-white/80 border-slate-200 text-slate-900 shadow-xl'
    }`}>
      {/* Column Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-500/20 text-red-500 animate-pulse">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-wide flex items-center gap-2">
              THE PANIC SIDEBAR
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500 text-white font-bold">
                TIMELINE
              </span>
            </h2>
            <p className={`text-[11px] font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Ranked by algorithmic crisis severity
            </p>
          </div>
        </div>
      </div>

      {/* Task List / Timeline */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 custom-scrollbar">
        {tasks.map((task, idx) => {
          const isActive = task.id === activeTaskId;
          const isRed = task.urgencyLevel === 'Crisis';
          const isOrange = task.urgencyLevel === 'Warning';
          const isGreen = task.urgencyLevel === 'Safe';

          // Color themes based on panic level
          let cardBorder = theme === 'dark' ? 'border-white/10 hover:border-white/20' : 'border-slate-200 hover:border-slate-300';
          let glowClass = '';
          let badgeColor = '';
          let iconComponent = null;

          if (isRed) {
            cardBorder = isActive 
              ? 'border-red-500 ring-2 ring-red-500/40 bg-gradient-to-r from-red-500/15 via-black/40 to-black/40' 
              : 'border-red-500/50 hover:border-red-500';
            glowClass = 'shadow-[0_0_20px_rgba(239,68,68,0.25)]';
            badgeColor = 'bg-red-500 text-white animate-pulse';
            iconComponent = <AlertTriangle className="w-4 h-4 text-red-500" />;
          } else if (isOrange) {
            cardBorder = isActive 
              ? 'border-amber-500 ring-2 ring-amber-500/40 bg-gradient-to-r from-amber-500/15 via-black/40 to-black/40' 
              : 'border-amber-500/40 hover:border-amber-500';
            glowClass = isActive ? 'shadow-[0_0_15px_rgba(245,158,11,0.2)]' : '';
            badgeColor = 'bg-amber-500 text-slate-950 font-bold';
            iconComponent = <Clock className="w-4 h-4 text-amber-500" />;
          } else {
            cardBorder = isActive 
              ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-black/40 to-black/40' 
              : 'border-emerald-500/30 hover:border-emerald-500';
            badgeColor = 'bg-emerald-500 text-slate-950 font-bold';
            iconComponent = <ShieldCheck className="w-4 h-4 text-emerald-500" />;
          }

          if (theme === 'light' && isActive) {
            cardBorder = isRed ? 'border-red-500 ring-2 ring-red-500/30 bg-red-50/80' : isOrange ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/80' : 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/80';
          }

          const progressPercent = Math.round((task.completedSteps / task.totalSteps) * 100);

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelectTask(task)}
              className={`relative rounded-xl p-3.5 border cursor-pointer transition-all duration-300 ${cardBorder} ${glowClass} ${
                theme === 'dark' && !isActive ? 'bg-white/5' : theme === 'light' && !isActive ? 'bg-white' : ''
              }`}
            >
              {/* Active Indicator Strip */}
              {isActive && (
                <motion.div 
                  layoutId="activeStrip" 
                  className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full ${
                    isRed ? 'bg-red-500' : isOrange ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} 
                />
              )}

              <div className="flex items-start justify-between gap-2 pl-1.5">
                <div className="space-y-1 pr-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded uppercase ${badgeColor}`}>
                      Panic: {task.panicScore}
                    </span>
                    <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded border ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      Due in {task.dueHours}h
                    </span>
                  </div>

                  <h3 className={`font-bold text-sm sm:text-base leading-snug pt-1 ${
                    isActive ? (isRed ? 'text-red-400 font-black' : isOrange ? 'text-amber-400' : 'text-emerald-400') : ''
                  }`}>
                    {task.title}
                  </h3>
                  
                  <p className={`text-xs flex items-center gap-1 font-medium ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <BookOpen className="w-3 h-3 opacity-70" />
                    <span className="truncate">{task.course}</span>
                  </p>
                </div>

                <div className="pt-0.5">{iconComponent}</div>
              </div>

              {/* Progress & Meta */}
              <div className="mt-3 pl-1.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                    Micro-Steps: {task.completedSteps}/{task.totalSteps}
                  </span>
                  <span className="font-semibold">{progressPercent}%</span>
                </div>

                <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'
                }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${
                      isRed ? 'bg-gradient-to-r from-red-500 to-rose-400' : isOrange ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`}
                  />
                </div>
              </div>

              {/* Rescue Me Button */}
              <div className="mt-3.5 pl-1.5 flex items-center justify-between">
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  task.complexity === 'High' ? 'text-red-400 bg-red-500/10 font-bold' : task.complexity === 'Medium' ? 'text-amber-400 bg-amber-500/10' : 'text-emerald-400 bg-emerald-500/10'
                }`}>
                  {task.complexity} Complexity
                </span>

                <button
                  onClick={(e) => onRescueMe(task, e)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow-md active:scale-95 ${
                    isRed
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-500/30'
                      : isOrange
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-amber-500/20'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 animate-bounce" />
                  <span>Rescue Me</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Sidebar Footer Tip */}
      <div className={`p-3 border-t text-[11px] font-mono text-center ${
        theme === 'dark' ? 'border-white/10 bg-black/30 text-slate-400' : 'border-slate-200 bg-slate-100 text-slate-600'
      }`}>
        ⚡ Click any task to enter Single-Focus Horizon
      </div>
    </div>
  );
};
