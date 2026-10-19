import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import QueryInput from './components/QueryInput.jsx';
import SynthesisPipeline from './components/SynthesisPipeline.jsx';
import MasterResponse from './components/MasterResponse.jsx';
import LivePreview from './components/LivePreview.jsx';
import AICouncilView from './components/AICouncilView.jsx';
import GodfyMindInspector from './components/GodfyMindInspector.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import { runGodfySynthesis } from './engine/godfyMind.js';
import { Sparkles, Eye, Bot, Brain, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('master'); // master | preview | council | mind
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageMessage, setStageMessage] = useState('');
  const [mindPreset, setMindPreset] = useState('balanced');
  const [result, setResult] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Run the default query on initial mount
  useEffect(() => {
    handleRunQuery('Make a landing page');
  }, []);

  const handleRunQuery = async (queryText) => {
    setIsProcessing(true);
    setProgress(5);
    setStageMessage('Godfy Fan-Out: Contacting 5 Free AI Models in parallel...');

    try {
      const res = await runGodfySynthesis({
        query: queryText,
        mindPreset,
        onProgress: ({ progress: p, currentAction }) => {
          setProgress(p);
          if (currentAction) setStageMessage(currentAction);
        }
      });
      setResult(res);
    } catch (err) {
      console.error('Godfy synthesis error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 text-slate-800 antialiased selection:bg-cyanlight-200 selection:text-cyan-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenSettings={() => setSettingsOpen(true)}
        currentMindPreset={mindPreset}
        isProcessing={isProcessing}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* Search & Prompt Box */}
        <QueryInput
          onSubmit={handleRunQuery}
          isProcessing={isProcessing}
          mindPreset={mindPreset}
          setMindPreset={setMindPreset}
        />

        {/* Live Multi-AI Fan-Out Pipeline */}
        <SynthesisPipeline
          progress={progress}
          stage={stageMessage}
          isProcessing={isProcessing}
          consensusMetrics={result?.masterResponse?.consensusMetrics}
        />

        {/* Perspective Navigation Tabs */}
        {result && (
          <div className="w-full max-w-4xl mx-auto mb-6">
            <div className="flex items-center space-x-1 sm:space-x-2 p-1.5 rounded-2xl bg-white border border-cream-200/90 shadow-sm overflow-x-auto">
              <button
                onClick={() => setActiveTab('master')}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition ${
                  activeTab === 'master'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-cream-100/80'
                }`}
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Godfy Master Output</span>
              </button>

              <button
                onClick={() => setActiveTab('preview')}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition relative ${
                  activeTab === 'preview'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-cream-100/80'
                }`}
              >
                <Eye className="w-4 h-4 text-cyan-300" />
                <span>Interactive Live Preview</span>
                {result?.previewCode && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse hidden sm:inline-block"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('council')}
                className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition ${
                  activeTab === 'council'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-cream-100/80'
                }`}
              >
                <Bot className="w-4 h-4 text-cyan-300" />
                <span>AI Council (5 Models)</span>
              </button>

              <button
                onClick={() => setActiveTab('mind')}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition ${
                  activeTab === 'mind'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-cream-100/80'
                }`}
              >
                <Brain className="w-4 h-4 text-cyan-300" />
                <span>Godfy Mind v1</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab Content Display */}
        <div className="w-full max-w-4xl mx-auto">
          {activeTab === 'master' && (
            <MasterResponse
              result={result}
              onSwitchToPreview={() => setActiveTab('preview')}
            />
          )}

          {activeTab === 'preview' && (
            <LivePreview previewCode={result?.previewCode} />
          )}

          {activeTab === 'council' && (
            <AICouncilView modelResponses={result?.modelResponses} />
          )}

          {activeTab === 'mind' && (
            <GodfyMindInspector
              reasoningLog={result?.reasoningLog}
              mindPreset={mindPreset}
              consensusScore={result?.consensusScore}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-cream-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-900 text-sm">Godfy</span>
            <span className="px-1.5 py-0.5 rounded bg-cream-100 text-slate-700 font-mono font-bold text-[10px] border border-cream-200">
              v1
            </span>
            <span>• The Multi-AI Autonomous Consensus Engine</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-600">Colors:</span>
            <span className="inline-flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FAF7EE] border border-cream-300 inline-block"></span>
              <span>White Cream</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFFFFF] border border-slate-300 inline-block"></span>
              <span>White</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E0F7FA] border border-cyan-300 inline-block"></span>
              <span>Cyan Light</span>
            </span>
          </div>

          <div>
            Updates sequence: <strong className="text-slate-800 font-mono">v1</strong>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        mindPreset={mindPreset}
        setMindPreset={setMindPreset}
      />
    </div>
  );
}
