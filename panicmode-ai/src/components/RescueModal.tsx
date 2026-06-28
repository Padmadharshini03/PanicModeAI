import React, { useState } from 'react';
import { AcademicTask, RescuePackage } from '../types';
import { ShieldAlert, Mail, Calendar, HeartPulse, Copy, Check, X, Sparkles, Send, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RescueModalProps {
  task: AcademicTask;
  data: RescuePackage | null;
  isLoading: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const RescueModal: React.FC<RescueModalProps> = ({
  task,
  data,
  isLoading,
  onClose,
  theme
}) => {
  const [activeTab, setActiveTab] = useState<'email' | 'schedule' | 'pep'>('email');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!data?.emailDraft) return;
    navigator.clipboard.writeText(data.emailDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isRed = task.urgencyLevel === 'Crisis';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden ${
          theme === 'dark'
            ? 'bg-slate-950 border-white/20 text-white'
            : 'bg-white border-slate-300 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-6 border-b flex items-center justify-between relative overflow-hidden ${
          isRed ? 'bg-gradient-to-r from-red-600/30 via-rose-600/20 to-transparent' : 'bg-gradient-to-r from-amber-500/20 to-transparent'
        } ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3 relative z-10">
            <div className={`p-3 rounded-2xl ${isRed ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-500 text-slate-950'}`}>
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  🚨 EMERGENCY PRODUCTIVITY RESCUE PACKAGE
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black truncate max-w-md">
                {task.title}
              </h3>
              <p className="text-xs font-mono opacity-70">{task.course} • Panic Score: {task.panicScore}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full border transition-colors relative z-10 ${
              theme === 'dark' ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className={`px-6 py-3 border-b flex gap-2 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'email'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/20'
                : theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700 border'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Extension Email Draft</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'schedule'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700 border'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Recovery Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('pep')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTab === 'pep'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                : theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-slate-400' : 'bg-white hover:bg-slate-100 text-slate-700 border'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>Adrenaline Boost</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 min-h-[280px]">
          {isLoading || !data ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
              <p className="text-sm font-mono animate-pulse">🤖 AI Coach deconstructing panic state...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono opacity-80 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Diplomatic Extension Request (Tailored to course)
                    </span>

                    <button
                      onClick={handleCopy}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                        copied
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-white text-slate-950 hover:bg-slate-200'
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Draft'}</span>
                    </button>
                  </div>

                  <div className={`p-4 rounded-2xl font-mono text-xs sm:text-sm leading-relaxed border whitespace-pre-wrap select-all ${
                    theme === 'dark' ? 'bg-black/60 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}>
                    {data.emailDraft}
                  </div>
                </motion.div>
              )}

              {activeTab === 'schedule' && (
                <motion.div
                  key="schedule"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <p className="text-xs font-mono opacity-80 mb-3">
                    ⚡ Emergency Triage Timeline to rescue assignment before {task.dueHours}h cutoff:
                  </p>
                  {data.scheduleBreakdown.map((block, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                        theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-xs shrink-0">
                        {block.time}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold">{block.action}</span>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'pep' && (
                <motion.div
                  key="pep"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center text-center py-8 px-4 space-y-6"
                >
                  <div className="p-4 rounded-full bg-emerald-500/20 text-emerald-400 animate-bounce">
                    <HeartPulse className="w-10 h-10" />
                  </div>
                  <blockquote className="text-lg sm:text-xl font-bold italic leading-relaxed max-w-lg">
                    "{data.pepTalk}"
                  </blockquote>
                  <p className="text-xs font-mono opacity-70">
                    Take 3 slow breaths right now. Inhale 4s... hold 4s... exhale 6s.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs font-mono ${
          theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-100'
        }`}>
          <span>Student Hackathon Demo Mode</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
          >
            Done & Ready to Execute
          </button>
        </div>
      </motion.div>
    </div>
  );
};
