import React, { useState } from 'react';
import { X, Sliders, Shield, Key, Cpu, Sparkles, Check } from 'lucide-react';
import { FREE_AI_MODELS } from '../engine/models.js';

export default function SettingsModal({ isOpen, onClose, mindPreset, setMindPreset }) {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('godfy-mind-core');
  const [modelWeights, setModelWeights] = useState(() => {
    const init = {};
    FREE_AI_MODELS.forEach(m => {
      init[m.id] = Math.round((m.defaultWeight || 0.85) * 100);
    });
    return init;
  });
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-node-enter">
      <div className="bg-[#16161e] rounded-2xl border border-[#292e42] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto text-[#c0caf5]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#292e42] flex items-center justify-between bg-[#13131a]">
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-5 h-5 text-[#7dcfff]" />
            <h3 className="text-base sm:text-lg font-bold text-[#c0caf5] font-display">Godfy Engine v1 Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#565f89] hover:text-[#c0caf5] hover:bg-[#1f2335] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 text-xs sm:text-sm">
          {/* Provider Mode */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#565f89] mb-2">
              Synthesis Engine Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider('godfy-mind-core')}
                className={`p-3 rounded-xl border text-left transition ${
                  provider === 'godfy-mind-core'
                    ? 'bg-[#1f2335] border-[#7aa2f7] text-[#7dcfff] font-medium'
                    : 'bg-[#1a1b26] border-[#292e42] text-[#9aa5ce] hover:bg-[#1f2335]'
                }`}
              >
                <div className="text-xs font-bold text-[#c0caf5]">Autonomous Mind Core</div>
                <div className="text-[10px] text-[#565f89] font-normal mt-0.5">Built-in consensus algorithm (Fastest)</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('external-mesh')}
                className={`p-3 rounded-xl border text-left transition ${
                  provider === 'external-mesh'
                    ? 'bg-[#1f2335] border-[#7aa2f7] text-[#7dcfff] font-medium'
                    : 'bg-[#1a1b26] border-[#292e42] text-[#9aa5ce] hover:bg-[#1f2335]'
                }`}
              >
                <div className="text-xs font-bold text-[#c0caf5]">Custom API / Local Ollama</div>
                <div className="text-[10px] text-[#565f89] font-normal mt-0.5">Plug in external OpenRouter / Ollama</div>
              </button>
            </div>
          </div>

          {/* Optional External API Key */}
          {provider === 'external-mesh' && (
            <div className="p-3.5 rounded-xl bg-[#1a1b26] border border-[#292e42] space-y-2">
              <label className="block text-xs font-mono text-[#9aa5ce]">
                Optional Endpoint / API Key:
              </label>
              <input
                type="password"
                placeholder="sk-or-v1-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#16161e] border border-[#292e42] text-xs font-mono text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
              />
              <p className="text-[10px] text-[#565f89] font-mono">
                Leave blank to automatically use Godfy's built-in 5-model consensus engine.
              </p>
            </div>
          )}

          {/* Model Weights in Consensus */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#565f89] mb-2">
              Frontier Model Consensus Calibration
            </label>
            <div className="space-y-2.5">
              {FREE_AI_MODELS.map((model) => (
                <div key={model.id} className="p-2.5 rounded-xl bg-[#1a1b26] border border-[#292e42] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-semibold text-xs text-[#c0caf5] block truncate">{model.name}</span>
                    <span className="text-[10px] text-[#565f89] font-mono">{model.provider}</span>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={modelWeights[model.id] || 85}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setModelWeights(prev => ({ ...prev, [model.id]: val }));
                      }}
                      className="w-20 sm:w-28 accent-[#7aa2f7] cursor-pointer"
                    />
                    <span className="text-xs font-mono text-[#7dcfff] w-8 text-right">
                      {modelWeights[model.id] || 85}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#292e42] bg-[#13131a] flex items-center justify-between">
          <span className="text-[11px] text-[#565f89] font-mono">Tokyo Night Theme</span>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-[#7aa2f7] hover:bg-[#89b4fa] text-[#16161e] font-semibold text-xs flex items-center space-x-1.5 transition active:scale-95"
          >
            {savedNotice ? <Check className="w-4 h-4" /> : null}
            <span>{savedNotice ? 'Saved!' : 'Save & Close'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
