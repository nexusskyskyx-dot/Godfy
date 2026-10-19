import React, { useState, useEffect } from 'react';
import { 
  X, Plus, MessageSquare, Trash2, Sliders, 
  Sparkles, Zap, Brain, RotateCcw,
  Globe, Image as ImageIcon, FolderTree
} from 'lucide-react';
import { FREE_AI_MODELS } from '../engine/models.js';
import { getStoredMemories, clearAllMemories } from '../engine/brainMemory.js';
import { getCognitiveProfile } from '../engine/cognitiveEngine.js';

export default function Sidebar({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenSettings,
  currentView = 'chat',
  onSelectView,
  hasProject = false
}) {
  const [memories, setMemories] = useState([]);
  const [cognitiveProfile, setCognitiveProfile] = useState(() => getCognitiveProfile());

  useEffect(() => {
    setMemories(getStoredMemories());
    setCognitiveProfile(getCognitiveProfile());
    const interval = setInterval(() => {
      setMemories(getStoredMemories());
      setCognitiveProfile(getCognitiveProfile());
    }, 2000);
    return () => clearInterval(interval);
  }, [sessions, isOpen]);

  const handleClearMemory = () => {
    clearAllMemories();
    setMemories([]);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Cursor Tokyo Night Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-[#16161e] border-r border-[#292e42] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-3.5 border-b border-[#292e42] flex items-center justify-between bg-[#13131a]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#292e42] shadow-glow-blue bg-black flex-shrink-0">
              <img src="/logo.png" alt="Godfy" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-[#c0caf5] text-sm tracking-tight font-display">Godfy</span>
                <span className="px-1.5 py-0.2 rounded bg-[#1f2335] text-[#7dcfff] text-[9px] font-mono font-bold border border-[#292e42]">
                  v1
                </span>
              </div>
              <p className="text-[10px] text-[#565f89] font-mono">Tokyo Night Studio</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#565f89] hover:text-[#c0caf5] hover:bg-[#1f2335] lg:hidden transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action: New Chat & Navigation Switcher */}
        <div className="p-3 border-b border-[#292e42] space-y-2">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#7aa2f7] hover:bg-[#89b4fa] text-[#16161e] font-semibold text-xs flex items-center justify-center space-x-2 shadow-sm transition active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Chat</span>
            <kbd className="text-[9px] bg-[#16161e]/20 px-1 py-0.2 rounded font-mono">⌘N</kbd>
          </button>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                if (onSelectView) onSelectView('chat');
                if (window.innerWidth < 1024) onClose();
              }}
              className={`py-1.5 px-2 rounded-lg font-medium text-xs flex items-center justify-center space-x-1.5 transition ${
                currentView === 'chat'
                  ? 'bg-[#1f2335] text-[#7dcfff] border border-[#3b4261]'
                  : 'bg-[#1a1b26] text-[#9aa5ce] hover:bg-[#1f2335]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => {
                if (onSelectView) onSelectView('editor');
                if (window.innerWidth < 1024) onClose();
              }}
              className={`py-1.5 px-2 rounded-lg font-medium text-xs flex items-center justify-center space-x-1.5 transition ${
                currentView === 'editor'
                  ? 'bg-[#1f2335] text-[#7dcfff] border border-[#3b4261]'
                  : 'bg-[#1a1b26] text-[#9aa5ce] hover:bg-[#1f2335]'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Studio</span>
              {hasProject && <span className="w-1.5 h-1.5 rounded-full bg-[#7dcfff] animate-pulse"></span>}
            </button>
          </div>
        </div>

        {/* Chat Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#565f89] mb-1.5 px-1 flex items-center justify-between">
              <span>Sessions</span>
              <span>{sessions.length}</span>
            </div>

            <div className="space-y-1">
              {sessions.map((sess) => {
                const isActive = sess.id === activeSessionId;
                return (
                  <div
                    key={sess.id}
                    className={`group flex items-center justify-between p-2 rounded-xl border transition text-xs ${
                      isActive
                        ? 'bg-[#1f2335] border-[#3b4261] text-[#c0caf5] font-medium shadow-xs'
                        : 'border-transparent hover:bg-[#1a1b26] text-[#9aa5ce] hover:text-[#c0caf5]'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectSession(sess.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className="flex-1 text-left flex items-center space-x-2 truncate pr-1"
                    >
                      <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#7dcfff]' : 'text-[#565f89]'}`} />
                      <span className="truncate">{sess.title}</span>
                    </button>

                    {sessions.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(sess.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#565f89] hover:text-[#f7768e] rounded transition"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Godfy Memory Pill */}
          <div className="p-3 rounded-xl bg-[#1a1b26] border border-[#292e42]">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-1.5">
                <Brain className="w-3.5 h-3.5 text-[#7aa2f7]" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#c0caf5]">
                  Brain Memory
                </span>
              </div>
              {memories.length > 0 && (
                <button
                  onClick={handleClearMemory}
                  className="text-[9px] font-mono text-[#565f89] hover:text-[#f7768e] transition"
                  title="Clear memory"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            {memories.length > 0 ? (
              <div className="space-y-1">
                {memories.slice(0, 3).map((m, idx) => (
                  <div key={idx} className="text-[11px] font-mono text-[#9aa5ce] truncate">
                    <span className="text-[#565f89]">{m.key}:</span> {m.value}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-[#565f89] font-mono">
                No memories saved yet. Introduce yourself!
              </p>
            )}
          </div>

          {/* Connected AI Friends */}
          <div className="p-3 rounded-xl bg-[#1a1b26] border border-[#292e42]">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#565f89] mb-2 flex items-center justify-between">
              <span>Free AI Friends</span>
              <span className="text-[#9ece6a] flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9ece6a] animate-pulse"></span>
                <span>5 Online</span>
              </span>
            </div>

            <div className="space-y-1 text-[11px] font-mono text-[#9aa5ce]">
              <div className="flex items-center justify-between py-0.5">
                <span>DeepSeek R1</span>
                <span className="text-[9px] text-[#565f89]">Reasoning</span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span>Mistral / Codestral</span>
                <span className="text-[9px] text-[#565f89]">AST Code</span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span>Phi-4 & Qwen 2.5</span>
                <span className="text-[9px] text-[#565f89]">Synthesis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#292e42] bg-[#13131a] flex items-center justify-between text-[11px] font-mono text-[#565f89]">
          <span>Godfy Engine v1</span>
          <span className="text-[#7dcfff]">Tokyo Night</span>
        </div>
      </aside>
    </>
  );
}
