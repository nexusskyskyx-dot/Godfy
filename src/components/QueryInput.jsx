import React, { useState } from 'react';
import { Sparkles, ArrowRight, CornerDownLeft, Brain, Cpu, Wand2 } from 'lucide-react';
import { MIND_PRESETS } from '../engine/models.js';

export default function QueryInput({ onSubmit, isProcessing, mindPreset, setMindPreset }) {
  const [query, setQuery] = useState('Make a landing page');

  const presetExamples = [
    { label: 'Make a landing page', icon: '🚀' },
    { label: 'Build a SaaS pricing calculator', icon: '⚡' },
    { label: 'Create an autonomous agent orchestrator', icon: '🧠' },
    { label: 'Design a clean developer portfolio', icon: '🎨' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;
    onSubmit(query.trim());
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Engine Status Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-cream-200 shadow-sm text-xs text-slate-700 mb-3">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400"></span>
          <span className="font-semibold text-slate-900">Godfy Engine v1</span>
          <span className="text-slate-400">•</span>
          <span>Multi-AI Consensus with its own mind</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          One Prompt. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">5 Free AIs Polled.</span> Unified by Godfy.
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
          Godfy broadcasts the exact same question simultaneously to free models, debates the trade-offs, and synthesizes the optimal master output.
        </p>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex flex-col sm:flex-row items-stretch bg-white rounded-2xl border-2 border-cream-200/90 shadow-card-subtle focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyanlight-100/60 transition duration-200 p-2 gap-2">
          <div className="flex-1 flex items-center pl-3">
            <Sparkles className="w-5 h-5 text-cyan-500 mr-3 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything (e.g. 'Make a landing page')..."
              className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-base sm:text-lg focus:outline-none font-medium"
              disabled={isProcessing}
            />
          </div>

          <div className="flex items-center space-x-2">
            {/* Mind Preset Selector */}
            <div className="relative">
              <select
                value={mindPreset}
                onChange={(e) => setMindPreset(e.target.value)}
                disabled={isProcessing}
                className="bg-cream-100/80 hover:bg-cream-200/60 text-slate-700 text-xs font-semibold py-2.5 px-3 rounded-xl border border-cream-200 focus:outline-none cursor-pointer appearance-none pr-8 transition"
                title="Select Godfy Mind Consciousness Mode"
              >
                {MIND_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    🧠 {p.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 text-xs">
                ▼
              </div>
            </div>

            {/* Run Button */}
            <button
              type="submit"
              disabled={isProcessing || !query.trim()}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-sm flex items-center space-x-2 shadow-sm transition active:scale-[0.98] group flex-shrink-0"
            >
              <span>{isProcessing ? 'Synthesizing...' : 'Run Godfy Mind'}</span>
              <ArrowRight className="w-4 h-4 text-cyan-300 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>

        {/* Quick prompt recommendations */}
        <div className="flex flex-wrap items-center gap-2 mt-3 px-1 text-xs">
          <span className="text-slate-500 font-medium">Try asking:</span>
          {presetExamples.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setQuery(item.label);
                onSubmit(item.label);
              }}
              disabled={isProcessing}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/80 hover:bg-cream-100 border border-cream-200 text-slate-700 font-medium transition hover:border-cyan-300 shadow-sm"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
