import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Folder, FolderOpen, FileCode, Plus, Edit2, Trash2, Check, X,
  Eye, Code, Download, Copy, RefreshCw, ChevronRight, ChevronDown,
  Monitor, Tablet, Smartphone, Brain, ArrowLeft,
  FolderPlus, FilePlus, Layers, FolderTree, ArrowRight, Sparkles, Loader2
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
    
    // Trigger rename animation highlight
    setAnimatingRenameId(nodeId);
    setTimeout(() => setAnimatingRenameId(null), 1000);
  };

  const handleDelete = (e, nodeId) => {
    e.stopPropagation();
    // Trigger smooth exit animation before removing from state
    setDeletingNodeId(nodeId);
    setTimeout(() => {
      const updated = deleteProjectNode(project, nodeId);
      onUpdateProject(updated);
      setOpenTabIds(prev => prev.filter(id => id !== nodeId));
      setDeletingNodeId(null);
    }, 280);
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
      updated = addFileToProject(project, creatingParentId, creatingName.trim(), '// Module created by Godfy Mind\n');
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

    const manifest = files.map(f => `=== FILE: ${f.path} ===\n\n${f.content}\n\n`).join('=' .repeat(50) + '\n\n');
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

  const handleAiExecute = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isAiExecuting) return;
    setIsAiExecuting(true);
    setAiActionMessage(`Godfy Mind deliberating: "${aiPrompt.trim().slice(0, 35)}..."`);
    try {
      if (onAskMindToModify) {
        await onAskMindToModify(aiPrompt.trim(), project);
      }
      setAiPrompt('');
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsAiExecuting(false);
        setAiActionMessage('');
      }, 500);
    }
  };

  // Render tree node recursively with animations
  const renderTree = (parentId = 'root', depth = 0) => {
    const children = project?.nodes?.filter(n => n.parentId === parentId) || [];
    const sorted = [...children].sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'folder' ? -1 : 1;
    });

    return (
      <div className="space-y-1">
        {sorted.map(node => {
          const isFolder = node.type === 'folder';
          const isActive = node.id === activeFileId;
          const isEditing = node.id === editingNodeId;
          const isNewlyAdded = node.id === animatingAddId;
          const isRecentlyRenamed = node.id === animatingRenameId;
          const isDeleting = node.id === deletingNodeId;

          return (
            <div 
              key={node.id} 
              style={{ paddingLeft: `${depth * 10}px` }}
              className={`transition-all duration-300 ${
                isDeleting ? 'animate-node-exit' : 
                isNewlyAdded ? 'animate-node-enter' : 
                isRecentlyRenamed ? 'animate-node-highlight' : ''
              }`}
            >
              <div 
                onClick={() => {
                  if (isFolder) {
                    onUpdateProject(toggleFolderOpen(project, node.id));
                  } else {
                    handleOpenFile(node);
                  }
                }}
                className={`group flex items-center justify-between px-2.5 py-2 sm:py-1.5 rounded-xl text-xs font-mono transition cursor-pointer select-none min-h-[40px] sm:min-h-0 border ${
                  isActive 
                    ? 'bg-cyanlight-100/90 text-cyan-950 font-bold border-cyan-300 shadow-xs' 
                    : 'border-transparent text-slate-700 hover:bg-cream-100/90 active:bg-cream-200/90 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center space-x-2 truncate flex-1 min-w-0 pr-1">
                  {isFolder ? (
                    <>
                      {node.isOpen ? (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                      {node.isOpen ? (
                        <FolderOpen className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                      ) : (
                        <Folder className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      )}
                    </>
                  ) : (
                    <FileCode className={`w-4 h-4 flex-shrink-0 ${
                      node.name.endsWith('.html') ? 'text-orange-500' :
                      node.name.endsWith('.css') ? 'text-blue-500' :
                      node.name.endsWith('.js') ? 'text-amber-500' :
                      node.name.endsWith('.json') ? 'text-emerald-500' : 'text-slate-500'
                    }`} />
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
                      className="bg-white border border-cyan-400 rounded px-1.5 py-0.5 text-xs text-slate-900 font-mono w-full focus:outline-none"
                    />
                  ) : (
                    <span className="truncate text-xs sm:text-[11px]">{node.name}</span>
                  )}
                </div>

                {/* Node hover & mobile tap controls */}
                {!isEditing && (
                  <div className="flex items-center space-x-1 flex-shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition">
                    {isFolder && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStartCreate('file', node.id); }}
                          className="p-1 sm:p-0.5 hover:bg-white rounded-lg text-slate-500 hover:text-cyan-800 transition"
                          title="Add file inside carpet"
                        >
                          <FilePlus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleStartCreate('folder', node.id); }}
                          className="p-1 sm:p-0.5 hover:bg-white rounded-lg text-slate-500 hover:text-cyan-800 transition"
                          title="Add sub-carpet"
                        >
                          <FolderPlus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={(e) => handleStartRename(e, node)}
                      className="p-1 sm:p-0.5 hover:bg-white rounded-lg text-slate-500 hover:text-slate-900 transition"
                      title="Rename"
                    >
                      <Edit2 className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                    </button>
                    {node.id !== 'root' && (
                      <button
                        onClick={(e) => handleDelete(e, node.id)}
                        className="p-1 sm:p-0.5 hover:bg-white rounded-lg text-slate-400 hover:text-rose-600 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
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
    <div className="flex-1 flex flex-col h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] bg-white overflow-hidden w-full">
      {/* Top Studio Bar */}
      <header className="border-b border-cream-200 bg-cream-50/80 flex-shrink-0">
        {/* Main Header Row */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <button
              onClick={onBackToChat}
              className="p-1.5 rounded-xl hover:bg-cream-100 text-slate-600 hover:text-slate-950 transition flex items-center space-x-1 text-xs font-semibold flex-shrink-0"
              title="Back to Godfy Chat"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-700" />
              <span className="hidden sm:inline">Chat</span>
            </button>

            <div className="h-4 w-px bg-cream-300 hidden sm:block"></div>

            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-cyanlight-200 border border-cyanlight-300 flex items-center justify-center text-cyan-900 flex-shrink-0">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-black text-slate-900 truncate">
                  {project?.name || 'Untitled Project'}
                </h2>
                <span className="text-[10px] font-mono text-slate-500 hidden sm:inline-block">
                  {stats.fileCount} files • {stats.folderCount} carpets • {stats.totalLines} lines
                </span>
              </div>
            </div>
          </div>

          {/* Desktop View Switcher & Export */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Desktop-only view mode switcher */}
            <div className="hidden md:inline-flex rounded-xl bg-cream-200/80 p-0.5 border border-cream-300 text-xs font-mono">
              <button
                onClick={() => setViewMode('editor')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === 'editor' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Code Only
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === 'split' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Split View
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  viewMode === 'preview' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Live Preview
              </button>
            </div>

            <button
              onClick={handleDownloadWholeProject}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-sm transition active:scale-95"
              title="Download full project code manifest"
            >
              <Download className="w-3.5 h-3.5 text-cyan-300" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Animated Mind Activity Banner when Godfy is modifying files */}
        {isAiExecuting && (
          <div className="px-3 py-1.5 bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-950 text-cyan-300 text-xs font-mono flex items-center justify-between border-t border-cyan-800/60 overflow-hidden relative">
            <div className="flex items-center space-x-2 relative z-10">
              <Brain className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span className="font-semibold text-[11px] truncate">{aiActionMessage || 'Godfy Mind is editing project hierarchy...'}</span>
            </div>
            <div className="flex items-center space-x-1 relative z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">Synthesizing</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-shimmer"></div>
          </div>
        )}

        {/* Mobile View Tab Switcher (Visible on < md) */}
        <div className="flex md:hidden border-t border-cream-200 bg-white px-2 py-1.5 gap-1 text-xs font-mono">
          <button
            onClick={() => setMobileTab('files')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition font-semibold ${
              mobileTab === 'files'
                ? 'bg-cyanlight-100 text-cyan-950 border border-cyanlight-300'
                : 'text-slate-600 hover:bg-cream-50'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5 text-cyan-700" />
            <span>Files ({stats.fileCount})</span>
          </button>
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition font-semibold ${
              mobileTab === 'editor'
                ? 'bg-cyanlight-100 text-cyan-950 border border-cyanlight-300'
                : 'text-slate-600 hover:bg-cream-50'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-cyan-700" />
            <span>Code</span>
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center space-x-1.5 transition font-semibold ${
              mobileTab === 'preview'
                ? 'bg-cyanlight-100 text-cyan-950 border border-cyanlight-300'
                : 'text-slate-600 hover:bg-cream-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-cyan-700" />
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
        } md:flex md:w-60 lg:w-64 border-r border-cream-200 flex-col bg-[#FDFBF7] flex-shrink-0 overflow-hidden`}>
          <div className="p-3 border-b border-cream-200 flex items-center justify-between text-xs font-mono bg-cream-50/50">
            <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
              Files & Carpets
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleStartCreate('file', 'root')}
                className="p-1.5 sm:p-1 hover:bg-cream-100 rounded-lg text-slate-600 hover:text-cyan-800 transition"
                title="New File (Nuevo Archivo)"
              >
                <FilePlus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </button>
              <button
                onClick={() => handleStartCreate('folder', 'root')}
                className="p-1.5 sm:p-1 hover:bg-cream-100 rounded-lg text-slate-600 hover:text-cyan-800 transition"
                title="New Carpet / Folder (Nueva Carpeta)"
              >
                <FolderPlus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>

          {/* Creation input if active */}
          {creatingType && (
            <div className="p-2.5 bg-cyanlight-50 border-b border-cyanlight-200 text-xs font-mono animate-node-enter">
              <div className="text-[10px] text-cyan-900 font-bold mb-1">
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
                  className="w-full bg-white border border-cyan-400 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none"
                />
                <button
                  onClick={handleConfirmCreate}
                  className="p-1.5 bg-cyan-400 text-slate-950 rounded-lg hover:bg-cyan-300 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCreatingType(null)}
                  className="p-1.5 bg-cream-200 text-slate-600 rounded-lg hover:bg-cream-300 transition"
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
          <div className="p-2 border-t border-cream-200 bg-white md:hidden">
            <button
              onClick={() => setMobileTab('editor')}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <span>Open Code Editor</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* PANEL 2: Multi-Tab Code Editor                           */}
        {/* ========================================================= */}
        <div className={`${
          mobileTab === 'editor' ? 'flex w-full' : 'hidden'
        } md:flex flex-col bg-[#0F172A] min-w-0 ${
          viewMode === 'split' ? 'md:w-1/2 md:border-r md:border-slate-800' : 'md:flex-1'
        } ${viewMode === 'preview' ? 'md:hidden' : ''}`}>
          {/* Editor Tabs Bar */}
          <div className="h-10 bg-[#090D16] border-b border-slate-800 flex items-center px-2 overflow-x-auto space-x-1 flex-shrink-0 scrollbar-none">
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
                      ? 'bg-[#0F172A] border-cyan-400 text-cyan-300 font-semibold'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button
                    onClick={(e) => handleCloseTab(e, file.id)}
                    className="hover:text-rose-400 p-0.5 rounded transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active file breadcrumb & actions */}
          {activeFile && (
            <div className="px-3 sm:px-4 py-1.5 bg-[#0A0E1A] border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-[11px] truncate max-w-[180px] sm:max-w-none">{activeFile.path}</span>
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <span className="text-[10px] text-cyan-400 uppercase font-semibold">
                  {activeFile.language}
                </span>
                <button
                  onClick={handleCopyActiveCode}
                  className="p-1 hover:text-white rounded text-slate-400 transition"
                  title="Copy File Code"
                >
                  {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={handleDownloadActiveFile}
                  className="p-1 hover:text-white rounded text-slate-400 transition"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Code Content Area */}
          {activeFile ? (
            <div className="flex-1 flex overflow-hidden relative">
              {/* Line Numbers */}
              <div className="w-9 sm:w-12 bg-[#090D16] text-slate-600 font-mono text-[11px] sm:text-xs text-right pr-2 sm:pr-3 pt-3 select-none overflow-hidden flex-shrink-0">
                {activeFile.content.split('\n').map((_, idx) => (
                  <div key={idx} className="leading-relaxed">{idx + 1}</div>
                ))}
              </div>

              {/* Editable Codearea */}
              <textarea
                ref={editorTextareaRef}
                value={activeFile.content}
                onChange={(e) => handleCodeChange(e.target.value)}
                spellCheck="false"
                className="flex-1 bg-[#0F172A] text-slate-100 font-mono text-xs sm:text-xs p-2.5 sm:p-3 leading-relaxed focus:outline-none resize-none overflow-auto"
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-mono text-xs p-4 text-center">
              <p>Select or create a file to start editing.</p>
              <button
                onClick={() => setMobileTab('files')}
                className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 text-cyan-400 text-xs md:hidden"
              >
                Browse Files & Carpets
              </button>
            </div>
          )}

          {/* Bottom Mind AI Command Bar */}
          <form onSubmit={handleAiExecute} className="p-2 sm:p-2.5 bg-[#090D16] border-t border-slate-800 flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400 flex-shrink-0">
              <Brain className={`w-3.5 h-3.5 ${isAiExecuting ? 'animate-spin-slow' : ''}`} />
            </div>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask Godfy to add file/carpet or write code..."
              className="flex-1 bg-[#0F172A] border border-slate-700 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!aiPrompt.trim() || isAiExecuting}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs font-mono transition disabled:opacity-40 flex-shrink-0"
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
        } md:flex flex-col bg-slate-100 min-w-0 ${
          viewMode === 'split' ? 'md:w-1/2' : 'md:flex-1'
        } ${viewMode === 'editor' ? 'md:hidden' : ''}`}>
          {/* Preview Toolbar */}
          <div className="h-10 bg-white border-b border-cream-200 px-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-500">
              <Eye className="w-3.5 h-3.5 text-cyan-600" />
              <span className="font-bold text-slate-800 text-[11px]">Live Preview</span>
            </div>

            {/* Viewport controls (Desktop viewports shown only on sm+) */}
            <div className="flex items-center space-x-1">
              <div className="hidden sm:flex items-center space-x-1">
                <button
                  onClick={() => setViewport('desktop')}
                  className={`p-1 rounded ${viewport === 'desktop' ? 'bg-cream-100 text-cyan-800 font-bold' : 'text-slate-400'}`}
                  title="Desktop (100%)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  className={`p-1 rounded ${viewport === 'tablet' ? 'bg-cream-100 text-cyan-800 font-bold' : 'text-slate-400'}`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport('mobile')}
                  className={`p-1 rounded ${viewport === 'mobile' ? 'bg-cream-100 text-cyan-800 font-bold' : 'text-slate-400'}`}
                  title="Mobile (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => setPreviewKey(k => k + 1)}
                className="p-1 hover:bg-cream-100 rounded text-slate-500 transition ml-1"
                title="Reload Preview"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Iframe Container */}
          <div className="flex-1 bg-slate-200/80 p-1 sm:p-4 flex items-center justify-center overflow-hidden">
            <div 
              className={`bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden border border-slate-300 transition-all duration-300 h-full w-full ${
                viewport === 'tablet' ? 'sm:w-[768px] sm:max-w-full' :
                viewport === 'mobile' ? 'sm:w-[375px] sm:max-w-full' : 'w-full'
              }`}
            >
              <iframe
                key={previewKey}
                srcDoc={previewHtml}
                title="Project Live Preview"
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
