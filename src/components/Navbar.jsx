import React from 'react';
import { Menu, Plus, Sliders, MessageSquare, FolderTree, Terminal } from 'lucide-react';

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
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#16161e]/90 border-b border-[#292e42] select-none">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 h-14 sm:h-15 flex items-center justify-between gap-2">
        {/* Left: Brand & Hamburger */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-lg text-[#9aa5ce] hover:text-[#c0caf5] hover:bg-[#1f2335] transition lg:hidden"
            title="Toggle Sidebar"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => onSelectView && onSelectView('chat')}
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-[#292e42] group-hover:border-[#7aa2f7] transition shadow-glow-blue flex-shrink-0 bg-black">
              <img 
                src="/logo.png" 
                alt="Godfy Logo" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center space-x-1.5">
              <span className="text-sm sm:text-base font-bold tracking-tight text-[#c0caf5] font-display">
                Godfy
              </span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#1f2335] text-[#7dcfff] text-[9px] sm:text-[10px] font-mono font-bold border border-[#292e42]">
                v1
              </span>
            </div>
          </div>
        </div>

        {/* Center: Cursor-style Mode Switcher [Chat | Studio] */}
        <div className="flex items-center space-x-1 bg-[#16161e] p-1 rounded-xl border border-[#292e42] text-xs font-mono">
          <button
            onClick={() => onSelectView && onSelectView('chat')}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-medium transition text-xs ${
              currentView === 'chat'
                ? 'bg-[#1f2335] text-[#7dcfff] border border-[#3b4261] shadow-xs'
                : 'text-[#9aa5ce] hover:text-[#c0caf5]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-sans">Chat</span>
            <kbd className="hidden md:inline-block text-[9px] text-[#565f89] ml-1 px-1 py-0.2 rounded bg-[#16161e]">⌘L</kbd>
          </button>
          
          <button
            onClick={() => onSelectView && onSelectView('editor')}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-medium transition text-xs ${
              currentView === 'editor'
                ? 'bg-[#1f2335] text-[#7dcfff] border border-[#3b4261] shadow-xs'
                : 'text-[#9aa5ce] hover:text-[#c0caf5]'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span className="font-sans">Studio</span>
            <kbd className="hidden md:inline-block text-[9px] text-[#565f89] ml-1 px-1 py-0.2 rounded bg-[#16161e]">⌘I</kbd>
            {hasProject && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#7dcfff] animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          <button
            onClick={onNewChat}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#7aa2f7]/10 hover:bg-[#7aa2f7]/20 border border-[#7aa2f7]/30 text-[#7aa2f7] hover:text-[#7dcfff] text-xs font-medium transition active:scale-[0.98]"
            title="New Chat (⌘N)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#1f2335] border border-[#292e42] hover:border-[#3b4261] text-[#9aa5ce] hover:text-[#c0caf5] text-xs font-medium transition flex items-center space-x-1"
            title="Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
