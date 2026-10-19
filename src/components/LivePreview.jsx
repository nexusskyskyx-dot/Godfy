import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, RotateCcw, ExternalLink, Maximize2, Shield } from 'lucide-react';

export default function LivePreview({ previewCode }) {
  const [viewport, setViewport] = useState('desktop'); // desktop | tablet | mobile
  const [iframeKey, setIframeKey] = useState(0);

  if (!previewCode) {
    return (
      <div className="bg-white rounded-2xl border border-cream-300 p-12 text-center">
        <p className="text-slate-500 text-sm">No live preview artifact generated for this query.</p>
      </div>
    );
  }

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      default:
        return 'w-full';
    }
  };

  const handleOpenNewWindow = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(previewCode);
      newWindow.document.close();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-cream-300 shadow-card-subtle overflow-hidden">
      {/* Control bar */}
      <div className="bg-cream-100/90 px-4 py-3 border-b border-cream-200 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Status & Viewport dimensions */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-white border border-cream-200 text-xs font-mono font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Live Sandbox: Godfy v1</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1 bg-white p-1 rounded-lg border border-cream-200">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-md text-xs flex items-center space-x-1 transition ${
                viewport === 'desktop' ? 'bg-cream-200/70 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Desktop View (Full width)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[11px]">Desktop</span>
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-md text-xs flex items-center space-x-1 transition ${
                viewport === 'tablet' ? 'bg-cream-200/70 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="text-[11px]">Tablet</span>
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-md text-xs flex items-center space-x-1 transition ${
                viewport === 'mobile' ? 'bg-cream-200/70 text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="text-[11px]">Mobile</span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIframeKey((k) => k + 1)}
            className="p-1.5 rounded-lg bg-white hover:bg-cream-50 border border-cream-300 text-slate-600 hover:text-slate-900 text-xs flex items-center space-x-1 transition"
            title="Reload sandbox preview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={handleOpenNewWindow}
            className="px-2.5 py-1.5 rounded-lg bg-cyanlight-100 hover:bg-cyanlight-200 border border-cyanlight-300 text-cyan-900 text-xs font-semibold flex items-center space-x-1 transition"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Tab</span>
          </button>
        </div>
      </div>

      {/* Frame wrapper */}
      <div className="p-4 sm:p-6 bg-cream-50/50 flex justify-center min-h-[640px] overflow-x-auto">
        <div
          className={`${getViewportWidth()} transition-all duration-300 bg-white rounded-xl shadow-md border border-cream-200 overflow-hidden flex flex-col`}
          style={{ height: '700px' }}
        >
          {/* Simulated Browser Address Bar */}
          <div className="bg-cream-100 px-3 py-2 border-b border-cream-200 flex items-center space-x-2">
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
            </div>
            <div className="flex-1 bg-white rounded px-2.5 py-0.5 text-[11px] font-mono text-slate-500 border border-cream-200 truncate">
              https://godfy-preview.local/landing-page
            </div>
          </div>

          <iframe
            key={iframeKey}
            title="Godfy Interactive Preview"
            srcDoc={previewCode}
            sandbox="allow-scripts allow-modals"
            className="w-full flex-1 border-0 bg-white"
          />
        </div>
      </div>
    </div>
  );
}
