import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Folder, FolderOpen, FileCode, Plus, Edit2, Trash2, Check, X,
  Eye, Code, Download, Copy, RefreshCw, ChevronRight, ChevronDown,
  Monitor, Tablet, Smartphone, Brain, ArrowLeft,
  FolderPlus, FilePlus, Layers, FolderTree, ArrowRight, Loader2,
  Terminal, Sparkles, Bug, Wrench, Scissors, ShieldAlert, CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { 
  addFileToProject, 
  addFolderToProject, 
  renameProjectNode, 
  deleteProjectNode, 
  updateFileContent, 
  toggleFolderOpen,
  buildProjectPreviewBundle
} from '../engine/projectEngine.js';
import { patchFileLines, detectCodeErrorsAndBugs } from '../engine/toolRunner.js';

export default function ProjectEditorView({
  project,
  onUpdateProject,
  onBackToChat,
  onAskMindToModify
}) {
  const [activeFileId, setActiveFileId] = useState(project?.activeFileId || null);
  const [openTabIds, setOpenTabIds] = useState(project?.openTabIds || []);
  
  // Desktop view mode: 'editor' | 'preview' | 'split'
  const [viewMode, setViewMode] = useState('split');
  // Mobile active tab: 'files' | 'editor' | 'preview'
  const [mobileTab, setMobileTab] = useState('editor');
  
  const [viewport, setViewport] = useState('desktop');
  const [previewKey, setPreviewKey] = useState(0);

  // Animated node states (for add/rename/delete animations)
  const [animatingAddId, setAnimatingAddId] = useState(null);
  const [animatingRenameId, setAnimatingRenameId] = useState(null);
  const [deletingNodeId, setDeletingNodeId] = useState(null);

  // Inline rename states
  const [editingNodeId, setEditingNodeId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Add new file / folder states
  const [creatingType, setCreatingType] = useState(null); // 'file' | 'folder' | null
  const [creatingParentId, setCreatingParentId] = useState('root');
  const [creatingName, setCreatingName] = useState('');

  // Studio Tools State: PATCH, ADD CODE, DELETE CODE, DEBUG
  const [isPatchModalOpen, setIsPatchModalOpen] = useState(false);
  const [patchTargetLine, setPatchTargetLine] = useState(1);
  const [patchNewCode, setPatchNewCode] = useState('');
  const [lastPatchedLine, setLastPatchedLine] = useState(null);
  const [patchNotification, setPatchNotification] = useState('');

  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [debugResults, setDebugResults] = useState(null);
  const [isSnippetModalOpen, setIsSnippetModalOpen] = useState(false);

  // Editor prompt bar state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiExecuting, setIsAiExecuting] = useState(false);
  const [aiActionMessage, setAiActionMessage] = useState('');
  const [copiedFile, setCopiedFile] = useState(false);

  const editorTextareaRef = useRef(null);

  // Sync active file with project changes
  useEffect(() => {
    if (project?.nodes) {
      const files = project.nodes.filter(n => n.type === 'file');
      if (files.length > 0 && (!activeFileId || !files.find(f => f.id === activeFileId))) {
        setActiveFileId(files[0].id);
        if (!openTabIds.includes(files[0].id)) {
          setOpenTabIds(prev => [...prev, files[0].id]);
        }
      }
    }
  }, [project, activeFileId, openTabIds]);

  const activeFile = useMemo(() => {
    return project?.nodes?.find(n => n.id === activeFileId && n.type === 'file') || null;
  }, [project, activeFileId]);

  // Compute file and folder counts
  const stats = useMemo(() => {
    const files = project?.nodes?.filter(n => n.type === 'file') || [];
    const folders = project?.nodes?.filter(n => n.type === 'folder' && n.id !== 'root') || [];
    const totalLines = files.reduce((acc, f) => acc + (f.content?.split('\n').length || 0), 0);
    return {
      fileCount: files.length,
      folderCount: folders.length,
      totalLines
    };
  }, [project]);

  // Generate live preview bundle
  const previewHtml = useMemo(() => {
    return buildProjectPreviewBundle(project);
  }, [project, previewKey]);

  // File explorer node actions
  const handleStartRename = (e, node) => {
    e.stopPropagation();
    setEditingNodeId(node.id);
    setEditingName(node.name);
  };

  const handleSaveRename = (nodeId) => {
    if (!editingName.trim()) {
      setEditingNodeId(null);
      return;
    }
    const updated = renameProjectNode(project, nodeId, editingName.trim());
    onUpdateProject(updated);
    setEditingNodeId(null);
    setEditingName('');
    
    setAnimatingRenameId(nodeId);
    setTimeout(() => setAnimatingRenameId(null), 1000);
  };

  const handleDelete = (e, nodeId) => {
    e.stopPropagation();
    setDeletingNodeId(nodeId);
    setTimeout(() => {
      const updated = deleteProjectNode(project, nodeId);
      onUpdateProject(updated);
      setOpenTabIds(prev => prev.filter(id => id !== nodeId));
      setDeletingNodeId(null);
    }, 240);
  };

  const handleStartCreate = (type, parentId = 'root') => {
    setCreatingType(type);
    setCreatingParentId(parentId);
    setCreatingName(type === 'file' ? 'component.js' : 'new_carpet');
  };

  const handleConfirmCreate = () => {
    if (!creatingName.trim()) {
      setCreatingType(null);
      return;
    }
    let updated;
    if (creatingType === 'file') {
      updated = addFileToProject(project, creatingParentId, creatingName.trim(), '// Module created in Tokyo Night Studio\n');
      const newFile = updated.nodes.find(n => n.name === creatingName.trim() && n.parentId === creatingParentId);
      if (newFile) {
        setActiveFileId(newFile.id);
        setOpenTabIds(prev => [...prev, newFile.id]);
        setMobileTab('editor');
        setAnimatingAddId(newFile.id);
        setTimeout(() => setAnimatingAddId(null), 1200);
      }
    } else {
      updated = addFolderToProject(project, creatingParentId, creatingName.trim());
      const newFolder = updated.nodes.find(n => n.name === creatingName.trim() && n.parentId === creatingParentId);
      if (newFolder) {
        setAnimatingAddId(newFolder.id);
        setTimeout(() => setAnimatingAddId(null), 1200);
      }
    }
    onUpdateProject(updated);
    setCreatingType(null);
    setCreatingName('');
  };

  const handleOpenFile = (fileNode) => {
    setActiveFileId(fileNode.id);
    if (!openTabIds.includes(fileNode.id)) {
      setOpenTabIds(prev => [...prev, fileNode.id]);
    }
    setMobileTab('editor');
  };

  const handleCloseTab = (e, fileId) => {
    e.stopPropagation();
    const nextTabs = openTabIds.filter(id => id !== fileId);
    setOpenTabIds(nextTabs);
    if (activeFileId === fileId) {
      setActiveFileId(nextTabs.length > 0 ? nextTabs[nextTabs.length - 1] : null);
    }
  };

  const handleCodeChange = (newCode) => {
    if (!activeFile) return;
    const updated = updateFileContent(project, activeFile.id, newCode);
    onUpdateProject(updated);
  };

  const handleCopyActiveCode = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleDownloadActiveFile = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadWholeProject = () => {
    const files = project?.nodes?.filter(n => n.type === 'file') || [];
    if (files.length === 0) return;

    const manifest = files.map(f => `=== FILE: ${f.path} ===\n\n${f.content}\n\n`).join('='.repeat(50) + '\n\n');
    const blob = new Blob([manifest], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_project_code.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // =====================================================================
  // STUDIO TOOLS: PATCH LINE, ADD CODE, DELETE CODE, DEBUG
  // =====================================================================
  const handleOpenPatchModal = (lineNum = 1) => {
    if (!activeFile) return;
    const lines = activeFile.content.split('\n');
    const safeLine = Math.min(Math.max(1, lineNum), Math.max(1, lines.length));
    const currentText = lines[safeLine - 1] || '';
    setPatchTargetLine(safeLine);
    setPatchNewCode(currentText);
    setIsPatchModalOpen(true);
  };

  const handleApplySurgicalPatch = () => {
    if (!activeFile) return;
    const patchRes = patchFileLines(activeFile.content, {
      line: patchTargetLine,
      newContent: patchNewCode
    });

    if (patchRes.patched) {
      const updated = updateFileContent(project, activeFile.id, patchRes.content);
      onUpdateProject(updated);
      setLastPatchedLine(patchTargetLine);
      setPatchNotification(`Patched line ${patchTargetLine} surgically!`);
      setTimeout(() => setPatchNotification(''), 3000);
      setTimeout(() => setLastPatchedLine(null), 4000);
      setIsPatchModalOpen(false);
    }
  };

  const handleDeleteCurrentLine = () => {
    if (!activeFile) return;
    const lines = activeFile.content.split('\n');
    if (lines.length <= 1) {
      handleCodeChange('');
      return;
    }
    const target = patchTargetLine || 1;
    lines.splice(target - 1, 1);
    handleCodeChange(lines.join('\n'));
    setPatchNotification(`Deleted line ${target}`);
    setTimeout(() => setPatchNotification(''), 2500);
  };

  const handleInjectSnippet = (snippetCode) => {
    if (!activeFile) return;
    const newContent = activeFile.content 
      ? `${activeFile.content.trimEnd()}\n\n${snippetCode}\n` 
      : `${snippetCode}\n`;
    handleCodeChange(newContent);
    setIsSnippetModalOpen(false);
    setPatchNotification('Injected code snippet successfully!');
    setTimeout(() => setPatchNotification(''), 2500);
  };

  const handleRunDebugger = () => {
    if (!activeFile) return;
    const results = detectCodeErrorsAndBugs(activeFile.content, activeFile.language);
    setDebugResults(results);
    setIsDebugOpen(true);
  };

  const handleApplyBugPatch = (bug) => {
    if (!activeFile || !bug.suggestedPatch) return;
    const patchRes = patchFileLines(activeFile.content, {
      line: bug.line,
      newContent: bug.suggestedPatch
    });

    if (patchRes.patched) {
      const updated = updateFileContent(project, activeFile.id, patchRes.content);
      onUpdateProject(updated);
      setLastPatchedLine(bug.line);
      setPatchNotification(`Fixed bug on line ${bug.line}!`);
      setTimeout(() => setPatchNotification(''), 3000);
      setTimeout(() => setLastPatchedLine(null), 4000);

      // Re-run debugger to update remaining issues
      const rechecked = detectCodeErrorsAndBugs(patchRes.content, activeFile.language);
      setDebugResults(rechecked);
    }
  };

  const handleAiExecute = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isAiExecuting) return;
    setIsAiExecuting(true);

    const actionLabel = 
      /(\b(delete|remove|rm|drop|erase)\b)/i.test(aiPrompt) ? 'Removing...' :
      /(\b(edit|modify|update|change|refactor|fix|patch)\b)/i.test(aiPrompt) ? 'Editing...' :
      /(\b(create|add|new|make)\b)/i.test(aiPrompt) ? 'Creating...' :
      'Thinking...';
    
    setAiActionMessage(actionLabel);

    try {
      if (onAskMindToModify) {
        await onAskMindToModify(aiPrompt, project);
      }
      setAiPrompt('');
    } catch (err) {
      console.error('Error applying AI modification:', err);
    } finally {
      setIsAiExecuting(false);
      setAiActionMessage('');
      setPreviewKey(k => k + 1);
    }
  };

  // Recursive Tree Renderer for Files and Carpets
  const renderTree = (parentId = 'root', depth = 0) => {
    const children = project?.nodes?.filter(n => n.parentId === parentId) || [];

    if (children.length === 0 && depth === 0) {
      return (
        <div className="p-4 text-center text-xs font-mono text-[#565f89]">
          No files or carpets in this project.
        </div>
      );
    }

    // Sort: Folders first, then files
    const sorted = [...children].sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'folder' ? -1 : 1;
    });

    return (
      <div className="space-y-0.5 select-none font-mono text-xs">
        {sorted.map(node => {
          const isFolder = node.type === 'folder';
          const isActive = !isFolder && node.id === activeFileId;
          const isEditing = editingNodeId === node.id;
          const isAnimatingAdd = animatingAddId === node.id;
          const isAnimatingRename = animatingRenameId === node.id;
          const isDeleting = deletingNodeId === node.id;

          return (
            <div 
              key={node.id} 
              className={`transition-all duration-200 ${isDeleting ? 'opacity-0 scale-95' : 'opacity-100'}`}
            >
              <div
                onClick={() => {
                  if (isFolder) {
                    const updated = toggleFolderOpen(project, node.id);
                    onUpdateProject(updated);
                  } else {
                    handleOpenFile(node);
                  }
                }}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                className={`group flex items-center justify-between py-1.5 pr-2 rounded-lg cursor-pointer transition text-xs ${
                  isActive
                    ? 'bg-[#1f2335] text-[#7dcfff] font-medium border-l-2 border-[#7dcfff]'
                    : 'text-[#9aa5ce] hover:bg-[#16161e] hover:text-[#c0caf5]'
                } ${isAnimatingAdd ? 'animate-node-enter' : ''} ${isAnimatingRename ? 'animate-node-highlight' : ''}`}
              >
                <div className="flex items-center space-x-1.5 min-w-0 flex-1">
                  {isFolder ? (
                    <>
                      <span className="text-[#565f89] hover:text-[#c0caf5]">
                        {node.isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </span>
                      {node.isOpen ? (
                        <FolderOpen className="w-3.5 h-3.5 text-[#7aa2f7] flex-shrink-0" />
                      ) : (
                        <Folder className="w-3.5 h-3.5 text-[#7aa2f7] flex-shrink-0" />
                      )}
                    </>
                  ) : (
                    <FileCode className={`w-3.5 h-3.5 flex-shrink-0 ml-4 ${isActive ? 'text-[#7dcfff]' : 'text-[#565f89]'}`} />
                  )}

                  {isEditing ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(node.id);
                        if (e.key === 'Escape') setEditingNodeId(null);
                      }}
                      onBlur={() => handleSaveRename(node.id)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      className="bg-[#16161e] border border-[#7aa2f7] rounded px-1.5 py-0.5 text-xs text-[#c0caf5] font-mono focus:outline-none w-28"
                    />
                  ) : (
                    <span className="truncate">{node.name}</span>
                  )}
                </div>

                {/* Node Actions on Hover */}
                {!isEditing && (
                  <div className="hidden group-hover:flex items-center space-x-1 flex-shrink-0">
                    {isFolder && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStartCreate('file', node.id); }}
                          className="p-1 hover:bg-[#16161e] rounded text-[#565f89] hover:text-[#7dcfff]"
                          title="Add file inside carpet"
                        >
                          <FilePlus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStartCreate('folder', node.id); }}
                          className="p-1 hover:bg-[#16161e] rounded text-[#565f89] hover:text-[#7dcfff]"
                          title="Add sub-carpet"
                        >
                          <FolderPlus className="w-3 h-3" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => handleStartRename(e, node)}
                      className="p-1 hover:bg-[#16161e] rounded text-[#565f89] hover:text-[#c0caf5]"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    {node.id !== 'root' && (
                      <button
                        onClick={(e) => handleDelete(e, node.id)}
                        className="p-1 hover:bg-[#16161e] rounded text-[#565f89] hover:text-[#f7768e]"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Render children if folder is open */}
              {isFolder && node.isOpen && renderTree(node.id, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#1a1b26] overflow-hidden w-full relative">
      {/* Toast Notification */}
      {patchNotification && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-[#1f2335] border border-[#7aa2f7] text-[#7dcfff] px-3.5 py-1.5 rounded-xl text-xs font-mono shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#9ece6a]" />
          <span>{patchNotification}</span>
        </div>
      )}

      {/* Top Studio Bar */}
      <header className="border-b border-[#292e42] bg-[#16161e] flex-shrink-0">
        <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <button
              onClick={onBackToChat}
              className="p-1.5 rounded-lg hover:bg-[#1f2335] text-[#9aa5ce] hover:text-[#c0caf5] transition flex items-center space-x-1 text-xs font-medium flex-shrink-0"
              title="Back to Chat (⌘L)"
            >
              <ArrowLeft className="w-4 h-4 text-[#7aa2f7]" />
              <span className="hidden sm:inline">Chat</span>
            </button>

            <div className="h-4 w-px bg-[#292e42] hidden sm:block"></div>

            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-[#1f2335] border border-[#292e42] flex items-center justify-center text-[#7dcfff] flex-shrink-0">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-bold text-[#c0caf5] truncate">
                  {project?.name || 'Untitled Project'}
                </h2>
                <span className="text-[10px] font-mono text-[#565f89] hidden sm:inline-block">
                  {stats.fileCount} files • {stats.folderCount} carpets • {stats.totalLines} lines
                </span>
              </div>
            </div>
          </div>

          {/* Desktop View Switcher & Export */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* View Mode Switcher (Desktop) */}
            <div className="hidden md:flex items-center bg-[#1f2335] rounded-xl p-0.5 border border-[#292e42] text-xs font-mono">
              <button
                onClick={() => setViewMode('editor')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === 'editor' ? 'bg-[#7aa2f7] text-[#16161e] font-bold' : 'text-[#9aa5ce] hover:text-[#c0caf5]'
                }`}
              >
                Code
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === 'split' ? 'bg-[#7aa2f7] text-[#16161e] font-bold' : 'text-[#9aa5ce] hover:text-[#c0caf5]'
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === 'preview' ? 'bg-[#7aa2f7] text-[#16161e] font-bold' : 'text-[#9aa5ce] hover:text-[#c0caf5]'
                }`}
              >
                Preview
              </button>
            </div>

            <button
              onClick={handleDownloadWholeProject}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#1f2335] hover:bg-[#24283b] border border-[#292e42] text-[#c0caf5] font-medium text-xs flex items-center space-x-1.5 transition active:scale-95"
              title="Download full project code manifest"
            >
              <Download className="w-3.5 h-3.5 text-[#7dcfff]" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Simple Cursor-Style Activity Status */}
        {isAiExecuting && (
          <div className="px-3 py-1.5 bg-[#16161e] text-xs font-mono flex items-center space-x-2 border-t border-[#292e42]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7aa2f7] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7aa2f7]"></span>
            </span>
            <span className="text-[#c0caf5] font-medium">{aiActionMessage || 'Editing...'}</span>
          </div>
        )}

        {/* Mobile View Tab Switcher */}
        <div className="flex md:hidden border-t border-[#292e42] bg-[#16161e] px-2 py-1.5 gap-1 text-xs font-mono">
          <button
            onClick={() => setMobileTab('files')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition font-semibold ${
              mobileTab === 'files'
                ? 'bg-[#1f2335] text-[#7dcfff] border border-[#3b4261]'
                : 'text-[#9aa5ce] hover:bg-[#1f2335]/50'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Files ({stats.fileCount})</span>
          </button>
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition font-semibold ${
              mobileTab === 'editor'
                ? 'bg-[#1f2335] text-[#7dcfff] border border-[#3b4261]'
                : 'text-[#9aa5ce] hover:bg-[#1f2335]/50'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition font-semibold ${
              mobileTab === 'preview'
                ? 'bg-[#1f2335] text-[#7dcfff] border border-[#3b4261]'
                : 'text-[#9aa5ce] hover:bg-[#1f2335]/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ========================================================= */}
        {/* PANEL 1: File & Carpet Explorer                          */}
        {/* ========================================================= */}
        <aside className={`${
          mobileTab === 'files' ? 'flex w-full' : 'hidden'
        } md:flex md:w-60 lg:w-64 border-r border-[#292e42] flex-col bg-[#16161e] flex-shrink-0 overflow-hidden`}>
          <div className="p-2.5 border-b border-[#292e42] flex items-center justify-between text-xs font-mono bg-[#13131a]">
            <span className="font-bold uppercase tracking-wider text-[#565f89] text-[10px]">
              Files & Carpets
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleStartCreate('file', 'root')}
                className="p-1 hover:bg-[#1f2335] rounded text-[#9aa5ce] hover:text-[#7dcfff] transition"
                title="New File"
              >
                <FilePlus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleStartCreate('folder', 'root')}
                className="p-1 hover:bg-[#1f2335] rounded text-[#9aa5ce] hover:text-[#7dcfff] transition"
                title="New Carpet / Folder"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Creation input if active */}
          {creatingType && (
            <div className="p-2 bg-[#1f2335] border-b border-[#292e42] text-xs font-mono animate-node-enter">
              <div className="text-[10px] text-[#7dcfff] font-bold mb-1">
                New {creatingType === 'file' ? 'File' : 'Carpet / Folder'}:
              </div>
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={creatingName}
                  onChange={(e) => setCreatingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirmCreate();
                    if (e.key === 'Escape') setCreatingType(null);
                  }}
                  autoFocus
                  placeholder={creatingType === 'file' ? 'filename.js' : 'folder_name'}
                  className="w-full bg-[#16161e] border border-[#7aa2f7] rounded px-2 py-1 text-xs text-[#c0caf5] font-mono focus:outline-none"
                />
                <button
                  onClick={handleConfirmCreate}
                  className="p-1 bg-[#7aa2f7] text-[#16161e] rounded hover:bg-[#89b4fa] transition"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCreatingType(null)}
                  className="p-1 bg-[#24283b] text-[#9aa5ce] rounded hover:bg-[#292e42] transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Tree Scroll Area */}
          <div className="flex-1 overflow-y-auto p-2">
            {renderTree('root', 0)}
          </div>

          {/* Mobile Bottom Quick Switch */}
          <div className="p-2 border-t border-[#292e42] bg-[#16161e] md:hidden">
            <button
              onClick={() => setMobileTab('editor')}
              className="w-full py-2 px-3 rounded-xl bg-[#7aa2f7] text-[#16161e] font-semibold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <span>Open Code Editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* PANEL 2: Multi-Tab Code Editor (Cursor Style)            */}
        {/* ========================================================= */}
        <div className={`${
          mobileTab === 'editor' ? 'flex w-full' : 'hidden'
        } md:flex flex-col bg-[#1a1b26] min-w-0 ${
          viewMode === 'split' ? 'md:w-1/2 md:border-r md:border-[#292e42]' : 'md:flex-1'
        } ${viewMode === 'preview' ? 'md:hidden' : ''}`}>
          {/* Editor Tabs Bar */}
          <div className="h-9 bg-[#16161e] border-b border-[#292e42] flex items-center px-2 overflow-x-auto space-x-1 flex-shrink-0 scrollbar-none">
            {openTabIds.map(tabId => {
              const file = project?.nodes?.find(n => n.id === tabId);
              if (!file) return null;
              const isTabActive = file.id === activeFileId;

              return (
                <div
                  key={file.id}
                  onClick={() => setActiveFileId(file.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-t-lg text-xs font-mono transition cursor-pointer select-none border-t-2 flex-shrink-0 ${
                    isTabActive
                      ? 'bg-[#1a1b26] border-[#7dcfff] text-[#7dcfff] font-medium'
                      : 'border-transparent text-[#565f89] hover:text-[#c0caf5] hover:bg-[#1f2335]'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button
                    onClick={(e) => handleCloseTab(e, file.id)}
                    className="hover:text-[#f7768e] p-0.5 rounded transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active file Studio Tools Toolbar */}
          {activeFile && (
            <div className="px-2.5 sm:px-3 py-1.5 bg-[#16161e]/80 border-b border-[#292e42] flex flex-wrap items-center justify-between gap-1.5 text-xs font-mono text-[#9aa5ce]">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="text-[11px] truncate max-w-[140px] sm:max-w-none text-[#c0caf5]">
                  {activeFile.path}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1f2335] text-[#7dcfff] uppercase font-bold border border-[#292e42]">
                  {activeFile.language}
                </span>
              </div>

              {/* STUDIO TOOLS: PATCH, ADD CODE, DELETE CODE, DEBUG */}
              <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
                {/* 🩹 PATCH LINE TOOL */}
                <button
                  onClick={() => handleOpenPatchModal(1)}
                  className="px-2 py-1 rounded-lg bg-[#1f2335] hover:bg-[#7aa2f7]/20 border border-[#292e42] hover:border-[#7aa2f7] text-[#7aa2f7] text-[11px] font-semibold flex items-center space-x-1 transition active:scale-95"
                  title="Surgically patch a specific line of code without regenerating the file"
                >
                  <Wrench className="w-3 h-3 text-[#7dcfff]" />
                  <span>Patch Line</span>
                </button>

                {/* ➕ ADD CODE SNIPPET */}
                <button
                  onClick={() => setIsSnippetModalOpen(true)}
                  className="px-2 py-1 rounded-lg bg-[#1f2335] hover:bg-[#24283b] border border-[#292e42] text-[#9ece6a] text-[11px] font-semibold flex items-center space-x-1 transition active:scale-95"
                  title="Add code snippet (functions, hooks, utilities)"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Code</span>
                </button>

                {/* 🐞 DEBUG FILE */}
                <button
                  onClick={handleRunDebugger}
                  className="px-2 py-1 rounded-lg bg-[#1f2335] hover:bg-[#24283b] border border-[#292e42] text-[#e0af68] text-[11px] font-semibold flex items-center space-x-1 transition active:scale-95"
                  title="Debug file: scan for syntax errors, DOM bugs, and runtime traps"
                >
                  <Bug className="w-3 h-3" />
                  <span>Debug</span>
                </button>

                {/* 🗑️ DELETE LINE / CODE */}
                <button
                  onClick={handleDeleteCurrentLine}
                  className="p-1 hover:bg-[#1f2335] rounded text-[#565f89] hover:text-[#f7768e] transition"
                  title="Delete current line"
                >
                  <Scissors className="w-3.5 h-3.5" />
                </button>

                {/* COPY */}
                <button
                  onClick={handleCopyActiveCode}
                  className="p-1 hover:text-[#c0caf5] rounded text-[#565f89] transition"
                  title="Copy File Code"
                >
                  {copiedFile ? <Check className="w-3.5 h-3.5 text-[#9ece6a]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {/* DOWNLOAD */}
                <button
                  onClick={handleDownloadActiveFile}
                  className="p-1 hover:text-[#c0caf5] rounded text-[#565f89] transition"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Code Content Area */}
          {activeFile ? (
            <div className="flex-1 flex flex-col overflow-hidden relative">
              <div className="flex-1 flex overflow-hidden">
                {/* Line Numbers with Click-to-Patch */}
                <div className="w-10 sm:w-12 bg-[#16161e] text-[#565f89] font-mono text-[11px] sm:text-xs text-right pr-2 pt-3 select-none overflow-hidden flex-shrink-0 border-r border-[#292e42]/60">
                  {activeFile.content.split('\n').map((_, idx) => {
                    const lineNum = idx + 1;
                    const isPatched = lastPatchedLine === lineNum;
                    return (
                      <div 
                        key={idx} 
                        onClick={() => handleOpenPatchModal(lineNum)}
                        title={`Click to surgically patch line ${lineNum}`}
                        className={`leading-relaxed cursor-pointer rounded px-1 transition ${
                          isPatched 
                            ? 'bg-[#9ece6a]/30 text-[#9ece6a] font-bold animate-pulse' 
                            : 'hover:text-[#7dcfff] hover:bg-[#1f2335]'
                        }`}
                      >
                        {lineNum}
                      </div>
                    );
                  })}
                </div>

                {/* Editable Codearea */}
                <textarea
                  ref={editorTextareaRef}
                  value={activeFile.content}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  spellCheck="false"
                  className="flex-1 bg-[#1a1b26] text-[#c0caf5] font-mono text-xs p-2.5 sm:p-3 leading-relaxed focus:outline-none resize-none overflow-auto"
                />
              </div>

              {/* In-Editor Debug Drawer */}
              {isDebugOpen && debugResults && (
                <div className="border-t border-[#292e42] bg-[#16161e] p-3 max-h-48 overflow-y-auto text-xs font-mono">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Bug className="w-3.5 h-3.5 text-[#e0af68]" />
                      <span className="font-bold text-[#c0caf5]">
                        AST Code Doctor: {debugResults.hasErrors ? `${debugResults.bugCount} Bug(s) Detected` : 'Zero Bugs Detected! Clean AST'}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsDebugOpen(false)}
                      className="p-1 hover:bg-[#1f2335] rounded text-[#565f89] hover:text-[#c0caf5]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {debugResults.bugs.length === 0 ? (
                    <div className="text-[#9ece6a] flex items-center space-x-1.5 py-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Code has no syntax bugs, unclosed brackets, or DOM safety issues.</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {debugResults.bugs.map((bug, bIdx) => (
                        <div key={bIdx} className="p-2 rounded bg-[#1f2335] border border-[#f7768e]/40 flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="px-1.5 py-0.2 rounded bg-[#f7768e]/20 text-[#f7768e] text-[10px] font-bold">
                                Line {bug.line}
                              </span>
                              <span className="text-[#c0caf5] text-[11px] font-medium">{bug.message}</span>
                            </div>
                            {bug.suggestedPatch && (
                              <div className="mt-1 text-[10px] text-[#7dcfff] truncate font-mono">
                                Fix: <code>{bug.suggestedPatch}</code>
                              </div>
                            )}
                          </div>
                          {bug.suggestedPatch && (
                            <button
                              onClick={() => handleApplyBugPatch(bug)}
                              className="px-2 py-1 rounded bg-[#7aa2f7] hover:bg-[#89b4fa] text-[#16161e] font-bold text-[10px] flex-shrink-0 transition active:scale-95"
                            >
                              Patch Bug
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#565f89] font-mono text-xs p-4 text-center">
              <p>Select or create a file to start editing.</p>
              <button
                onClick={() => setMobileTab('files')}
                className="mt-3 px-3 py-1.5 rounded-lg bg-[#1f2335] text-[#7dcfff] text-xs md:hidden"
              >
                Browse Files & Carpets
              </button>
            </div>
          )}

          {/* Cursor Command Prompt Bar (⌘K style) */}
          <form onSubmit={handleAiExecute} className="p-2 sm:p-2.5 bg-[#16161e] border-t border-[#292e42] flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            <div className="p-1.5 rounded-lg bg-[#1f2335] border border-[#292e42] text-[#7dcfff] flex-shrink-0">
              <Brain className={`w-3.5 h-3.5 ${isAiExecuting ? 'animate-spin-slow' : ''}`} />
            </div>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask Godfy Mind: 'patch line 12 with ...', 'create carpet components', 'delete file'..."
              className="flex-1 bg-[#1f2335] border border-[#292e42] rounded-xl px-2.5 sm:px-3 py-1.5 text-xs text-[#c0caf5] placeholder-[#565f89] font-mono focus:outline-none focus:border-[#7aa2f7]"
            />
            <button
              type="submit"
              disabled={!aiPrompt.trim() || isAiExecuting}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#7aa2f7] hover:bg-[#89b4fa] text-[#16161e] font-bold text-xs font-mono transition disabled:opacity-40 flex-shrink-0"
            >
              {isAiExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
            </button>
          </form>
        </div>

        {/* ========================================================= */}
        {/* PANEL 3: Live Interactive Preview                        */}
        {/* ========================================================= */}
        <div className={`${
          mobileTab === 'preview' ? 'flex w-full' : 'hidden'
        } md:flex flex-col bg-[#16161e] min-w-0 ${
          viewMode === 'split' ? 'md:w-1/2' : 'md:flex-1'
        } ${viewMode === 'editor' ? 'md:hidden' : ''}`}>
          {/* Preview Toolbar */}
          <div className="h-9 bg-[#1f2335] border-b border-[#292e42] px-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-1.5 text-xs font-mono text-[#c0caf5]">
              <Eye className="w-3.5 h-3.5 text-[#7dcfff]" />
              <span className="font-semibold text-[11px]">Live Preview</span>
            </div>

            {/* Viewport controls */}
            <div className="flex items-center space-x-1">
              <div className="hidden sm:flex items-center space-x-1">
                <button
                  onClick={() => setViewport('desktop')}
                  className={`p-1 rounded ${viewport === 'desktop' ? 'bg-[#16161e] text-[#7dcfff]' : 'text-[#565f89]'}`}
                  title="Desktop (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  className={`p-1 rounded ${viewport === 'tablet' ? 'bg-[#16161e] text-[#7dcfff]' : 'text-[#565f89]'}`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('mobile')}
                  className={`p-1 rounded ${viewport === 'mobile' ? 'bg-[#16161e] text-[#7dcfff]' : 'text-[#565f89]'}`}
                  title="Mobile (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-3.5 w-px bg-[#292e42] mx-1"></div>

              <button
                onClick={() => setPreviewKey(k => k + 1)}
                className="p-1 hover:bg-[#16161e] rounded text-[#565f89] hover:text-[#c0caf5] transition"
                title="Reload Sandbox"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Preview Iframe */}
          <div className="flex-1 bg-[#0f0f14] flex items-center justify-center overflow-auto p-2 sm:p-4">
            <div 
              style={{
                width: viewport === 'mobile' ? '375px' : viewport === 'tablet' ? '768px' : '100%',
                height: '100%',
                maxWidth: '100%'
              }}
              className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 border border-[#292e42]"
            >
              <iframe
                key={previewKey}
                title="Godfy Multi-File Runtime"
                srcDoc={previewHtml}
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: SURGICAL LINE PATCH TOOL                         */}
      {/* ========================================================= */}
      {isPatchModalOpen && activeFile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#16161e] border border-[#292e42] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-3.5 bg-[#1f2335] border-b border-[#292e42] flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#c0caf5]">
                <Wrench className="w-4 h-4 text-[#7dcfff]" />
                <span className="font-bold">Surgical Code Patch Tool</span>
                <span className="text-[10px] text-[#565f89]">({activeFile.name})</span>
              </div>
              <button
                onClick={() => setIsPatchModalOpen(false)}
                className="p-1 hover:bg-[#16161e] rounded text-[#565f89] hover:text-[#c0caf5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center space-x-2">
                <label className="text-[#9aa5ce] text-[11px]">Target Line Number:</label>
                <input
                  type="number"
                  min="1"
                  max={activeFile.content.split('\n').length}
                  value={patchTargetLine}
                  onChange={(e) => {
                    const lNum = parseInt(e.target.value, 10) || 1;
                    setPatchTargetLine(lNum);
                    const current = activeFile.content.split('\n')[lNum - 1] || '';
                    setPatchNewCode(current);
                  }}
                  className="w-20 bg-[#1f2335] border border-[#292e42] rounded px-2 py-1 text-xs text-[#c0caf5] focus:outline-none focus:border-[#7aa2f7]"
                />
                <span className="text-[10px] text-[#565f89]">
                  / {activeFile.content.split('\n').length} total lines
                </span>
              </div>

              {/* Original Line Preview */}
              <div>
                <label className="text-[#565f89] text-[10px] uppercase font-bold block mb-1">
                  Original Code on Line {patchTargetLine}:
                </label>
                <div className="bg-[#1a1b26] border border-[#f7768e]/30 rounded-lg p-2 text-xs text-[#f7768e] truncate line-through">
                  {activeFile.content.split('\n')[patchTargetLine - 1] || '(Empty Line)'}
                </div>
              </div>

              {/* Patched Line Replacement */}
              <div>
                <label className="text-[#7dcfff] text-[10px] uppercase font-bold block mb-1">
                  New Patched Code (Surgically replaces only this line):
                </label>
                <textarea
                  value={patchNewCode}
                  onChange={(e) => setPatchNewCode(e.target.value)}
                  rows="3"
                  className="w-full bg-[#1a1b26] border border-[#7aa2f7] rounded-lg p-2 text-xs text-[#c0caf5] font-mono focus:outline-none focus:ring-1 focus:ring-[#7aa2f7]"
                  placeholder="Enter replacement line or fixed expression..."
                />
              </div>

              {/* Quick Preset Actions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setPatchNewCode(`try { ${patchNewCode.trim()} } catch (err) { console.error(err); }`)}
                  className="px-2 py-0.5 rounded bg-[#1f2335] text-[10px] text-[#9aa5ce] hover:text-[#7dcfff] border border-[#292e42]"
                >
                  + Try/Catch
                </button>
                <button
                  type="button"
                  onClick={() => setPatchNewCode(`if (typeof window !== 'undefined') { ${patchNewCode.trim()} }`)}
                  className="px-2 py-0.5 rounded bg-[#1f2335] text-[10px] text-[#9aa5ce] hover:text-[#7dcfff] border border-[#292e42]"
                >
                  + Window Check
                </button>
                <button
                  type="button"
                  onClick={() => setPatchNewCode(`console.log('[DEBUG]', ${patchNewCode.trim() || 'true'});`)}
                  className="px-2 py-0.5 rounded bg-[#1f2335] text-[10px] text-[#9aa5ce] hover:text-[#7dcfff] border border-[#292e42]"
                >
                  + Console Log
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#1f2335] border-t border-[#292e42] flex items-center justify-end space-x-2">
              <button
                onClick={() => setIsPatchModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-mono text-[#9aa5ce] hover:text-[#c0caf5] hover:bg-[#16161e]"
              >
                Cancel
              </button>
              <button
                onClick={handleApplySurgicalPatch}
                className="px-4 py-1.5 rounded-xl bg-[#7aa2f7] hover:bg-[#89b4fa] text-[#16161e] font-bold text-xs font-mono transition active:scale-95 flex items-center space-x-1.5"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Apply Patch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD CODE SNIPPET                                */}
      {/* ========================================================= */}
      {isSnippetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#16161e] border border-[#292e42] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-3.5 bg-[#1f2335] border-b border-[#292e42] flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#c0caf5]">
                <Plus className="w-4 h-4 text-[#9ece6a]" />
                <span className="font-bold">Add Code Snippet</span>
              </div>
              <button
                onClick={() => setIsSnippetModalOpen(false)}
                className="p-1 hover:bg-[#16161e] rounded text-[#565f89] hover:text-[#c0caf5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 space-y-2 font-mono text-xs max-h-80 overflow-y-auto">
              <button
                onClick={() => handleInjectSnippet(`// Modular Event Handler\nexport function setupEventListeners(element) {\n  if (!element) return;\n  element.addEventListener('click', (e) => {\n    console.log('[Tokyo Night Action]', e);\n  });\n}`)}
                className="w-full text-left p-2.5 rounded-xl bg-[#1f2335] hover:bg-[#24283b] border border-[#292e42] hover:border-[#7aa2f7] transition"
              >
                <div className="text-xs font-bold text-[#7dcfff]">Modular Event Handler</div>
                <div className="text-[10px] text-[#565f89]">Adds robust listener with element safety guard</div>
              </button>

              <button
                onClick={() => handleInjectSnippet(`// Async Fetch Helper\nexport async function fetchJson(endpoint, options = {}) {\n  try {\n    const response = await fetch(endpoint, options);\n    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);\n    return await response.json();\n  } catch (error) {\n    console.error('[Fetch Error]:', error);\n    return null;\n  }\n}`)}
                className="w-full text-left p-2.5 rounded-xl bg-[#1f2335] hover:bg-[#24283b] border border-[#292e42] hover:border-[#7aa2f7] transition"
              >
                <div className="text-xs font-bold text-[#9ece6a]">Async Safe Fetch Helper</div>
                <div className="text-[10px] text-[#565f89]">Resilient HTTP loader with error boundaries</div>
              </button>

              <button
                onClick={() => handleInjectSnippet(`// Reactive State Store\nexport function createStore(initialState = {}) {\n  let state = { ...initialState };\n  const listeners = new Set();\n  return {\n    getState: () => state,\n    setState: (update) => {\n      state = typeof update === 'function' ? update(state) : { ...state, ...update };\n      listeners.forEach(fn => fn(state));\n    },\n    subscribe: (fn) => {\n      listeners.add(fn);\n      return () => listeners.delete(fn);\n    }\n  };\n}`)}
                className="w-full text-left p-2.5 rounded-xl bg-[#1f2335] hover:bg-[#24283b] border border-[#292e42] hover:border-[#7aa2f7] transition"
              >
                <div className="text-xs font-bold text-[#bb9af7]">Reactive State Store</div>
                <div className="text-[10px] text-[#565f89]">Lightweight pub-sub state management store</div>
              </button>

              <button
                onClick={() => handleInjectSnippet(`/* Tokyo Night Card Styling */\n.tokyo-card {\n  background: #1f2335;\n  border: 1px solid #292e42;\n  border-radius: 0.75rem;\n  padding: 1rem;\n  color: #c0caf5;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);\n}`)}
                className="w-full text-left p-2.5 rounded-xl bg-[#1f2335] hover:bg-[#24283b] border border-[#292e42] hover:border-[#7aa2f7] transition"
              >
                <div className="text-xs font-bold text-[#e0af68]">Tokyo Night CSS Card</div>
                <div className="text-[10px] text-[#565f89]">Theme-compliant card styles with 1px border</div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
