import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Brain, Bot, Eye, Copy, Check, ChevronDown, ChevronUp, 
  RotateCcw, Code, Download, ExternalLink, X, Monitor, Tablet, Smartphone,
  Layers, ArrowRight, Zap, CheckCircle2
} from 'lucide-react';
import { MIND_PRESETS } from '../engine/models.js';

export default function ChatEngineView({
  messages,
  onSendMessage,
  isProcessing,
  streamMessage,
  mindPreset,
  setMindPreset
}) {
  const [inputText, setInputText] = useState('');
  const [expandedThinks, setExpandedThinks] = useState({});
  const [expandedCouncils, setExpandedCouncils] = useState({});
  const [activeCouncilModel, setActiveCouncilModel] = useState({});
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [previewModalArtifact, setPreviewModalArtifact] = useState(null);
  const [previewViewport, setPreviewViewport] = useState('desktop'); // desktop | tablet | mobile
  const [previewKey, setPreviewKey] = useState(0);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, streamMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const msg = inputText.trim();
    setInputText('');
    onSendMessage(msg);
  };

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const starterCards = [
    {
      title: 'Make a landing page',
      desc: 'Ask Godfy to call 5 Free AIs and synthesize a complete, runnable landing page.',
      icon: '🚀'
    },
    {
      title: 'Build an autonomous agent swarm',
      desc: 'Orchestrate parallel reasoning nodes with conflict resolution.',
      icon: '🧠'
    },
    {
      title: 'Design a clean developer portfolio',
      desc: 'Synthesize minimalist layout with White Cream & Cyan Light design tokens.',
      icon: '🎨'
    },
    {
      title: 'Write a SaaS pricing calculator',
      desc: 'Generate interactive tier selection logic with responsive cards.',
      icon: '⚡'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-5xl w-full mx-auto relative">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        
        {/* Empty state: Welcome screen */}
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto my-auto pt-6 pb-12 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-cream-200 shadow-sm text-xs font-mono text-slate-700 mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="font-bold text-slate-900">Godfy Engine v1</span>
              <span className="text-slate-400">•</span>
              <span>With Its Own Mind</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight mb-4 font-display">
              The AI Chat Engine <br />
              <span className="bg-gradient-to-r from-slate-900 via-cyan-700 to-cyan-500 bg-clip-text text-transparent">
                With Its Own Autonomous Mind
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed font-normal">
              Send any prompt. Godfy broadcasts the same question to <strong>5 Free open-weight AIs</strong> simultaneously, compares their answers, and delivers the best response combining all of them.
            </p>

            {/* Visual Example Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-cream-300 shadow-card-subtle text-left max-w-lg mx-auto mb-8 font-mono text-xs">
              <div className="flex items-center space-x-2 text-slate-700 font-semibold mb-2">
                <span className="text-cyan-600 font-bold">$</span>
                <span>User: "Make a landing page"</span>
              </div>
              <div className="pl-3.5 border-l-2 border-cyan-400 text-slate-600 space-y-1">
                <div className="text-cyan-800 font-semibold">⚡ Godfy Engine:</div>
                <div>1. Calls 5 Free AIs (Llama, DeepSeek, Mistral, Qwen, Gemma)</div>
                <div>2. Sends the exact same prompt to all models in parallel</div>
                <div>3. Resolves divergences with its own mind</div>
                <div className="text-emerald-700 font-bold">4. Returns the best combined response + live preview!</div>
              </div>
            </div>

            {/* Quick Starters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {starterCards.map((card) => (
                <button
                  key={card.title}
                  onClick={() => onSendMessage(card.title)}
                  className="p-4 rounded-xl bg-white hover:bg-cream-50/80 border border-cream-200/90 hover:border-cyan-400 transition shadow-card-subtle group text-left"
                >
                  <div className="text-xl mb-1">{card.icon}</div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-cyan-700 transition">
                    {card.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {card.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message Stream */}
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          const msgId = msg.id || index;

          return (
            <div
              key={msgId}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-200`}
            >
              {/* Header: Sender & Timestamp */}
              <div className="flex items-center space-x-2 mb-1.5 px-1">
                {!isUser && (
                  <div className="w-5 h-5 rounded-md bg-slate-900 flex items-center justify-center text-[10px] font-extrabold text-cyan-300">
                    G
                  </div>
                )}
                <span className="text-xs font-bold text-slate-800 font-mono">
                  {isUser ? 'You' : 'Godfy Engine'}
                </span>
                {!isUser && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyanlight-100 text-cyan-900 font-mono font-bold border border-cyanlight-200">
                    v1
                  </span>
                )}
                <span className="text-[10px] font-mono text-slate-400">{msg.timestamp}</span>
              </div>

              {/* Message Content Container */}
              <div
                className={`w-full max-w-full sm:max-w-[92%] rounded-2xl p-4 sm:p-6 shadow-card-subtle ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none ml-auto sm:w-auto sm:max-w-[80%]'
                    : 'bg-white border border-cream-300 text-slate-800 rounded-tl-none'
                }`}
              >
                {/* Godfy Autonomous Badges */}
                {!isUser && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-cream-200">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyanlight-50 text-cyan-900 text-xs font-mono font-bold border border-cyanlight-200">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{msg.consensusScore ? `Consensus: ${msg.consensusScore}` : '5 Free AIs Combined'}</span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
                      Parallel Fan-Out Latency: ~380ms
                    </div>
                  </div>
                )}

                {/* Expandable Godfy Mind Internal Monologue */}
                {!isUser && msg.thinkTrace && (
                  <div className="mb-4">
                    <button
                      onClick={() => setExpandedThinks(p => ({ ...p, [msgId]: !p[msgId] }))}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-cream-100/70 hover:bg-cream-100 border border-cream-200 text-xs font-mono text-slate-700 transition"
                    >
                      <div className="flex items-center space-x-2">
                        <Brain className="w-3.5 h-3.5 text-cyan-700" />
                        <span className="font-semibold text-slate-900">Godfy Mind Reasoning Trace</span>
                      </div>
                      {expandedThinks[msgId] ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>

                    {expandedThinks[msgId] && (
                      <div className="mt-2 p-3.5 rounded-xl bg-cream-50 border border-cream-200 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {msg.thinkTrace}
                      </div>
                    )}
                  </div>
                )}

                {/* Master Response Text */}
                <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed space-y-3 font-normal">
                  {msg.masterText || msg.text}
                </div>

                {/* Interactive Code Artifact & Live Sandbox Button */}
                {!isUser && msg.codeArtifact && (
                  <div className="mt-5 rounded-xl border border-cream-300 overflow-hidden bg-slate-950 shadow-md">
                    <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center space-x-2 font-mono">
                        <Code className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Synthesized {msg.codeLanguage || 'html'}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setPreviewModalArtifact(msg.codeArtifact)}
                          className="px-3 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center space-x-1 transition shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Live Preview Sandbox</span>
                        </button>

                        <button
                          onClick={() => handleCopy(msg.codeArtifact, msgId)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center space-x-1 transition"
                        >
                          {copiedCodeId === msgId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedCodeId === msgId ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 overflow-x-auto max-h-64 text-xs font-mono text-slate-200">
                      <pre>
                        <code>{msg.codeArtifact}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Compare 5 Free AI Proposals Drawer */}
                {!isUser && msg.modelProposals && (
                  <div className="mt-5 pt-4 border-t border-cream-200">
                    <button
                      onClick={() => setExpandedCouncils(p => ({ ...p, [msgId]: !p[msgId] }))}
                      className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white hover:bg-cream-50 border border-cream-300 text-xs font-mono text-slate-800 transition"
                    >
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-cyan-600" />
                        <span className="font-bold">Compare the 5 Free AI Answers</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500">
                        <span className="text-[11px]">Inspect proposals</span>
                        {expandedCouncils[msgId] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </div>
                    </button>

                    {expandedCouncils[msgId] && (
                      <div className="mt-3 p-3.5 rounded-xl bg-cream-50/80 border border-cream-200 space-y-3">
                        {/* Model selector tabs */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                          {msg.modelProposals.map((m) => {
                            const isSelected = (activeCouncilModel[msgId] || msg.modelProposals[0].modelId) === m.modelId;
                            return (
                              <button
                                key={m.modelId}
                                onClick={() => setActiveCouncilModel(p => ({ ...p, [msgId]: m.modelId }))}
                                className={`p-2 rounded-lg text-left text-xs transition border ${
                                  isSelected
                                    ? 'bg-white border-cyan-400 font-bold text-slate-900 shadow-sm'
                                    : 'bg-white/60 border-cream-200 text-slate-600 hover:bg-white'
                                }`}
                              >
                                <div className="text-[10px] text-cyan-700 font-mono font-bold truncate">{m.badge}</div>
                                <div className="truncate font-semibold">{m.modelName.split(' ')[0]}</div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Selected model content */}
                        {(() => {
                          const currentModelId = activeCouncilModel[msgId] || msg.modelProposals[0].modelId;
                          const model = msg.modelProposals.find(m => m.modelId === currentModelId) || msg.modelProposals[0];
                          return (
                            <div className="p-3.5 rounded-lg bg-white border border-cream-200 text-xs space-y-2">
                              <div className="flex items-center justify-between pb-2 border-b border-cream-200">
                                <div className="font-bold text-slate-900">{model.modelName}</div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cream-100 text-slate-700">
                                  Role: {model.badge}
                                </span>
                              </div>
                              <div className="text-cyan-900 font-mono text-[11px] bg-cyanlight-50 p-2 rounded border border-cyanlight-200">
                                <strong>Extracted by Godfy:</strong> {model.keyExtracted}
                              </div>
                              <div className="text-slate-700 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed pt-1">
                                {model.answer}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Follow-up recommendation chips */}
              {!isUser && msg.suggestedFollowUps && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-full sm:max-w-[90%]">
                  {msg.suggestedFollowUps.map((promptText, i) => (
                    <button
                      key={i}
                      onClick={() => onSendMessage(promptText)}
                      disabled={isProcessing}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-cream-100 border border-cream-300 text-slate-700 text-[11px] font-medium transition hover:border-cyan-400 flex items-center space-x-1 shadow-sm"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-500" />
                      <span>{promptText}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Live Processing Pipeline Bar */}
        {isProcessing && (
          <div className="flex items-start space-x-3 p-4 rounded-2xl bg-white border border-cyanlight-300 shadow-sm animate-pulse max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <Brain className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                <span>Godfy Mind Consensus in progress...</span>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              </div>
              <p className="text-xs font-mono text-cyan-800">
                {streamMessage || 'Broadcasting to Llama 3.3, DeepSeek R1, Mistral, Qwen, Gemma...'}
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Sticky Input Form */}
      <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-cream-200">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-cream-50 border-2 border-cream-200/90 focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyanlight-100/50 transition">
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Godfy anything (e.g. 'Make a landing page')..."
              disabled={isProcessing}
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
            />

            {/* Mind preset picker */}
            <select
              value={mindPreset}
              onChange={(e) => setMindPreset(e.target.value)}
              disabled={isProcessing}
              className="hidden sm:inline-block bg-white text-slate-700 text-xs font-semibold py-1.5 px-2.5 rounded-xl border border-cream-300 focus:outline-none cursor-pointer"
            >
              {MIND_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  🧠 {p.name}
                </option>
              ))}
            </select>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isProcessing || !inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm transition active:scale-[0.98] flex-shrink-0"
            >
              <span>{isProcessing ? 'Synthesizing...' : 'Send'}</span>
              <Send className="w-3.5 h-3.5 text-cyan-300" />
            </button>
          </div>

          {/* Footer specifications */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono mt-2 px-1">
            <div className="flex items-center space-x-2">
              <span>Godfy Engine <strong>v1</strong></span>
              <span>•</span>
              <span>5 Free AIs Polled Simultaneously</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <span>Main: White cream (#FAF7EE)</span>
              <span>•</span>
              <span>Cyan light (#E0F7FA)</span>
            </div>
          </div>
        </form>
      </div>

      {/* Interactive Live Sandbox Modal (when clicking "Live Preview Sandbox") */}
      {previewModalArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-cream-300 shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-3 sm:p-4 border-b border-cream-200 bg-cream-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-md bg-white border border-cream-200 text-xs font-mono font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Live Sandbox: Godfy v1</span>
                </div>

                {/* Viewport toggles */}
                <div className="hidden sm:flex items-center space-x-1 bg-white p-1 rounded-lg border border-cream-200">
                  <button
                    onClick={() => setPreviewViewport('desktop')}
                    className={`p-1.5 rounded-md text-xs flex items-center space-x-1 transition ${
                      previewViewport === 'desktop' ? 'bg-cream-200 text-slate-900 font-bold' : 'text-slate-500'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewViewport('tablet')}
                    className={`p-1.5 rounded-md text-xs flex items-center space-x-1 transition ${
                      previewViewport === 'tablet' ? 'bg-cream-200 text-slate-900 font-bold' : 'text-slate-500'
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span>Tablet</span>
                  </button>
                  <button
                    onClick={() => setPreviewViewport('mobile')}
                    className={`p-1.5 rounded-md text-xs flex items-center space-x-1 transition ${
                      previewViewport === 'mobile' ? 'bg-cream-200 text-slate-900 font-bold' : 'text-slate-500'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewKey(k => k + 1)}
                  className="p-1.5 rounded-lg bg-white border border-cream-300 text-slate-600 hover:text-slate-900 text-xs flex items-center space-x-1"
                  title="Reload preview"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    const w = window.open();
                    w?.document.write(previewModalArtifact);
                    w?.document.close();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-cyanlight-100 hover:bg-cyanlight-200 border border-cyanlight-300 text-cyan-900 text-xs font-semibold flex items-center space-x-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Tab</span>
                </button>

                <button
                  onClick={() => setPreviewModalArtifact(null)}
                  className="p-1.5 rounded-lg bg-white border border-cream-300 text-slate-500 hover:text-slate-900 text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Iframe Sandbox */}
            <div className="flex-1 bg-cream-100/60 p-2 sm:p-4 flex justify-center items-center overflow-auto">
              <div
                className={`transition-all duration-300 bg-white rounded-xl shadow-lg border border-cream-300 overflow-hidden h-full flex flex-col ${
                  previewViewport === 'mobile' ? 'w-[375px]' : previewViewport === 'tablet' ? 'w-[768px]' : 'w-full'
                }`}
              >
                <div className="bg-cream-100 px-3 py-1.5 border-b border-cream-200 flex items-center space-x-2 text-[11px] font-mono text-slate-500">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  </div>
                  <span className="truncate">https://godfy-sandbox.local/preview</span>
                </div>
                <iframe
                  key={previewKey}
                  title="Godfy Artifact Sandbox"
                  srcDoc={previewModalArtifact}
                  sandbox="allow-scripts allow-modals"
                  className="w-full flex-1 border-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
