import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import QueryInput from './components/QueryInput.jsx';
import SynthesisPipeline from './components/SynthesisPipeline.jsx';
import MasterResponse from './components/MasterResponse.jsx';
import LivePreview from './components/LivePreview.jsx';
import AICouncilView from './components/AICouncilView.jsx';
import GodfyMindInspector from './components/GodfyMindInspector.jsx';
import EngineChat from './components/EngineChat.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import { runGodfySynthesis, chatWithGodfy } from './engine/godfyMind.js';
import { generateLandingPageCode } from './engine/templates.js';
import { Sparkles, Eye, Bot, Brain } from 'lucide-react';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('chat'); // 'chat' | 'studio'
  const [activeTab, setActiveTab] = useState('master'); // 'master' | 'preview' | 'council' | 'mind'
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageMessage, setStageMessage] = useState('');
  const [mindPreset, setMindPreset] = useState('balanced');
  const [result, setResult] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activePrompt, setActivePrompt] = useState('Make a landing page');

  // Conversation stream for Mind Chat
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'godfy',
      text: `Greetings. I am **Godfy** (Engine v1) — an AI engine with its own autonomous mind. 

When you ask me a question, I send it simultaneously to 5 Free open-weight models (Llama 3.3, DeepSeek R1, Mistral 24B, Qwen 2.5, Gemma 2), arbitrate the trade-offs, and synthesize the ultimate master deliverable.

Try asking: **"Make a landing page"** or request any component refinement!`,
      thinkTrace: `Godfy Mind v1 initialized. 5 Free open-weight AI nodes verified and listening. 
Theme configuration: Main White Cream (#FAF7EE), Secondary White (#FFFFFF), 2nd Secondary Cyan Light (#E0F7FA).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        'Make a landing page',
        'Add a testimonials section',
        'How does Godfy synthesize 5 AIs?',
        'Show color specification'
      ]
    }
  ]);

  // Initial synthesis on mount
  useEffect(() => {
    handleRunQuery('Make a landing page', false);
  }, []);

  const handleRunQuery = async (queryText, switchViewToStudio = true) => {
    setActivePrompt(queryText);
    setIsProcessing(true);
    setProgress(10);
    setStageMessage('Godfy Fan-Out: Contacting 5 Free AI Models in parallel...');

    if (switchViewToStudio) {
      setActiveView('studio');
    }

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

      // Also append to chat history
      setMessages((prev) => [
        ...prev,
        {
          id: `usr-${Date.now()}`,
          sender: 'user',
          text: queryText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: `godfy-${Date.now()}`,
          sender: 'godfy',
          text: `I have synthesized your request: **"${queryText}"** across the 5 Free AI nodes.

- **Consensus Rating:** ${res.masterResponse.consensusMetrics?.agreement || '97.4%'}
- **Godfy Mind Decision:** ${res.masterResponse.mindTakeaway}

The unified artifact is ready! You can interact with it live or inspect the council proposals.`,
          thinkTrace: `Godfy Cognitive Trace for "${queryText}":
