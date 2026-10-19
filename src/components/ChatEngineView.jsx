import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Brain, Users, Eye, Copy, Check, ChevronDown, ChevronUp, 
  RotateCcw, Code, Download, ExternalLink, X, Monitor, Tablet, Smartphone,
  Layers, ArrowRight, Zap, CheckCircle2, Globe, Bot
} from 'lucide-react';
import { marked } from 'marked';
import { MIND_PRESETS } from '../engine/models.js';

marked.setOptions({
  gfm: true,
  breaks: true
});

marked.use({
  renderer: {
    code({ text, lang }) {
      const language = (lang || 'code').toLowerCase();
      const displayLang = language.toUpperCase();
      const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      return `<div class="code-block-wrapper my-3 rounded-xl overflow-hidden border border-slate-800 bg-[#090D16] shadow-sm">
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-[#0F172A] border-b border-slate-800 text-[11px] font-mono">
          <span class="text-cyan-400 font-semibold tracking-wider">${displayLang}</span>
          <span class="text-slate-400 text-[10px]">Godfy Code Synthesizer</span>
        </div>
        <pre class="p-3.5 text-xs text-slate-100 font-mono overflow-x-auto leading-relaxed"><code>${escaped}</code></pre>
      </div>`;
    }
  }
});

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
  const [previewViewport, setPreviewViewport] = useState('desktop');
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
      desc: 'Calls his friends for layout, style, and copy, then synthesizes a live previewable page.',
      icon: '🚀'
    },
    {
      title: 'Reverse a linked list',
      desc: 'DeepSeek checks edge cases, Mistral writes clean O(n) code.',
      icon: '⚡'
    },
    {
      title: 'Explain quantum computing',
      desc: 'Qwen, Llama, and DeepSeek give a 3-point clear explanation.',
      icon: '🧠'
    },
    {
      title: 'Design a clean portfolio',
      desc: 'Styled in signature White Cream (#FAF7EE) and Cyan Light (#E0F7FA).',
      icon: '🎨'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-4xl w-full mx-auto relative">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-5">
        
        {/* Empty state: Welcome screen */}
        {messages.length === 0 && (
          <div className="max-w-xl mx-auto my-auto pt-4 pb-8 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-cream-200 shadow-sm text-xs font-mono text-slate-700 mb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="font-bold text-slate-900">Godfy Engine v1</span>
              <span className="text-slate-400">•</span>
              <span>An AI With Its Own Brain</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight leading-snug mb-3 font-display">
              The AI Brain That <br />
              <span className="bg-gradient-to-r from-slate-900 via-cyan-700 to-cyan-500 bg-clip-text text-transparent">
                Calls His Friends For Ideas
              </span>
            </h1>

            {/* Brain Concept Box */}
            <div className="p-4 rounded-2xl bg-white border border-cream-300 shadow-card-subtle text-left max-w-md mx-auto mb-6 text-xs sm:text-sm">
              <div className="font-bold text-slate-900 mb-2 flex items-center space-x-1.5">
                <Brain className="w-4 h-4 text-cyan-600" />
                <span>How Godfy's Brain Works:</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 font-medium pl-1">
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-600 font-bold">1.</span>
                  <span><strong>Calls his friends</strong> (Llama, DeepSeek, Mistral, Qwen, Gemma) for ideas</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-600 font-bold">2.</span>
                  <span><strong>Thinks about what to do</strong> with their responses</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-600 font-bold">3.</span>
                  <span><strong>Makes the best answer</strong> combining the best parts</span>
                </li>
              </ul>
            </div>

            {/* Quick Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
              {starterCards.map((card) => (
                <button
                  key={card.title}
                  onClick={() => onSendMessage(card.title)}
                  className="p-3 rounded-xl bg-white hover:bg-cream-50 border border-cream-200 hover:border-cyan-400 transition shadow-card-subtle group text-left"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-base">{card.icon}</span>
                    <span className="font-bold text-xs text-slate-900 group-hover:text-cyan-700 transition">
                      {card.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">
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
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-in fade-in duration-150`}
            >
              {/* Header: Sender & Timestamp */}
              <div className="flex items-center space-x-1.5 mb-1 px-1">
                {!isUser && (
                  <div className="w-5 h-5 rounded-md bg-slate-900 flex items-center justify-center text-[10px] font-extrabold text-cyan-300">
                    G
                  </div>
                )}
                <span className="text-xs font-bold text-slate-800 font-mono">
                  {isUser ? 'You' : 'Godfy'}
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
                className={`w-full max-w-full sm:max-w-[88%] rounded-2xl p-4 sm:p-5 shadow-card-subtle ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none ml-auto sm:w-auto sm:max-w-[75%]'
                    : 'bg-white border border-cream-300 text-slate-800 rounded-tl-none'
                }`}
              >
                {/* Godfy Brain Indicator */}
                {!isUser && (
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-cream-200 text-xs">
                    <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyanlight-50 text-cyan-900 text-[11px] font-mono font-bold border border-cyanlight-200">
                      <Brain className="w-3 h-3 text-cyan-600" />
                      <span>Brain: Combined 5 Friends</span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400">
                      Consensus: {msg.consensusScore || '98%'}
                    </div>
                  </div>
                )}

                {/* Expandable Godfy Brain Thought Trace (<think>) */}
                {!isUser && msg.thinkTrace && (
                  <div className="mb-3">
                    <button
                      onClick={() => setExpandedThinks(p => ({ ...p, [msgId]: !p[msgId] }))}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-cream-100/70 hover:bg-cream-100 border border-cream-200 text-xs font-mono text-slate-700 transition"
                    >
                      <div className="flex items-center space-x-1.5">
                        <Brain className="w-3.5 h-3.5 text-cyan-700" />
                        <span className="font-semibold text-slate-900 text-[11px]">Brain: What I'm going to do</span>
                      </div>
                      {expandedThinks[msgId] ? (
                        <ChevronUp className="w-3 h-3 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-slate-500" />
                      )}
                    </button>

                    {expandedThinks[msgId] && (
                      <div className="mt-2 p-3.5 rounded-xl bg-cream-50 border border-cream-200 shadow-sm">
                        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-cyan-800 pb-2 mb-2 border-b border-cream-200 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                          <span className="uppercase tracking-wider">Godfy Brain Thinking Trace</span>
                        </div>
                        <div 
                          className="godfy-markdown text-xs text-slate-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: marked.parse(msg.thinkTrace || '') }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Master Response Text with Markdown & Rich Text Formatting */}
                {isUser ? (
                  <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-medium">
                    {msg.text}
                  </div>
                ) : (
                  <div 
                    className="godfy-markdown max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: marked.parse(msg.masterText || msg.text || '') }}
                  />
                )}

                {/* Live Sandbox Button if landing page/UI artifact exists */}
                {!isUser && msg.codeArtifact && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-950 text-white flex items-center justify-between border border-cream-300">
                    <div className="flex items-center space-x-2 text-xs font-mono">
                      <Code className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{msg.codeLanguage === 'html' ? 'Landing Page Ready' : 'Code Synthesized'}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {msg.codeLanguage === 'html' && (
                        <button
                          onClick={() => setPreviewModalArtifact(msg.codeArtifact)}
                          className="px-3 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center space-x-1 transition shadow-sm"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Live Preview Sandbox</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleCopy(msg.codeArtifact, msgId)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center space-x-1 transition"
                      >
                        {copiedCodeId === msgId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCodeId === msgId ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* What My Friends Answered Drawer */}
                {!isUser && msg.modelProposals && (
                  <div className="mt-4 pt-3 border-t border-cream-200">
                    <button
                      onClick={() => setExpandedCouncils(p => ({ ...p, [msgId]: !p[msgId] }))}
                      className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-cream-50 hover:bg-cream-100 border border-cream-200 text-xs font-mono text-slate-800 transition"
                    >
                      <div className="flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-cyan-700" />
                        <span className="font-bold text-[11px]">See what my 5 friends answered</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500 text-[10px]">
                        <span>{expandedCouncils[msgId] ? 'Hide' : 'Inspect'}</span>
                        {expandedCouncils[msgId] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </div>
                    </button>

                    {expandedCouncils[msgId] && (
                      <div className="mt-2.5 p-3 rounded-xl bg-cream-50/90 border border-cream-200 space-y-2.5">
                        {/* Model selector buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1">
                          {msg.modelProposals.map((m) => {
                            const isSelected = (activeCouncilModel[msgId] || msg.modelProposals[0].modelId) === m.modelId;
                            return (
                              <button
                                key={m.modelId}
                                onClick={() => setActiveCouncilModel(p => ({ ...p, [msgId]: m.modelId }))}
                                className={`p-1.5 rounded-lg text-left text-xs transition border ${
                                  isSelected
                                    ? 'bg-white border-cyan-400 font-bold text-slate-900 shadow-sm'
                                    : 'bg-white/60 border-cream-200 text-slate-600 hover:bg-white'
                                }`}
                              >
                                <div className="text-[9px] text-cyan-700 font-mono truncate">{m.badge}</div>
                                <div className="truncate font-semibold text-[11px]">{m.modelName.split(' ')[0]}</div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Selected model content */}
                        {(() => {
                          const currentModelId = activeCouncilModel[msgId] || msg.modelProposals[0].modelId;
                          const model = msg.modelProposals.find(m => m.modelId === currentModelId) || msg.modelProposals[0];
                          return (
                            <div className="p-3 rounded-lg bg-white border border-cream-200 text-xs space-y-1.5">
                              <div className="flex items-center justify-between pb-1.5 border-b border-cream-200 text-[11px]">
                                <span className="font-bold text-slate-900">{model.modelName}</span>
                                <span className="text-[10px] text-cyan-800 font-mono bg-cyanlight-50 px-1.5 py-0.5 rounded">
                                  {model.source}
                                </span>
                              </div>
                              <div 
                                className="godfy-markdown text-slate-700 text-xs max-h-56 overflow-y-auto leading-relaxed pr-1"
                                dangerouslySetInnerHTML={{ __html: marked.parse(model.answer || '') }}
                              />
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Follow-up chips */}
              {!isUser && msg.suggestedFollowUps && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-full sm:max-w-[88%]">
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
          <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-cyanlight-300 shadow-sm animate-pulse max-w-md">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-300 flex-shrink-0">
              <Brain className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="text-xs font-mono text-cyan-900 truncate">
              {streamMessage || 'Calling friends & thinking...'}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Sticky Input Form */}
      <div className="p-3 bg-white/95 backdrop-blur-md border-t border-cream-200">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-cream-50 border-2 border-cream-200/90 focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyanlight-100/50 transition">
            
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Godfy anything (e.g. 'Make a landing page')..."
              disabled={isProcessing}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
            />

            <select
              value={mindPreset}
              onChange={(e) => setMindPreset(e.target.value)}
              disabled={isProcessing}
              className="hidden sm:inline-block bg-white text-slate-700 text-xs font-semibold py-1.5 px-2 rounded-xl border border-cream-300 focus:outline-none cursor-pointer"
            >
              {MIND_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  🧠 {p.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={isProcessing || !inputText.trim()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs flex items-center space-x-1 shadow-sm transition active:scale-[0.98] flex-shrink-0"
            >
              <span>{isProcessing ? 'Thinking...' : 'Send'}</span>
              <Send className="w-3.5 h-3.5 text-cyan-300" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1.5 px-1">
            <span>Godfy <strong>v1</strong> • Calls 5 AI Friends for ideas</span>
            <span>Colors: White Cream (#FAF7EE) • White • Cyan Light (#E0F7FA)</span>
          </div>
        </form>
      </div>

      {/* Interactive Live Sandbox Modal */}
      {previewModalArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-cream-300 shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
            <div className="p-3 border-b border-cream-200 bg-cream-50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 px-2 py-0.5 rounded-md bg-white border border-cream-200 text-xs font-mono font-bold text-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Godfy Live Preview</span>
                </div>

                <div className="hidden sm:flex items-center space-x-1 bg-white p-0.5 rounded-lg border border-cream-200">
                  <button
                    onClick={() => setPreviewViewport('desktop')}
                    className={`p-1 rounded text-xs flex items-center space-x-1 ${
                      previewViewport === 'desktop' ? 'bg-cream-200 font-bold' : 'text-slate-500'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewViewport('tablet')}
                    className={`p-1 rounded text-xs flex items-center space-x-1 ${
                      previewViewport === 'tablet' ? 'bg-cream-200 font-bold' : 'text-slate-500'
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span>Tablet</span>
                  </button>
                  <button
                    onClick={() => setPreviewViewport('mobile')}
                    className={`p-1 rounded text-xs flex items-center space-x-1 ${
                      previewViewport === 'mobile' ? 'bg-cream-200 font-bold' : 'text-slate-500'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setPreviewKey(k => k + 1)}
                  className="p-1.5 rounded-lg bg-white border border-cream-300 text-slate-600 hover:text-slate-900"
                  title="Reload"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    const w = window.open();
                    w?.document.write(previewModalArtifact);
                    w?.document.close();
                  }}
                  className="px-2 py-1 rounded-lg bg-cyanlight-100 hover:bg-cyanlight-200 border border-cyanlight-300 text-cyan-900 text-xs font-semibold flex items-center space-x-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New Tab</span>
                </button>

                <button
                  onClick={() => setPreviewModalArtifact(null)}
                  className="p-1.5 rounded-lg bg-white border border-cream-300 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-cream-100/60 p-2 sm:p-4 flex justify-center items-center overflow-auto">
              <div
                className={`transition-all duration-300 bg-white rounded-xl shadow-lg border border-cream-300 overflow-hidden h-full flex flex-col ${
                  previewViewport === 'mobile' ? 'w-[375px]' : previewViewport === 'tablet' ? 'w-[768px]' : 'w-full'
                }`}
              >
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
