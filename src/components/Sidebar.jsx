import React from 'react';
import { 
  X, Plus, MessageSquare, Sparkles, Layers, Sliders, 
  ExternalLink, CheckCircle2, ChevronRight, Zap, RefreshCw, Eye
} from 'lucide-react';
import { FREE_AI_MODELS } from '../engine/models.js';

export default function Sidebar({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  onNewSession,
  onSelectPrompt,
  onOpenSettings,
  activePrompt
}) {
  const historyItems = [
    { id: '1', title: 'Make a landing page', tag: 'Landing Page', icon: '🚀' },
    { id: '2', title: 'Add testimonials section', tag: 'Social Proof', icon: '⭐' },
    { id: '3', title: 'SaaS pricing calculator', tag: 'Logic & Code', icon: '⚡' },
    { id: '4', title: 'Artisan coffee roastery', tag: 'E-commerce', icon: '☕' },
    { id: '5', title: 'Design developer portfolio', tag: 'Portfolio', icon: '🎨' }
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-white border-r border-cream-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Brand */}
        <div className="p-4 sm:p-5 border-b border-cream-200 flex items-center justify-between bg-cream-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyanlight-200 to-cyanlight-400 p-0.5 shadow-sm">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-extrabold text-slate-900 text-base">
                G
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-slate-900 text-base tracking-tight font-display">Godfy</span>
                <span className="px-1.5 py-0.2 rounded bg-cyanlight-100 text-cyan-900 text-[10px] font-bold font-mono border border-cyanlight-200">
                  v1
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Autonomous Mind Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-cream-100 lg:hidden transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Synthesis / Chat */}
        <div className="p-4 border-b border-cream-200 space-y-2">
          <button
            onClick={() => {
              onNewSession();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-sm transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-cyan-300" />
            <span>New Mind Synthesis</span>
          </button>

          {/* View Switcher: Studio vs Chat */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-cream-100/80 border border-cream-200 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveView('chat');
                if (window.innerWidth < 1024) onClose();
              }}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition ${
                activeView === 'chat'
                  ? 'bg-white text-slate-900 shadow-sm border border-cream-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-600" />
              <span>Mind Chat</span>
            </button>

            <button
              onClick={() => {
                setActiveView('studio');
                if (window.innerWidth < 1024) onClose();
              }}
              className={`py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition ${
                activeView === 'studio'
                  ? 'bg-white text-slate-900 shadow-sm border border-cream-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Studio UI</span>
            </button>
          </div>
        </div>

        {/* Scrollable Middle: Sessions & Quick Prompts */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Quick Prompts / Recent Inquiries */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Recent Queries
            </div>
            <div className="space-y-1">
              {historyItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectPrompt(item.title);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between text-xs group ${
                    activePrompt === item.title
                      ? 'bg-cream-100 border-cyan-300 font-semibold text-slate-900'
                      : 'border-transparent hover:bg-cream-50 hover:border-cream-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-sm">{item.icon}</span>
                    <span className="truncate">{item.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 transition flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* 5 Free AIs Status */}
          <div className="p-3.5 rounded-2xl bg-cream-50/80 border border-cream-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                Free AI Mesh (5 Nodes)
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="space-y-1.5">
              {FREE_AI_MODELS.map((m) => (
                <div key={m.id} className="flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span className="truncate font-medium">{m.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-800">{m.latency}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Color Identity Reminder */}
          <div className="p-3 rounded-xl bg-white border border-cream-200 space-y-1 text-[11px]">
            <div className="font-bold text-slate-800">Design Specification</div>
            <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
              <span>Main: White Cream</span>
              <span className="w-3 h-3 rounded-full bg-[#FAF7EE] border border-cream-300 inline-block"></span>
            </div>
            <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
              <span>Secondary: White</span>
              <span className="w-3 h-3 rounded-full bg-[#FFFFFF] border border-slate-200 inline-block"></span>
            </div>
            <div className="flex items-center justify-between text-slate-500 font-mono text-[10px]">
              <span>2nd Secondary: Cyan Light</span>
              <span className="w-3 h-3 rounded-full bg-[#E0F7FA] border border-cyan-300 inline-block"></span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-cream-200 bg-cream-50/50 flex items-center justify-between text-xs">
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-600" />
            <span className="font-medium">Settings</span>
          </button>

          <a
            href="https://godfy-flux-cf70.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-cyan-800 hover:text-cyan-950 font-semibold transition"
          >
            <span>Vercel Live</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>
    </>
  );
}
