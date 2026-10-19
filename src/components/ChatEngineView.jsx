import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Brain, Users, Eye, Copy, Check, ChevronDown, ChevronUp, 
  RotateCcw, Code, Download, ExternalLink, X, Monitor, Tablet, Smartphone,
  Layers, ArrowRight, Zap, CheckCircle2, Globe, Bot, Image as ImageIcon,
  ZoomIn, Search, ChevronLeft, ChevronRight, FolderTree, FileCode
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
  const [activeCouncilModel, setActiveCouncilModel] = useState({});
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [codeInspectorModal, setCodeInspectorModal] = useState(null);
  const [copiedInspectorCode, setCopiedInspectorCode] = useState(false);
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

  const handleNextImage = (e) => {
    e?.stopPropagation();
    if (!selectedImageModal?.allImages || selectedImageModal.allImages.length <= 1) return;
    const nextIndex = (selectedImageModal.index + 1) % selectedImageModal.allImages.length;
    setSelectedImageModal({
      image: selectedImageModal.allImages[nextIndex],
      allImages: selectedImageModal.allImages,
      index: nextIndex
    });
  };

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    if (!selectedImageModal?.allImages || selectedImageModal.allImages.length <= 1) return;
    const prevIndex = (selectedImageModal.index - 1 + selectedImageModal.allImages.length) % selectedImageModal.allImages.length;
    setSelectedImageModal({
      image: selectedImageModal.allImages[prevIndex],
      allImages: selectedImageModal.allImages,
      index: prevIndex
    });
  };

  const starterCards = [
    {
      title: 'Implement an LRU Cache in Python',
      desc: 'Zero placeholders: clean O(1) double-linked list + hash map with test assertions.',
      icon: '⚡'
    },
    {
      title: 'Make a landing page',
      desc: 'Calls his friends for layout, style, and copy, then synthesizes a live previewable page.',
      icon: '🚀'
    },
    {
      title: 'Show images of James Webb Telescope',
      desc: 'Live visual search for high-resolution deep space photography and verified captures.',
      icon: '🌌'
    },
    {
      title: 'What is the best AI model in 2026?',
      desc: 'Cross-model consensus on DeepSeek-R1, Claude 3.7, and the latest frontier landscape.',
      icon: '🧠'
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] max-w-4xl w-full mx-auto relative">
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
            <div className="p-4 rounded-2xl bg-white border border-cream-300 shadow-card-subtle text-left max-w-lg mx-auto mb-6 text-xs sm:text-sm">
              <div className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Brain className="w-4 h-4 text-cyan-600" />
                  <span>Godfy 16-Neuron Cognitive Cortex:</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyanlight-100 text-cyan-900 text-[10px] font-mono font-bold border border-cyanlight-200">
                  IQ 185-195
                </span>
              </div>
              <ul className="space-y-1.5 text-slate-600 font-medium pl-1">
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-600 font-bold">1.</span>
                  <span><strong>Calls 16 Frontier Neurons</strong> across 4 specialized lobes (Reasoning, Code AST, Red-Teaming, Synthesis)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-600 font-bold">2.</span>
                  <span><strong>Tree-of-Thought (ToT) Deliberation</strong>: Explores branching hypotheses & adversarial red-team counter-arguments</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-600 font-bold">3.</span>
                  <span><strong>Produces master-grade synthesis</strong> with mathematical proofs, formal Big-O bounds, and zero placeholders</span>
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
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyanlight-50 text-cyan-900 text-[11px] font-mono font-bold border border-cyanlight-200">
                        <Brain className="w-3 h-3 text-cyan-600" />
                        <span>16-Neuron Cortex</span>
                      </div>

                      <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyanlight-100 text-cyan-950 text-[10px] font-mono font-bold border border-cyan-300">
                        <Zap className="w-2.5 h-2.5 text-cyan-700" />
                        <span>IQ {msg.iqScore || 185}</span>
                      </div>

                      {msg.searchedWeb && (
                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-mono font-bold border border-emerald-200 shadow-2xs">
                          <Globe className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                          <span>Live Web Search</span>
                        </div>
                      )}

                      {msg.searchedImages && msg.images && msg.images.length > 0 && (
                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-900 text-[10px] font-mono font-bold border border-cyan-200 shadow-2xs">
                          <ImageIcon className="w-2.5 h-2.5 text-cyan-600" />
                          <span>{msg.images.length} Images Found</span>
                        </div>
                      )}

                      {msg.newlyLearned && msg.newlyLearned.length > 0 && (
                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 text-[10px] font-mono font-bold border border-purple-200">
                          <Brain className="w-2.5 h-2.5 text-purple-600" />
                          <span>Memory Saved: {msg.newlyLearned[0]}</span>
                        </div>
                      )}

                      {!msg.newlyLearned && msg.hasMemory && (
                        <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyanlight-50 text-cyan-900 text-[10px] font-mono border border-cyanlight-200">
                          <Brain className="w-2.5 h-2.5 text-cyan-600" />
                          <span>Memory Active</span>
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-slate-400">
                      Consensus: {msg.consensusScore || '98%'}
                    </div>
                  </div>
                )}

                {/* Advanced Cognitive Deliberation & Thought Trace */}
                {!isUser && msg.thinkTrace && (
                  <div className="mb-3">
                    <button
                      onClick={() => setExpandedThinks(p => ({ ...p, [msgId]: !p[msgId] }))}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-cream-100/80 hover:bg-cream-100 border border-cream-200/90 text-xs font-mono text-slate-700 transition"
                    >
                      <div className="flex items-center space-x-2 truncate pr-2">
                        <div className="w-5 h-5 rounded-md bg-cyanlight-200/70 border border-cyanlight-300 flex items-center justify-center text-cyan-900 flex-shrink-0">
                          <Brain className="w-3 h-3 text-cyan-700" />
                        </div>
                        <span className="font-bold text-slate-900 text-[11px] truncate">
                          Tree-of-Thought & Adversarial Audit (IQ {msg.iqScore || 185})
                        </span>
                        {msg.cognitiveMeta?.intentType && (
                          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono bg-white border border-cream-200 text-slate-600 truncate max-w-[140px]">
                            {msg.cognitiveMeta.intentType}
                          </span>
                        )}
                        {msg.cognitiveMeta?.durationMs && (
                          <span className="hidden sm:inline-block text-[9px] font-mono text-cyan-800">
                            {msg.cognitiveMeta.durationMs}ms
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5 text-slate-500 text-[10px] flex-shrink-0">
                        <span className="hidden xs:inline">{expandedThinks[msgId] ? 'Hide' : 'Inspect Trace'}</span>
                        {expandedThinks[msgId] ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                        )}
                      </div>
                    </button>

                    {/* Activated tool chips summary under button */}
                    {!expandedThinks[msgId] && msg.cognitiveMeta?.activatedTools && msg.cognitiveMeta.activatedTools.length > 0 && (
                      <div className="mt-1 px-2 flex items-center space-x-1.5 overflow-x-auto text-[9px] font-mono text-slate-500">
                        <span className="text-cyan-800 font-semibold flex-shrink-0">Capabilities:</span>
                        {msg.cognitiveMeta.activatedTools.map((tool, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded bg-white border border-cream-200 text-slate-700 flex-shrink-0">
                            ✓ {tool}
                          </span>
                        ))}
                      </div>
                    )}

                    {expandedThinks[msgId] && (
                      <div className="mt-2 p-3.5 rounded-xl bg-cream-50 border border-cream-200 shadow-sm animate-fade-in">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-cream-200 text-[10px] font-mono text-cyan-900 font-semibold">
                          <div className="flex items-center space-x-1.5">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            <span className="uppercase tracking-wider">Autonomous Cognitive Pipeline</span>
                          </div>
                          {msg.cognitiveMeta?.durationMs && (
                            <span className="text-slate-500 font-normal">
                              Evaluated across 10 Neural Pathways in {msg.cognitiveMeta.durationMs}ms
                            </span>
                          )}
                        </div>

                        {/* Active Tools Matrix Chips */}
                        {msg.cognitiveMeta?.activatedTools && msg.cognitiveMeta.activatedTools.length > 0 && (
                          <div className="mb-3 p-2 rounded-lg bg-white border border-cream-200 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                            <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px]">Autonomous Orchestration:</span>
                            {msg.cognitiveMeta.activatedTools.map((tool, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-cyanlight-50 border border-cyanlight-200 text-cyan-950 font-medium">
                                ⚡ {tool}
                              </span>
                            ))}
                          </div>
                        )}

                        <div 
                          className="godfy-markdown text-xs text-slate-700 leading-relaxed font-sans"
                          dangerouslySetInnerHTML={{ __html: marked.parse(msg.thinkTrace || '') }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Expandable Live Web Sources Drawer */}
                {!isUser && msg.webSources && msg.webSources.length > 0 && (
                  <div className="mb-3">
                    <button
                      onClick={() => setExpandedWebSources(p => ({ ...p, [msgId]: !p[msgId] }))}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-50/70 hover:bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-900 transition"
                    >
                      <div className="flex items-center space-x-1.5">
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold text-emerald-950 text-[11px]">
                          Live Web Sources ({msg.webSources.length} consulted)
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-700 text-[10px]">
                        <span>{expandedWebSources[msgId] ? 'Hide' : 'Inspect'}</span>
                        {expandedWebSources[msgId] ? (
                          <ChevronUp className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-emerald-600" />
                        )}
                      </div>
                    </button>

                    {expandedWebSources[msgId] && (
                      <div className="mt-2 p-3 rounded-xl bg-white border border-emerald-200 space-y-2 shadow-sm">
                        <div className="text-[10px] uppercase font-mono font-bold text-emerald-800 tracking-wider pb-1 border-b border-cream-200 flex items-center justify-between">
                          <span>Verified Live Web Citations</span>
                          <span className="text-slate-400">Current</span>
                        </div>
                        <div className="space-y-1.5">
                          {msg.webSources.map((source, idx) => {
                            let domain = '';
                            try {
                              domain = source.url ? new URL(source.url).hostname.replace('www.', '') : '';
                            } catch {}

                            return (
                              <a
                                key={idx}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-2 rounded-lg bg-cream-50 hover:bg-cream-100 border border-cream-200 transition group text-left"
                              >
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-900 group-hover:text-cyan-800">
                                  <span className="truncate max-w-[85%]">{source.title}</span>
                                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-cyan-600 shrink-0" />
                                </div>
                                <div className="flex items-center space-x-1.5 text-[10px] text-emerald-700 font-mono mt-0.5">
                                  {domain && (
                                    <img
                                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
                                      alt=""
                                      className="w-3 h-3 rounded-xs inline-block"
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  )}
                                  <span>{source.source}</span>
                                  {domain && <span className="text-slate-400">• {domain}</span>}
                                </div>
                                <div className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                                  {source.snippet}
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Interactive Visual Media & Images Gallery */}
                {!isUser && msg.images && msg.images.length > 0 && (
                  <div className="mb-3.5 rounded-xl border border-cyan-200/90 bg-white/95 p-3 overflow-hidden shadow-xs">
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-cream-200">
                      <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs">
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Verified Visual Media ({msg.images.length} images)</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-800 bg-cyanlight-50 px-2 py-0.5 rounded-full border border-cyanlight-200">
                        Click to view full-res
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {msg.images.map((img, idx) => (
                        <button
                          key={img.id || idx}
                          type="button"
                          onClick={() => setSelectedImageModal({ image: img, allImages: msg.images, index: idx })}
                          className="group relative flex flex-col rounded-lg overflow-hidden bg-cream-50 border border-cream-200 hover:border-cyan-400 hover:shadow-md transition text-left cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                        >
                          <div className="aspect-4/3 w-full overflow-hidden bg-slate-100 relative">
                            <img
                              src={img.thumbnail || img.url}
                              alt={img.title || 'Live Search Image'}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              onError={(e) => {
                                e.target.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(img.title || 'photo')}?width=400&height=300&nologo=true`;
                              }}
                            />
                            <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/25 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <span className="p-1.5 rounded-full bg-white/95 text-slate-900 shadow-sm">
                                <ZoomIn className="w-3.5 h-3.5" />
                              </span>
                            </div>
                            <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-xs">
                              {img.source || 'Web'}
                            </span>
                          </div>
                          <div className="p-1.5 bg-white border-t border-cream-100">
                            <div className="text-[10px] font-medium text-slate-800 truncate" title={img.title}>
                              {img.title || 'Visual Asset'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
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

                {/* Multi-File Project Studio Card (Zero Templates) */}
                {!isUser && msg.projectData && (
                  <div className="mt-4 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0C1B2A] text-white border border-cyan-800/60 shadow-lg p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-600/60 flex items-center justify-center text-cyan-300">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-sm text-slate-100">{msg.projectData.name}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 text-[10px] font-mono border border-cyan-700/60 font-semibold">
                              Multi-File Project
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {msg.projectData.nodes.filter(n => n.type === 'file').length} files across {msg.projectData.nodes.filter(n => n.type === 'folder' && n.id !== 'root').length} carpets (folders) • Zero templates
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onOpenProjectInEditor && onOpenProjectInEditor(msg.projectData)}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-sm transition active:scale-95"
                        >
                          <FolderTree className="w-3.5 h-3.5" />
                          <span>Open in Project Editor</span>
                        </button>
                      </div>
                    </div>

                    {/* Folder & File Tree Preview */}
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      {msg.projectData.nodes.filter(n => n.type === 'file').slice(0, 4).map(file => (
                        <div key={file.id} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center space-x-2">
                          <FileCode className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                          <span className="truncate text-slate-300 text-[11px]">{file.path}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code & Landing Page Artifact Card */}
                {!isUser && msg.codeArtifact && (
                  <div className="mt-4 rounded-xl bg-slate-950 text-white border border-slate-800 shadow-md overflow-hidden">
                    {/* Header bar */}
                    <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2 text-xs font-mono">
                        <div className="p-1 rounded-md bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
                          <Code className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-slate-200">
                          {msg.codeFileName || (msg.codeLanguage === 'html' ? 'landing_page.html' : `solution.${msg.codeLanguage || 'js'}`)}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 border border-slate-700 font-semibold uppercase">
                          {msg.codeLanguage || 'CODE'}
                        </span>
                      </div>

                      {/* Complexity badges if present */}
                      {msg.codeComplexity && (
                        <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-mono">
                          <span className="px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700 text-cyan-300">
                            ⏱️ {msg.codeComplexity.time}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800/90 border border-slate-700 text-slate-300">
                            💾 {msg.codeComplexity.space}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => {
                            if (msg.projectData && onOpenProjectInEditor) {
                              onOpenProjectInEditor(msg.projectData);
                            } else if (onOpenProjectInEditor) {
                              onOpenProjectInEditor();
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-bold text-xs flex items-center space-x-1 transition shadow-sm active:scale-95"
                          title="Open in Project Studio"
                        >
                          <FolderTree className="w-3.5 h-3.5" />
                          <span>Editor</span>
                        </button>

                        {msg.codeLanguage === 'html' && (
                          <button
                            onClick={() => setPreviewModalArtifact(msg.codeArtifact)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center space-x-1 transition shadow-sm active:scale-95"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                        )}

                        <button
                          onClick={() => setCodeInspectorModal({
                            code: msg.codeArtifact,
                            language: msg.codeLanguage,
                            fileName: msg.codeFileName || `solution.${msg.codeLanguage || 'js'}`,
                            complexity: msg.codeComplexity,
                            edgeCases: msg.codeEdgeCases
                          })}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1 transition active:scale-95 border border-slate-700"
                          title="Inspect code, line numbers & assertions"
                        >
                          <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Inspect</span>
                        </button>

                        <button
                          onClick={() => handleDownloadCode(msg.codeArtifact, msg.codeFileName || (msg.codeLanguage === 'html' ? 'landing_page.html' : `solution.${msg.codeLanguage || 'js'}`))}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1 transition active:scale-95 border border-slate-700"
                          title="Download file"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-300" />
                          <span className="hidden sm:inline">Save</span>
                        </button>

                        <button
                          onClick={() => handleCopy(msg.codeArtifact, msgId)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center space-x-1 transition active:scale-95 border border-slate-700"
                        >
                          {copiedCodeId === msgId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                          <span>{copiedCodeId === msgId ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Edge case chips if available */}
                    {msg.codeEdgeCases && msg.codeEdgeCases.length > 0 && (
                      <div className="px-3 py-1.5 bg-slate-950 text-[10px] text-slate-400 font-mono flex items-center space-x-2 border-t border-slate-900 overflow-x-auto">
                        <span className="text-slate-500 font-semibold uppercase tracking-wider flex-shrink-0">Guards:</span>
                        {msg.codeEdgeCases.map((ec, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 flex-shrink-0">
                            ✓ {ec}
                          </span>
                        ))}
                      </div>
                    )}
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
                        <span className="font-bold text-[11px]">Inspect {msg.modelProposals?.length || 16} Frontier Neurons (4 Lobes)</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500 text-[10px]">
                        <span>{expandedCouncils[msgId] ? 'Hide' : 'Inspect'}</span>
                        {expandedCouncils[msgId] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </div>
                    </button>

                    {expandedCouncils[msgId] && (
                      <div className="mt-2.5 p-3 rounded-xl bg-cream-50/90 border border-cream-200 space-y-2.5">
                        {/* Model selector buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-1.5">
                          {msg.modelProposals.map((m) => {
                            const isSelected = (activeCouncilModel[msgId] || msg.modelProposals[0].modelId) === m.modelId;
                            return (
                              <button
                                key={m.modelId}
                                onClick={() => setActiveCouncilModel(p => ({ ...p, [msgId]: m.modelId }))}
                                className={`p-1.5 rounded-lg text-left text-xs transition border ${
                                  isSelected
                                    ? 'bg-white border-cyan-400 font-bold text-slate-900 shadow-sm ring-1 ring-cyan-200'
                                    : 'bg-white/60 border-cream-200 text-slate-600 hover:bg-white'
                                }`}
                              >
                                <div className="text-[9px] text-cyan-700 font-mono truncate">{m.badge || m.source}</div>
                                <div className="truncate font-semibold text-[11px]">{m.modelName}</div>
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

        {/* Live Autonomous Cognitive Pipeline Bar (Clean & Animated) */}
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
                <span className="truncate">1. Calls Friends</span>
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

            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-100/30 to-transparent animate-shimmer pointer-events-none"></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Sticky Input Form */}
      <div className="p-2.5 sm:p-3 bg-white/95 backdrop-blur-md border-t border-cream-200">
        <form onSubmit={handleSubmit} className="relative">
          {/* Web & Image Search Control Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mb-1.5 px-1 flex-wrap gap-1">
            <div className="flex items-center space-x-1.5 flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setForceWebSearch(v => !v)}
                className={`inline-flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-mono transition border ${
                  forceWebSearch 
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm' 
                    : 'bg-white hover:bg-cream-100 text-slate-700 border-cream-300'
                }`}
                title="Godfy decides autonomously when to search, or toggle ON to force live web search for every query"
              >
                <Globe className={`w-3 h-3 ${forceWebSearch ? 'text-slate-950 animate-pulse' : 'text-cyan-600'}`} />
                <span className="hidden sm:inline">{forceWebSearch ? 'Live Web: ON' : 'Live Web: Auto'}</span>
                <span className="sm:hidden">{forceWebSearch ? 'Web: ON' : 'Web: Auto'}</span>
              </button>

              <button
                type="button"
                onClick={() => setForceImageSearch(v => !v)}
                className={`inline-flex items-center space-x-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-mono transition border ${
                  forceImageSearch 
                    ? 'bg-cyan-600 text-white border-cyan-500 font-bold shadow-sm' 
                    : 'bg-white hover:bg-cream-100 text-slate-700 border-cream-300'
                }`}
                title="Force Godfy to search and return verified images & photography"
              >
                <ImageIcon className={`w-3 h-3 ${forceImageSearch ? 'text-white animate-pulse' : 'text-cyan-600'}`} />
                <span className="hidden sm:inline">{forceImageSearch ? 'Images: ON' : 'Images: Auto'}</span>
                <span className="sm:hidden">{forceImageSearch ? 'Images: ON' : 'Images: Auto'}</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-[10px] text-slate-400">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active 16-Neuron Engine</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-cream-50 border-2 border-cream-200/90 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyanlight-200 transition">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Godfy anything (e.g. 'Make a landing page')..."
              disabled={isProcessing}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium min-w-0"
            />

            <select
              value={mindPreset}
              onChange={(e) => setMindPreset(e.target.value)}
              disabled={isProcessing}
              className="hidden sm:inline-block bg-white text-slate-700 text-xs font-semibold py-1.5 px-2 rounded-xl border border-cream-300 focus:outline-none cursor-pointer flex-shrink-0"
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
              className="px-3 sm:px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm transition active:scale-[0.98] flex-shrink-0"
            >
              <span className="hidden xs:inline">{isProcessing ? 'Thinking...' : 'Send'}</span>
              <Send className="w-3.5 h-3.5 text-cyan-300" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1.5 px-1">
            <span>Godfy <strong>v1</strong> • Calls 10 Free AI Friends (Neural Mesh)</span>
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

      {/* Full-Screen Image Lightbox Modal */}
      {selectedImageModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImageModal(null)}
        >
          <div 
            className="bg-white rounded-2xl border border-cream-200 shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3 border-b border-cream-200 bg-cream-50 flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate max-w-[75%]">
                <ImageIcon className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                  {selectedImageModal.image?.title || 'Visual Media Asset'}
                </span>
                {selectedImageModal.allImages?.length > 1 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyanlight-100 text-cyan-900 font-bold flex-shrink-0">
                    {selectedImageModal.index + 1} / {selectedImageModal.allImages.length}
                  </span>
                )}
              </div>

              <button
                onClick={() => setSelectedImageModal(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-cream-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Image Container */}
            <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[460px] p-2">
              <img
                src={selectedImageModal.image?.url || selectedImageModal.image?.thumbnail}
                alt={selectedImageModal.image?.title || 'High resolution image'}
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-lg"
              />

              {/* Previous / Next buttons */}
              {selectedImageModal.allImages?.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition backdrop-blur-xs cursor-pointer shadow-md"
                    title="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition backdrop-blur-xs cursor-pointer shadow-md"
                    title="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3 bg-white border-t border-cream-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2 text-[11px] text-slate-600 font-mono">
                <span className="px-2 py-0.5 rounded bg-cream-100 text-slate-800 font-semibold border border-cream-200">
                  {selectedImageModal.image?.source || 'Verified Source'}
                </span>
                {selectedImageModal.image?.author && (
                  <span className="truncate max-w-[200px]">By {selectedImageModal.image.author}</span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyImageUrl(selectedImageModal.image?.url || selectedImageModal.image?.thumbnail)}
                  className="px-3 py-1.5 rounded-lg bg-cream-100 hover:bg-cream-200 text-slate-800 text-[11px] font-medium flex items-center space-x-1.5 transition border border-cream-300"
                >
                  {copiedImageUrl === (selectedImageModal.image?.url || selectedImageModal.image?.thumbnail) ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={selectedImageModal.image?.url || selectedImageModal.image?.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-medium flex items-center space-x-1.5 transition shadow-xs"
                >
                  <span>Open Original</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Inspector & Assertions Modal */}
      {codeInspectorModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setCodeInspectorModal(null)}
        >
          <div 
            className="bg-[#0B0F19] border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3 border-b border-slate-800 bg-[#0F172A] flex items-center justify-between">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
                  <Code className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div className="font-mono font-bold text-xs sm:text-sm text-slate-100 truncate">
                    {codeInspectorModal.fileName || 'source_code'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {codeInspectorModal.language?.toUpperCase() || 'CODE'} • {codeInspectorModal.code ? codeInspectorModal.code.split('\n').length : 0} lines
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadCode(codeInspectorModal.code, codeInspectorModal.fileName || 'code.txt')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium flex items-center space-x-1.5 transition border border-slate-700 active:scale-95"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codeInspectorModal.code);
                    setCopiedInspectorCode(true);
                    setTimeout(() => setCopiedInspectorCode(false), 2000);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium flex items-center space-x-1.5 transition border border-slate-700 active:scale-95"
                >
                  {copiedInspectorCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                  <span>{copiedInspectorCode ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => setCodeInspectorModal(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Complexity & Guard Info Bar */}
            {(codeInspectorModal.complexity || (codeInspectorModal.edgeCases && codeInspectorModal.edgeCases.length > 0)) && (
              <div className="px-4 py-2 bg-[#090D16] border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                {codeInspectorModal.complexity && (
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-[11px]">Complexity:</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[11px]">
                      ⏱️ {codeInspectorModal.complexity.time}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                      💾 {codeInspectorModal.complexity.space}
                    </span>
                  </div>
                )}
                {codeInspectorModal.edgeCases && (
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                    <span className="text-emerald-400 font-bold">✓ Tests & Guards:</span>
                    <span className="text-slate-300">{codeInspectorModal.edgeCases.join(', ')}</span>
                  </div>
                )}
              </div>
            )}

            {/* Code Body with Line Numbers */}
            <div className="flex-1 overflow-auto p-4 bg-[#06080F] font-mono text-xs sm:text-sm leading-relaxed">
              <div className="flex select-text">
                {/* Line numbers */}
                <div className="select-none pr-4 text-right text-slate-600 font-mono text-xs border-r border-slate-800/80">
                  {(codeInspectorModal.code || '').split('\n').map((_, idx) => (
                    <div key={idx} className="leading-6">{idx + 1}</div>
                  ))}
                </div>
                {/* Code content */}
                <pre className="pl-4 text-slate-100 overflow-x-auto flex-1 font-mono text-xs leading-6">
                  <code>{codeInspectorModal.code}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
