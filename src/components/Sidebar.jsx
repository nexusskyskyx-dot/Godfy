import React, { useState, useEffect } from 'react';
import { 
  X, Plus, MessageSquare, Trash2, Sliders, ExternalLink, 
  Sparkles, CheckCircle2, ChevronRight, Zap, Brain, RotateCcw
} from 'lucide-react';
import { FREE_AI_MODELS } from '../engine/models.js';
import { getStoredMemories, clearAllMemories } from '../engine/brainMemory.js';

export default function Sidebar({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onOpenSettings
}) {
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    setMemories(getStoredMemories());
    const interval = setInterval(() => {
      setMemories(getStoredMemories());
    }, 2000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClearMemory = () => {
    clearAllMemories();
    setMemories([]);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-white border-r border-cream-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-cream-200 flex items-center justify-between bg-cream-50/60">
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
              <p className="text-[10px] text-slate-500 font-medium">Multi-AI Chat Engine</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-cream-100 lg:hidden transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Chat */}
        <div className="p-3.5 border-b border-cream-200">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-sm transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-cyan-300" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Chat History
            </div>

            <div className="space-y-1">
              {sessions.map((sess) => {
                const isActive = sess.id === activeSessionId;
                return (
                  <div
                    key={sess.id}
                    className={`group flex items-center justify-between p-2 rounded-xl border transition text-xs ${
                      isActive
                        ? 'bg-cream-100 border-cyan-300 font-semibold text-slate-900 shadow-sm'
                        : 'border-transparent hover:bg-cream-50 hover:border-cream-200 text-slate-700'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectSession(sess.id);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className="flex-1 text-left flex items-center space-x-2 truncate pr-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                      <span className="truncate">{sess.title}</span>
                    </button>

                    {sessions.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(sess.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition"
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

          {/* Godfy Brain Long-Term Memory */}
          <div className="p-3.5 rounded-2xl bg-cream-50/80 border border-cream-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <Brain className="w-3.5 h-3.5 text-cyan-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800">
                  Brain Memory
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyanlight-100 text-cyan-900 font-bold border border-cyanlight-200">
                {memories.length} facts
              </span>
            </div>

            {memories.length > 0 ? (
              <div className="space-y-1">
                <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
                  {memories.map((m) => (
                    <div key={m.id} className="text-[10px] bg-white p-1.5 rounded-lg border border-cream-200 flex justify-between items-center">
                      <span className="font-semibold text-slate-800 truncate max-w-[55%]">{m.key}</span>
                      <span className="text-cyan-800 font-mono truncate max-w-[42%] text-right">{m.value}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleClearMemory}
                  className="w-full mt-1.5 text-[10px] text-slate-400 hover:text-red-500 font-mono flex items-center justify-center space-x-1 py-1 transition"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Clear Brain Memory</span>
                </button>
              </div>
            ) : (
              <div className="text-[10px] text-slate-500 italic py-1">
                No memories yet. Tell Godfy your name or preferences!
              </div>
            )}
          </div>

          {/* 5 Free AIs Telemetry */}
          <div className="p-3.5 rounded-2xl bg-cream-50/80 border border-cream-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                5 Free AI Mesh
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

          {/* Color identity badge */}
          <div className="p-3 rounded-xl bg-white border border-cream-200 space-y-1 text-[11px]">
            <div className="font-bold text-slate-800">Color System Confirmed</div>
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

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-cream-200 bg-cream-50/50 flex items-center justify-between text-xs">
          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-600" />
            <span className="font-medium">Engine Settings</span>
          </button>

          <a
            href="https://godfy-flux-cf70.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-cyan-800 hover:text-cyan-950 font-semibold transition"
          >
            <span>Vercel App</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>
    </>
  );
}
