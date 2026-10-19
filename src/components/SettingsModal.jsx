import React, { useState } from 'react';
import { X, Sliders, Shield, Key, Cpu, Sparkles, Check } from 'lucide-react';
import { FREE_AI_MODELS } from '../engine/models.js';

export default function SettingsModal({ isOpen, onClose, mindPreset, setMindPreset }) {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('godfy-mind-core');
  const [modelWeights, setModelWeights] = useState({
    'llama-3.3': 85,
    'deepseek-r1': 92,
    'mistral-large': 88,
    'qwen-2.5': 84,
    'gemma-2': 81
  });
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-cream-300 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-cream-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-600" />
            <h3 className="text-lg font-bold text-slate-900">Godfy Engine v1 Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-cream-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm">
          {/* Provider Mode */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Synthesis Engine Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider('godfy-mind-core')}
                className={`p-3 rounded-xl border text-left transition ${
                  provider === 'godfy-mind-core'
                    ? 'bg-cyanlight-50 border-cyan-400 font-bold text-cyan-900'
                    : 'bg-white border-cream-200 text-slate-700 hover:bg-cream-50'
                }`}
              >
                <div className="text-xs">Autonomous Mind Core</div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">Built-in consensus algorithm (Fastest)</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('external-mesh')}
                className={`p-3 rounded-xl border text-left transition ${
                  provider === 'external-mesh'
                    ? 'bg-cyanlight-50 border-cyan-400 font-bold text-cyan-900'
                    : 'bg-white border-cream-200 text-slate-700 hover:bg-cream-50'
                }`}
              >
                <div className="text-xs">Custom API / Local Ollama</div>
                <div className="text-[10px] text-slate-500 font-normal mt-0.5">Plug in external OpenRouter / Ollama</div>
              </button>
            </div>
          </div>

          {/* Optional External API Key */}
          {provider === 'external-mesh' && (
            <div className="p-4 rounded-xl bg-cream-50 border border-cream-200 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Optional OpenRouter / Ollama Endpoint:
              </label>
              <input
                type="password"
                placeholder="sk-or-v1-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-cream-300 text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
              <p className="text-[11px] text-slate-500">
                Leave blank to automatically use Godfy's built-in intelligent multi-model synthesis engine.
              </p>
            </div>
          )}

          {/* Model Weights in Consensus */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              AI Council Weights (Influence on Godfy Mind)
            </label>
            <div className="space-y-3">
              {FREE_AI_MODELS.map((model) => (
                <div key={model.id} className="flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-800">
                    {model.name} <span className="text-slate-400 font-normal">({model.badge})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={modelWeights[model.id] || 85}
                      onChange={(e) =>
                        setModelWeights({ ...modelWeights, [model.id]: Number(e.target.value) })
                      }
                      className="w-24 accent-cyan-500"
                    />
                    <span className="text-xs font-mono w-8 text-right text-slate-600">
                      {modelWeights[model.id] || 85}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Palettes Confirmed */}
          <div className="p-3.5 rounded-xl bg-cream-100 border border-cream-200">
            <div className="text-xs font-bold text-slate-900 mb-1">Color Palette Configured:</div>
            <div className="text-[11px] text-slate-600 font-mono space-y-0.5">
              <div>Main: White Cream (<code>#FAF7EE</code>)</div>
              <div>Secondary: White (<code>#FFFFFF</code>)</div>
              <div>2nd Secondary: Cyan Light (<code>#E0F7FA</code>)</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-cream-50 border-t border-cream-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">Updates Cycle: v1</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 hover:bg-cream-100 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              {savedNotice ? <Check className="w-4 h-4 text-emerald-400" /> : null}
              <span>{savedNotice ? 'Saved!' : 'Save & Close'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
