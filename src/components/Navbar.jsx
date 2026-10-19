import React from 'react';
import { Menu, Plus, Sliders, MessageSquare, FolderTree } from 'lucide-react';

export default function Navbar({
  onToggleSidebar,
  onNewChat,
  onOpenSettings,
  isProcessing,
  currentView = 'chat',
  onSelectView,
  hasProject = false
}) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/90 border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-cream-100 transition lg:hidden"
            title="Open Chat Sidebar"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative flex-shrink-0 cursor-pointer" onClick={() => onSelectView && onSelectView('chat')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyanlight-200 via-cyanlight-100 to-cream-100 border border-cyanlight-300 flex items-center justify-center shadow-sm">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-wider">G</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-white animate-pulse"></div>
          </div>

          <div className="cursor-pointer" onClick={() => onSelectView && onSelectView('chat')}>
            <div className="flex items-center space-x-1.5">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 font-display">Godfy</span>
              <span className="px-1.5 py-0.5 rounded-md bg-cyanlight-100 text-cyan-900 text-[10px] sm:text-xs font-bold font-mono border border-cyanlight-200 tracking-wide">
                v1
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
              Multi-AI Autonomous Engine & Studio
            </p>
          </div>
        </div>

        {/* Center: Navigation Mode Toggle (Chat | Project Editor) */}
        <div className="flex items-center space-x-1 bg-cream-100 p-1 rounded-xl border border-cream-300/80 text-xs font-mono">
          <button
            onClick={() => onSelectView && onSelectView('chat')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
              currentView === 'chat'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-700" />
            <span className="font-sans text-xs">Chat</span>
          </button>
          <button
            onClick={() => onSelectView && onSelectView('editor')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
              currentView === 'editor'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-cyan-700" />
            <span className="font-sans text-xs">Project Editor</span>
            {hasProject && (
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onNewChat}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white border border-slate-200 hover:border-cyan-400 text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-sm transition flex items-center space-x-1.5"
            title="Engine Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-600" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
