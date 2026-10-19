import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, Brain, Bot, Eye, Copy, Check, ChevronDown, ChevronUp, 
  RotateCcw, SplitSquareVertical, ArrowRight, CornerDownLeft, Layers, Code
} from 'lucide-react';
import LivePreview from './LivePreview.jsx';

export default function EngineChat({
  messages,
  onSendMessage,
  isProcessing,
  currentArtifact,
  onSwitchToPreview
}) {
  const [inputText, setInputText] = useState('');
  const [expandedThinks, setExpandedThinks] = useState({});
  const [splitPreview, setSplitPreview] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const msg = inputText.trim();
    setInputText('');
    onSendMessage(msg);
  };

  const toggleThink = (id) => {
    setExpandedThinks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={`w-full max-w-7xl mx-auto flex flex-col ${splitPreview ? 'lg:flex-row gap-6' : ''}`}>
      {/* Left Chat Column */}
      <div className={`flex-1 flex flex-col bg-white rounded-2xl border border-cream-300 shadow-card-subtle overflow-hidden ${splitPreview ? 'lg:w-1/2' : 'w-full max-w-4xl mx-auto'}`} style={{ height: '780px' }}>
        
        {/* Chat Header */}
        <div className="p-4 border-b border-cream-200 bg-cream-50/70 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                <Brain className="w-4 h-4 text-cyan-300" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-sm text-slate-900">Chat with Godfy Mind</h3>
                <span className="px-1.5 py-0.5 rounded bg-cyanlight-100 text-cyan-900 text-[10px] font-mono font-bold border border-cyanlight-200">
                  v1
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">Consensus of 5 Free AIs on demand</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Split Screen Toggle (Desktop only) */}
            <button
              onClick={() => setSplitPreview(!splitPreview)}
              className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                splitPreview
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-cream-300 hover:border-cyan-400'
              }`}
              title="Toggle Live Landing Page Split Screen"
            >
              <SplitSquareVertical className="w-3.5 h-3.5 text-cyan-400" />
              <span>{splitPreview ? 'Close Split' : 'Split View'}</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-cream-50/30">
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id || index}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                {/* Header info */}
                <div className="flex items-center space-x-2 mb-1 px-1">
                  <span className="text-[10px] font-mono text-slate-400">{msg.timestamp}</span>
                  <span className="text-xs font-bold text-slate-800">
                    {isUser ? 'You' : 'Godfy Engine v1'}
                  </span>
                </div>

                {/* Bubble Container */}
                <div
                  className={`max-w-[90%] sm:max-w-[82%] rounded-2xl p-4 sm:p-5 shadow-sm text-sm ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white border border-cream-300 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {/* Expandable Reasoning / Think Trace (Godfy only) */}
                  {!isUser && msg.thinkTrace && (
                    <div className="mb-3 border-b border-cream-200 pb-2.5">
                      <button
                        onClick={() => toggleThink(msg.id || index)}
                        className="flex items-center justify-between w-full text-xs font-mono font-medium text-cyan-800 bg-cyanlight-50 hover:bg-cyanlight-100 p-2 rounded-lg border border-cyanlight-200 transition"
                      >
                        <div className="flex items-center space-x-1.5">
                          <Brain className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Godfy Mind Consensus Monologue</span>
                        </div>
                        {expandedThinks[msg.id || index] ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {expandedThinks[msg.id || index] && (
                        <div className="mt-2 p-3 bg-cream-100/70 rounded-lg text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed border border-cream-200">
                          {msg.thinkTrace}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                    {msg.text}
                  </div>

                  {/* Artifact Notification Card */}
                  {!isUser && msg.updatedArtifact && (
                    <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-cream-100 to-cyanlight-50 border border-cyanlight-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">Landing Page Artifact Updated</div>
                          <div className="text-[11px] text-slate-500 font-mono">Synthesized with 5 Free AIs</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={onSwitchToPreview}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center space-x-1 hover:bg-slate-800 transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-300" />
                          <span>View Live</span>
                        </button>
                        <button
                          onClick={() => handleCopyCode(msg.updatedArtifact, index)}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-cream-300 text-slate-700 text-xs font-semibold flex items-center space-x-1 hover:bg-cream-50 transition"
                        >
                          {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggested follow-up prompt chips */}
                {!isUser && msg.suggestedPrompts && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[90%]">
                    {msg.suggestedPrompts.map((promptText, i) => (
                      <button
                        key={i}
                        onClick={() => onSendMessage(promptText)}
                        disabled={isProcessing}
                        className="px-2.5 py-1 rounded-full bg-white hover:bg-cream-100 border border-cream-300 text-slate-700 text-[11px] font-medium transition hover:border-cyan-400 flex items-center space-x-1"
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

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-start space-x-2">
              <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white flex-shrink-0">
                <Brain className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              </div>
              <div className="bg-white border border-cream-300 p-3.5 rounded-2xl rounded-tl-none shadow-sm text-xs font-mono text-cyan-800 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
                <span>Godfy Mind is polling 5 Free AIs & synthesizing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-cream-200 bg-white">
          <div className="flex items-center space-x-2 bg-cream-50 rounded-2xl border-2 border-cream-200 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyanlight-100 p-1.5 transition">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tell Godfy to update sections, change copy, or build components..."
              disabled={isProcessing}
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              disabled={isProcessing || !inputText.trim()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm active:scale-[0.98] flex-shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5 text-cyan-300" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-2 px-1">
            <span>Updates like: <strong>v1</strong></span>
            <span>Main: White cream • Secondary: White • 2nd: Cyan light</span>
          </div>
        </form>
      </div>

      {/* Right Column: Split Screen Live Preview (when active) */}
      {splitPreview && (
        <div className="hidden lg:block lg:w-1/2">
          <LivePreview previewCode={currentArtifact} />
        </div>
      )}
    </div>
  );
}
