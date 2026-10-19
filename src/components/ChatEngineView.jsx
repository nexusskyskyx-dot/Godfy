import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Brain, Eye, Copy, Check, ChevronDown, ChevronUp, 
  Code, Download, ExternalLink, X, Monitor, Tablet, Smartphone,
  Layers, ArrowRight, Zap, Globe, Image as ImageIcon,
  ZoomIn, FolderTree, FileCode, Sliders, ChevronLeft, ChevronRight,
  MessageSquare
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

      return `<div class="code-block-wrapper my-2.5 rounded-xl overflow-hidden border border-slate-800 bg-[#090D16] shadow-sm">
        <div class="flex items-center justify-between px-3 py-1.5 bg-[#0F172A] border-b border-slate-800 text-[10px] font-mono">
          <span class="text-cyan-400 font-semibold tracking-wider">${displayLang}</span>
          <span class="text-slate-400">Godfy Synthesizer</span>
        </div>
        <pre class="p-3 text-xs text-slate-100 font-mono overflow-x-auto leading-relaxed"><code>${escaped}</code></pre>
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
  setMindPreset,
  onOpenProjectInEditor
}) {
  const [inputText, setInputText] = useState('');
  const [expandedThinks, setExpandedThinks] = useState({});
  const [expandedCouncils, setExpandedCouncils] = useState({});
  const [expandedWebSources, setExpandedWebSources] = useState({});
  const [forceWebSearch, setForceWebSearch] = useState(false);
  const [forceImageSearch, setForceImageSearch] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [copiedImageUrl, setCopiedImageUrl] = useState(null);
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [codeInspectorModal, setCodeInspectorModal] = useState(null);
  const [copiedInspectorCode, setCopiedInspectorCode] = useState(false);
  const [previewModalArtifact, setPreviewModalArtifact] = useState(null);
  const [previewViewport, setPreviewViewport] = useState('desktop');
  const [previewKey, setPreviewKey] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, streamMessage]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const msg = inputText.trim();
    setInputText('');
    onSendMessage(msg, forceWebSearch, forceImageSearch ? 'images' : 'auto');
  };

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleDownloadCode = (code, filename = 'source_code.txt') => {
    if (!code) return;
    try {
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download code file', e);
    }
  };

  const handleCopyImageUrl = (url) => {
    if (!url) return;
    navigator.clipboard?.writeText(url);
    setCopiedImageUrl(url);
    setTimeout(() => setCopiedImageUrl(null), 2000);
  };

  const starterCards = [
    {
      title: 'Make a full project',
      desc: 'Builds a complete multi-file app from scratch with folders and zero templates',
      prompt: 'Build a multi-file project for a modern coffee roastery'
    },
    {
      title: 'Landing page design',
      desc: 'Synthesizes clean semantic HTML & Tailwind in signature Cream & Cyan',
      prompt: 'Create a high-converting landing page for an organic matcha brand'
    },
    {
      title: 'Algorithmic code',
      desc: 'Zero-placeholder algorithms, data structures, and edge-case guards',
      prompt: 'Implement an LRU Cache in Python with clean doubly-linked list'
    },
    {
      title: 'Visual media search',
      desc: 'Searches the live web and retrieves verified high-resolution photography',
      prompt: 'Show images of the James Webb Space Telescope deep field'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] w-full max-w-4xl mx-auto overflow-hidden bg-cream-100">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2.5 sm:px-6 py-3 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Clean Empty Welcome State */}
        {messages.length === 0 && (
          <div className="max-w-xl mx-auto my-auto pt-6 pb-6 text-center px-2">
            <div className="relative inline-block mb-3 sm:mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyanlight-200 via-cyanlight-100 to-cream-100 border border-cyan-300 flex items-center justify-center shadow-sm mx-auto">
                <span className="font-extrabold text-slate-900 text-2xl font-display">G</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-white animate-pulse"></div>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display mb-1.5">
              Godfy Mind <span className="text-xs px-2 py-0.5 rounded-full bg-cyanlight-100 text-cyan-900 font-mono font-bold border border-cyanlight-200">v1</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6">
              Autonomous AI with its own brain. Consults free frontier models, deliberates through Tree-of-Thought, and builds whole projects from scratch.
            </p>

            {/* Quick Starter Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {starterCards.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(card.prompt)}
                  className="p-3 rounded-xl bg-white hover:bg-cream-50/80 border border-cream-200/90 hover:border-cyan-400 transition-all text-left group shadow-xs active:scale-[0.99]"
                >
                  <div className="font-bold text-xs text-slate-900 group-hover:text-cyan-700 transition flex items-center justify-between">
                    <span>{card.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition" />
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
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
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full animate-node-enter`}
            >
              {/* Header: Sender & Timestamp */}
              <div className="flex items-center space-x-1.5 mb-1 px-1 text-[11px] font-mono text-slate-500">
                {!isUser && (
                  <div className="w-4 h-4 rounded-md bg-slate-900 flex items-center justify-center text-[9px] font-extrabold text-cyan-300">
                    G
                  </div>
                )}
                <span className="font-bold text-slate-800">
                  {isUser ? 'You' : 'Godfy'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-400 text-[10px]">{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`w-full max-w-full sm:max-w-[90%] rounded-2xl p-3.5 sm:p-5 transition-all ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs ml-auto sm:w-auto sm:max-w-[80%]'
                    : 'bg-white border border-cream-200/90 text-slate-800 rounded-tl-xs shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                }`}
              >
                {/* Clean, Non-Crowded Thought Indicator (Discreet Drawer) */}
                {!isUser && msg.thinkTrace && (
                  <div className="mb-2.5 pb-2 border-b border-cream-100">
                    <button
                      onClick={() => setExpandedThinks(p => ({ ...p, [msgId]: !p[msgId] }))}
                      className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-slate-500 hover:text-cyan-800 transition py-0.5 px-2 rounded-lg hover:bg-cream-50"
                    >
                      <Brain className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Thought for {msg.cognitiveMeta?.durationMs ? `${(msg.cognitiveMeta.durationMs / 1000).toFixed(1)}s` : '1.2s'}</span>
                      <span className="text-slate-300">•</span>
                      <span>16 neurons</span>
                      <span className="text-slate-300">•</span>
                      <span>{msg.consensusScore || '98%'} consensus</span>
                      {expandedThinks[msgId] ? (
                        <ChevronUp className="w-3 h-3 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      )}
                    </button>

                    {/* Smooth Collapsed Thought Trace */}
                    {expandedThinks[msgId] && (
                      <div className="mt-2 p-3 rounded-xl bg-cream-50/80 border border-cream-200 text-xs font-mono text-slate-700 space-y-1.5 animate-node-enter">
                        <div className="text-[10px] uppercase font-bold text-cyan-900 tracking-wider">
                          Cognitive Deliberation Trace
                        </div>
                        <div className="whitespace-pre-wrap text-[11px] text-slate-600 leading-relaxed max-h-48 overflow-y-auto">
                          {msg.thinkTrace}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Verified Images Gallery (if present) */}
                {!isUser && msg.images && msg.images.length > 0 && (
                  <div className="mb-3 rounded-xl border border-cream-200 p-2.5 bg-cream-50/50">
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-cream-200 text-xs font-bold text-slate-800">
                      <div className="flex items-center space-x-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Images ({msg.images.length})</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">Tap to expand</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {msg.images.map((img, idx) => (
                        <button
                          key={img.id || idx}
                          type="button"
                          onClick={() => setSelectedImageModal({ image: img, allImages: msg.images, index: idx })}
                          className="aspect-4/3 rounded-lg overflow-hidden bg-slate-100 border border-cream-200 hover:border-cyan-400 relative group transition"
                        >
                          <img
                            src={img.thumbnail || img.url}
                            alt={img.title || 'Image'}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                              e.target.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(img.title || 'photo')}?width=400&height=300&nologo=true`;
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Message Text */}
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

                {/* Multi-File Project Studio Card (Simple & Elegant) */}
                {!isUser && msg.projectData && (
                  <div className="mt-3.5 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0A1A2F] text-white p-3 sm:p-4 border border-cyan-800/60 shadow-sm">
                    <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-800/80">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-300 flex-shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-100 truncate">{msg.projectData.name}</h4>
                          <p className="text-[10px] text-cyan-300 font-mono">
                            {msg.projectData.nodes.filter(n => n.type === 'file').length} files • {msg.projectData.nodes.filter(n => n.type === 'folder' && n.id !== 'root').length} carpets (folders)
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenProjectInEditor && onOpenProjectInEditor(msg.projectData)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-sm transition active:scale-95"
                      >
                        <FolderTree className="w-3.5 h-3.5" />
                        <span>Open Studio</span>
                      </button>
                    </div>

                    {/* Compact File Pills */}
                    <div className="mt-2.5 flex flex-wrap gap-1 text-[10px] font-mono">
                      {msg.projectData.nodes.filter(n => n.type === 'file').slice(0, 4).map(file => (
                        <span key={file.id} className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-300 border border-slate-800 truncate max-w-[140px]">
                          {file.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Artifact Card (Clean & Compact) */}
                {!isUser && msg.codeArtifact && !msg.projectData && (
                  <div className="mt-3 rounded-xl bg-slate-950 text-white border border-slate-800 overflow-hidden">
                    <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                        <Code className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-semibold truncate max-w-[140px] sm:max-w-none">
                          {msg.codeFileName || `solution.${msg.codeLanguage || 'js'}`}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {msg.codeLanguage === 'html' && (
                          <button
                            onClick={() => setPreviewModalArtifact(msg.codeArtifact)}
                            className="px-2 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-[11px] flex items-center space-x-1 transition active:scale-95"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleCopy(msg.codeArtifact, msgId)}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center space-x-1 transition active:scale-95 border border-slate-700"
                        >
                          {copiedCodeId === msgId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                          <span>{copiedCodeId === msgId ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Minimalist AI Friends Council Link (Optional inspection) */}
                {!isUser && msg.modelProposals && msg.modelProposals.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-cream-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <button
                      onClick={() => setExpandedCouncils(p => ({ ...p, [msgId]: !p[msgId] }))}
                      className="hover:text-cyan-800 transition flex items-center space-x-1"
                    >
                      <span>5 AI friends consulted</span>
                      <ChevronDown className={`w-3 h-3 transition ${expandedCouncils[msgId] ? 'rotate-180' : ''}`} />
                    </button>
                    <span>Autonomous arbitrated</span>
                  </div>
                )}

                {/* Collapsed Model Council Grid */}
                {!isUser && expandedCouncils[msgId] && msg.modelProposals && (
                  <div className="mt-2 space-y-1.5 animate-node-enter">
                    {msg.modelProposals.map((m, i) => (
                      <div key={i} className="p-2 rounded-lg bg-cream-50 border border-cream-200 text-[11px]">
                        <div className="font-bold text-slate-900 mb-0.5">{m.modelName} ({m.source})</div>
                        <div className="text-slate-600 line-clamp-2">{m.answer}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Minimal Follow-Up Chips */}
              {!isUser && msg.suggestedFollowUps && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-full sm:max-w-[90%]">
                  {msg.suggestedFollowUps.map((promptText, i) => (
                    <button
                      key={i}
                      onClick={() => onSendMessage(promptText)}
                      disabled={isProcessing}
                      className="px-2.5 py-1 rounded-full bg-white hover:bg-cream-50 border border-cream-300 text-slate-700 text-[11px] font-medium transition hover:border-cyan-400 flex items-center space-x-1 shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-600" />
                      <span>{promptText}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Live Autonomous Cognitive Pipeline Animation */}
        {isProcessing && (
          <div className="flex flex-col space-y-2 p-3.5 sm:p-4 rounded-2xl bg-white border border-cyan-300 shadow-[0_4px_20px_rgba(34,211,238,0.12)] max-w-lg overflow-hidden relative animate-node-enter">
            <div className="flex items-center space-x-3 relative z-10">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-cyan-300 shadow-sm animate-neural-pulse">
                  <Brain className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <div className="flex items-center space-x-1.5 text-[10px] font-mono text-cyan-800 font-bold uppercase tracking-wider">
                  <span>Godfy Brain Cortex</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-cyan-600">Tree-of-Thought</span>
                </div>
                <div className="text-xs font-mono text-slate-800 font-semibold truncate mt-0.5">
                  {streamMessage || 'Arbitrating 5 free AI friends & formulating plan...'}
                </div>
              </div>
            </div>

            {/* Neural progress indicators */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 relative z-10 text-[10px] font-mono">
              <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-cyanlight-50 border border-cyanlight-200 text-cyan-900 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                <span className="truncate">1. Friends</span>
              </div>
              <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-cyanlight-50 border border-cyanlight-200 text-cyan-900 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                <span className="truncate">2. Deliberates</span>
              </div>
              <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-cyanlight-50 border border-cyanlight-200 text-cyan-900 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                <span className="truncate">3. Synthesizes</span>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-100/30 to-transparent animate-shimmer pointer-events-none"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Ultra-Clean Modern Floating Input Form */}
      <div className="p-2 sm:p-3 bg-white/95 backdrop-blur-md border-t border-cream-200 flex-shrink-0">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          {/* Quick tool pills row */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mb-1 px-1">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setForceWebSearch(v => !v)}
                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono transition border ${
                  forceWebSearch 
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold' 
                    : 'bg-cream-100 hover:bg-cream-200 text-slate-600 border-cream-300'
                }`}
                title="Force live web search"
              >
                <Globe className={`w-3 h-3 ${forceWebSearch ? 'text-slate-950' : 'text-cyan-600'}`} />
                <span>Web: {forceWebSearch ? 'ON' : 'Auto'}</span>
              </button>

              <button
                type="button"
                onClick={() => setForceImageSearch(v => !v)}
                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono transition border ${
                  forceImageSearch 
                    ? 'bg-cyan-600 text-white border-cyan-500 font-bold' 
                    : 'bg-cream-100 hover:bg-cream-200 text-slate-600 border-cream-300'
                }`}
                title="Force image search"
              >
                <ImageIcon className={`w-3 h-3 ${forceImageSearch ? 'text-white' : 'text-cyan-600'}`} />
                <span>Images: {forceImageSearch ? 'ON' : 'Auto'}</span>
              </button>
            </div>

            <select
              value={mindPreset}
              onChange={(e) => setMindPreset(e.target.value)}
              disabled={isProcessing}
              className="bg-transparent text-slate-600 text-[10px] font-mono focus:outline-none cursor-pointer"
            >
              {MIND_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clean Input Capsule */}
          <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-cream-50 border-2 border-cream-200 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyanlight-200 transition">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Godfy to make a project, code, or answer..."
              disabled={isProcessing}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium min-w-0"
            />

            <button
              type="submit"
              disabled={isProcessing || !inputText.trim()}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white flex items-center justify-center shadow-sm transition active:scale-95 flex-shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4 text-cyan-300" />
            </button>
          </div>
        </form>
      </div>

      {/* Live Preview Modal */}
      {previewModalArtifact && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col p-2 sm:p-6 animate-node-enter">
          <div className="bg-white rounded-2xl overflow-hidden flex flex-col flex-1 shadow-2xl border border-slate-700">
            <div className="h-12 bg-cream-50 border-b border-cream-200 px-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-800">
                <Eye className="w-4 h-4 text-cyan-600" />
                <span>Live Preview Sandbox</span>
              </div>
              <button
                onClick={() => setPreviewModalArtifact(null)}
                className="p-1 rounded-lg text-slate-500 hover:bg-cream-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <iframe
              key={previewKey}
              srcDoc={previewModalArtifact}
              title="Preview"
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {selectedImageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col p-2 sm:p-6 animate-node-enter">
          <div className="flex justify-end p-2">
            <button
              onClick={() => setSelectedImageModal(null)}
              className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-hidden p-2">
            <img
              src={selectedImageModal.image.url}
              alt={selectedImageModal.image.title}
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
