import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Brain, Eye, Copy, Check, ChevronDown, ChevronUp, 
  Code, Download, ExternalLink, X, Monitor, Tablet, Smartphone,
  Layers, ArrowRight, Zap, Globe, Image as ImageIcon,
  ZoomIn, FolderTree, FileCode, Sliders, Loader2, Edit3, Trash2, Plus
} from 'lucide-react';
import { marked } from 'marked';
import { MIND_PRESETS } from '../engine/models.js';

marked.setOptions({
  gfm: true,
  breaks: true
});

function getSimpleStatus(streamMessage) {
  const msg = (streamMessage || '').toLowerCase();
  
  if (msg.includes('edit') || msg.includes('modify') || msg.includes('update') || msg.includes('patch')) {
    return {
      type: 'editing',
      label: 'Editing...',
      icon: <Edit3 className="w-3.5 h-3.5 text-[#e0af68] animate-bounce" />,
      dotColor: 'bg-[#e0af68]'
    };
  }
  if (msg.includes('remov') || msg.includes('delet') || msg.includes('clean') || msg.includes('drop')) {
    return {
      type: 'removing',
      label: 'Removing...',
      icon: <Trash2 className="w-3.5 h-3.5 text-[#f7768e] animate-pulse" />,
      dotColor: 'bg-[#f7768e]'
    };
  }
  if (msg.includes('creat') || msg.includes('build') || msg.includes('generat')) {
    return {
      type: 'creating',
      label: 'Creating...',
      icon: <Plus className="w-3.5 h-3.5 text-[#9ece6a] animate-pulse" />,
      dotColor: 'bg-[#9ece6a]'
    };
  }
  if (msg.includes('search') || msg.includes('crawl') || msg.includes('web') || msg.includes('image')) {
    return {
      type: 'searching',
      label: 'Searching...',
      icon: <Globe className="w-3.5 h-3.5 text-[#7dcfff] animate-spin" />,
      dotColor: 'bg-[#7dcfff]'
    };
  }
  if (msg.includes('synth')) {
    return {
      type: 'synthesizing',
      label: 'Synthesizing...',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#bb9af7] animate-pulse" />,
      dotColor: 'bg-[#bb9af7]'
    };
  }
  
  return {
    type: 'thinking',
    label: 'Thinking...',
    icon: <Loader2 className="w-3.5 h-3.5 text-[#7aa2f7] animate-spin" />,
    dotColor: 'bg-[#7aa2f7]'
  };
}

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
  onOpenProjectInEditor,
  currentProject,
  onUpdateProject
}) {
  const [inputText, setInputText] = useState('');
  const [expandedThinks, setExpandedThinks] = useState({});
  const [selectedImageModal, setSelectedImageModal] = useState(null);
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [previewModalArtifact, setPreviewModalArtifact] = useState(null);

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
    onSendMessage(msg, false, 'auto');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
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
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-6 py-2.5 sm:py-3 space-y-2.5">
        
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
              Autonomous 20-model consensus engine in Tokyo Night theme. Models coordinate across 4 cognitive lobes with mutual peer awareness to build complete projects with zero templates.
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
              {/* Header: Sender & Timestamp for Godfy */}
              {!isUser && (
                <div className="flex items-center space-x-1.5 mb-1 px-1 text-[11px] font-mono text-[#565f89]">
                  <div className="w-4 h-4 rounded overflow-hidden border border-[#292e42] bg-black flex-shrink-0">
                    <img src="/logo.png" alt="G" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-medium text-[#c0caf5]">Godfy</span>
                  <span>•</span>
                  <span className="text-[10px]">{msg.timestamp}</span>
                </div>
              )}

              {/* Message Content */}
              <div
                className={`transition-all ${
                  isUser
                    ? 'w-fit max-w-[85%] sm:max-w-[75%] bg-[#1f2335] border border-[#292e42] text-[#c0caf5] rounded-2xl px-3.5 py-2 ml-auto shadow-xs break-words'
                    : 'w-full bg-transparent border-0 shadow-none px-1 py-0.5 text-[#c0caf5]'
                }`}
              >
                {/* Clean Thought Indicator (Unboxed, Cursor-style line) */}
                {!isUser && msg.thinkTrace && (
                  <div className="mb-2 pb-1">
                    <button
                      onClick={() => setExpandedThinks(p => ({ ...p, [msgId]: !p[msgId] }))}
                      className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-[#565f89] hover:text-[#7dcfff] transition py-0.5 px-1.5 rounded hover:bg-[#1f2335]/50"
                    >
                      <Brain className="w-3.5 h-3.5 text-[#7aa2f7]" />
                      <span>Thought for {msg.cognitiveMeta?.durationMs ? `${(msg.cognitiveMeta.durationMs / 1000).toFixed(1)}s` : '1.2s'}</span>
                      {expandedThinks[msgId] ? (
                        <ChevronUp className="w-3 h-3 text-[#565f89]" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-[#565f89]" />
                      )}
                    </button>

                    {/* Collapsed Thought Trace */}
                    {expandedThinks[msgId] && (
                      <div className="mt-1.5 pl-3 border-l border-[#292e42] text-xs font-mono text-[#9aa5ce] space-y-1 animate-node-enter">
                        <div className="whitespace-pre-wrap text-[11px] text-[#565f89] leading-relaxed max-h-48 overflow-y-auto">
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
                  <div className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed font-normal">
                    {msg.text.trim()}
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

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => {
                            if (onUpdateProject) onUpdateProject(msg.projectData);
                            onOpenProjectInEditor && onOpenProjectInEditor(msg.projectData);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#7aa2f7] hover:bg-[#89b4fa] text-[#16161e] font-semibold text-xs flex items-center space-x-1.5 shadow-sm transition active:scale-95"
                        >
                          <FolderTree className="w-3.5 h-3.5" />
                          <span>Open Studio</span>
                        </button>
                      </div>
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

                    <pre className="p-3 text-xs text-[#c0caf5] font-mono overflow-x-auto leading-relaxed bg-[#16161e]">
                      <code>{msg.codeArtifact}</code>
                    </pre>
                  </div>
                )}

                {/* End of message bubble */}
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

        {/* Cursor-Style Status Indicator (Clean, Simple, Zero Box) */}
        {isProcessing && (() => {
          const status = getSimpleStatus(streamMessage);
          return (
            <div className="flex items-center space-x-2.5 py-1.5 px-1 text-xs sm:text-sm font-mono text-[#c0caf5] select-none animate-node-enter">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.dotColor} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${status.dotColor}`}></span>
              </span>
              <div className="flex items-center space-x-1.5">
                {status.icon}
                <span className="font-medium tracking-wide">
                  {status.label}
                </span>
              </div>
            </div>
          );
        })()}

        <div ref={messagesEndRef} />
      </div>

      {/* Sleek Cursor Input Card (Clean, Automatic Search, Zero Clutter) */}
      <div className="p-2 sm:p-3 bg-[#16161e]/95 backdrop-blur-xl border-t border-[#292e42] flex-shrink-0 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
        <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
          <div className="bg-[#1f2335] rounded-2xl border border-[#292e42] focus-within:border-[#7aa2f7] focus-within:ring-2 focus-within:ring-[#7aa2f7]/20 transition-all shadow-lg p-2 sm:p-2.5">
            {/* Input textarea */}
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Godfy anything... (Enter to send, Shift+Enter for new line)"
              disabled={isProcessing}
              rows={1}
              className="w-full bg-transparent px-2 py-1 text-xs sm:text-sm text-[#c0caf5] placeholder-[#565f89] focus:outline-none resize-none font-normal leading-relaxed max-h-32 min-h-[36px]"
            />

            {/* Bottom action bar inside the card */}
            <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-[#292e42]/60">
              {/* Left pills: Preset & Autonomous Search Status */}
              <div className="flex items-center space-x-2">
                <select
                  value={mindPreset}
                  onChange={(e) => setMindPreset(e.target.value)}
                  disabled={isProcessing}
                  className="bg-[#16161e] text-[#9aa5ce] hover:text-[#c0caf5] text-[11px] font-mono px-2 py-1 rounded-lg border border-[#292e42] focus:outline-none cursor-pointer"
                >
                  {MIND_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <div className="hidden sm:flex items-center space-x-1 text-[11px] font-mono text-[#565f89]">
                  <Globe className="w-3 h-3 text-[#7dcfff]" />
                  <span>Auto Web & Images</span>
                </div>
              </div>

              {/* Right: Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim() || isProcessing}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#7aa2f7] hover:bg-[#89b4fa] text-[#16161e] font-semibold text-xs flex items-center space-x-1.5 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm active:scale-95"
              >
                <span className="hidden sm:inline">Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Image Modal Preview */}
      {selectedImageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-3xl w-full bg-[#16161e] border border-[#292e42] rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-[#292e42] flex items-center justify-between">
              <span className="text-xs font-mono text-[#c0caf5] truncate max-w-[80%]">
                {selectedImageModal.image.title || 'Image Preview'}
              </span>
              <button
                onClick={() => setSelectedImageModal(null)}
                className="p-1 hover:bg-[#1f2335] rounded text-[#565f89] hover:text-[#c0caf5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[70vh] flex items-center justify-center p-2 bg-[#0f0f14]">
              <img
                src={selectedImageModal.image.url || selectedImageModal.image.thumbnail}
                alt={selectedImageModal.image.title}
                className="max-h-[65vh] max-w-full object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}

      {/* Standalone Artifact HTML Preview Modal */}
      {previewModalArtifact && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl h-[85vh] bg-[#16161e] border border-[#292e42] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-3 border-b border-[#292e42] flex items-center justify-between bg-[#1f2335]">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#c0caf5]">
                <Eye className="w-4 h-4 text-[#7dcfff]" />
                <span className="font-bold">Live Standalone Sandbox Preview</span>
              </div>
              <button
                onClick={() => setPreviewModalArtifact(null)}
                className="p-1 hover:bg-[#16161e] rounded text-[#565f89] hover:text-[#c0caf5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 bg-white">
              <iframe
                title="Preview"
                srcDoc={previewModalArtifact}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-modals allow-same-origin"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
