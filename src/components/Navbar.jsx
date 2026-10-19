import React from 'react';
import { Cpu, Sparkles, Sliders, ShieldCheck, Layers } from 'lucide-react';

export default function Navbar({ onOpenSettings, currentMindPreset, isProcessing }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Version */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyanlight-200 via-cyanlight-100 to-cream-100 border border-cyanlight-300 flex items-center justify-center shadow-sm">
              <span className="font-extrabold text-slate-900 text-lg tracking-wider">G</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">Godfy</span>
              <span className="px-2 py-0.5 rounded-md bg-cyanlight-100 text-cyan-900 text-xs font-bold font-mono border border-cyanlight-200 tracking-wide">
                v1
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Multi-AI Autonomous Consensus Engine
            </p>
          </div>
        </div>

        {/* Center Mind Pulse */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cream-50 border border-cream-200 text-xs font-medium text-slate-700">
          <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-cyan-500 animate-ping' : 'bg-emerald-500'}`}></div>
          <span className="font-semibold text-slate-800">Mind:</span>
          <span className="text-slate-600">
            {isProcessing ? 'Synthesizing 5 Free AIs...' : 'Online & Autonomous'}
          </span>
          <span className="text-cream-300">|</span>
          <span className="text-cyan-700 font-mono text-[11px] font-semibold">5 Free Nodes Synced</span>
        </div>

        {/* Action Controls & Color Palette Pill */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-cream-100/70 border border-cream-200 text-[11px] text-slate-600 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-cream-100 border border-cream-300 inline-block" title="White cream (#FAF7EE)"></span>
            <span>Cream</span>
            <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-200 inline-block" title="White (#FFFFFF)"></span>
            <span>White</span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyanlight-brand border border-cyan-300 inline-block" title="Cyan light (#E0F7FA)"></span>
            <span>Cyan</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-cyan-400 text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-sm transition"
            title="Engine Configuration"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-600" />
            <span className="hidden sm:inline">Engine Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