- Broadcasted query simultaneously to 5 Free models.
- Resolved 4 syntactic divergences.
- Standardized onto White Cream (#FAF7EE) and Cyan Light (#E0F7FA) design tokens.
- Emitted full production bundle.`,
          updatedArtifact: res.previewCode,
          suggestedPrompts: [
            'Add a testimonials section',
            'Add a pricing calculator',
            'Show me the 5 Free AI proposals'
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('Godfy synthesis error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChatSend = async (userText) => {
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      const botResponse = await chatWithGodfy({
        message: userText,
        history: messages,
        currentArtifact: result?.previewCode,
        mindPreset
      });

      if (botResponse.updatedArtifact) {
        setResult((prev) => ({
          ...prev,
          previewCode: botResponse.updatedArtifact
        }));
      }

      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewSession = () => {
    setActivePrompt('Make a landing page');
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'godfy',
        text: 'New session started. Godfy Mind is clear and ready. What shall we synthesize together?',
        thinkTrace: 'Memory buffers reset. 5 Free AI nodes online.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: [
          'Make a landing page',
          'Build a SaaS pricing calculator',
          'Create an AI agent orchestrator'
        ]
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-cream-100 text-slate-800 antialiased selection:bg-cyanlight-200 selection:text-cyan-900 font-sans flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
        onNewSession={handleNewSession}
        onSelectPrompt={(prompt) => handleRunQuery(prompt, true)}
        onOpenSettings={() => setSettingsOpen(true)}
        activePrompt={activePrompt}
      />

      {/* Main Content Area (shifted on desktop when sidebar is present) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 sm:lg:pl-80 transition-all duration-300">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSettings={() => setSettingsOpen(true)}
          currentMindPreset={mindPreset}
          isProcessing={isProcessing}
          activeView={activeView}
          setActiveView={setActiveView}
        />

        {/* Main Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
          {activeView === 'chat' ? (
            /* Part for Chatting with the Engine */
            <EngineChat
              messages={messages}
              onSendMessage={handleChatSend}
              isProcessing={isProcessing}
              currentArtifact={result?.previewCode}
              onSwitchToPreview={() => {
                setActiveView('studio');
                setActiveTab('preview');
              }}
            />
          ) : (
            /* Studio Workbench View */
            <div>
              {/* Query Input */}
              <QueryInput
                onSubmit={(q) => handleRunQuery(q, true)}
                isProcessing={isProcessing}
                mindPreset={mindPreset}
                setMindPreset={setMindPreset}
              />

              {/* Multi-AI Fan-Out Live Pipeline */}
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
                      className={`flex-1 min-w-[120px] py-2 px-2.5 sm:py-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-1.5 sm:space-x-2 transition ${
                        activeTab === 'master'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-cream-100/80'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                      <span>Godfy Master</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`flex-1 min-w-[120px] py-2 px-2.5 sm:py-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-1.5 sm:space-x-2 transition relative ${
                        activeTab === 'preview'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-cream-100/80'
                      }`}
                    >
                      <Eye className="w-4 h-4 text-cyan-300" />
                      <span>Live Sandbox</span>
                      {result?.previewCode && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse hidden sm:inline-block"></span>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveTab('council')}
                      className={`flex-1 min-w-[120px] py-2 px-2.5 sm:py-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-1.5 sm:space-x-2 transition ${
                        activeTab === 'council'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-cream-100/80'
                      }`}
                    >
                      <Bot className="w-4 h-4 text-cyan-300" />
                      <span>AI Council</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('mind')}
                      className={`flex-1 min-w-[120px] py-2 px-2.5 sm:py-2.5 sm:px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-1.5 sm:space-x-2 transition ${
                        activeTab === 'mind'
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-cream-100/80'
                      }`}
                    >
                      <Brain className="w-4 h-4 text-cyan-300" />
                      <span>Mind v1</span>
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
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-cream-200 bg-white py-6 text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 text-sm">Godfy</span>
              <span className="px-1.5 py-0.5 rounded bg-cream-100 text-slate-700 font-mono font-bold text-[10px] border border-cream-200">
                v1
              </span>
              <span>• Multi-AI Autonomous Engine</span>
            </div>

            <div className="flex items-center space-x-3 text-[11px]">
              <span className="inline-flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#FAF7EE] border border-cream-300 inline-block"></span>
                <span>White Cream</span>
              </span>
              <span className="inline-flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#FFFFFF] border border-slate-300 inline-block"></span>
                <span>White</span>
              </span>
              <span className="inline-flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-[#E0F7FA] border border-cyan-300 inline-block"></span>
                <span>Cyan Light</span>
              </span>
            </div>

            <div>
              Updates format: <strong className="text-slate-800 font-mono">v1</strong>
            </div>
          </div>
        </footer>
      </div>

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
