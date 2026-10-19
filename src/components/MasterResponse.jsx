import React, { useState } from 'react';
import { Copy, Check, Download, Eye, Sparkles, Brain, CheckCircle, Code, Layers } from 'lucide-react';

export default function MasterResponse({ result, onSwitchToPreview }) {
  const [copied, setCopied] = useState(false);

  if (!result || !result.masterResponse) return null;

  const { masterResponse, consensusScore, previewCode } = result;

  const handleCopy = () => {
    if (masterResponse.codeSnippet) {
      navigator.clipboard.writeText(masterResponse.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([masterResponse.codeSnippet || ''], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = 'godfy-synthesized-landing-page.html';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Godfy Mind Synthesis Stamp */}
      <div className="bg-white rounded-2xl border border-cream-300/80 p-6 shadow-card-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cream-200">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-cyanlight-100 text-cyan-900 text-xs font-bold font-mono mb-2 border border-cyanlight-200">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>GODFY MIND SYNTHESIS • v1</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {masterResponse.title}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-mono">Consensus Match</div>
              <div className="text-lg font-extrabold text-slate-900 font-mono text-cyan-700">
                {masterResponse.consensusMetrics?.agreement || '97.4%'}
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cream-100 border border-cream-300 flex items-center justify-center font-bold text-slate-800 text-sm">
              5/5 AIs
            </div>
          </div>
        </div>

        {/* Synthesis Summary */}
        <p className="text-slate-700 text-base leading-relaxed mt-4">
          {masterResponse.summary}
        </p>

        {/* Godfy Mind Takeaway Callout */}
        <div className="mt-5 p-4 rounded-xl bg-cream-100/70 border border-cream-200 flex items-start space-x-3">
          <Brain className="w-5 h-5 text-cyan-700 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold text-slate-900">Godfy Mind Autonomous Judgment: </span>
            <span className="text-slate-700">{masterResponse.mindTakeaway}</span>
          </div>
        </div>

        {/* Feature & Contribution Breakdown */}
        {masterResponse.featuresProvided && (
          <div className="mt-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Synthesized Master Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {masterResponse.featuresProvided.map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs font-medium text-slate-700 bg-white p-2.5 rounded-lg border border-cream-200">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Code / Artifact Viewer */}
      {masterResponse.codeSnippet && (
        <div className="bg-white rounded-2xl border border-cream-300 shadow-card-subtle overflow-hidden">
          {/* Code Header Bar */}
          <div className="bg-cream-100/80 px-4 py-3 border-b border-cream-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold font-mono uppercase text-slate-700 px-2 py-0.5 rounded bg-white border border-cream-300">
                {masterResponse.codeLanguage || 'html'}
              </span>
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                Synthesized artifact ready for production
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {previewCode && (
                <button
                  onClick={onSwitchToPreview}
                  className="px-3 py-1.5 rounded-lg bg-cyanlight-100 hover:bg-cyanlight-200 text-cyan-900 border border-cyanlight-300 text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Interactive Live Preview</span>
                </button>
              )}

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-cream-100 text-slate-700 border border-cream-300 text-xs font-semibold flex items-center space-x-1.5 transition"
                title="Copy full code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-cream-100 text-slate-700 border border-cream-300 text-xs font-semibold flex items-center space-x-1.5 transition"
                title="Download HTML"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-4 bg-slate-950 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 max-h-[480px]">
            <pre>
              <code>{masterResponse.codeSnippet}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
