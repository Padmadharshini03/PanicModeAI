import React, { useState } from 'react';
import { AcademicTask } from '../types';
import { CheckCircle2, Circle, Clock, Flame, Plus, RefreshCw, Sparkles, Zap, ShieldAlert, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface FocusHorizonProps {
  task: AcademicTask;
  onToggleStep: (taskId: string, stepId: string) => void;
  onAddStep: (taskId: string, stepText: string, timeEst: string) => void;
  onRegenerateSteps: (taskId: string) => Promise<void>;
  onRescueMe: (task: AcademicTask) => void;
  theme: 'dark' | 'light';
}

export const FocusHorizon: React.FC<FocusHorizonProps> = ({
  task,
  onToggleStep,
  onAddStep,
  onRegenerateSteps,
  onRescueMe,
  theme
}) => {
  const [newStepText, setNewStepText] = useState('');
  const [newStepTime, setNewStepTime] = useState('10 mins');
  const [isAdding, setIsAdding] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const isRed = task.urgencyLevel === 'Crisis';
  const isOrange = task.urgencyLevel === 'Warning';
  
  const handleCheckboxClick = (stepId: string, isCurrentlyDone: boolean, e: React.MouseEvent) => {
    if (!isCurrentlyDone) {
      // Trigger celebratory confetti
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { x, y },
        colors: isRed ? ['#ef4444', '#f87171', '#fcd34d'] : isOrange ? ['#f59e0b', '#fbbf24', '#34d399'] : ['#10b981', '#34d399', '#6ee7b7']
      });
    }
    onToggleStep(task.id, stepId);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepText.trim()) return;
    onAddStep(task.id, newStepText.trim(), newStepTime);
    setNewStepText('');
    setIsAdding(false);
  };

  const handleRegenClick = async () => {
    setIsRegenerating(true);
    await onRegenerateSteps(task.id);
    setIsRegenerating(false);
  };

  const progressPercent = Math.round((task.completedSteps / Math.max(1, task.totalSteps)) * 100);

  let accentColorText = isRed ? 'text-red-500' : isOrange ? 'text-amber-500' : 'text-emerald-500';
  let accentColorBg = isRed ? 'from-red-500/20' : isOrange ? 'from-amber-500/20' : 'from-emerald-500/20';

  return (
    <div className={`flex flex-col h-full rounded-2xl border backdrop-blur-md overflow-hidden transition-all duration-500 ${
      theme === 'dark'
        ? 'bg-black/50 border-white/10 text-white shadow-2xl'
        : 'bg-white/90 border-slate-200 text-slate-900 shadow-xl'
    }`}>
      {/* Horizon Top Banner */}
      <div className={`p-5 sm:p-6 border-b relative overflow-hidden bg-gradient-to-b ${accentColorBg} via-transparent to-transparent ${
        theme === 'dark' ? 'border-white/10' : 'border-slate-200'
      }`}>
        {/* Background Watermark Gauge */}
        <div className="absolute -right-8 -top-8 opacity-10 pointer-events-none">
          <ShieldAlert className={`w-64 h-64 ${accentColorText}`} />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 border border-white/20 uppercase tracking-wider backdrop-blur-md text-white">
                👁️ THE FOCUS HORIZON (SINGLE-TASK ISOLATION)
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-black animate-pulse ${
                isRed ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' : isOrange ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
              }`}>
                CRISIS SCORE: {task.panicScore}/100
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight max-w-2xl">
              {task.title}
            </h2>

            <div className={`flex items-center gap-4 text-xs sm:text-sm font-medium ${
              theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              <span className="flex items-center gap-1.5 font-bold text-amber-400">
                <Clock className="w-4 h-4 animate-spin-slow" />
                <span>Due in exactly {task.dueHours} hours</span>
              </span>
              <span>•</span>
              <span className="truncate">{task.course}</span>
              <span>•</span>
              <span className="font-mono underline decoration-dotted">{task.complexity} Complexity</span>
            </div>
          </div>

          <button
            onClick={() => onRescueMe(task)}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 shadow-xl shrink-0 hover:scale-105 active:scale-95 ${
              isRed
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-red-500/40 ring-2 ring-red-400/50'
                : isOrange
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-amber-500/30'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/30'
            }`}
          >
            <Zap className="w-5 h-5 animate-bounce text-amber-300" />
            <span>Generate AI Rescue Package</span>
          </button>
        </div>

        {/* Psychological Note */}
        {task.notes && (
          <div className={`mt-4 p-3 rounded-xl border text-xs font-mono ${
            theme === 'dark' ? 'bg-white/5 border-white/10 text-amber-300/90' : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            💡 <span className="font-bold">Intelligence Triage:</span> {task.notes}
          </div>
        )}
      </div>

      {/* Progress Bar & Actions Header */}
      <div className={`px-5 py-3.5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <span className="text-xs font-mono font-bold whitespace-nowrap">
            MICRO-STEPS ({task.completedSteps}/{task.totalSteps}):
          </span>
          <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'
          }`}>
            <motion.div
              animate={{ width: `${progressPercent}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                isRed ? 'bg-red-500' : isOrange ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
          </div>
          <span className="text-xs font-mono font-bold w-10 text-right">{progressPercent}%</span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleRegenClick}
            disabled={isRegenerating}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border flex items-center gap-1.5 transition-all ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-300'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700 shadow-xs'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isRegenerating ? 'AI Deconstructing...' : '🤖 AI Auto-Breakdown'}</span>
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border flex items-center gap-1.5 transition-all ${
              theme === 'dark'
                ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/30 text-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Micro-Step</span>
          </button>
        </div>
      </div>

      {/* Micro-Steps List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar">
        {/* Cognitive Framing Message */}
        <div className={`p-3.5 rounded-xl border mb-4 text-xs sm:text-sm ${
          theme === 'dark' ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent border-blue-500/20 text-blue-200' : 'bg-blue-50 border-blue-200 text-blue-900'
        }`}>
          🧠 <span className="font-bold">Cognitive Anti-Paralysis Rule:</span> Do not look at Step 5. Do not think about grading rubrics right now. Your sole mission on Earth for the next 15 minutes is ticking off Step 1.
        </div>

        {/* Add Step Form Drawer */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddSubmit}
              className={`p-4 rounded-xl border space-y-3 mb-4 overflow-hidden ${
                theme === 'dark' ? 'bg-white/10 border-amber-500/40' : 'bg-amber-50/60 border-amber-300'
              }`}
            >
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                ➕ Add Custom Friction-Free Micro-Step
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., Download PDF to desktop (keep it stupidly simple)..."
                  value={newStepText}
                  onChange={(e) => setNewStepText(e.target.value)}
                  autoFocus
                  className={`flex-1 px-3 py-2 rounded-lg text-sm border focus:outline-hidden ${
                    theme === 'dark' ? 'bg-black/60 border-white/20 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <select
                  value={newStepTime}
                  onChange={(e) => setNewStepTime(e.target.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-mono border focus:outline-hidden ${
                    theme === 'dark' ? 'bg-black/60 border-white/20 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="2 mins">⚡ 2 mins</option>
                  <option value="5 mins">⏱️ 5 mins</option>
                  <option value="10 mins">⏱️ 10 mins</option>
                  <option value="20 mins">🔥 20 mins</option>
                </select>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 shadow-md"
                >
                  Save
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Checklist */}
        <div className="space-y-3">
          {task.steps.map((step, idx) => {
            const isFirstIncomplete = idx === task.steps.findIndex(s => !s.done);

            return (
              <motion.div
                key={step.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={(e) => handleCheckboxClick(step.id, step.done, e)}
                className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 select-none ${
                  step.done
                    ? (theme === 'dark' ? 'bg-white/5 border-white/5 opacity-50 line-through' : 'bg-slate-100 border-slate-200 opacity-60 line-through')
                    : isFirstIncomplete
                    ? (theme === 'dark' ? 'bg-gradient-to-r from-red-500/20 via-amber-500/10 to-transparent border-red-500/50 ring-2 ring-red-500/30 shadow-lg shadow-red-500/10' : 'bg-red-50/90 border-red-400 ring-2 ring-red-400/30 shadow-md')
                    : (theme === 'dark' ? 'bg-white/10 hover:bg-white/15 border-white/10' : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs')
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-transform group-hover:scale-110 shrink-0 ${
                    step.done
                      ? 'bg-emerald-500 text-slate-950'
                      : isFirstIncomplete
                      ? 'border-2 border-red-500 text-red-500 animate-pulse'
                      : (theme === 'dark' ? 'border-2 border-slate-500 text-transparent' : 'border-2 border-slate-400 text-transparent')
                  }`}>
                    {step.done ? <Check className="w-4 h-4 font-black" /> : <Circle className="w-3 h-3 fill-current opacity-0" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {isFirstIncomplete && !step.done && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-black bg-red-500 text-white animate-bounce">
                          NEXT STEP
                        </span>
                      )}
                      <span className={`text-sm sm:text-base font-bold truncate ${
                        step.done ? (theme === 'dark' ? 'text-slate-400' : 'text-slate-500') : isFirstIncomplete ? (theme === 'dark' ? 'text-white' : 'text-slate-900') : (theme === 'dark' ? 'text-slate-200' : 'text-slate-800')
                      }`}>
                        {step.text}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-mono px-2.5 py-1 rounded-md font-semibold border ${
                    step.done
                      ? (theme === 'dark' ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-200 border-slate-300 text-slate-600')
                      : isFirstIncomplete
                      ? 'bg-red-500/20 border-red-500/30 text-red-300 font-bold'
                      : (theme === 'dark' ? 'bg-white/10 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700')
                  }`}>
                    ⏱️ {step.timeEstimate}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Horizon Footer Motivation */}
      <div className={`p-3.5 border-t flex items-center justify-between text-xs font-mono ${
        theme === 'dark' ? 'border-white/10 bg-black/40 text-amber-300' : 'border-slate-200 bg-slate-100 text-slate-700'
      }`}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 animate-spin-slow text-amber-400" />
          <span>Completed steps auto-save to rescue ecosystem</span>
        </div>
        <span className="font-bold underline cursor-pointer" onClick={() => onRescueMe(task)}>
          Need Extension? →
        </span>
      </div>
    </div>
  );
};
