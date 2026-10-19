import React, { useState } from 'react';
import { Bot, Check, ArrowRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function AICouncilView({ modelResponses }) {
  const [selectedModel, setSelectedModel] = useState(modelResponses?.[0]?.modelId || 'llama-3.3');

  if (!modelResponses || modelResponses.length === 0) return null;

  const activeModelData = modelResponses.find((m) => m.modelId === selectedModel) || modelResponses[0];

  return (
    <div className="space-y-6">
      {/* Intro explanation */}
      <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-card-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Free AI Council Submissions (5 Models)
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            See the raw proposals sent back from each open-weight model before Godfy's mind synthesized them.
          </p>
        </div>
        <div className="inline-flex items-center space-x-1 text-xs font-mono bg-cream-100 px-3 py-1.5 rounded-xl border border-cream-200 text-slate-700">
          <Zap className="w-3.5 h-3.5 text-cyan-600" />
          <span>Broadcast Latency: 260ms - 410ms</span>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {modelResponses.map((item) => {
          const isSelected = item.modelId === selectedModel;
          return (
            <button
              key={item.modelId}
              onClick={() => setSelectedModel(item.modelId)}
              className={`p-3 rounded-xl text-left border transition ${
                isSelected
                  ? 'bg-white border-cyan-400 ring-2 ring-cyanlight-200 shadow-sm'
                  : 'bg-cream-100/60 border-cream-200 hover:bg-white text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cream-200 text-slate-700">
                  {item.badge}
                </span>
                <span className="text-[10px] font-mono font-bold text-cyan-700">
                  {item.confidence}%
                </span>
              </div>
              <div className="font-bold text-xs text-slate-900 truncate">
                {item.modelName}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Model Detailed Proposal */}
      <div className="bg-white rounded-2xl border border-cream-300 p-6 shadow-card-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cream-200 gap-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              <Bot className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">{activeModelData.modelName}</h4>
              <p className="text-xs text-slate-500 font-mono">Specialty: {activeModelData.badge}</p>
            </div>
          </div>

          <div className="px-3 py-1 rounded-full bg-cream-100 border border-cream-200 text-xs font-mono text-slate-700">
            Confidence Rating: <strong className="text-cyan-800">{activeModelData.confidence}%</strong>
          </div>
        </div>

        {/* Godfy Extraction Badge */}
        <div className="p-3.5 rounded-xl bg-cyanlight-50 border border-cyanlight-200 flex items-start space-x-2.5">
          <Sparkles className="w-4 h-4 text-cyan-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-slate-800">
            <strong className="text-cyan-950">Extracted by Godfy Mind: </strong>
            <span>{activeModelData.keyContribution}</span>
          </div>
        </div>

        {/* Raw Response Text */}
        <div className="bg-cream-50/70 p-5 rounded-xl border border-cream-200 text-xs sm:text-sm font-mono text-slate-800 whitespace-pre-wrap overflow-x-auto leading-relaxed">
          {activeModelData.response}
        </div>
      </div>
    </div>
  );
}
