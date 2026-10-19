import React from 'react';
import { Brain, CheckCircle, ShieldAlert, Cpu, Sparkles, Layers, Sliders } from 'lucide-react';
import { MIND_PRESETS } from '../engine/models.js';

export default function GodfyMindInspector({ reasoningLog, mindPreset, consensusScore }) {
  const currentPreset = MIND_PRESETS.find((p) => p.id === mindPreset) || MIND_PRESETS[0];

  return (
    <div className="space-y-6">
      {/* Mind Overview Header */}
      <div className="bg-white rounded-2xl border border-cream-300 p-6 shadow-card-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-cream-200 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-cyan-300 flex items-center justify-center text-white shadow-md">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-slate-900">Godfy Autonomous Mind Core</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-cyanlight-100 text-cyan-900 font-mono font-bold border border-cyanlight-200">
                  v1
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Internal cognitive pipeline, cross-validation rules & resolution matrix
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="px-3 py-1.5 rounded-xl bg-cream-100 border border-cream-200 text-xs font-mono text-slate-800">
              Active Mode: <strong className="text-cyan-800">{currentPreset.name}</strong>
            </div>
          </div>
        </div>

        {/* Mind Mode description */}
        <div className="mt-4 p-4 rounded-xl bg-cream-50 border border-cream-200 text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900">Consciousness Profile: </strong>
          {currentPreset.description}
        </div>
      </div>

      {/* Internal Monologue / Reasoning Steps */}
      <div className="bg-white rounded-2xl border border-cream-300 p-6 shadow-card-subtle">
        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-cyan-600" />
          <span>Cognitive Adjudication Trace (v1)</span>
        </h4>

        <div className="space-y-4">
          {reasoningLog?.map((step) => (
            <div key={step.step} className="p-4 rounded-xl bg-cream-100/50 border border-cream-200 flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                {step.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-bold text-slate-900">{step.title}</h5>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    step.status === 'resolved' ? 'bg-amber-100 text-amber-800' :
                    step.status === 'synthesized' ? 'bg-cyanlight-100 text-cyan-900' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {step.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Godfy Engine Color & Version Specification Matrix */}
      <div className="bg-[#16161e] rounded-2xl border border-[#292e42] p-6 shadow-card-subtle">
        <h4 className="text-sm font-bold text-[#c0caf5] uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#7aa2f7]" />
          <span>Godfy System Specifications</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-[#292e42] bg-[#1a1b26]">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-4 h-4 rounded-full bg-[#1a1b26] border border-[#7aa2f7]"></span>
              <span className="font-bold text-xs text-[#c0caf5]">Tokyo Night Foundation</span>
            </div>
            <div className="text-xs text-[#7aa2f7] font-mono">Night (#1a1b26)</div>
            <p className="text-[11px] text-[#565f89] mt-1">Foundation background and subtle surface cards</p>
          </div>

          <div className="p-3.5 rounded-xl border border-[#292e42] bg-[#1f2335]">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-4 h-4 rounded-full bg-[#16161e] border border-[#292e42]"></span>
              <span className="font-bold text-xs text-[#c0caf5]">Surface & Panes</span>
            </div>
            <div className="text-xs text-[#7dcfff] font-mono">Darker (#16161e)</div>
            <p className="text-[11px] text-[#565f89] mt-1">Elevated cards, preview containers, and inputs</p>
          </div>

          <div className="p-3.5 rounded-xl border border-[#292e42] bg-[#1a1b26]">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-4 h-4 rounded-full bg-[#7aa2f7] border border-[#7dcfff]"></span>
              <span className="font-bold text-xs text-[#c0caf5]">Tokyo Accents</span>
            </div>
            <div className="text-xs text-[#7aa2f7] font-mono">Blue & Cyan (#7aa2f7)</div>
            <p className="text-[11px] text-[#565f89] mt-1">Interactive glows, badges, and focus rings</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#292e42] text-xs font-mono text-[#565f89] flex items-center justify-between">
          <span>Updates release cycle format: <strong className="text-[#c0caf5]">v1</strong></span>
          <span>Engine status: <strong className="text-[#9ece6a]">Autonomous Mind active</strong></span>
        </div>
      </div>
    </div>
  );
}
