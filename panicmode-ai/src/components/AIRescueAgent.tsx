import React, { useState, useRef, useEffect } from 'react';
import { AcademicTask, ChatMessage } from '../types';
import { Bot, Send, Sparkles, Zap, Mail, FileText, Calendar, HeartPulse, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface AIRescueAgentProps {
  activeTask: AcademicTask;
  messages: ChatMessage[];
  onSendMessage: (text: string, mode?: 'chat' | 'extension' | 'summarize' | 'schedule' | 'suggestions' | 'analysis' | 'meditation') => Promise<void>;
  isThinking: boolean;
  theme: 'dark' | 'light';
}

export const AIRescueAgent: React.FC<AIRescueAgentProps> = ({
  activeTask,
  messages,
  onSendMessage,
  isThinking,
  theme
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    onSendMessage(inputText.trim(), 'chat');
    setInputText('');
  };

  const handleQuickAction = (mode: 'extension' | 'summarize' | 'schedule' | 'suggestions' | 'analysis' | 'meditation', defaultPrompt: string) => {
    if (isThinking) return;
    onSendMessage(defaultPrompt, mode);
  };

  return (
    <div className={`flex flex-col h-full rounded-[24px] border backdrop-blur-xl overflow-hidden transition-all duration-500 ${
      theme === 'dark'
        ? 'bg-[#151120]/85 border-white/10 text-white shadow-2xl'
        : 'bg-white/85 border-slate-200/80 text-slate-900 shadow-xl shadow-slate-200/50'
    }`}>
      {/* Column Header (Matching Mockups) */}
      <div className={`p-4 border-b flex items-center justify-between ${
        theme === 'dark' ? 'border-white/10 bg-[#211d2d]/60' : 'border-slate-200/80 bg-slate-50/80'
      }`}>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-500 text-white shadow-md overflow-hidden border border-white/20">
            <Bot className="w-6 h-6" />
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#151120]" />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-base font-display tracking-tight flex items-center gap-1.5">
              {theme === 'dark' ? 'Rescue Coach AI' : 'Rescue Coach AI'}
            </h2>
            <p className={`text-xs font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {theme === 'dark' ? 'Vent therapist online' : 'ALWAYS HERE TO HELP'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Rescue Macros / Actions */}
      <div className={`p-3.5 border-b space-y-2.5 ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200/80 bg-slate-100/60'}`}>
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-80 flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-amber-400 shrink-0" />
          <span>{theme === 'dark' ? 'INSTANT ACTION MACROS' : 'QUICK ACTIONS'}</span>
        </div>
        
        {theme === 'dark' ? (
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleQuickAction('extension', `Draft an urgent 24-hour extension email for ${activeTask.title}`)}
              disabled={isThinking}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border group active:scale-98 bg-gradient-to-r from-red-500/15 to-rose-500/10 hover:from-red-500/25 hover:to-rose-500/15 border-red-500/30 text-rose-200"
            >
              <span className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                <span>Draft Extension Email</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400/90 font-semibold">Auto-diplomacy</span>
            </button>

            <button
              onClick={() => handleQuickAction('summarize', `Give me a hyper-concise 3-bullet core action cheat sheet to start ${activeTask.title}`)}
              disabled={isThinking}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border group active:scale-98 bg-gradient-to-r from-emerald-500/15 to-teal-500/10 hover:from-emerald-500/25 hover:to-teal-500/15 border-emerald-500/30 text-emerald-200"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Summarize Study Block</span>
              </span>
              <span className="text-[10px] font-mono text-amber-400/90 font-semibold">80/20 Rule</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleQuickAction('suggestions', `Give me 3 smart actionable suggestions to kickstart ${activeTask.title}`)}
              disabled={isThinking}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-3 border group active:scale-98 bg-sky-100/80 hover:bg-sky-200/80 border-sky-200 text-sky-900 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
              <span>Smart Suggestions</span>
            </button>

            <button
              onClick={() => handleQuickAction('analysis', `Analyze my academic workload stress level for ${activeTask.title} and give immediate advice`)}
              disabled={isThinking}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-3 border group active:scale-98 bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-800 shadow-xs"
            >
              <HeartPulse className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
              <span>Stress Analysis</span>
            </button>

            <button
              onClick={() => handleQuickAction('meditation', `Guide me through a 5-minute box breathing meditation reset`)}
              disabled={isThinking}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-3 border group active:scale-98 bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-800 shadow-xs"
            >
              <Bot className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
              <span>5-Min Meditation</span>
            </button>
          </div>
        )}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'student';

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono opacity-70">
                <span>{isUser ? '👤 You (Student)' : '🤖 Rescue Coach AI'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div className={`p-3.5 rounded-2xl max-w-[90%] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                isUser
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-br-xs font-medium shadow-md'
                  : theme === 'dark'
                  ? 'bg-white/10 border border-white/15 text-slate-100 rounded-bl-xs shadow-inner'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-md font-medium'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          );
        })}

        {isThinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2">
            <div className={`p-3 rounded-2xl rounded-bl-xs text-xs font-mono flex items-center gap-2 ${
              theme === 'dark' ? 'bg-white/10 border border-white/15 text-amber-300' : 'bg-slate-100 border border-slate-200 text-slate-700'
            }`}>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Rescue Coach drafting emergency response...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Vent Pills */}
      <div className={`px-3 py-2 border-t flex gap-1.5 overflow-x-auto no-scrollbar ${
        theme === 'dark' ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50'
      }`}>
        <button
          onClick={() => onSendMessage("I'm completely paralyzed by anxiety right now. Where do I even start?", 'chat')}
          disabled={isThinking}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap border transition-colors ${
            theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/10 text-rose-300' : 'bg-white hover:bg-rose-50 border-slate-200 text-rose-800'
          }`}
        >
          💔 "I'm paralyzed by anxiety"
        </button>
        <button
          onClick={() => onSendMessage("My brain is completely fried. Give me a dopamine pep talk.", 'chat')}
          disabled={isThinking}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap border transition-colors ${
            theme === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/10 text-amber-300' : 'bg-white hover:bg-amber-50 border-slate-200 text-amber-800'
          }`}
        >
          ⚡ "Brain is fried, need pep talk"
        </button>
      </div>

      {/* Vent / Chat Input Bar */}
      <form onSubmit={handleSubmit} className={`p-3 border-t flex items-center gap-2 ${
        theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
      }`}>
        <input
          type="text"
          placeholder="Vent or ask AI coach anything..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isThinking}
          className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-hidden transition-all ${
            theme === 'dark'
              ? 'bg-black/60 border-white/15 focus:border-amber-500/50 text-white placeholder-slate-500'
              : 'bg-slate-50 border-slate-300 focus:border-amber-500 text-slate-900 placeholder-slate-400'
          }`}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isThinking}
          className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 disabled:opacity-50 text-white transition-transform active:scale-95 shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
