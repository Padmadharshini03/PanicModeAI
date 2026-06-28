import React, { useState, useEffect } from 'react';
import { AcademicTask, ChatMessage, RescuePackage } from './types';
import { Header } from './components/Header';
import { PanicSidebar } from './components/PanicSidebar';
import { FocusHorizon } from './components/FocusHorizon';
import { AIRescueAgent } from './components/AIRescueAgent';
import { RescueModal } from './components/RescueModal';
import { LoginPage } from './components/LoginPage';
import { NewTaskModal } from './components/NewTaskModal';
import { Flame, Eye, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const defaultInitialTasks: AcademicTask[] = [
  {
    id: 'task-1',
    title: 'Advanced ML Problem Set',
    course: 'CS 6400 - Machine Learning',
    dueHours: 4,
    complexity: 'High',
    completedSteps: 1,
    totalSteps: 5,
    steps: [
      { id: '1-1', text: 'Open Jupyter notebook and load dataset', done: true, timeEstimate: '2 mins' },
      { id: '1-2', text: 'Write baseline logistic regression script', done: false, timeEstimate: '10 mins' },
      { id: '1-3', text: 'Implement custom attention layer equations', done: false, timeEstimate: '25 mins' },
      { id: '1-4', text: 'Run 5-fold cross validation grid search', done: false, timeEstimate: '15 mins' },
      { id: '1-5', text: 'Export accuracy plots & write 1-page summary', done: false, timeEstimate: '10 mins' }
    ],
    panicScore: 94,
    urgencyLevel: 'Crisis',
    notes: 'Covers neural architectures & loss functions. Prof strictly enforces 11:59pm cutoff.'
  },
  {
    id: 'task-2',
    title: 'Literature Review Essay Outline',
    course: 'HUM 301 - Modern Ethics',
    dueHours: 24,
    complexity: 'Medium',
    completedSteps: 2,
    totalSteps: 5,
    steps: [
      { id: '2-1', text: 'Download 3 primary source PDFs from library portal', done: true, timeEstimate: '5 mins' },
      { id: '2-2', text: 'Highlight thesis statement in each PDF', done: true, timeEstimate: '15 mins' },
      { id: '2-3', text: 'Draft introduction paragraph with hook', done: false, timeEstimate: '12 mins' },
      { id: '2-4', text: 'Create bulleted list of 4 body paragraph arguments', done: false, timeEstimate: '20 mins' },
      { id: '2-5', text: 'Format APA bibliography entries', done: false, timeEstimate: '8 mins' }
    ],
    panicScore: 68,
    urgencyLevel: 'Warning',
    notes: 'Requires at least 5 peer-reviewed citations.'
  },
  {
    id: 'task-3',
    title: 'Register for Next Semester Electives',
    course: 'REG 101 - Academic Advising',
    dueHours: 96,
    complexity: 'Low',
    completedSteps: 0,
    totalSteps: 4,
    steps: [
      { id: '3-1', text: 'Log into Student Degree Works portal', done: false, timeEstimate: '2 mins' },
      { id: '3-2', text: 'Check prerequisite clearances for Distributed Systems', done: false, timeEstimate: '5 mins' },
      { id: '3-3', text: 'Add CRN 44091 and CRN 88210 to draft cart', done: false, timeEstimate: '3 mins' },
      { id: '3-4', text: 'Submit registration and save confirmation PDF', done: false, timeEstimate: '2 mins' }
    ],
    panicScore: 22,
    urgencyLevel: 'Safe',
    notes: 'Window closes Friday at 5:00pm.'
  }
];

const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'agent',
    text: "⚡ **SYSTEM ONLINE**: Welcome to PanicMode AI. I detected your High-Paralysis deadline for **Advanced ML Problem Set** (Due in 4 hours). Cortisol levels are high. \n\nRemember: We are NOT doing the whole assignment right now. We are isolating exactly ONE task. What is your biggest mental blocker right this second?",
    timestamp: 'Just now'
  }
];

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const [tasks, setTasks] = useState<AcademicTask[]>(defaultInitialTasks);
  const [activeTaskId, setActiveTaskId] = useState<string>('task-1');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  
  // Modal & Mobile Navigation states
  const [modalTask, setModalTask] = useState<AcademicTask | null>(null);
  const [rescueData, setRescueData] = useState<RescuePackage | null>(null);
  const [isRescueLoading, setIsRescueLoading] = useState(false);
  const [mobileTab, setMobileTab] = useState<'sidebar' | 'horizon' | 'agent'>('horizon');

  const activeTask = tasks.find(t => t.id === activeTaskId) || tasks[0];

  // Fetch initial tasks from API if available
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        if (data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks);
        }
      })
      .catch(() => {
        // Fallback silently to pre-populated state
      });
  }, []);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleAddNewTask = (newTask: AcademicTask) => {
    setTasks(prev => [newTask, ...prev]);
    setActiveTaskId(newTask.id);
    setIsNewTaskOpen(false);
  };

  const handleSelectTask = (task: AcademicTask) => {
    setActiveTaskId(task.id);
    setMobileTab('horizon');
  };

  const handleToggleStep = (taskId: string, stepId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const newSteps = t.steps.map(s => s.id === stepId ? { ...s, done: !s.done } : s);
      const doneCount = newSteps.filter(s => s.done).length;
      return { ...t, steps: newSteps, completedSteps: doneCount };
    }));
  };

  const handleAddStep = (taskId: string, text: string, timeEstimate: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const newStep = {
        id: `step-${Date.now()}`,
        text,
        done: false,
        timeEstimate
      };
      return {
        ...t,
        steps: [...t.steps, newStep],
        totalSteps: t.totalSteps + 1
      };
    }));
  };

  const handleRegenerateSteps = async (taskId: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    try {
      const res = await fetch('/api/generate-steps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: targetTask.title,
          complexity: targetTask.complexity,
          course: targetTask.course
        })
      });
      const data = await res.json();
      if (data.steps) {
        setTasks(prev => prev.map(t => {
          if (t.id !== taskId) return t;
          const doneSteps = t.steps.filter(s => s.done);
          const combined = [...doneSteps, ...data.steps];
          return {
            ...t,
            steps: combined,
            totalSteps: combined.length,
            completedSteps: doneSteps.length
          };
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerRescue = async (task: AcademicTask, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setModalTask(task);
    setIsRescueLoading(true);
    setRescueData(null);

    try {
      const res = await fetch('/api/rescue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task })
      });
      const data = await res.json();
      setRescueData(data);
    } catch (err) {
      setRescueData({
        emailDraft: `Subject: Extension Request - ${task.title}\n\nDear Professor,\n\nI am writing to respectfully request a brief 24-hour extension on ${task.title}. Thank you for your consideration.\n\nBest regards,\n[Your Name]`,
        scheduleBreakdown: [
          { time: 'Right Now', action: 'Take 4 deep breaths & hydrate' },
          { time: 'Next 25m', action: 'Execute first micro-step' },
          { time: 'Final 30m', action: 'Polish & upload' }
        ],
        pepTalk: "Done is better than perfect! Momentum defeats anxiety."
      });
    } finally {
      setIsRescueLoading(false);
    }
  };

  const handleSendMessage = async (text: string, mode?: 'chat' | 'extension' | 'summarize' | 'schedule' | 'suggestions' | 'analysis' | 'meditation') => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'student',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsAgentThinking(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: chatMessages,
          activeTask,
          mode
        })
      });
      const data = await res.json();
      
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.response || "I'm right here with you! Let's take it one micro-step at a time.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, agentMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `agent-fallback-${Date.now()}`,
        sender: 'agent',
        text: "⚡ **Emergency Offline Guidance**: Breathe deeply. Pick up a pen or open your document and commit to just 120 seconds of typing. You've got this!",
        timestamp: 'Just now'
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsAgentThinking(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <LoginPage
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onLogin={handleLogin}
        onStartRescue={() => setIsLoggedIn(true)}
      />
    );
  }

  return (
    <div className={`relative min-h-screen flex flex-col font-sans overflow-hidden select-none transition-colors duration-500 ${
      theme === 'dark' ? 'text-white' : 'text-slate-900'
    }`}>
      {/* 1. FULLSCREEN AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {theme === 'dark' ? (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-75 contrast-125"
            >
              <source
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260422_112520_ee819691-f2e8-4c54-bb77-3fb72c84eaa5.mp4"
                type="video/mp4"
              />
            </video>
            {/* Heavy Dark Mask */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <div className="absolute inset-0 bg-gradient-to-tr from-red-950/20 via-transparent to-amber-950/10 pointer-events-none" />
          </>
        ) : (
          <>
            {/* Vibrant Light Mode Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-sky-50 to-amber-100" />
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
            {/* Frosted Glass Layer */}
            <div className="absolute inset-0 bg-white/70 backdrop-blur-md" />
          </>
        )}
      </div>

      {/* Global Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activePanicScore={activeTask.panicScore}
        onOpenNewTask={() => setIsNewTaskOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. THREE-COLUMN DASHBOARD LAYOUT (Desktop) / Tabbed (Mobile) */}
      <main className="relative z-10 flex-1 p-3 sm:p-5 lg:p-6 max-w-[1700px] mx-auto w-full flex flex-col h-[calc(100vh-68px)] pb-16 lg:pb-6">
        {/* Desktop 3-Column Bento Grid */}
        <div className="hidden lg:grid grid-cols-12 gap-5 h-full">
          {/* Column 1: The Panic Sidebar (Timeline) - 3 cols */}
          <section className="col-span-3 h-full">
            <PanicSidebar
              tasks={tasks}
              activeTaskId={activeTaskId}
              onSelectTask={handleSelectTask}
              onRescueMe={handleTriggerRescue}
              theme={theme}
            />
          </section>

          {/* Column 2: The Focus Horizon (Active Isolation) - 5 cols */}
          <section className="col-span-5 h-full">
            <FocusHorizon
              task={activeTask}
              onToggleStep={handleToggleStep}
              onAddStep={handleAddStep}
              onRegenerateSteps={handleRegenerateSteps}
              onRescueMe={(t) => handleTriggerRescue(t)}
              theme={theme}
            />
          </section>

          {/* Column 3: The AI Rescue Agent (Chat) - 4 cols */}
          <section className="col-span-4 h-full">
            <AIRescueAgent
              activeTask={activeTask}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isThinking={isAgentThinking}
              theme={theme}
            />
          </section>
        </div>

        {/* Mobile View (< 1024px) */}
        <div className="lg:hidden flex-1 h-full overflow-hidden pb-4">
          {mobileTab === 'sidebar' && (
            <PanicSidebar
              tasks={tasks}
              activeTaskId={activeTaskId}
              onSelectTask={handleSelectTask}
              onRescueMe={handleTriggerRescue}
              theme={theme}
            />
          )}
          {mobileTab === 'horizon' && (
            <FocusHorizon
              task={activeTask}
              onToggleStep={handleToggleStep}
              onAddStep={handleAddStep}
              onRegenerateSteps={handleRegenerateSteps}
              onRescueMe={(t) => handleTriggerRescue(t)}
              theme={theme}
            />
          )}
          {mobileTab === 'agent' && (
            <AIRescueAgent
              activeTask={activeTask}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              isThinking={isAgentThinking}
              theme={theme}
            />
          )}
        </div>
      </main>

      {/* Mobile Tab Bar (< 1024px) */}
      <nav className={`lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t px-4 py-2.5 flex justify-around backdrop-blur-xl ${
        theme === 'dark' ? 'bg-black/90 border-white/10 text-white' : 'bg-white/90 border-slate-200 text-slate-900 shadow-lg'
      }`}>
        <button
          onClick={() => setMobileTab('sidebar')}
          className={`flex flex-col items-center gap-1 transition-all ${
            mobileTab === 'sidebar' ? 'text-red-500 font-bold scale-105' : 'opacity-60'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[10px] font-mono uppercase">Timeline</span>
        </button>

        <button
          onClick={() => setMobileTab('horizon')}
          className={`flex flex-col items-center gap-1 transition-all relative ${
            mobileTab === 'horizon' ? 'text-amber-500 font-bold scale-105' : 'opacity-60'
          }`}
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] font-mono uppercase">Focus Horizon</span>
          <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />
        </button>

        <button
          onClick={() => setMobileTab('agent')}
          className={`flex flex-col items-center gap-1 transition-all ${
            mobileTab === 'agent' ? 'text-emerald-500 font-bold scale-105' : 'opacity-60'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span className="text-[10px] font-mono uppercase">AI Coach</span>
        </button>
      </nav>

      {/* 4. RESCUE ME MODAL OVERLAY */}
      <AnimatePresence>
        {modalTask && (
          <RescueModal
            task={modalTask}
            data={rescueData}
            isLoading={isRescueLoading}
            onClose={() => setModalTask(null)}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* 5. NEW TASK MODAL */}
      <AnimatePresence>
        {isNewTaskOpen && (
          <NewTaskModal
            isOpen={isNewTaskOpen}
            onClose={() => setIsNewTaskOpen(false)}
            onSubmit={handleAddNewTask}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
