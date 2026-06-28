import React, { useState } from 'react';
import { AcademicTask } from '../types';
import { X, Plus, ShieldAlert, Sparkles, Clock, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: AcademicTask) => void;
  theme: 'dark' | 'light';
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  theme
}) => {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [dueHours, setDueHours] = useState('12');
  const [complexity, setComplexity] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [firstStep, setFirstStep] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !course.trim()) return;

    const hours = parseInt(dueHours) || 12;
    const panic = Math.min(99, Math.max(15, Math.round((100 / Math.max(1, hours)) * (complexity === 'High' ? 1.5 : complexity === 'Medium' ? 1 : 0.6))));
    const urgency = panic > 75 ? 'Crisis' : panic > 45 ? 'Warning' : 'Safe';

    const newTask: AcademicTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      course: course.trim(),
      dueHours: hours,
      complexity,
      completedSteps: 0,
      totalSteps: firstStep.trim() ? 1 : 3,
      steps: firstStep.trim() ? [
        { id: `step-${Date.now()}-1`, text: firstStep.trim(), done: false, timeEstimate: '10 mins' }
      ] : [
        { id: `step-${Date.now()}-1`, text: `Understand assignment requirements for ${title}`, done: false, timeEstimate: '5 mins' },
        { id: `step-${Date.now()}-2`, text: 'Gather references and create document outline', done: false, timeEstimate: '15 mins' },
        { id: `step-${Date.now()}-3`, text: 'Draft baseline content section 1', done: false, timeEstimate: '25 mins' }
      ],
      panicScore: panic,
      urgencyLevel: urgency,
      notes: notes.trim() || 'Custom user-added panic mode task.'
    };

    onSubmit(newTask);
    setTitle('');
    setCourse('');
    setDueHours('12');
    setFirstStep('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative z-10 w-full max-w-lg rounded-[24px] border p-6 sm:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden ${
          theme === 'dark'
            ? 'bg-[#151120]/95 border-white/15 text-white shadow-rose-950/50'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl'
        }`}
      >
        <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ff5773] text-white shadow-md">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display tracking-tight">
                Declare New Task Triage
              </h2>
              <p className="text-xs opacity-70 font-mono">
                Isolate your single academic horizon
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 opacity-70 hover:opacity-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider opacity-85 mb-1.5">
              Assignment Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. biology report lab"
              className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-hidden transition-all font-bold ${
                theme === 'dark' ? 'bg-black/40 border-white/15 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-rose-500 text-slate-900'
              }`}
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider opacity-85 mb-1.5">
              Course / Code
            </label>
            <input
              type="text"
              required
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. BIOL 202 - Molecular Bio"
              className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-hidden transition-all ${
                theme === 'dark' ? 'bg-black/40 border-white/15 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-rose-500 text-slate-900'
              }`}
            />
          </div>

          {/* Grid: Due in Hours & Complexity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider opacity-85 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Due in (Hours)</span>
              </label>
              <input
                type="number"
                min="1"
                max="240"
                required
                value={dueHours}
                onChange={(e) => setDueHours(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-hidden transition-all font-mono font-bold ${
                  theme === 'dark' ? 'bg-black/40 border-white/15 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-rose-500 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider opacity-85 mb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Complexity</span>
              </label>
              <select
                value={complexity}
                onChange={(e: any) => setComplexity(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-hidden transition-all font-semibold cursor-pointer ${
                  theme === 'dark' ? 'bg-[#211d2d] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="High">High Complexity</option>
                <option value="Medium">Medium Complexity</option>
                <option value="Low">Low Complexity</option>
              </select>
            </div>
          </div>

          {/* First Micro Step */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider opacity-85 mb-1.5">
              Immediate First Micro-Step (Optional)
            </label>
            <input
              type="text"
              value={firstStep}
              onChange={(e) => setFirstStep(e.target.value)}
              placeholder="e.g. Create blank document and format headings"
              className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-hidden transition-all ${
                theme === 'dark' ? 'bg-black/40 border-white/15 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-rose-500 text-slate-900'
              }`}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider opacity-85 mb-1.5">
              Prof Notes / Cutoff Rules
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. APA format required. No late submissions accepted."
              className={`w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-hidden transition-all resize-none ${
                theme === 'dark' ? 'bg-black/40 border-white/15 focus:border-rose-500 text-white' : 'bg-slate-50 border-slate-300 focus:border-rose-500 text-slate-900'
              }`}
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-3 rounded-xl text-xs font-bold font-mono transition-all border ${
                theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
              }`}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-xs font-bold font-mono tracking-wider bg-[#ff5773] hover:bg-[#ff4060] text-white shadow-lg shadow-[#ff5773]/25 transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>ISOLATE & RESCUE</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
