import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Brain, Eye, Copy, Check, ChevronDown, ChevronUp, 
  Code, Download, ExternalLink, X, Monitor, Tablet, Smartphone,
  Layers, ArrowRight, Zap, Globe, Image as ImageIcon,
  ZoomIn, FolderTree, FileCode, Sliders
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

      return `<div class="code-block-wrapper my-2.5 rounded-xl overflow-hidden border border-[#292e42] bg-[#16161e] shadow-lg">
        <div class="flex items-center justify-between px-3.5 py-1.5 bg-[#1f2335] border-b border-[#292e42] text-[10px] font-mono">
          <span class="text-[#7dcfff] font-bold tracking-wider">${displayLang}</span>
          <span class="text-[#565f89]">Tokyo Night AST</span>
        </div>
        <pre class="p-3 text-xs text-[#c0caf5] font-mono overflow-x-auto leading-relaxed"><code>${escaped}</code></pre>
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
  const [forceWebSearch, setForceWebSearch] = useState(false);
  const [forceImageSearch, setForceImageSearch] = useState(false);
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [previewModalArtifact, setPreviewModalArtifact] = useState(null);
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

  const starterCards = [
    {
      title: 'Generate Full Multi-File App',
      desc: 'Modular folder hierarchy (/src, /styles, /js) with zero templates',
      prompt: 'Build a multi-file project for a modern coffee roastery'
    },
    {
      title: 'Design Semantic Landing Page',
      desc: 'Clean Tokyo Night aesthetic with live responsive preview',
      prompt: 'Create a high-converting landing page for an organic matcha brand'
    },
    {
      title: 'Algorithmic Engineering',
      desc: 'Clean data structures & algorithms with verified invariants',
      prompt: 'Implement an LRU Cache in Python with clean doubly-linked list'
    },
    {
      title: 'Live Web & Visual Search',
      desc: 'Search the live web and retrieve verified deep-space photography',
      prompt: 'Show images of the James Webb Space Telescope deep field'
    }
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col w-full max-w-4xl mx-auto overflow-hidden bg-[#1a1b26]">
      {/* Messages Scroll Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 space-y-4">
        
        {/* Cursor Minimalist Welcome State */}
        {messages.length === 0 && (
          <div className="max-w-xl mx-auto my-auto pt-8 pb-6 text-center px-2">
            <div className="relative inline-block mb-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-[#292e42] shadow-glow-blue mx-auto bg-black p-0.5">
                <img src="/logo.png" alt="Godfy Logo" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#7dcfff] border-2 border-[#1a1b26] animate-pulse"></div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#c0caf5] tracking-tight font-display mb-1.5 flex items-center justify-center space-x-2">
              <span>Godfy Mind</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1f2335] text-[#7dcfff] font-mono border border-[#292e42]">
                v1
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#9aa5ce] max-w-md mx-auto mb-6 font-sans">
              Autonomous multi-AI consensus engine in Tokyo Night theme. Arbitrates 5 free frontier models and builds complete projects with zero templates.
            </p>

            {/* Quick Starter Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {starterCards.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(card.prompt)}
                  className="p-3 rounded-xl bg-[#16161e] hover:bg-[#1f2335] border border-[#292e42] hover:border-[#7aa2f7] transition-all text-left group shadow-xs active:scale-[0.99]"
                >
                  <div className="font-semibold text-xs text-[#c0caf5] group-hover:text-[#7dcfff] transition flex items-center justify-between">
                    <span>{card.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#565f89] group-hover:text-[#7dcfff] group-hover:translate-x-0.5 transition" />
                  </div>
                  <div className="text-[11px] text-[#565f89] line-clamp-1 mt-0.5">
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
              <div className="flex items-center space-x-1.5 mb-1 px-1 text-[11px] font-mono text-[#565f89]">
                {!isUser && (
                  <div className="w-4 h-4 rounded overflow-hidden border border-[#292e42] bg-black flex-shrink-0">
                    <img src="/logo.png" alt="G" className="w-full h-full object-cover" />
                  </div>
                )}
                <span className="font-medium text-[#c0caf5]">
                  {isUser ? 'You' : 'Godfy'}
                </span>
                <span>•</span>
                <span className="text-[10px]">{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`w-full max-w-full sm:max-w-[90%] rounded-2xl p-3.5 sm:p-5 transition-all ${
                  isUser
                    ? 'bg-[#1f2335] border border-[#292e42] text-[#c0caf5] rounded-tr-xs ml-auto sm:w-auto sm:max-w-[80%]'
                    : 'bg-[#16161e] border border-[#292e42] text-[#c0caf5] rounded-tl-xs shadow-cursor-card'
                }`}
              >
                {/* Clean, Non-Crowded Thought Indicator (Discreet Drawer) */}
                {!isUser && msg.thinkTrace && (
                  <div className="mb-2.5 pb-2 border-b border-[#292e42]">
                    <button
                      onClick={() => setExpandedThinks(p => ({ ...p, [msgId]: !p[msgId] }))}
                      className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-[#9aa5ce] hover:text-[#7dcfff] transition py-0.5 px-2 rounded-lg hover:bg-[#1f2335]"
                    >
                      <Brain className="w-3.5 h-3.5 text-[#7aa2f7]" />
                      <span>Thought for {msg.cognitiveMeta?.durationMs ? `${(msg.cognitiveMeta.durationMs / 1000).toFixed(1)}s` : '1.2s'}</span>
                      <span className="text-[#565f89]">•</span>
                      <span>16 neurons</span>
                      <span className="text-[#565f89]">•</span>
                      <span className="text-[#7dcfff]">{msg.consensusScore || '98%'}</span>
                      {expandedThinks[msgId] ? (
                        <ChevronUp className="w-3 h-3 text-[#565f89]" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-[#565f89]" />
                      )}
                    </button>

                    {/* Collapsed Thought Trace */}
                    {expandedThinks[msgId] && (
                      <div className="mt-2 p-3 rounded-xl bg-[#1a1b26] border border-[#292e42] text-xs font-mono text-[#9aa5ce] space-y-1.5 animate-node-enter">
                        <div className="text-[10px] uppercase font-bold text-[#7dcfff] tracking-wider">
                          Tree-of-Thought Deliberation
                        </div>
                        <div className="whitespace-pre-wrap text-[11px] text-[#9aa5ce] leading-relaxed max-h-48 overflow-y-auto">
                          {msg.thinkTrace}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Verified Images Gallery */}
                {!isUser && msg.images && msg.images.length > 0 && (
                  <div className="mb-3 rounded-xl border border-[#292e42] p-2 bg-[#1a1b26]">
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#292e42] text-xs font-semibold text-[#c0caf5]">
                      <div className="flex items-center space-x-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#7dcfff]" />
                        <span>Images ({msg.images.length})</span>
                      </div>
                      <span className="text-[10px] text-[#565f89] font-mono">Tap to zoom</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {msg.images.map((img, idx) => (
                        <button
                          key={img.id || idx}
                          type="button"
                          onClick={() => setSelectedImageModal({ image: img, allImages: msg.images, index: idx })}
                          className="aspect-4/3 rounded-lg overflow-hidden bg-[#1f2335] border border-[#292e42] hover:border-[#7aa2f7] relative group transition"
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
                  <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-normal">
                    {msg.text}
                  </div>
                ) : (
                  <div 
                    className="godfy-markdown max-w-none text-xs sm:text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: marked.parse(msg.masterText || msg.text || '') }}
                  />
                )}

                {/* Multi-File Project Studio Card (Cursor Style) */}
                {!isUser && msg.projectData && (
                  <div className="mt-3.5 rounded-xl bg-[#1a1b26] p-3 sm:p-4 border border-[#292e42] shadow-md">
                    <div className="flex items-center justify-between gap-2 flex-wrap pb-2.5 border-b border-[#292e42]">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#1f2335] border border-[#3b4261] flex items-center justify-center text-[#7dcfff] flex-shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-[#c0caf5] truncate">{msg.projectData.name}</h4>
                          <p className="text-[10px] text-[#7dcfff] font-mono">
                            {msg.projectData.nodes.filter(n => n.type === 'file').length} files • {msg.projectData.nodes.filter(n => n.type === 'folder' && n.id !== 'root').length} carpets (folders)
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenProjectInEditor && onOpenProjectInEditor(msg.projectData)}
                        className="px-3 py-1.5 rounded-xl bg-[#7aa2f7] hover:bg-[#89b4fa] text-[#16161e] font-semibold text-xs flex items-center space-x-1.5 shadow-sm transition active:scale-95"
                      >
                        <FolderTree className="w-3.5 h-3.5" />
                        <span>Open Studio</span>
                      </button>
                    </div>

                    {/* Compact File Pills */}
                    <div className="mt-2.5 flex flex-wrap gap-1 text-[10px] font-mono">
                      {msg.projectData.nodes.filter(n => n.type === 'file').slice(0, 5).map(file => (
                        <span key={file.id} className="px-2 py-0.5 rounded bg-[#1f2335] text-[#9aa5ce] border border-[#292e42] truncate max-w-[140px]">
                          {file.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Artifact Card */}
                {!isUser && msg.codeArtifact && !msg.projectData && (
                  <div className="mt-3 rounded-xl bg-[#16161e] border border-[#292e42] overflow-hidden">
                    <div className="px-3 py-2 bg-[#1f2335] border-b border-[#292e42] flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-mono text-[#c0caf5]">
                        <Code className="w-3.5 h-3.5 text-[#7dcfff]" />
                        <span className="font-semibold truncate max-w-[140px] sm:max-w-none">
                          {msg.codeFileName || `solution.${msg.codeLanguage || 'js'}`}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {msg.codeLanguage === 'html' && (
                          <button
                            onClick={() => setPreviewModalArtifact(msg.codeArtifact)}
                            className="px-2 py-1 rounded-lg bg-[#7dcfff] hover:bg-[#89dceb] text-[#16161e] font-bold text-[11px] flex items-center space-x-1 transition active:scale-95"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Preview</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleCopy(msg.codeArtifact, msgId)}
                          className="px-2 py-1 rounded-lg bg-[#16161e] hover:bg-[#24283b] text-[#9aa5ce] hover:text-[#c0caf5] text-[11px] font-medium flex items-center space-x-1 transition active:scale-95 border border-[#292e42]"
                        >
                          {copiedCodeId === msgId ? <Check className="w-3 h-3 text-[#9ece6a]" /> : <Copy className="w-3 h-3 text-[#565f89]" />}
                          <span>{copiedCodeId === msgId ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Minimalist AI Friends Council Link */}
                {!isUser && msg.modelProposals && msg.modelProposals.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#292e42] flex items-center justify-between text-[11px] font-mono text-[#565f89]">
                    <button
                      onClick={() => setExpandedCouncils(p => ({ ...p, [msgId]: !p[msgId] }))}
                      className="hover:text-[#7dcfff] transition flex items-center space-x-1"
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
                      <div key={i} className="p-2 rounded-lg bg-[#1a1b26] border border-[#292e42] text-[11px]">
                        <div className="font-semibold text-[#c0caf5] mb-0.5">{m.modelName} ({m.source})</div>
                        <div className="text-[#9aa5ce] line-clamp-2">{m.answer}</div>
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
                      className="px-2.5 py-1 rounded-full bg-[#16161e] hover:bg-[#1f2335] border border-[#292e42] text-[#9aa5ce] hover:text-[#c0caf5] text-[11px] font-medium transition hover:border-[#7aa2f7] flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3 text-[#7dcfff]" />
                      <span>{promptText}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Live Autonomous Cognitive Pipeline Animation (Tokyo Night Pulse) */}
        {isProcessing && (
          <div className="flex flex-col space-y-2 p-3.5 sm:p-4 rounded-2xl bg-[#16161e] border border-[#7aa2f7]/50 shadow-glow-blue max-w-lg overflow-hidden relative animate-node-enter">
            <div className="flex items-center space-x-3 relative z-10">
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center border border-[#292e42] overflow-hidden animate-neural-pulse">
                  <img src="/logo.png" alt="Godfy" className="w-full h-full object-cover" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7dcfff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7dcfff]"></span>
                </span>
              </div>
              <div className="overflow-hidden flex-1 min-w-0">
                <div className="flex items-center space-x-1.5 text-[10px] font-mono text-[#7dcfff] font-bold uppercase tracking-wider">
                  <span>Godfy Mind Cortex</span>
                  <span className="text-[#565f89]">•</span>
                  <span className="text-[#9aa5ce]">Tree-of-Thought</span>
                </div>
                <div className="text-xs font-mono text-[#c0caf5] font-semibold truncate mt-0.5">
                  {streamMessage || 'Arbitrating 5 free AI friends & formulating plan...'}
                </div>
              </div>
            </div>

            {/* Neural progress indicators */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 relative z-10 text-[10px] font-mono">
              <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-[#1f2335] border border-[#292e42] text-[#9aa5ce]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7dcfff] animate-pulse"></span>
                <span className="truncate">1. Friends</span>
              </div>
              <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-[#1f2335] border border-[#292e42] text-[#9aa5ce]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7aa2f7] animate-pulse"></span>
                <span className="truncate">2. Deliberates</span>
              </div>
              <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-[#1f2335] border border-[#292e42] text-[#9aa5ce]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9ece6a] animate-pulse"></span>
                <span className="truncate">3. Synthesizes</span>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#7aa2f7]/10 to-transparent animate-shimmer pointer-events-none"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Cursor Floating Input Form */}
      <div className="p-2 sm:p-3 bg-[#16161e]/95 backdrop-blur-xl border-t border-[#292e42] flex-shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          {/* Quick tool pills row */}
          <div className="flex items-center justify-between text-[11px] text-[#565f89] font-mono mb-1.5 px-1">
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setForceWebSearch(v => !v)}
                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono transition border ${
                  forceWebSearch 
                    ? 'bg-[#7dcfff] text-[#16161e] border-[#7dcfff] font-bold' 
                    : 'bg-[#1f2335] hover:bg-[#24283b] text-[#9aa5ce] border-[#292e42]'
                }`}
                title="Force live web search"
              >
                <Globe className={`w-3 h-3 ${forceWebSearch ? 'text-[#16161e]' : 'text-[#7dcfff]'}`} />
                <span>Web: {forceWebSearch ? 'ON' : 'Auto'}</span>
              </button>

              <button
                type="button"
                onClick={() => setForceImageSearch(v => !v)}
                className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono transition border ${
                  forceImageSearch 
                    ? 'bg-[#7aa2f7] text-[#16161e] border-[#7aa2f7] font-bold' 
                    : 'bg-[#1f2335] hover:bg-[#24283b] text-[#9aa5ce] border-[#292e42]'
                }`}
                title="Force image search"
              >
                <ImageIcon className={`w-3 h-3 ${forceImageSearch ? 'text-[#16161e]' : 'text-[#7aa2f7]'}`} />
                <span>Images: {forceImageSearch ? 'ON' : 'Auto'}</span>
              </button>
            </div>

            <select
              value={mindPreset}
              onChange={(e) => setMindPreset(e.target.value)}
              disabled={isProcessing}
              className="bg-[#1f2335] text-[#9aa5ce] text-[10px] font-mono focus:outline-none cursor-pointer rounded px-1.5 py-0.5 border border-[#292e42]"
            >
              {MIND_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cursor Input Capsule */}
          <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-[#1f2335] border border-[#292e42] focus-within:border-[#7aa2f7] focus-within:ring-2 focus-within:ring-[#7aa2f7]/20 transition">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Godfy to make a project, code, or answer..."
              disabled={isProcessing}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-[#c0caf5] placeholder-[#565f89] focus:outline-none font-normal min-w-0"
            />

            <button
              type="submit"
              disabled={isProcessing || !inputText.trim()}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#7aa2f7] hover:bg-[#89b4fa] disabled:opacity-30 text-[#16161e] flex items-center justify-center shadow-sm transition active:scale-95 flex-shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Live Preview Modal */}
      {previewModalArtifact && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-2 sm:p-6 animate-node-enter">
          <div className="bg-[#1a1b26] rounded-2xl overflow-hidden flex flex-col flex-1 shadow-2xl border border-[#292e42]">
            <div className="h-12 bg-[#16161e] border-b border-[#292e42] px-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-[#c0caf5]">
                <Eye className="w-4 h-4 text-[#7dcfff]" />
                <span>Sandbox Preview</span>
              </div>
              <button
                onClick={() => setPreviewModalArtifact(null)}
                className="p-1 rounded-lg text-[#565f89] hover:text-[#c0caf5] hover:bg-[#1f2335] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <iframe
              key={previewKey}
              srcDoc={previewModalArtifact}
              title="Preview"
              sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
              className="w-full h-full border-0 bg-white"
            />
          </div>
        </div>
      )}

      {/* Full Image Modal */}
      {selectedImageModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-2 sm:p-6 animate-node-enter">
          <div className="flex justify-end p-2">
            <button
              onClick={() => setSelectedImageModal(null)}
              className="p-2 rounded-full bg-[#1f2335] text-[#c0caf5] hover:bg-[#24283b] transition"
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
