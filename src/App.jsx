import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import ChatEngineView from './components/ChatEngineView.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import { processChatWithGodfy } from './engine/godfyMind.js';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mindPreset, setMindPreset] = useState('balanced');
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamMessage, setStreamMessage] = useState('');

  // Initial demo session
  const defaultInitialSession = {
    id: 'session-default',
    title: 'Make a landing page',
    updatedAt: new Date().toISOString(),
    messages: []
  };

  const [sessions, setSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('godfy_sessions_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return [defaultInitialSession];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return sessions[0]?.id || 'session-default';
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('godfy_sessions_v1', JSON.stringify(sessions));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  const handleSendMessage = async (userText) => {
    if (!userText.trim() || isProcessing) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update session title if it's the first message
    const shouldUpdateTitle = messages.length === 0 || activeSession.title === 'New Chat' || activeSession.title === 'Make a landing page';
    const newTitle = shouldUpdateTitle ? userText.slice(0, 32) : activeSession.title;

    setSessions(prev =>
      prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            title: newTitle,
            updatedAt: new Date().toISOString(),
            messages: [...s.messages, userMessage]
          };
        }
        return s;
      })
    );

    setIsProcessing(true);
    setStreamMessage('Calling 5 Free AIs in parallel...');

    try {
      const godfyResponse = await processChatWithGodfy({
        prompt: userText,
        history: messages,
        mindPreset,
        onStreamStep: ({ message }) => {
          setStreamMessage(message);
        }
      });

      setSessions(prev =>
        prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              updatedAt: new Date().toISOString(),
              messages: [...s.messages, godfyResponse]
            };
          }
          return s;
        })
      );
    } catch (err) {
      console.error('Godfy Chat Engine Error:', err);
    } finally {
      setIsProcessing(false);
      setStreamMessage('');
    }
  };

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession = {
      id: newId,
      title: 'New Chat',
      updatedAt: new Date().toISOString(),
      messages: []
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (idToDelete) => {
    if (sessions.length <= 1) {
      // Reset if only 1 session
      handleNewChat();
      return;
    }
    const filtered = sessions.filter(s => s.id !== idToDelete);
    setSessions(filtered);
    if (activeSessionId === idToDelete) {
      setActiveSessionId(filtered[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 text-slate-800 antialiased selection:bg-cyanlight-200 selection:text-cyan-900 font-sans flex">
      {/* Responsive Collapsible Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => setActiveSessionId(id)}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main Chat Engine Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 sm:lg:pl-80 transition-all duration-300 min-h-screen">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={handleNewChat}
          onOpenSettings={() => setSettingsOpen(true)}
          isProcessing={isProcessing}
        />

        {/* Dedicated Chatting Engine View */}
        <ChatEngineView
          messages={messages}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
          streamMessage={streamMessage}
          mindPreset={mindPreset}
          setMindPreset={setMindPreset}
        />
      </div>

      {/* Engine Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        mindPreset={mindPreset}
        setMindPreset={setMindPreset}
      />
    </div>
  );
}
