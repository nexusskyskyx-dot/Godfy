import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import ChatEngineView from './components/ChatEngineView.jsx';
import ProjectEditorView from './components/ProjectEditorView.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import { processChatWithGodfy } from './engine/godfyMind.js';
import { 
  generateDynamicMultiFileProject, 
  addFileToProject, 
  addFolderToProject, 
  renameProjectNode,
  deleteProjectNode,
  updateFileContent
} from './engine/projectEngine.js';
import { patchFileLines } from './engine/toolRunner.js';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mindPreset, setMindPreset] = useState('balanced');
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamMessage, setStreamMessage] = useState('');
  const [currentView, setCurrentView] = useState('chat'); // 'chat' | 'editor'

  // Active Project Studio state
  const [currentProject, setCurrentProject] = useState(() => {
    try {
      const saved = localStorage.getItem('godfy_active_project_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // fallback
    }
    return generateDynamicMultiFileProject('Modern Digital Workspace');
  });

  // Sync active project to localStorage
  useEffect(() => {
    try {
      if (currentProject) {
        localStorage.setItem('godfy_active_project_v1', JSON.stringify(currentProject));
      }
    } catch (e) {
      console.warn('Failed to save project:', e);
    }
  }, [currentProject]);

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

  // Sync sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('godfy_sessions_v1', JSON.stringify(sessions));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = activeSession?.messages || [];

  const handleSendMessage = async (userText, forceSearch = false, searchMode = 'auto') => {
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
    const initialAction = 
      /(\b(bash|sh|terminal|exec)\b)/i.test(userText) ? 'Running bash...' :
      /(\b(patch|fix bug|repair)\b)/i.test(userText) ? 'Patching bug...' :
      /(\b(debug|ast|diagnos|error)\b)/i.test(userText) ? 'Debugging code...' :
      /(\b(run code|execute code|eval)\b)/i.test(userText) ? 'Running code...' :
      /(\b(preview|render)\b)/i.test(userText) ? 'Running preview...' :
      /(\b(edit|modify|update|change|refactor)\b)/i.test(userText) ? 'Editing file...' :
      /(\b(delete|remove|rm|drop|erase|discard)\b)/i.test(userText) ? 'Deleting file...' :
      /(\b(carpet|folder|carpeta)\b)/i.test(userText) ? 'Creating folder...' :
      /(\b(create|make|build|generate|new project|new file)\b)/i.test(userText) ? 'Creating file...' :
      /(\b(search|find|lookup|images|photos)\b)/i.test(userText) || searchMode === 'images' ? 'Searching web...' :
      'Thinking...';
    setStreamMessage(initialAction);

    try {
      const godfyResponse = await processChatWithGodfy({
        prompt: userText,
        history: messages,
        mindPreset,
        forceSearch,
        searchMode,
        activeProject: currentProject,
        onStreamStep: ({ message }) => {
          setStreamMessage(message);
        }
      });

      // If response generated or modified a multi-file project, update active project state
      if (godfyResponse.projectData) {
        setCurrentProject(godfyResponse.projectData);
      }

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

  const handleOpenProjectInEditor = (projectToOpen) => {
    if (projectToOpen) {
      setCurrentProject(projectToOpen);
    }
    setCurrentView('editor');
  };

  const handleAskMindToModifyProject = async (prompt, proj) => {
    const isClearAll = /(?:clear|empty|clean|purge|wipe|remove\s+all|delete\s+all|remove\s+files\s+and\s+folders|delete\s+files\s+and\s+folders|remove\s+everything|delete\s+everything|remove\s+files|delete\s+files)/i.test(prompt) || prompt.toLowerCase().includes('from studio');
    const addFileMatch = prompt.match(/(?:add|create|make)\s+(?:a\s+)?(?:new\s+)?file\s+(?:called|named)?\s*([a-zA-Z0-9_\-\.\/]+)/i);
    const addFolderMatch = prompt.match(/(?:add|create|make)\s+(?:a\s+)?(?:new\s+)?(?:carpet|folder|carpeta|dir)\s+(?:called|named)?\s*([a-zA-Z0-9_\-\.\/]+)/i);
    const renameMatch = prompt.match(/rename\s+([a-zA-Z0-9_\-\.\/]+)\s+to\s+([a-zA-Z0-9_\-\.\/]+)/i);
    const deleteMatch = prompt.match(/(?:delete|remove|rm|drop|erase)\s+(?:file|folder|carpet|carpeta)?\s*([a-zA-Z0-9_\-\.\/]+)/i);
    const patchLineMatch = prompt.match(/(?:patch|fix|replace)\s+(?:line\s+(\d+)|#(\d+))\s*(?:in|of)?\s*([a-zA-Z0-9_\-\.\/]+)?\s*(?:with|to|as)?\s*(.*)/i);

    let updated = { ...proj };

    if (isClearAll) {
      // Clear all files and folders (carpets) from Studio
      updated = {
        ...proj,
        name: 'Empty Workspace',
        nodes: [
          { id: 'root', name: 'root', type: 'folder', isOpen: true, parentId: null, path: '/' }
        ],
        activeFileId: null,
        openTabIds: []
      };
    } else if (patchLineMatch) {
      // Surgical Line Patching instead of whole file generation!
      const lineNum = parseInt(patchLineMatch[1] || patchLineMatch[2], 10);
      const specifiedFile = patchLineMatch[3]?.trim();
      const newContent = patchLineMatch[4] ? patchLineMatch[4].trim().replace(/^["'`]|["'`]$/g, '') : '';

      const targetFile = specifiedFile
        ? updated.nodes.find(n => n.type === 'file' && (n.name === specifiedFile || n.path.endsWith(specifiedFile)))
        : (updated.nodes.find(n => n.id === updated.activeFileId) || updated.nodes.find(n => n.type === 'file'));

      if (targetFile && lineNum > 0) {
        const patchRes = patchFileLines(targetFile.content, { line: lineNum, newContent });
        if (patchRes.patched) {
          updated = updateFileContent(updated, targetFile.id, patchRes.content);
        }
      }
    } else if (deleteMatch) {
      const targetName = deleteMatch[1].trim();
      const target = updated.nodes.find(n => 
        n.name.toLowerCase() === targetName.toLowerCase() || 
        n.path.toLowerCase() === targetName.toLowerCase() || 
        n.path.toLowerCase() === `/${targetName.toLowerCase()}` ||
        n.name.toLowerCase().startsWith(targetName.toLowerCase())
      );
      if (target && target.id !== 'root') {
        updated = deleteProjectNode(updated, target.id);
      }
    } else if (addFolderMatch) {
      const folderName = addFolderMatch[1].trim();
      updated = addFolderToProject(updated, 'root', folderName);
    } else if (addFileMatch) {
      const fileName = addFileMatch[1].trim();
      const cleanName = fileName.split('/').pop();
      const content = `// Generated by Godfy Mind\n// Module: ${cleanName}\n\nexport function init() {\n  console.log("Module ${cleanName} mounted successfully.");\n}\n`;
      updated = addFileToProject(updated, 'root', cleanName, content);
    } else if (renameMatch) {
      const oldName = renameMatch[1].trim();
      const newName = renameMatch[2].trim();
      const target = updated.nodes.find(n => n.name === oldName || n.path === oldName || n.path === `/${oldName}`);
      if (target) {
        updated = renameProjectNode(updated, target.id, newName);
      }
    } else if (!/(\b(delete|remove|rm|drop|erase|clear|clean|purge|wipe)\b)/i.test(prompt)) {
      // Only generate new project when user explicitly wants to build/create
      const newGen = generateDynamicMultiFileProject(prompt);
      updated = newGen;
    }

    setCurrentProject(updated);
    return updated;
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
    setCurrentView('chat');
  };

  const handleDeleteSession = (idToDelete) => {
    if (sessions.length <= 1) {
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
    <div className="h-[100dvh] w-full bg-[#1a1b26] text-[#c0caf5] antialiased selection:bg-[#7aa2f7]/30 selection:text-[#7dcfff] font-sans flex overflow-hidden fixed inset-0">
      {/* Responsive Collapsible Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          setCurrentView('chat');
        }}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onOpenSettings={() => setSettingsOpen(true)}
        currentView={currentView}
        onSelectView={setCurrentView}
        hasProject={Boolean(currentProject)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 sm:lg:pl-80 transition-all duration-300 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={handleNewChat}
          onOpenSettings={() => setSettingsOpen(true)}
          isProcessing={isProcessing}
          currentView={currentView}
          onSelectView={setCurrentView}
          hasProject={Boolean(currentProject)}
        />

        {/* View Switcher: Chat Engine vs Project Editor */}
        {currentView === 'chat' ? (
          <ChatEngineView
            messages={messages}
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
            streamMessage={streamMessage}
            mindPreset={mindPreset}
            setMindPreset={setMindPreset}
            onOpenProjectInEditor={handleOpenProjectInEditor}
            currentProject={currentProject}
            onUpdateProject={setCurrentProject}
          />
        ) : (
          <ProjectEditorView
            project={currentProject}
            onUpdateProject={setCurrentProject}
            onBackToChat={() => setCurrentView('chat')}
            onAskMindToModify={handleAskMindToModifyProject}
          />
        )}
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
