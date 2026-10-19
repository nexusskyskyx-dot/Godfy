import React from 'react';
import { Menu, MessageSquare, Sparkles, Sliders, Brain, Layers, ExternalLink } from 'lucide-react';

export default function Navbar({
  onToggleSidebar,
  onOpenSettings,
  currentMindPreset,
  isProcessing,
  activeView,
  setActiveView
}) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/90 border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-cream-100 transition lg:hidden"
            title="Open Sidebar"
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyanlight-200 via-cyanlight-100 to-cream-100 border border-cyanlight-300 flex items-center justify-center shadow-sm">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-wider">G</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-white animate-pulse"></div>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 font-display">Godfy</span>
              <span className="px-1.5 py-0.5 rounded-md bg-cyanlight-100 text-cyan-900 text-[10px] sm:text-xs font-bold font-mono border border-cyanlight-200 tracking-wide">
                v1
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden md:block">
              Multi-AI Autonomous Consensus
            </p>
          </div>
        </div>

        {/* Center: Mode switcher (Studio vs Mind Chat) */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-cream-100/90 border border-cream-200 text-xs font-semibold">
          <button
            onClick={() => setActiveView('chat')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
              activeView === 'chat'
                ? 'bg-white text-slate-900 shadow-sm border border-cream-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
            <span className="hidden sm:inline">Mind Chat</span>
            <span className="sm:hidden">Chat</span>
          </button>

          <button
            onClick={() => setActiveView('studio')}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
              activeView === 'studio'
                ? 'bg-white text-slate-900 shadow-sm border border-cream-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span className="hidden sm:inline">Studio Workbench</span>
            <span className="sm:hidden">Studio</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Vercel quick pill */}
          <a
            href="https://godfy-flux-cf70.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-cyan-900 text-xs font-semibold border border-cream-300 transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Vercel Live</span>
            <ExternalLink className="w-3 h-3 text-cyan-700" />
          </a>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-cyan-400 text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-sm transition"
            title="Engine Configuration"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-600" />
            <span className="hidden md:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
