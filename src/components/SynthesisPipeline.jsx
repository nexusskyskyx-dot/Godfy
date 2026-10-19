import React from 'react';
import { CheckCircle2, Clock, Cpu, Brain, GitMerge, Zap } from 'lucide-react';
import { FREE_AI_MODELS } from '../engine/models.js';

export default function SynthesisPipeline({ progress, stage, isProcessing, consensusMetrics }) {
  if (!isProcessing && !consensusMetrics) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 bg-white rounded-2xl border border-cream-300/80 p-5 shadow-card-subtle">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cream-200 gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-cyanlight-100 border border-cyanlight-200 flex items-center justify-center text-cyan-800">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Godfy Multi-AI Fan-Out Pipeline</h3>
            <p className="text-xs text-slate-500">Broadcasting query in parallel to all free open-weight models</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-cream-100 text-slate-700 border border-cream-200">
            Engine Version: <strong>v1</strong>
          </span>
          {consensusMetrics && (
            <span className="px-2.5 py-1 rounded-full bg-cyanlight-100 text-cyan-900 border border-cyanlight-200 font-bold">
              Consensus: {consensusMetrics.agreement}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="my-4">
          <div className="flex justify-between text-xs text-slate-600 mb-1 font-mono">
            <span>Stage: {stage}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-cream-100 rounded-full h-2 overflow-hidden border border-cream-200">
            <div
              className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* 5 Free Models Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
        {FREE_AI_MODELS.map((model) => {
          const isFinished = !isProcessing || progress >= 75;
          return (
            <div
              key={model.id}
              className={`p-3 rounded-xl border transition duration-200 ${
                isFinished
                  ? 'bg-cream-50/70 border-cream-200 hover:border-cyan-300'
                  : 'bg-white border-dashed border-cyanlight-300 animate-pulse'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  {model.badge}
                </span>
                {isFinished ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
                )}
              </div>

              <div className="font-bold text-xs text-slate-900 truncate" title={model.name}>
                {model.name}
              </div>
              <div className="text-[10px] text-slate-500 truncate" title={model.provider}>
                {model.provider}
              </div>

              <div className="mt-2 pt-2 border-t border-cream-200 flex items-center justify-between text-[10px] font-mono text-slate-600">
                <span>Latency</span>
                <span className="font-semibold text-cyan-800">{model.latency}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mind Synthesis Resolution Indicator */}
      <div className="mt-4 pt-3 border-t border-cream-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-cyan-600" />
          <span>
            <strong>Godfy's Mind:</strong> Cross-verifies code, eliminates duplicate copy, unifies into master artifact.
          </span>
        </div>
        <div className="text-[11px] font-mono text-cyan-800 bg-cyanlight-50 px-2 py-0.5 rounded border border-cyanlight-200">
          Autonomous Adjudication Engine
        </div>
      </div>
    </div>
  );
}
