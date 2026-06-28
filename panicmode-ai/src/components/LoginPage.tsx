import React, { useState } from 'react';
import { TriangleAlert, Sparkles, Sun, Moon, Brain, Lock, Mail, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogin: (email: string) => void;
  onStartRescue: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  theme,
  onToggleTheme,
  onLogin,
  onStartRescue
}) => {
  const [email, setEmail] = useState('you@university.edu');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email);
    }, 600);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans relative overflow-hidden select-none transition-colors duration-500 ${
      theme === 'dark' ? 'bg-[#151120] text-[#e7dff5]' : 'bg-[#faf9f5] text-[#1b1c1a]'
    }`}>
      {/* Background Ambient Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {theme === 'dark' ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-950/30 via-[#151120] to-purple-950/20" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffb2b9_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-rose-100/60 via-amber-50/40 to-sky-100/50" />
            <div className="absolute inset-0 bg-[radial-gradient(#8d7072_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-300/20 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Top Header */}
      <header className="relative z-10 px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#ff5773] shadow-md shadow-[#ff5773]/30">
            <TriangleAlert className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#ff5773]">
            PanicMode AI
          </span>
        </div>

        <button
          onClick={onToggleTheme}
          aria-label="Toggle Theme"
          className={`p-2.5 rounded-xl border transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-white/10 hover:bg-white/15 border-white/10 text-amber-300'
              : 'bg-white text-amber-500 hover:bg-slate-100 border-slate-200 shadow-xs'
          }`}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Center Glass Login Modal */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`w-full max-w-[440px] p-8 rounded-[28px] border backdrop-blur-xl shadow-2xl relative transition-all ${
            theme === 'dark'
              ? 'bg-[#211d2d]/80 border-white/10 shadow-rose-950/40'
              : 'bg-white/85 border-slate-200/80 shadow-slate-200/60'
          }`}
        >
          {/* Top Brain Icon */}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 border shadow-md ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400'
              : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}>
            <Brain className="w-7 h-7" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-2">
            Welcome Back
          </h1>
          <p className={`text-sm text-center mb-8 ${theme === 'dark' ? 'text-[#e1bec0]' : 'text-slate-600'}`}>
            Take a deep breath. We'll handle the rest.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider opacity-90">
                STUDENT EMAIL
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all overflow-hidden ${
                theme === 'dark'
                  ? 'bg-[#151120]/90 border-white/10 focus-within:border-rose-500/60'
                  : 'bg-slate-50 border-slate-300 focus-within:border-rose-500 focus-within:bg-white'
              }`}>
                <span className="pl-3.5 pr-2 text-rose-500 font-bold font-mono">@</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full py-3.5 pr-4 bg-transparent text-sm font-medium focus:outline-hidden"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider opacity-90">
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => alert("Password recovery dispatch active. Check your student inbox.")}
                  className="text-xs font-semibold text-rose-500 hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className={`relative flex items-center rounded-xl border transition-all overflow-hidden ${
                theme === 'dark'
                  ? 'bg-[#151120]/90 border-white/10 focus-within:border-rose-500/60'
                  : 'bg-slate-50 border-slate-300 focus-within:border-rose-500 focus-within:bg-white'
              }`}>
                <span className="pl-3.5 pr-2 text-rose-500 opacity-80">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-3.5 pr-4 bg-transparent text-sm font-medium tracking-widest focus:outline-hidden"
                />
              </div>
            </div>

            {/* Primary Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold tracking-wide bg-[#ff5773] hover:bg-[#ff4060] text-white shadow-lg shadow-[#ff5773]/25 transition-all active:scale-98 flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <span>Entering Protocol...</span>
              ) : (
                <>
                  <span>Enter Focus Mode</span>
                  <Zap className="w-4 h-4 fill-white" />
                </>
              )}
            </button>
          </form>

          {/* Secure Access Divider */}
          <div className="my-6 relative flex items-center justify-center">
            <div className={`absolute inset-0 flex items-center`} aria-hidden="true">
              <div className={`w-full border-t ${theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`} />
            </div>
            <span className={`relative px-3 text-xs font-mono font-semibold uppercase tracking-wider rounded-md ${
              theme === 'dark' ? 'bg-[#211d2d] text-slate-400' : 'bg-white text-slate-500'
            }`}>
              Secure Access
            </span>
          </div>

          {/* Continue with Student ID */}
          <button
            type="button"
            onClick={onStartRescue}
            className={`w-full py-3.5 rounded-xl border transition-all text-sm font-semibold flex items-center justify-center gap-2.5 ${
              theme === 'dark'
                ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-rose-500" />
            <span>Continue with Student ID</span>
          </button>

          {/* Footer Link */}
          <div className="mt-8 text-center text-xs sm:text-sm font-medium opacity-90">
            <span>New student? </span>
            <button
              type="button"
              onClick={onStartRescue}
              className="font-bold text-rose-500 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Start Rescue Mode</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Bottom Footer Bar */}
      <footer className="relative z-10 px-6 py-4 flex items-center justify-between text-xs font-mono opacity-80 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold tracking-wider uppercase">SYSTEM CALM</span>
        </div>

        <div className="tracking-widest uppercase">
          PRODUCTIVE EMPATHY V2.04
        </div>
      </footer>
    </div>
  );
};
