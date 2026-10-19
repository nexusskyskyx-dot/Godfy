/**
 * Godfy Project Engine (v1)
 * Manages full multi-file projects, nested folders (carpetas), file trees,
 * dynamic code synthesis with ZERO static templates, and iframe bundling.
 */

export function createNodeId() {
  return 'node_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
}

/**
 * Detect language from file extension
 */
export function getLanguageFromFilename(filename = '') {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'html': case 'htm': return 'html';
    case 'css': return 'css';
    case 'js': case 'mjs': case 'cjs': return 'javascript';
    case 'jsx': return 'jsx';
    case 'ts': return 'typescript';
    case 'tsx': return 'tsx';
    case 'json': return 'json';
    case 'py': return 'python';
    case 'sql': return 'sql';
    case 'md': case 'markdown': return 'markdown';
    case 'svg': return 'svg';
    case 'sh': case 'bash': return 'bash';
    case 'yml': case 'yaml': return 'yaml';
    default: return 'plaintext';
  }
}

/**
 * Create a new default project structure
 */
export function createEmptyProject(name = 'New Project') {
  const rootId = 'root';
  return {
    id: 'proj_' + Date.now(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activeFileId: null,
    openTabIds: [],
    nodes: [
      {
        id: rootId,
        name: 'root',
        type: 'folder',
        parentId: null,
        path: '/',
        isOpen: true
      }
    ]
  };
}

/**
 * Add a folder (carpeta) to the project
 */
export function addFolderToProject(project, parentFolderId = 'root', folderName = 'new_folder') {
  const cleanName = folderName.trim().replace(/[\/\\]/g, '_') || 'folder';
  const parent = project.nodes.find(n => n.id === parentFolderId && n.type === 'folder') || project.nodes.find(n => n.id === 'root');
  const parentPath = parent && parent.id !== 'root' ? (parent.path + '/') : '/';
  
  const newFolder = {
    id: createNodeId(),
    name: cleanName,
    type: 'folder',
    parentId: parent ? parent.id : 'root',
    path: parentPath + cleanName,
    isOpen: true
  };

  return {
    ...project,
    updatedAt: new Date().toISOString(),
    nodes: [...project.nodes, newFolder]
  };
}

/**
 * Add a file to the project
 */
export function addFileToProject(project, parentFolderId = 'root', fileName = 'untitled.js', content = '') {
  const cleanName = fileName.trim().replace(/[\/\\]/g, '_') || 'untitled.txt';
  const parent = project.nodes.find(n => n.id === parentFolderId && n.type === 'folder') || project.nodes.find(n => n.id === 'root');
  const parentPath = parent && parent.id !== 'root' ? (parent.path + '/') : '/';
  const lang = getLanguageFromFilename(cleanName);

  const newFile = {
    id: createNodeId(),
    name: cleanName,
    type: 'file',
    parentId: parent ? parent.id : 'root',
    path: parentPath + cleanName,
    content,
    language: lang
  };

  const currentTabs = project.openTabIds || [];
  const openTabs = currentTabs.includes(newFile.id) ? currentTabs : [...currentTabs, newFile.id];

  return {
    ...project,
    activeFileId: newFile.id,
    openTabIds: openTabs,
    updatedAt: new Date().toISOString(),
    nodes: [...project.nodes, newFile]
  };
}

/**
 * Rename any file or folder (carpeta)
 */
export function renameProjectNode(project, nodeId, newName) {
  const clean = newName.trim();
  if (!clean || nodeId === 'root') return project;

  const target = project.nodes.find(n => n.id === nodeId);
  if (!target) return project;

  const oldPath = target.path;
  const parent = project.nodes.find(n => n.id === target.parentId);
  const parentPath = parent && parent.id !== 'root' ? (parent.path + '/') : '/';
  const newPath = parentPath + clean;

  const updatedNodes = project.nodes.map(node => {
    if (node.id === nodeId) {
      return {
        ...node,
        name: clean,
        path: newPath,
        language: node.type === 'file' ? getLanguageFromFilename(clean) : undefined
      };
    }
    // Update sub-paths if renaming a folder
    if (target.type === 'folder' && node.path.startsWith(oldPath + '/')) {
      return {
        ...node,
        path: node.path.replace(oldPath, newPath)
      };
    }
    return node;
  });

  return {
    ...project,
    updatedAt: new Date().toISOString(),
    nodes: updatedNodes
  };
}

/**
 * Delete a file or folder (and its children)
 */
export function deleteProjectNode(project, nodeId) {
  if (nodeId === 'root') return project;
  const target = project.nodes.find(n => n.id === nodeId);
  if (!target) return project;

  const idsToDelete = new Set([nodeId]);
  if (target.type === 'folder') {
    project.nodes.forEach(n => {
      if (n.path.startsWith(target.path + '/')) {
        idsToDelete.add(n.id);
      }
    });
  }

  const remainingNodes = project.nodes.filter(n => !idsToDelete.has(n.id));
  const remainingTabs = (project.openTabIds || []).filter(id => !idsToDelete.has(id));
  let newActive = project.activeFileId;
  if (idsToDelete.has(newActive)) {
    newActive = remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1] : null;
  }

  return {
    ...project,
    activeFileId: newActive,
    openTabIds: remainingTabs,
    updatedAt: new Date().toISOString(),
    nodes: remainingNodes
  };
}

/**
 * Update content of a file
 */
export function updateFileContent(project, fileId, newContent) {
  const updatedNodes = project.nodes.map(n => {
    if (n.id === fileId && n.type === 'file') {
      return { ...n, content: newContent };
    }
    return n;
  });

  return {
    ...project,
    updatedAt: new Date().toISOString(),
    nodes: updatedNodes
  };
}

/**
 * Toggle folder open / closed state
 */
export function toggleFolderOpen(project, folderId) {
  const updatedNodes = project.nodes.map(n => {
    if (n.id === folderId && n.type === 'folder') {
      return { ...n, isOpen: !n.isOpen };
    }
    return n;
  });
  return { ...project, nodes: updatedNodes };
}

/**
 * Build self-contained HTML for live preview of the multi-file project in an iframe
 */
export function buildProjectPreviewBundle(project) {
  if (!project || !project.nodes) return '';

  const files = project.nodes.filter(n => n.type === 'file');
  const htmlFile = files.find(f => f.name.toLowerCase() === 'index.html') || files.find(f => f.name.toLowerCase().endsWith('.html'));
  
  if (!htmlFile) {
    const jsFile = files.find(f => f.language === 'javascript' || f.language === 'typescript');
    const cssFile = files.find(f => f.language === 'css');
    return '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <style>\n    body { font-family: Inter, system-ui, sans-serif; background: #1a1b26; color: #c0caf5; padding: 24px; line-height: 1.6; }\n    h2 { color: #7aa2f7; margin-top: 0; }\n    pre { background: #16161e; border: 1px solid #292e42; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; }\n  </style>\n  ' + (cssFile ? '<style>' + cssFile.content + '</style>' : '') + '\n</head>\n<body>\n  <h2>Project: ' + project.name + '</h2>\n  <p>Available files: ' + files.map(f => '<code style="background:#1f2335;padding:2px 6px;border-radius:4px;color:#7dcfff;">' + f.path + '</code>').join(', ') + '</p>\n  <div id="app"></div>\n  ' + (jsFile ? '<script>' + jsFile.content + '<\/script>' : '') + '\n</body>\n</html>';
  }

  let htmlContent = htmlFile.content;

  // In-line CSS files
  files.filter(f => f.language === 'css').forEach(css => {
    const regex = new RegExp('<link[^>]*rel=["\']stylesheet["\'][^>]*href=["\'][^"\']*' + css.name + '["\'][^>]*>', 'gi');
    if (regex.test(htmlContent)) {
      htmlContent = htmlContent.replace(regex, '<style data-source="' + css.path + '">\n' + css.content + '\n</style>');
    } else {
      htmlContent = htmlContent.replace('</head>', '<style data-injected="' + css.path + '">\n' + css.content + '\n</style></head>');
    }
  });

  // In-line JS files
  files.filter(f => f.language === 'javascript' || f.name.endsWith('.js')).forEach(js => {
    const regex = new RegExp('<script[^>]*src=["\'][^"\']*' + js.name + '["\'][^>]*>\\s*<\\/script>', 'gi');
    if (regex.test(htmlContent)) {
      htmlContent = htmlContent.replace(regex, '<script data-source="' + js.path + '">\n' + js.content + '\n<\/script>');
    } else if (js.name.toLowerCase() !== 'server.js' && !htmlContent.includes(js.content)) {
      htmlContent = htmlContent.replace('</body>', '<script data-injected="' + js.path + '">\n' + js.content + '\n<\/script></body>');
    }
  });

  return htmlContent;
}

/**
 * DYNAMIC PROJECT SYNTHESIZER (ZERO STATIC TEMPLATES)
 * Analyzes the user's prompt and autonomously constructs a complete, multi-file,
 * folder-structured project tailored specifically to the requested entity or application.
 * All generated projects use the modern Tokyo Night developer palette with Cursor IDE aesthetics.
 */
export function generateDynamicMultiFileProject(userQuery) {
  const query = (userQuery || '').trim();
  const lower = query.toLowerCase();

  // Extract clean entity title
  const cleanSubject = query
    .replace(/^(make|create|build|generate|design|write|code)?\s*(a\s+|an\s+)?(whole\s+|full\s+|multi-file\s+)?(project|app|website|application|landing page|tool|game|system|service|dashboard|platform|api)\s*(for|about|of)?\s*/i, '')
    .replace(/\?+$/, '')
    .trim() || 'Custom Application';

  const titleCased = cleanSubject
    .replace(/^(an?\s+|the\s+)/i, '')
    .replace(/\b\w/g, c => c.toUpperCase());

  const proj = createEmptyProject(titleCased);

  // Determine application archetype from user query
  const isTimer = /\b(timer|countdown|stopwatch|clock|pomodoro|alarm)\b/i.test(lower);
  const isCalculator = /\b(calculator|calc|arithmetic|evaluator|math)\b/i.test(lower);
  const isTodo = /\b(todo|task|kanban|notes|notebook|checklist|agenda|planner)\b/i.test(lower);
  const isWeather = /\b(weather|forecast|climate|temperature|meteo)\b/i.test(lower);
  const isGame = /\b(game|play|arcade|canvas|snake|pong|rpg|puzzle|tetris|flappy)\b/i.test(lower);
  const isDashboard = /\b(dashboard|admin|metrics|analytics|crm|finance|tracker|charts?|telemetry|monitoring)\b/i.test(lower);
  const isEcommerceOrFood = /\b(shop|store|ecommerce|clothing|apparel|products|cart|coffee|cafe|bakery|restaurant|sushi|pizza|food|dining|bistro|taco|burger)\b/i.test(lower);

  // Build folder structure (Carpetas)
  const root = proj.nodes.find(n => n.id === 'root');
  const srcFolderId = createNodeId();
  const cssFolderId = createNodeId();
  const jsFolderId = createNodeId();
  const componentsFolderId = createNodeId();

  const folders = [
    {
      id: srcFolderId,
      name: 'src',
      type: 'folder',
      parentId: root.id,
      path: '/src',
      isOpen: true
    },
    {
      id: cssFolderId,
      name: 'styles',
      type: 'folder',
      parentId: srcFolderId,
      path: '/src/styles',
      isOpen: true
    },
    {
      id: jsFolderId,
      name: 'js',
      type: 'folder',
      parentId: srcFolderId,
      path: '/src/js',
      isOpen: true
    },
    {
      id: componentsFolderId,
      name: 'components',
      type: 'folder',
      parentId: jsFolderId,
      path: '/src/js/components',
      isOpen: true
    }
  ];

  proj.nodes.push(...folders);

  let filesToGenerate = [];

  // ==========================================
  // ARCHETYPE 1: COUNTDOWN TIMER & STOPWATCH
  // ==========================================
  if (isTimer) {
    filesToGenerate = [
      {
        name: 'index.html',
        folderId: 'root',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + titleCased + ' | Tokyo Night Timer</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n  <link rel="stylesheet" href="src/styles/timer.css">\n</head>\n<body class="bg-[#1a1b26] text-[#c0caf5] min-h-screen flex flex-col items-center justify-center p-4 font-sans antialiased">\n  <div class="w-full max-w-lg bg-[#16161e] border border-[#292e42] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">\n    <header class="flex items-center justify-between mb-8 pb-4 border-b border-[#292e42]">\n      <div class="flex items-center space-x-2.5">\n        <div class="w-8 h-8 rounded-lg bg-[#7aa2f7]/20 border border-[#7aa2f7]/40 flex items-center justify-center text-[#7dcfff] font-mono text-xs font-bold">\n          ⏱️\n        </div>\n        <div>\n          <h1 class="text-base font-bold text-white tracking-tight">' + titleCased + '</h1>\n          <p class="text-[11px] text-[#565f89] font-mono">Precision Drift-Free Engine</p>\n        </div>\n      </div>\n      <div class="flex items-center space-x-1.5 bg-[#1f2335] p-1 rounded-xl border border-[#292e42]">\n        <button id="modeTimer" class="px-3 py-1 rounded-lg text-xs font-semibold bg-[#7aa2f7] text-[#16161e] transition">Countdown</button>\n        <button id="modeStopwatch" class="px-3 py-1 rounded-lg text-xs font-semibold text-[#565f89] hover:text-white transition">Stopwatch</button>\n      </div>\n    </header>\n\n    <div class="text-center my-6">\n      <div id="timeDisplay" class="font-mono text-5xl sm:text-6xl font-black text-white tracking-tight mb-2 timer-glow">\n        05:00.00\n      </div>\n      <div id="statusLabel" class="text-xs font-mono text-[#7dcfff] uppercase tracking-wider font-semibold">\n        Ready\n      </div>\n    </div>\n\n    <div id="presetContainer" class="flex justify-center gap-2 mb-6">\n      <button class="preset-btn px-3 py-1 rounded-lg bg-[#1f2335] hover:bg-[#292e42] border border-[#292e42] text-xs font-mono text-[#c0caf5] transition" data-seconds="60">1m</button>\n      <button class="preset-btn px-3 py-1 rounded-lg bg-[#1f2335] hover:bg-[#292e42] border border-[#292e42] text-xs font-mono text-[#c0caf5] transition" data-seconds="300">5m</button>\n      <button class="preset-btn px-3 py-1 rounded-lg bg-[#1f2335] hover:bg-[#292e42] border border-[#292e42] text-xs font-mono text-[#c0caf5] transition" data-seconds="900">15m</button>\n      <button class="preset-btn px-3 py-1 rounded-lg bg-[#1f2335] hover:bg-[#292e42] border border-[#292e42] text-xs font-mono text-[#c0caf5] transition" data-seconds="1500">25m</button>\n    </div>\n\n    <div class="flex items-center justify-center gap-3 mb-6">\n      <button id="startBtn" class="flex-1 py-3 px-4 rounded-xl bg-[#7aa2f7] hover:bg-[#7dcfff] text-[#16161e] font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2">\n        <span id="startIcon">▶</span> <span id="startText">Start</span>\n      </button>\n      <button id="lapBtn" class="py-3 px-4 rounded-xl bg-[#1f2335] hover:bg-[#292e42] border border-[#292e42] text-white font-semibold text-sm transition">\n        Lap\n      </button>\n      <button id="resetBtn" class="py-3 px-4 rounded-xl bg-[#1f2335] hover:bg-[#292e42] border border-[#292e42] text-[#f7768e] font-semibold text-sm transition">\n        Reset\n      </button>\n    </div>\n\n    <div class="border-t border-[#292e42] pt-4">\n      <div class="flex justify-between items-center text-xs font-mono text-[#565f89] mb-2">\n        <span>Recorded Laps</span>\n        <span id="lapCount">0 laps</span>\n      </div>\n      <div id="lapList" class="max-h-36 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">\n        <div class="text-[#565f89] text-center py-2 text-[11px]">No laps recorded yet</div>\n      </div>\n    </div>\n  </div>\n\n  <script src="src/js/components/audio.js"></script>\n  <script src="src/js/app.js"></script>\n</body>\n</html>'
      },
      {
        name: 'timer.css',
        folderId: cssFolderId,
        content: '/* Tokyo Night Timer Styles */\n:root {\n  --tokyo-bg: #1a1b26;\n  --tokyo-surface: #16161e;\n  --tokyo-card: #1f2335;\n  --tokyo-border: #292e42;\n  --tokyo-blue: #7aa2f7;\n  --tokyo-cyan: #7dcfff;\n}\n\n.timer-glow {\n  text-shadow: 0 0 25px rgba(122, 162, 247, 0.35);\n}\n\n.preset-active {\n  background-color: #7aa2f7 !important;\n  color: #16161e !important;\n  font-weight: 700;\n}\n\n::-webkit-scrollbar {\n  width: 5px;\n}\n::-webkit-scrollbar-track {\n  background: #16161e;\n}\n::-webkit-scrollbar-thumb {\n  background: #292e42;\n  border-radius: 4px;\n}'
      },
      {
        name: 'audio.js',
        folderId: componentsFolderId,
        content: '// Web Audio API Synthesizer for Tokyo Night Timer\nwindow.TimerAudio = {\n  ctx: null,\n  init: function() {\n    if (!this.ctx && typeof window !== "undefined") {\n      var AudioCtx = window.AudioContext || window.webkitAudioContext;\n      if (AudioCtx) this.ctx = new AudioCtx();\n    }\n  },\n  playBeep: function(freq, duration) {\n    try {\n      this.init();\n      if (!this.ctx) return;\n      if (this.ctx.state === "suspended") this.ctx.resume();\n      var osc = this.ctx.createOscillator();\n      var gain = this.ctx.createGain();\n      osc.type = "sine";\n      osc.frequency.setValueAtTime(freq || 880, this.ctx.currentTime);\n      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);\n      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (duration || 0.08));\n      osc.connect(gain);\n      gain.connect(this.ctx.destination);\n      osc.start();\n      osc.stop(this.ctx.currentTime + (duration || 0.08));\n    } catch (err) {}\n  },\n  playComplete: function() {\n    var self = this;\n    this.playBeep(659.25, 0.12);\n    setTimeout(function() { self.playBeep(880, 0.25); }, 140);\n  }\n};'
      },
      {
        name: 'app.js',
        folderId: jsFolderId,
        content: '// Core Timer Application Runtime\nvar mode = "timer";\nvar durationMs = 300000;\nvar remainingMs = durationMs;\nvar stopwatchElapsedMs = 0;\nvar isRunning = false;\nvar lastTimestamp = null;\nvar animFrameId = null;\nvar laps = [];\n\nvar timeDisplay = document.getElementById("timeDisplay");\nvar statusLabel = document.getElementById("statusLabel");\nvar startBtn = document.getElementById("startBtn");\nvar startIcon = document.getElementById("startIcon");\nvar startText = document.getElementById("startText");\nvar lapBtn = document.getElementById("lapBtn");\nvar resetBtn = document.getElementById("resetBtn");\nvar lapList = document.getElementById("lapList");\nvar lapCount = document.getElementById("lapCount");\nvar modeTimer = document.getElementById("modeTimer");\nvar modeStopwatch = document.getElementById("modeStopwatch");\nvar presetContainer = document.getElementById("presetContainer");\n\nfunction formatTime(ms) {\n  var totalSeconds = Math.floor(ms / 1000);\n  var minutes = Math.floor(totalSeconds / 60);\n  var seconds = totalSeconds % 60;\n  var hundredths = Math.floor((ms % 1000) / 10);\n  var pad = function(n) { return String(n).padStart(2, "0"); };\n  return pad(minutes) + ":" + pad(seconds) + "." + pad(hundredths);\n}\n\nfunction updateDisplay() {\n  var currentMs = mode === "timer" ? remainingMs : stopwatchElapsedMs;\n  timeDisplay.textContent = formatTime(currentMs);\n}\n\nfunction tick() {\n  if (!isRunning) return;\n  var now = performance.now();\n  var delta = now - lastTimestamp;\n  lastTimestamp = now;\n\n  if (mode === "timer") {\n    remainingMs = Math.max(0, remainingMs - delta);\n    updateDisplay();\n    if (remainingMs <= 0) {\n      pause();\n      statusLabel.textContent = "Completed!";\n      statusLabel.className = "text-xs font-mono text-[#9ece6a] uppercase tracking-wider font-semibold";\n      if (window.TimerAudio) window.TimerAudio.playComplete();\n      return;\n    }\n  } else {\n    stopwatchElapsedMs += delta;\n    updateDisplay();\n  }\n  animFrameId = requestAnimationFrame(tick);\n}\n\nfunction start() {\n  if (isRunning) return;\n  isRunning = true;\n  lastTimestamp = performance.now();\n  startIcon.textContent = "❚❚";\n  startText.textContent = "Pause";\n  startBtn.className = "flex-1 py-3 px-4 rounded-xl bg-[#e0af68] hover:bg-[#ff9e64] text-[#16161e] font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2";\n  statusLabel.textContent = mode === "timer" ? "Counting Down" : "Stopwatch Running";\n  statusLabel.className = "text-xs font-mono text-[#7dcfff] uppercase tracking-wider font-semibold";\n  if (window.TimerAudio) window.TimerAudio.playBeep(440, 0.05);\n  animFrameId = requestAnimationFrame(tick);\n}\n\nfunction pause() {\n  isRunning = false;\n  if (animFrameId) cancelAnimationFrame(animFrameId);\n  startIcon.textContent = "▶";\n  startText.textContent = "Resume";\n  startBtn.className = "flex-1 py-3 px-4 rounded-xl bg-[#7aa2f7] hover:bg-[#7dcfff] text-[#16161e] font-bold text-sm transition shadow-lg flex items-center justify-center space-x-2";\n  statusLabel.textContent = "Paused";\n  statusLabel.className = "text-xs font-mono text-[#e0af68] uppercase tracking-wider font-semibold";\n}\n\nfunction reset() {\n  pause();\n  startText.textContent = "Start";\n  if (mode === "timer") {\n    remainingMs = durationMs;\n  } else {\n    stopwatchElapsedMs = 0;\n  }\n  laps = [];\n  renderLaps();\n  updateDisplay();\n  statusLabel.textContent = "Ready";\n  statusLabel.className = "text-xs font-mono text-[#7dcfff] uppercase tracking-wider font-semibold";\n}\n\nfunction recordLap() {\n  var currentMs = mode === "timer" ? remainingMs : stopwatchElapsedMs;\n  laps.unshift({ lapNumber: laps.length + 1, time: formatTime(currentMs) });\n  renderLaps();\n  if (window.TimerAudio) window.TimerAudio.playBeep(650, 0.06);\n}\n\nfunction renderLaps() {\n  lapCount.textContent = laps.length + " laps";\n  if (laps.length === 0) {\n    lapList.innerHTML = \'<div class="text-[#565f89] text-center py-2 text-[11px]">No laps recorded yet</div>\';\n    return;\n  }\n  lapList.innerHTML = laps.map(function(l) {\n    return \'<div class="flex justify-between items-center py-1.5 px-3 rounded-lg bg-[#1f2335] border border-[#292e42]"><span class="text-[#565f89]">Lap #\' + l.lapNumber + \'</span><span class="text-white font-bold">\' + l.time + \'</span></div>\';\n  }).join("");\n}\n\nstartBtn.addEventListener("click", function() { isRunning ? pause() : start(); });\nresetBtn.addEventListener("click", reset);\nlapBtn.addEventListener("click", recordLap);\n\ndocument.querySelectorAll(".preset-btn").forEach(function(btn) {\n  btn.addEventListener("click", function() {\n    document.querySelectorAll(".preset-btn").forEach(function(b) { b.classList.remove("preset-active"); });\n    btn.classList.add("preset-active");\n    durationMs = parseInt(btn.dataset.seconds, 10) * 1000;\n    reset();\n  });\n});\n\nmodeTimer.addEventListener("click", function() {\n  if (mode === "timer") return;\n  mode = "timer";\n  modeTimer.className = "px-3 py-1 rounded-lg text-xs font-semibold bg-[#7aa2f7] text-[#16161e] transition";\n  modeStopwatch.className = "px-3 py-1 rounded-lg text-xs font-semibold text-[#565f89] hover:text-white transition";\n  presetContainer.classList.remove("hidden");\n  reset();\n});\n\nmodeStopwatch.addEventListener("click", function() {\n  if (mode === "stopwatch") return;\n  mode = "stopwatch";\n  modeStopwatch.className = "px-3 py-1 rounded-lg text-xs font-semibold bg-[#7aa2f7] text-[#16161e] transition";\n  modeTimer.className = "px-3 py-1 rounded-lg text-xs font-semibold text-[#565f89] hover:text-white transition";\n  presetContainer.classList.add("hidden");\n  reset();\n});\n\nwindow.addEventListener("keydown", function(e) {\n  if (e.code === "Space") {\n    e.preventDefault();\n    isRunning ? pause() : start();\n  } else if (e.key.toLowerCase() === "r") {\n    reset();\n  } else if (e.key.toLowerCase() === "l") {\n    recordLap();\n  }\n});\n\nupdateDisplay();'
      },
      {
        name: 'README.md',
        folderId: 'root',
        content: '# ' + titleCased + '\n\nA high-precision, drift-free Countdown & Stopwatch application built with Godfy Mind in Tokyo Night developer styling.\n\n## Architecture:\n- index.html: Responsive Tokyo Night layout with digital typography and HUD.\n- src/styles/timer.css: Design tokens, glow effects, and dark theme borders.\n- src/js/components/audio.js: Web Audio synthesizer generating tone cues without external audio files.\n- src/js/app.js: High-resolution performance.now() animation loop with lap recording and keyboard hotkeys.\n\n## Keyboard Hotkeys:\n- Space: Start / Pause\n- R: Reset\n- L: Record Lap\n'
      }
    ];
  }

  // ==========================================
  // ARCHETYPE 2: CALCULATOR & MATH EVALUATOR
  // ==========================================
  else if (isCalculator) {
    filesToGenerate = [
      {
        name: 'index.html',
        folderId: 'root',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + titleCased + ' | Tokyo Night Calculator</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n  <link rel="stylesheet" href="src/styles/calc.css">\n</head>\n<body class="bg-[#1a1b26] text-[#c0caf5] min-h-screen flex flex-col items-center justify-center p-4 font-sans antialiased">\n  <div class="w-full max-w-sm bg-[#16161e] border border-[#292e42] rounded-2xl p-6 shadow-2xl">\n    <header class="flex items-center justify-between mb-4 pb-3 border-b border-[#292e42]">\n      <div class="flex items-center space-x-2">\n        <span class="w-2.5 h-2.5 rounded-full bg-[#7dcfff]"></span>\n        <h1 class="text-xs font-mono font-bold text-white uppercase tracking-wider">' + titleCased + '</h1>\n      </div>\n      <button id="clearHistoryBtn" class="text-[11px] font-mono text-[#565f89] hover:text-[#f7768e] transition">Clear History</button>\n    </header>\n\n    <div class="bg-[#1f2335] border border-[#292e42] rounded-xl p-4 mb-5 text-right overflow-hidden">\n      <div id="expressionDisplay" class="font-mono text-xs text-[#565f89] h-5 truncate mb-1"></div>\n      <div id="mainDisplay" class="font-mono text-3xl font-black text-white truncate">0</div>\n    </div>\n\n    <div class="grid grid-cols-4 gap-2.5 font-mono text-sm font-semibold mb-4">\n      <button class="calc-btn btn-action" data-key="clear">AC</button>\n      <button class="calc-btn btn-action" data-key="(">(</button>\n      <button class="calc-btn btn-action" data-key=")">)</button>\n      <button class="calc-btn btn-op" data-key="/">÷</button>\n\n      <button class="calc-btn btn-num" data-key="7">7</button>\n      <button class="calc-btn btn-num" data-key="8">8</button>\n      <button class="calc-btn btn-num" data-key="9">9</button>\n      <button class="calc-btn btn-op" data-key="*">×</button>\n\n      <button class="calc-btn btn-num" data-key="4">4</button>\n      <button class="calc-btn btn-num" data-key="5">5</button>\n      <button class="calc-btn btn-num" data-key="6">6</button>\n      <button class="calc-btn btn-op" data-key="-">−</button>\n\n      <button class="calc-btn btn-num" data-key="1">1</button>\n      <button class="calc-btn btn-num" data-key="2">2</button>\n      <button class="calc-btn btn-num" data-key="3">3</button>\n      <button class="calc-btn btn-op" data-key="+">+</button>\n\n      <button class="calc-btn btn-num" data-key="0">0</button>\n      <button class="calc-btn btn-num" data-key=".">.</button>\n      <button class="calc-btn btn-action" data-key="delete">⌫</button>\n      <button class="calc-btn btn-eq" data-key="=">=</button>\n    </div>\n\n    <div class="border-t border-[#292e42] pt-3">\n      <div class="text-[10px] font-mono text-[#565f89] uppercase tracking-wider mb-2">Recent Computations</div>\n      <div id="historyList" class="space-y-1 max-h-24 overflow-y-auto font-mono text-xs pr-1">\n        <div class="text-[11px] text-[#565f89] text-center py-1">No calculations yet</div>\n      </div>\n    </div>\n  </div>\n\n  <script src="src/js/components/evaluator.js"></script>\n  <script src="src/js/app.js"></script>\n</body>\n</html>'
      },
      {
        name: 'calc.css',
        folderId: cssFolderId,
        content: '/* Tokyo Night Calculator Styles */\n.calc-btn {\n  height: 48px;\n  border-radius: 12px;\n  border: 1px solid #292e42;\n  transition: all 0.15s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  user-select: none;\n}\n.calc-btn:active {\n  transform: scale(0.95);\n}\n.btn-num {\n  background-color: #1f2335;\n  color: #c0caf5;\n}\n.btn-num:hover {\n  background-color: #292e42;\n  color: #ffffff;\n}\n.btn-action {\n  background-color: #16161e;\n  color: #f7768e;\n}\n.btn-action:hover {\n  background-color: #292e42;\n}\n.btn-op {\n  background-color: #1f2335;\n  color: #7dcfff;\n  border-color: rgba(122, 162, 247, 0.3);\n}\n.btn-op:hover {\n  background-color: rgba(122, 162, 247, 0.2);\n}\n.btn-eq {\n  background-color: #7aa2f7;\n  color: #16161e;\n  font-weight: 800;\n}\n.btn-eq:hover {\n  background-color: #7dcfff;\n}'
      },
      {
        name: 'evaluator.js',
        folderId: componentsFolderId,
        content: '// AST Expression Evaluator (Shunting-Yard Infix to RPN)\nwindow.CalculatorEvaluator = {\n  PRECEDENCE: { "+": 1, "-": 1, "*": 2, "/": 2 },\n  evaluate: function(expr) {\n    if (!expr) return 0;\n    try {\n      var tokens = this.tokenize(expr);\n      var rpn = this.toRPN(tokens);\n      return this.solveRPN(rpn);\n    } catch (e) {\n      return "Error";\n    }\n  },\n  tokenize: function(expr) {\n    var tokens = [];\n    var i = 0;\n    var clean = expr.replace(/\\s+/g, "");\n    while (i < clean.length) {\n      var ch = clean[i];\n      if (/\\d|\\./.test(ch)) {\n        var numStr = "";\n        while (i < clean.length && /[0-9.]/.test(clean[i])) {\n          numStr += clean[i];\n          i++;\n        }\n        tokens.push({ type: "NUM", val: parseFloat(numStr) });\n        continue;\n      }\n      if ("+-*/()".includes(ch)) {\n        tokens.push({ type: "OP", val: ch });\n        i++;\n        continue;\n      }\n      i++;\n    }\n    return tokens;\n  },\n  toRPN: function(tokens) {\n    var queue = [];\n    var stack = [];\n    for (var k = 0; k < tokens.length; k++) {\n      var t = tokens[k];\n      if (t.type === "NUM") {\n        queue.push(t);\n      } else if (t.val === "(") {\n        stack.push(t);\n      } else if (t.val === ")") {\n        while (stack.length && stack[stack.length - 1].val !== "(") {\n          queue.push(stack.pop());\n        }\n        stack.pop();\n      } else {\n        while (\n          stack.length &&\n          stack[stack.length - 1].val !== "(" &&\n          this.PRECEDENCE[stack[stack.length - 1].val] >= this.PRECEDENCE[t.val]\n        ) {\n          queue.push(stack.pop());\n        }\n        stack.push(t);\n      }\n    }\n    while (stack.length) queue.push(stack.pop());\n    return queue;\n  },\n  solveRPN: function(rpn) {\n    var stack = [];\n    for (var k = 0; k < rpn.length; k++) {\n      var t = rpn[k];\n      if (t.type === "NUM") {\n        stack.push(t.val);\n      } else {\n        var b = stack.pop();\n        var a = stack.pop();\n        if (t.val === "+") stack.push(a + b);\n        else if (t.val === "-") stack.push(a - b);\n        else if (t.val === "*") stack.push(a * b);\n        else if (t.val === "/") {\n          if (b === 0) throw new Error("Div0");\n          stack.push(a / b);\n        }\n      }\n    }\n    var res = stack[0];\n    return Math.round(res * 1e10) / 1e10;\n  }\n};'
      },
      {
        name: 'app.js',
        folderId: jsFolderId,
        content: '// Calculator Event Loop & State Controller\nvar currentInput = "";\nvar historyList = [];\ntry {\n  historyList = JSON.parse(localStorage.getItem("godfy_calc_hist") || "[]");\n} catch (e) { historyList = []; }\n\nvar mainDisplay = document.getElementById("mainDisplay");\nvar expressionDisplay = document.getElementById("expressionDisplay");\nvar historyListEl = document.getElementById("historyList");\nvar clearHistoryBtn = document.getElementById("clearHistoryBtn");\n\nfunction updateDisplay() {\n  mainDisplay.textContent = currentInput || "0";\n}\n\nfunction handleInput(key) {\n  if (key === "clear") {\n    currentInput = "";\n    expressionDisplay.textContent = "";\n    updateDisplay();\n  } else if (key === "delete") {\n    currentInput = currentInput.slice(0, -1);\n    updateDisplay();\n  } else if (key === "=") {\n    if (!currentInput) return;\n    var result = window.CalculatorEvaluator.evaluate(currentInput);\n    expressionDisplay.textContent = currentInput + " =";\n    historyList.unshift({ expr: currentInput, result: result });\n    if (historyList.length > 10) historyList.pop();\n    try { localStorage.setItem("godfy_calc_hist", JSON.stringify(historyList)); } catch (e) {}\n    renderHistory();\n    currentInput = String(result);\n    updateDisplay();\n  } else {\n    var isOp = ["+", "-", "*", "/"].includes(key);\n    var lastChar = currentInput.slice(-1);\n    if (isOp && ["+", "-", "*", "/"].includes(lastChar)) {\n      currentInput = currentInput.slice(0, -1) + key;\n    } else {\n      currentInput += key;\n    }\n    updateDisplay();\n  }\n}\n\nfunction renderHistory() {\n  if (historyList.length === 0) {\n    historyListEl.innerHTML = \'<div class="text-[11px] text-[#565f89] text-center py-1">No calculations yet</div>\';\n    return;\n  }\n  historyListEl.innerHTML = historyList.map(function(h) {\n    return \'<div class="flex justify-between items-center py-1 px-2 rounded hover:bg-[#1f2335] cursor-pointer" onclick="currentInput=\\\'\' + h.result + \'\\\'; updateDisplay();"><span class="text-[#565f89] truncate max-w-[140px]">\' + h.expr + \'</span><span class="text-[#7dcfff] font-bold">=\' + h.result + \'</span></div>\';\n  }).join("");\n}\n\ndocument.querySelectorAll(".calc-btn").forEach(function(btn) {\n  btn.addEventListener("click", function() { handleInput(btn.dataset.key); });\n});\n\nclearHistoryBtn.addEventListener("click", function() {\n  historyList = [];\n  try { localStorage.removeItem("godfy_calc_hist"); } catch (e) {}\n  renderHistory();\n});\n\nwindow.addEventListener("keydown", function(e) {\n  if (/[0-9+\\-*/().]/.test(e.key)) {\n    handleInput(e.key);\n  } else if (e.key === "Enter") {\n    handleInput("=");\n  } else if (e.key === "Backspace") {\n    handleInput("delete");\n  } else if (e.key === "Escape") {\n    handleInput("clear");\n  }\n});\n\nrenderHistory();'
      },
      {
        name: 'README.md',
        folderId: 'root',
        content: '# ' + titleCased + '\n\nA scientific and arithmetic calculator powered by Dijkstra\'s Shunting-Yard AST algorithm in Tokyo Night theme.\n\n## Architecture:\n- index.html: Precision numeric keypad and dual display.\n- src/styles/calc.css: Tokyo Night button hierarchy and tactile press states.\n- src/js/components/evaluator.js: Infix-to-RPN token parser and zero-eval math engine.\n- src/js/app.js: Keyboard listeners and localStorage computation history.\n'
      }
    ];
  }

  // ==========================================
  // ARCHETYPE 3: TODO LIST & KANBAN MANAGER
  // ==========================================
  else if (isTodo) {
    filesToGenerate = [
      {
        name: 'index.html',
        folderId: 'root',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + titleCased + ' | Tokyo Night Kanban</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n  <link rel="stylesheet" href="src/styles/kanban.css">\n</head>\n<body class="bg-[#1a1b26] text-[#c0caf5] min-h-screen p-4 sm:p-6 font-sans antialiased">\n  <div class="max-w-6xl mx-auto">\n    <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#292e42]">\n      <div class="flex items-center space-x-3">\n        <div class="w-10 h-10 rounded-xl bg-[#7aa2f7]/15 border border-[#7aa2f7]/30 flex items-center justify-center text-lg">\n          📋\n        </div>\n        <div>\n          <h1 class="text-xl font-extrabold text-white">' + titleCased + '</h1>\n          <p class="text-xs text-[#565f89] font-mono">Tokyo Night Task & Kanban System</p>\n        </div>\n      </div>\n      <div class="flex items-center space-x-3 w-full sm:w-auto">\n        <input id="searchInput" type="text" placeholder="Search tasks..." class="bg-[#16161e] border border-[#292e42] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7aa2f7] w-full sm:w-48 transition" />\n        <button id="newTaskBtn" class="px-4 py-2 rounded-xl bg-[#7aa2f7] hover:bg-[#7dcfff] text-[#16161e] font-bold text-xs whitespace-nowrap transition shadow-sm">\n          + New Task\n        </button>\n      </div>\n    </header>\n\n    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">\n      <div class="kanban-col bg-[#16161e] border border-[#292e42] rounded-2xl p-4 flex flex-col">\n        <div class="flex justify-between items-center mb-4 pb-2 border-b border-[#292e42]">\n          <span class="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2">\n            <span class="w-2 h-2 rounded-full bg-[#7dcfff]"></span>\n            <span>To Do</span>\n          </span>\n          <span id="countTodo" class="text-xs font-mono px-2 py-0.5 rounded-full bg-[#1f2335] text-[#7dcfff]">0</span>\n        </div>\n        <div id="colTodo" class="space-y-3 flex-1 min-h-[300px]"></div>\n      </div>\n\n      <div class="kanban-col bg-[#16161e] border border-[#292e42] rounded-2xl p-4 flex flex-col">\n        <div class="flex justify-between items-center mb-4 pb-2 border-b border-[#292e42]">\n          <span class="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2">\n            <span class="w-2 h-2 rounded-full bg-[#e0af68]"></span>\n            <span>In Progress</span>\n          </span>\n          <span id="countProgress" class="text-xs font-mono px-2 py-0.5 rounded-full bg-[#1f2335] text-[#e0af68]">0</span>\n        </div>\n        <div id="colProgress" class="space-y-3 flex-1 min-h-[300px]"></div>\n      </div>\n\n      <div class="kanban-col bg-[#16161e] border border-[#292e42] rounded-2xl p-4 flex flex-col">\n        <div class="flex justify-between items-center mb-4 pb-2 border-b border-[#292e42]">\n          <span class="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2">\n            <span class="w-2 h-2 rounded-full bg-[#9ece6a]"></span>\n            <span>Completed</span>\n          </span>\n          <span id="countDone" class="text-xs font-mono px-2 py-0.5 rounded-full bg-[#1f2335] text-[#9ece6a]">0</span>\n        </div>\n        <div id="colDone" class="space-y-3 flex-1 min-h-[300px]"></div>\n      </div>\n    </div>\n  </div>\n\n  <script src="src/js/components/storage.js"></script>\n  <script src="src/js/app.js"></script>\n</body>\n</html>'
      },
      {
        name: 'kanban.css',
        folderId: cssFolderId,
        content: '/* Tokyo Night Kanban Styles */\n.task-card {\n  background-color: #1f2335;\n  border: 1px solid #292e42;\n  border-radius: 12px;\n  padding: 14px;\n  transition: all 0.2s ease;\n}\n.task-card:hover {\n  border-color: #7aa2f7;\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px -5px rgba(0, 0, 0, 0.4);\n}\n.priority-high {\n  background-color: rgba(247, 118, 142, 0.15);\n  color: #f7768e;\n  border: 1px solid rgba(247, 118, 142, 0.3);\n}\n.priority-medium {\n  background-color: rgba(224, 175, 104, 0.15);\n  color: #e0af68;\n  border: 1px solid rgba(224, 175, 104, 0.3);\n}\n.priority-low {\n  background-color: rgba(158, 206, 106, 0.15);\n  color: #9ece6a;\n  border: 1px solid rgba(158, 206, 106, 0.3);\n}'
      },
      {
        name: 'storage.js',
        folderId: componentsFolderId,
        content: '// Task Storage & Schema Manager\nwindow.TaskStore = {\n  KEY: "godfy_kanban_tasks",\n  getTasks: function() {\n    var raw = localStorage.getItem(this.KEY);\n    if (!raw) {\n      var defaultTasks = [\n        { id: "1", title: "Initialize Tokyo Night Palette", priority: "high", column: "done", desc: "Configure CSS variables & Cursor tokens" },\n        { id: "2", title: "Synthesize Real Code Logic", priority: "high", column: "progress", desc: "Eliminate dummy stubs and connect AST parser" },\n        { id: "3", title: "Deploy Multi-File Studio", priority: "medium", column: "todo", desc: "Wire up tabs, folder creation, and rename tools" }\n      ];\n      this.saveTasks(defaultTasks);\n      return defaultTasks;\n    }\n    try {\n      return JSON.parse(raw);\n    } catch (e) {\n      return [];\n    }\n  },\n  saveTasks: function(tasks) {\n    localStorage.setItem(this.KEY, JSON.stringify(tasks));\n  }\n};'
      },
      {
        name: 'app.js',
        folderId: jsFolderId,
        content: '// Kanban Interactive Logic\nvar tasks = window.TaskStore.getTasks();\nvar colTodo = document.getElementById("colTodo");\nvar colProgress = document.getElementById("colProgress");\nvar colDone = document.getElementById("colDone");\nvar countTodo = document.getElementById("countTodo");\nvar countProgress = document.getElementById("countProgress");\nvar countDone = document.getElementById("countDone");\nvar newTaskBtn = document.getElementById("newTaskBtn");\nvar searchInput = document.getElementById("searchInput");\n\nfunction render() {\n  var query = (searchInput.value || "").toLowerCase();\n  var filtered = tasks.filter(function(t) {\n    return t.title.toLowerCase().includes(query) || (t.desc || "").toLowerCase().includes(query);\n  });\n\n  var todo = filtered.filter(function(t) { return t.column === "todo"; });\n  var progress = filtered.filter(function(t) { return t.column === "progress"; });\n  var done = filtered.filter(function(t) { return t.column === "done"; });\n\n  countTodo.textContent = todo.length;\n  countProgress.textContent = progress.length;\n  countDone.textContent = done.length;\n\n  colTodo.innerHTML = renderCards(todo, "todo");\n  colProgress.innerHTML = renderCards(progress, "progress");\n  colDone.innerHTML = renderCards(done, "done");\n}\n\nfunction renderCards(list, currentCol) {\n  if (list.length === 0) {\n    return \'<div class="text-xs text-[#565f89] text-center py-8">No tasks here</div>\';\n  }\n  return list.map(function(t) {\n    return \'<div class="task-card">\' +\n      \'<div class="flex justify-between items-start mb-2">\' +\n        \'<span class="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold priority-\' + t.priority + \'">\' + t.priority.toUpperCase() + \'</span>\' +\n        \'<button onclick="deleteTask(\\\\\'\' + t.id + \'\\\\\')" class="text-xs text-[#565f89] hover:text-[#f7768e] transition">✕</button>\' +\n      \'</div>\' +\n      \'<h4 class="text-sm font-bold text-white mb-1">\' + t.title + \'</h4>\' +\n      \'<p class="text-xs text-[#565f89] mb-3 leading-relaxed">\' + (t.desc || "") + \'</p>\' +\n      \'<div class="flex gap-2 pt-2 border-t border-[#292e42]/60">\' +\n        (currentCol !== "todo" ? \'<button onclick="moveTask(\\\\\'\' + t.id + \'\\\\\', \\\\\'todo\\\\\')" class="text-[11px] font-mono text-[#7dcfff] hover:underline">← Todo</button>\' : "") +\n        (currentCol !== "progress" ? \'<button onclick="moveTask(\\\\\'\' + t.id + \'\\\\\', \\\\\'progress\\\\\')" class="text-[11px] font-mono text-[#e0af68] hover:underline">\' + (currentCol === "todo" ? "Start →" : "← Progress") + \'</button>\' : "") +\n        (currentCol !== "done" ? \'<button onclick="moveTask(\\\\\'\' + t.id + \'\\\\\', \\\\\'done\\\\\')" class="text-[11px] font-mono text-[#9ece6a] hover:underline">Done ✓</button>\' : "") +\n      \'</div>\' +\n    \'</div>\';\n  }).join("");\n}\n\nwindow.moveTask = function(id, nextCol) {\n  tasks = tasks.map(function(t) { return t.id === id ? Object.assign({}, t, { column: nextCol }) : t; });\n  window.TaskStore.saveTasks(tasks);\n  render();\n};\n\nwindow.deleteTask = function(id) {\n  tasks = tasks.filter(function(t) { return t.id !== id; });\n  window.TaskStore.saveTasks(tasks);\n  render();\n};\n\nnewTaskBtn.addEventListener("click", function() {\n  var title = prompt("Enter task title:");\n  if (!title || !title.trim()) return;\n  var desc = prompt("Enter task details:") || "";\n  var priority = prompt("Priority (low / medium / high):", "medium") || "medium";\n\n  var newTask = {\n    id: "t_" + Date.now(),\n    title: title.trim(),\n    desc: desc.trim(),\n    priority: ["low", "medium", "high"].includes(priority.toLowerCase()) ? priority.toLowerCase() : "medium",\n    column: "todo"\n  };\n\n  tasks.unshift(newTask);\n  window.TaskStore.saveTasks(tasks);\n  render();\n});\n\nsearchInput.addEventListener("input", render);\nrender();'
      },
      {
        name: 'README.md',
        folderId: 'root',
        content: '# ' + titleCased + '\n\nA responsive Tokyo Night Kanban task board with search filtering and persistent browser storage.\n\n## Architecture:\n- index.html: 3-column responsive layout with real-time counters.\n- src/styles/kanban.css: Tokyo Night cards, priority badges, and glow borders.\n- src/js/components/storage.js: LocalStorage persistence provider.\n- src/js/app.js: Card lifecycle manager, search indexer, and state transitions.\n'
      }
    ];
  }

  // ==========================================
  // ARCHETYPE 4: WEATHER DASHBOARD & METRICS
  // ==========================================
  else if (isWeather) {
    filesToGenerate = [
      {
        name: 'index.html',
        folderId: 'root',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + titleCased + ' | Tokyo Night Weather</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n  <link rel="stylesheet" href="src/styles/weather.css">\n</head>\n<body class="bg-[#1a1b26] text-[#c0caf5] min-h-screen p-4 sm:p-8 font-sans antialiased flex flex-col items-center justify-center">\n  <div class="w-full max-w-xl bg-[#16161e] border border-[#292e42] rounded-3xl p-6 sm:p-8 shadow-2xl">\n    <header class="flex items-center justify-between mb-8 pb-4 border-b border-[#292e42]">\n      <div class="flex items-center space-x-2.5">\n        <span class="text-2xl">⛅</span>\n        <div>\n          <h1 class="text-base font-bold text-white">' + titleCased + '</h1>\n          <p id="citySubtitle" class="text-xs text-[#565f89] font-mono">Tokyo, JP • Live Telemetry</p>\n        </div>\n      </div>\n      <div class="flex items-center space-x-2">\n        <select id="citySelect" class="bg-[#1f2335] border border-[#292e42] text-white text-xs font-mono rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#7aa2f7]">\n          <option value="tokyo">Tokyo</option>\n          <option value="san_francisco">San Francisco</option>\n          <option value="london">London</option>\n          <option value="paris">Paris</option>\n          <option value="new_york">New York</option>\n        </select>\n        <button id="unitToggle" class="px-3 py-1.5 rounded-xl bg-[#1f2335] border border-[#292e42] text-xs font-mono text-[#7dcfff] font-bold">°C</button>\n      </div>\n    </header>\n\n    <div class="bg-gradient-to-br from-[#1f2335] to-[#16161e] border border-[#292e42] rounded-2xl p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-center justify-between gap-6">\n      <div>\n        <div id="conditionBadge" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7aa2f7]/15 border border-[#7aa2f7]/30 text-xs font-mono text-[#7dcfff] font-bold mb-3">\n          <span>☀️ Clear Sky</span>\n        </div>\n        <div class="flex items-baseline space-x-2">\n          <span id="tempValue" class="text-6xl font-black text-white tracking-tight">18</span>\n          <span id="tempUnit" class="text-2xl font-bold text-[#7aa2f7]">°C</span>\n        </div>\n        <p id="feelText" class="text-xs text-[#565f89] mt-1 font-mono">Feels like 17° • Wind 9 km/h</p>\n      </div>\n      <div id="weatherIconLarge" class="text-6xl animate-pulse">\n        ☀️\n      </div>\n    </div>\n\n    <div class="grid grid-cols-3 gap-3 mb-6">\n      <div class="bg-[#1f2335] border border-[#292e42] rounded-xl p-3 text-center">\n        <span class="text-[10px] font-mono text-[#565f89] uppercase tracking-wider block mb-1">Humidity</span>\n        <span id="humidityVal" class="text-sm font-bold text-white font-mono">54%</span>\n      </div>\n      <div class="bg-[#1f2335] border border-[#292e42] rounded-xl p-3 text-center">\n        <span class="text-[10px] font-mono text-[#565f89] uppercase tracking-wider block mb-1">Wind</span>\n        <span id="windVal" class="text-sm font-bold text-white font-mono">11 km/h</span>\n      </div>\n      <div class="bg-[#1f2335] border border-[#292e42] rounded-xl p-3 text-center">\n        <span class="text-[10px] font-mono text-[#565f89] uppercase tracking-wider block mb-1">Precip</span>\n        <span id="precipVal" class="text-sm font-bold text-white font-mono">0 mm</span>\n      </div>\n    </div>\n\n    <div class="border-t border-[#292e42] pt-4">\n      <div class="text-[10px] font-mono text-[#565f89] uppercase tracking-wider mb-3">5-Day Forecast</div>\n      <div id="forecastContainer" class="grid grid-cols-5 gap-2 text-center text-xs font-mono"></div>\n    </div>\n  </div>\n\n  <script src="src/js/components/api.js"></script>\n  <script src="src/js/app.js"></script>\n</body>\n</html>'
      },
      {
        name: 'weather.css',
        folderId: cssFolderId,
        content: '/* Tokyo Night Weather Styles */\n:root {\n  --tokyo-bg: #1a1b26;\n  --tokyo-surface: #16161e;\n  --tokyo-card: #1f2335;\n  --tokyo-border: #292e42;\n  --tokyo-blue: #7aa2f7;\n  --tokyo-cyan: #7dcfff;\n}'
      },
      {
        name: 'api.js',
        folderId: componentsFolderId,
        content: '// Weather Telemetry Data Engine\nwindow.WeatherAPI = {\n  DATA: {\n    tokyo: { city: "Tokyo, JP", tempC: 18, cond: "Clear Sky", icon: "☀️", humidity: 52, wind: 9, precip: 0, forecast: [20, 19, 17, 18, 21] },\n    san_francisco: { city: "San Francisco, US", tempC: 15, cond: "Partly Cloudy", icon: "⛅", humidity: 68, wind: 18, precip: 0, forecast: [16, 15, 14, 16, 17] },\n    london: { city: "London, UK", tempC: 12, cond: "Scattered Showers", icon: "🌧️", humidity: 82, wind: 14, precip: 2.1, forecast: [13, 11, 10, 12, 14] },\n    paris: { city: "Paris, FR", tempC: 14, cond: "Overcast", icon: "☁️", humidity: 71, wind: 10, precip: 0.2, forecast: [15, 14, 13, 15, 16] },\n    new_york: { city: "New York, US", tempC: 16, cond: "Sunny Breeze", icon: "🌤️", humidity: 48, wind: 12, precip: 0, forecast: [17, 18, 16, 15, 19] }\n  },\n  getCityWeather: function(key) {\n    return this.DATA[key] || this.DATA.tokyo;\n  }\n};'
      },
      {
        name: 'app.js',
        folderId: jsFolderId,
        content: '// Weather Controller\nvar isCelsius = true;\nvar currentCityKey = "tokyo";\n\nvar citySelect = document.getElementById("citySelect");\nvar unitToggle = document.getElementById("unitToggle");\nvar citySubtitle = document.getElementById("citySubtitle");\nvar tempValue = document.getElementById("tempValue");\nvar tempUnit = document.getElementById("tempUnit");\nvar conditionBadge = document.getElementById("conditionBadge");\nvar weatherIconLarge = document.getElementById("weatherIconLarge");\nvar feelText = document.getElementById("feelText");\nvar humidityVal = document.getElementById("humidityVal");\nvar windVal = document.getElementById("windVal");\nvar precipVal = document.getElementById("precipVal");\nvar forecastContainer = document.getElementById("forecastContainer");\n\nfunction toDisplayTemp(c) {\n  return isCelsius ? Math.round(c) : Math.round(c * 1.8 + 32);\n}\n\nfunction updateWeather() {\n  var w = window.WeatherAPI.getCityWeather(currentCityKey);\n  citySubtitle.textContent = w.city + " • Live Telemetry";\n  tempValue.textContent = toDisplayTemp(w.tempC);\n  tempUnit.textContent = isCelsius ? "°C" : "°F";\n  unitToggle.textContent = isCelsius ? "°C" : "°F";\n  conditionBadge.innerHTML = "<span>" + w.icon + " " + w.cond + "</span>";\n  weatherIconLarge.textContent = w.icon;\n  feelText.textContent = "Feels like " + toDisplayTemp(w.tempC - 1) + "° • Wind " + w.wind + " km/h";\n  humidityVal.textContent = w.humidity + "%";\n  windVal.textContent = w.wind + " km/h";\n  precipVal.textContent = w.precip + " mm";\n\n  var days = ["Mon", "Tue", "Wed", "Thu", "Fri"];\n  forecastContainer.innerHTML = w.forecast.map(function(t, idx) {\n    return \'<div class="bg-[#1f2335] border border-[#292e42] rounded-xl p-2.5">\' +\n      \'<span class="text-[#565f89] block mb-1">\' + days[idx] + \'</span>\' +\n      \'<span class="text-sm font-bold text-white block">\' + toDisplayTemp(t) + \'°</span>\' +\n    \'</div>\';\n  }).join("");\n}\n\ncitySelect.addEventListener("change", function(e) {\n  currentCityKey = e.target.value;\n  updateWeather();\n});\n\nunitToggle.addEventListener("click", function() {\n  isCelsius = !isCelsius;\n  updateWeather();\n});\n\nupdateWeather();'
      },
      {
        name: 'README.md',
        folderId: 'root',
        content: '# ' + titleCased + '\n\nAn atmospheric weather telemetry dashboard in Tokyo Night palette.\n\n## Architecture:\n- index.html: Weather hero widget, telemetry metrics, and 5-day outlook.\n- src/styles/weather.css: Design tokens and dark card styling.\n- src/js/components/api.js: Weather telemetry data provider.\n- src/js/app.js: Unit conversion (°C/°F) and reactive UI binding.\n'
      }
    ];
  }

  // ==========================================
  // ARCHETYPE 5: INTERACTIVE CANVAS GAME
  // ==========================================
  else if (isGame) {
    filesToGenerate = [
      {
        name: 'index.html',
        folderId: 'root',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + titleCased + ' | Tokyo Night Arcade</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n  <link rel="stylesheet" href="src/styles/game.css">\n</head>\n<body class="bg-[#1a1b26] text-[#c0caf5] min-h-screen flex flex-col items-center justify-center p-4 font-sans antialiased">\n  <div class="max-w-md w-full bg-[#16161e] border border-[#292e42] rounded-2xl p-6 shadow-2xl text-center">\n    <header class="flex justify-between items-center mb-4 pb-3 border-b border-[#292e42]">\n      <div class="text-left">\n        <h1 class="text-base font-extrabold text-white font-mono">' + titleCased + '</h1>\n        <p class="text-[10px] text-[#565f89] font-mono">60 FPS Tokyo Night Engine</p>\n      </div>\n      <div class="flex space-x-3 font-mono text-xs">\n        <div>Score: <span id="scoreDisplay" class="text-[#7dcfff] font-bold">0</span></div>\n        <div>High: <span id="highScoreDisplay" class="text-[#9ece6a] font-bold">0</span></div>\n      </div>\n    </header>\n\n    <div class="relative inline-block mb-4">\n      <canvas id="gameCanvas" width="380" height="380" class="rounded-xl border border-[#292e42] shadow-inner bg-[#16161e]"></canvas>\n      <div id="gameOverlay" class="absolute inset-0 bg-[#16161e]/85 rounded-xl flex flex-col items-center justify-center p-6">\n        <h2 id="overlayTitle" class="text-xl font-black text-white font-mono mb-2">Tokyo Night Arcade</h2>\n        <p class="text-xs text-[#565f89] mb-4">Use Arrow Keys or WASD to navigate</p>\n        <button id="startBtn" class="px-6 py-2.5 rounded-xl bg-[#7aa2f7] hover:bg-[#7dcfff] text-[#16161e] font-bold text-xs uppercase tracking-wider font-mono shadow-lg transition">\n          Play Game\n        </button>\n      </div>\n    </div>\n\n    <div class="grid grid-cols-3 gap-2 max-w-[180px] mx-auto mb-2 md:hidden">\n      <div></div>\n      <button class="dpad-btn py-2.5 rounded-lg bg-[#1f2335] text-white" data-dir="up">▲</button>\n      <div></div>\n      <button class="dpad-btn py-2.5 rounded-lg bg-[#1f2335] text-white" data-dir="left">◀</button>\n      <button class="dpad-btn py-2.5 rounded-lg bg-[#1f2335] text-white" data-dir="down">▼</button>\n      <button class="dpad-btn py-2.5 rounded-lg bg-[#1f2335] text-white" data-dir="right">▶</button>\n    </div>\n  </div>\n\n  <script src="src/js/components/audio.js"></script>\n  <script src="src/js/game.js"></script>\n</body>\n</html>'
      },
      {
        name: 'game.css',
        folderId: cssFolderId,
        content: '/* Tokyo Night Game Styles */\n#gameCanvas {\n  background: #16161e;\n}\n.dpad-btn:active {\n  background-color: #7aa2f7 !important;\n  color: #16161e !important;\n}'
      },
      {
        name: 'audio.js',
        folderId: componentsFolderId,
        content: '// Web Audio Sound Effects for Arcade\nwindow.GameAudio = {\n  ctx: null,\n  init: function() {\n    if (!this.ctx && typeof window !== "undefined") {\n      var AudioCtx = window.AudioContext || window.webkitAudioContext;\n      if (AudioCtx) this.ctx = new AudioCtx();\n    }\n  },\n  playTone: function(freq, dur) {\n    try {\n      this.init();\n      if (!this.ctx) return;\n      if (this.ctx.state === "suspended") this.ctx.resume();\n      var osc = this.ctx.createOscillator();\n      var gain = this.ctx.createGain();\n      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);\n      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);\n      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);\n      osc.connect(gain);\n      gain.connect(this.ctx.destination);\n      osc.start();\n      osc.stop(this.ctx.currentTime + dur);\n    } catch (e) {}\n  },\n  playEat: function() { this.playTone(880, 0.08); },\n  playOver: function() { this.playTone(220, 0.25); }\n};'
      },
      {
        name: 'game.js',
        folderId: jsFolderId,
        content: '// 60 FPS Snake Arcade Logic\nvar canvas = document.getElementById("gameCanvas");\nvar ctx = canvas.getContext("2d");\nvar scoreDisplay = document.getElementById("scoreDisplay");\nvar highScoreDisplay = document.getElementById("highScoreDisplay");\nvar overlay = document.getElementById("gameOverlay");\nvar overlayTitle = document.getElementById("overlayTitle");\nvar startBtn = document.getElementById("startBtn");\n\nvar gridSize = 19;\nvar tileCount = 20;\n\nvar snake = [{ x: 10, y: 10 }];\nvar food = { x: 5, y: 5 };\nvar dx = 0;\nvar dy = 0;\nvar score = 0;\nvar highScore = parseInt(localStorage.getItem("godfy_arcade_high") || "0", 10);\nvar gameInterval = null;\nvar isPlaying = false;\n\nhighScoreDisplay.textContent = highScore;\n\nfunction resetGame() {\n  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];\n  dx = 1;\n  dy = 0;\n  score = 0;\n  scoreDisplay.textContent = score;\n  spawnFood();\n}\n\nfunction spawnFood() {\n  food = {\n    x: Math.floor(Math.random() * tileCount),\n    y: Math.floor(Math.random() * tileCount)\n  };\n}\n\nfunction step() {\n  var head = { x: snake[0].x + dx, y: snake[0].y + dy };\n\n  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {\n    return gameOver();\n  }\n\n  if (snake.some(function(segment) { return segment.x === head.x && segment.y === head.y; })) {\n    return gameOver();\n  }\n\n  snake.unshift(head);\n\n  if (head.x === food.x && head.y === food.y) {\n    score += 10;\n    scoreDisplay.textContent = score;\n    if (score > highScore) {\n      highScore = score;\n      highScoreDisplay.textContent = highScore;\n      localStorage.setItem("godfy_arcade_high", String(highScore));\n    }\n    if (window.GameAudio) window.GameAudio.playEat();\n    spawnFood();\n  } else {\n    snake.pop();\n  }\n\n  draw();\n}\n\nfunction draw() {\n  ctx.fillStyle = "#16161e";\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n\n  ctx.strokeStyle = "#1f2335";\n  ctx.lineWidth = 0.5;\n  for (var i = 0; i < canvas.width; i += gridSize) {\n    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();\n    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();\n  }\n\n  ctx.fillStyle = "#7dcfff";\n  ctx.shadowColor = "#7dcfff";\n  ctx.shadowBlur = 10;\n  ctx.beginPath();\n  ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);\n  ctx.fill();\n  ctx.shadowBlur = 0;\n\n  snake.forEach(function(s, idx) {\n    ctx.fillStyle = idx === 0 ? "#bb9af7" : "#7aa2f7";\n    ctx.fillRect(s.x * gridSize + 1, s.y * gridSize + 1, gridSize - 2, gridSize - 2);\n  });\n}\n\nfunction gameOver() {\n  clearInterval(gameInterval);\n  isPlaying = false;\n  if (window.GameAudio) window.GameAudio.playOver();\n  overlayTitle.textContent = "Game Over";\n  startBtn.textContent = "Play Again";\n  overlay.classList.remove("hidden");\n}\n\nfunction startGame() {\n  resetGame();\n  overlay.classList.add("hidden");\n  isPlaying = true;\n  clearInterval(gameInterval);\n  gameInterval = setInterval(step, 110);\n}\n\nstartBtn.addEventListener("click", startGame);\n\nwindow.addEventListener("keydown", function(e) {\n  if (!isPlaying) return;\n  if ((e.key === "ArrowUp" || e.key === "w") && dy === 0) { dx = 0; dy = -1; }\n  else if ((e.key === "ArrowDown" || e.key === "s") && dy === 0) { dx = 0; dy = 1; }\n  else if ((e.key === "ArrowLeft" || e.key === "a") && dx === 0) { dx = -1; dy = 0; }\n  else if ((e.key === "ArrowRight" || e.key === "d") && dx === 0) { dx = 1; dy = 0; }\n});\n\ndocument.querySelectorAll(".dpad-btn").forEach(function(b) {\n  b.addEventListener("click", function() {\n    var dir = b.dataset.dir;\n    if (dir === "up" && dy === 0) { dx = 0; dy = -1; }\n    else if (dir === "down" && dy === 0) { dx = 0; dy = 1; }\n    else if (dir === "left" && dx === 0) { dx = -1; dy = 0; }\n    else if (dir === "right" && dx === 0) { dx = 1; dy = 0; }\n  });\n});\n\ndraw();'
      },
      {
        name: 'README.md',
        folderId: 'root',
        content: '# ' + titleCased + '\n\nA high-framerate 60 FPS Canvas Arcade game built with Tokyo Night visuals and sound synthesis.\n\n## Controls:\n- Arrow Keys / WASD: Steer direction\n- Mobile: On-screen tactical D-Pad\n'
      }
    ];
  }

  // ==========================================
  // ARCHETYPE 6: ANALYTICS & METRICS DASHBOARD
  // ==========================================
  else if (isDashboard) {
    filesToGenerate = [
      {
        name: 'index.html',
        folderId: 'root',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + titleCased + ' | Tokyo Night Console</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n  <link rel="stylesheet" href="src/styles/dashboard.css">\n</head>\n<body class="bg-[#1a1b26] text-[#c0caf5] min-h-screen p-6 font-sans antialiased">\n  <div class="max-w-7xl mx-auto">\n    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-[#292e42]">\n      <div class="flex items-center space-x-3">\n        <div class="w-10 h-10 rounded-xl bg-[#7aa2f7]/15 border border-[#7aa2f7]/30 flex items-center justify-center font-bold text-[#7dcfff] font-mono">\n          ' + titleCased.charAt(0) + '\n        </div>\n        <div>\n          <h1 class="text-xl font-black text-white tracking-tight">' + titleCased + ' Telemetry</h1>\n          <p class="text-xs text-[#565f89] font-mono">Real-Time Cluster Monitoring • 16 Active Nodes</p>\n        </div>\n      </div>\n      <div class="flex items-center space-x-3">\n        <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#9ece6a]/15 text-[#9ece6a] text-xs font-mono font-bold border border-[#9ece6a]/30">\n          <span class="w-2 h-2 rounded-full bg-[#9ece6a] animate-pulse"></span>\n          <span>All Nodes Healthy</span>\n        </span>\n        <button id="syncBtn" class="px-3.5 py-1.5 rounded-xl bg-[#1f2335] hover:bg-[#292e42] border border-[#292e42] text-xs font-mono text-white transition">\n          ↻ Sync Metrics\n        </button>\n      </div>\n    </header>\n\n    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">\n      <div class="bg-[#16161e] border border-[#292e42] rounded-2xl p-5">\n        <span class="text-xs font-mono text-[#565f89] block mb-1">TOTAL REQUESTS</span>\n        <div id="metricRequests" class="text-2xl font-black text-white font-mono">1,482,910</div>\n        <span class="text-[11px] text-[#9ece6a] font-mono mt-1 block">↑ +14.2% from last hour</span>\n      </div>\n      <div class="bg-[#16161e] border border-[#292e42] rounded-2xl p-5">\n        <span class="text-xs font-mono text-[#565f89] block mb-1">P99 LATENCY</span>\n        <div id="metricLatency" class="text-2xl font-black text-[#7dcfff] font-mono">14.2 ms</div>\n        <span class="text-[11px] text-[#7dcfff] font-mono mt-1 block">Optimal response curve</span>\n      </div>\n      <div class="bg-[#16161e] border border-[#292e42] rounded-2xl p-5">\n        <span class="text-xs font-mono text-[#565f89] block mb-1">ERROR RATE</span>\n        <div id="metricErrors" class="text-2xl font-black text-[#9ece6a] font-mono">0.002%</div>\n        <span class="text-[11px] text-[#9ece6a] font-mono mt-1 block">Zero unhandled exceptions</span>\n      </div>\n      <div class="bg-[#16161e] border border-[#292e42] rounded-2xl p-5">\n        <span class="text-xs font-mono text-[#565f89] block mb-1">CLUSTER UPTIME</span>\n        <div class="text-2xl font-black text-white font-mono">99.998%</div>\n        <span class="text-[11px] text-[#565f89] font-mono mt-1 block">42 days uninterrupted</span>\n      </div>\n    </div>\n\n    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">\n      <div class="lg:col-span-2 bg-[#16161e] border border-[#292e42] rounded-2xl p-6">\n        <div class="flex justify-between items-center mb-6">\n          <h3 class="text-sm font-bold text-white uppercase tracking-wider font-mono">Throughput Graph (24h)</h3>\n          <span class="text-xs text-[#7dcfff] font-mono">Live SVG Stream</span>\n        </div>\n        <div id="chartContainer" class="h-56 flex items-end space-x-2 pt-6"></div>\n      </div>\n\n      <div class="bg-[#16161e] border border-[#292e42] rounded-2xl p-6">\n        <div class="flex justify-between items-center mb-4">\n          <h3 class="text-sm font-bold text-white uppercase tracking-wider font-mono">Audit Log Stream</h3>\n          <button id="streamToggle" class="text-xs text-[#7aa2f7] hover:underline font-mono">Live</button>\n        </div>\n        <div id="logContainer" class="space-y-2 text-xs font-mono max-h-56 overflow-y-auto pr-1"></div>\n      </div>\n    </div>\n  </div>\n\n  <script src="src/js/components/metrics.js"></script>\n  <script src="src/js/app.js"></script>\n</body>\n</html>'
      },
      {
        name: 'dashboard.css',
        folderId: cssFolderId,
        content: '/* Tokyo Night Dashboard Styles */\n:root {\n  --tokyo-bg: #1a1b26;\n  --tokyo-surface: #16161e;\n  --tokyo-card: #1f2335;\n  --tokyo-border: #292e42;\n  --tokyo-blue: #7aa2f7;\n  --tokyo-cyan: #7dcfff;\n}'
      },
      {
        name: 'metrics.js',
        folderId: componentsFolderId,
        content: '// Real-time Telemetry Aggregator\nwindow.MetricsEngine = {\n  HOURLY_DATA: [45, 62, 58, 71, 84, 96, 88, 105, 120, 115, 130, 142, 138, 155, 162, 170, 168, 185, 192, 188, 205, 220, 215, 238],\n  generateLog: function() {\n    var events = ["CACHE_HIT", "AUTH_TOKEN_ROTATED", "DB_CHECKPOINT", "QUERY_COMPLETED", "TLS_HANDSHAKE"];\n    var regions = ["us-east-1", "eu-west-1", "ap-northeast-1", "sa-east-1"];\n    return {\n      event: events[Math.floor(Math.random() * events.length)],\n      region: regions[Math.floor(Math.random() * regions.length)],\n      time: new Date().toLocaleTimeString(),\n      latency: Math.floor(8 + Math.random() * 15) + "ms"\n    };\n  }\n};'
      },
      {
        name: 'app.js',
        folderId: jsFolderId,
        content: '// Dashboard Render Controller\nvar chartContainer = document.getElementById("chartContainer");\nvar logContainer = document.getElementById("logContainer");\nvar syncBtn = document.getElementById("syncBtn");\n\nfunction renderChart() {\n  var data = window.MetricsEngine.HOURLY_DATA;\n  var max = Math.max.apply(Math, data);\n  chartContainer.innerHTML = data.map(function(v) {\n    var pct = Math.round((v / max) * 100);\n    return \'<div class="flex-1 flex flex-col items-center group relative h-full justify-end">\' +\n      \'<div class="w-full bg-[#1f2335] group-hover:bg-[#7aa2f7] transition rounded-t" style="height: \' + pct + \'%"></div>\' +\n    \'</div>\';\n  }).join("");\n}\n\nfunction appendLog() {\n  var log = window.MetricsEngine.generateLog();\n  var item = document.createElement("div");\n  item.className = "p-2 rounded-lg bg-[#1f2335] border border-[#292e42] flex justify-between items-center";\n  item.innerHTML = \'<div><span class="text-white block font-bold">\' + log.event + \'</span><span class="text-[10px] text-[#565f89]">\' + log.region + \'</span></div><span class="text-[10px] text-[#7dcfff]">\' + log.latency + \'</span>\';\n  logContainer.prepend(item);\n  if (logContainer.children.length > 8) {\n    logContainer.removeChild(logContainer.lastChild);\n  }\n}\n\nsyncBtn.addEventListener("click", function() {\n  renderChart();\n  appendLog();\n});\n\nrenderChart();\nfor (var i = 0; i < 4; i++) appendLog();\nsetInterval(appendLog, 3000);'
      },
      {
        name: 'README.md',
        folderId: 'root',
        content: '# ' + titleCased + ' Dashboard\n\nA real-time developer operations and telemetry console styled in Tokyo Night.\n\n## Architecture:\n- index.html: Multi-node metrics dashboard with KPI summaries.\n- src/styles/dashboard.css: Tokyo Night design system and layout.\n- src/js/components/metrics.js: Telemetry generation and aggregation logic.\n- src/js/app.js: SVG chart rendering and live event stream loop.\n'
      }
    ];
  }

  // ==========================================
  // ARCHETYPE 7: E-COMMERCE & DIGITAL STOREFRONT
  // ==========================================
  else if (isEcommerceOrFood) {
    filesToGenerate = [
      {
        name: 'index.html',
        folderId: 'root',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + titleCased + ' | Official Store</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n  <link rel="stylesheet" href="src/styles/shop.css">\n</head>\n<body class="bg-[#1a1b26] text-[#c0caf5] min-h-screen p-6 font-sans antialiased">\n  <div class="max-w-6xl mx-auto">\n    <header class="flex justify-between items-center mb-8 pb-4 border-b border-[#292e42]">\n      <div class="flex items-center space-x-3">\n        <div class="w-10 h-10 rounded-xl bg-[#7aa2f7]/20 border border-[#7aa2f7]/40 flex items-center justify-center font-bold text-[#7dcfff] font-mono text-lg">\n          ' + titleCased.charAt(0) + '\n        </div>\n        <div>\n          <h1 class="text-xl font-extrabold text-white">' + titleCased + '</h1>\n          <p class="text-xs text-[#565f89] font-mono">Artisanal Direct Offerings</p>\n        </div>\n      </div>\n      <div class="flex items-center space-x-3">\n        <button id="cartBtn" class="px-4 py-2 rounded-xl bg-[#1f2335] hover:bg-[#292e42] border border-[#292e42] text-xs font-mono text-white transition flex items-center space-x-2">\n          <span>🛒 Cart</span>\n          <span id="cartCountBadge" class="w-5 h-5 rounded-full bg-[#7aa2f7] text-[#16161e] font-bold flex items-center justify-center text-[10px]">0</span>\n        </button>\n      </div>\n    </header>\n\n    <div id="catalogGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>\n  </div>\n\n  <script src="src/js/components/catalog.js"></script>\n  <script src="src/js/app.js"></script>\n</body>\n</html>'
      },
      {
        name: 'shop.css',
        folderId: cssFolderId,
        content: '/* Tokyo Night Storefront Styles */\n:root {\n  --tokyo-bg: #1a1b26;\n  --tokyo-surface: #16161e;\n  --tokyo-card: #1f2335;\n  --tokyo-border: #292e42;\n  --tokyo-blue: #7aa2f7;\n  --tokyo-cyan: #7dcfff;\n}'
      },
      {
        name: 'catalog.js',
        folderId: componentsFolderId,
        content: '// Storefront Catalog Items\nwindow.StoreCatalog = [\n  { id: "1", name: "Signature Edition", price: 29.00, badge: "Bestseller", desc: "Crafted with premium materials and rigorous quality testing." },\n  { id: "2", name: "Reserve Single-Origin", price: 45.00, badge: "Limited", desc: "Rare artisanal batch roasted with unparalleled precision." },\n  { id: "3", name: "Developer Pro Kit", price: 69.00, badge: "Popular", desc: "Comprehensive bundle engineered for high performance." }\n];'
      },
      {
        name: 'app.js',
        folderId: jsFolderId,
        content: '// Storefront Shopping Controller\nvar cart = [];\nvar catalogGrid = document.getElementById("catalogGrid");\nvar cartCountBadge = document.getElementById("cartCountBadge");\nvar cartBtn = document.getElementById("cartBtn");\n\nfunction renderCatalog() {\n  catalogGrid.innerHTML = window.StoreCatalog.map(function(item) {\n    return \'<div class="bg-[#16161e] border border-[#292e42] rounded-2xl p-6 flex flex-col justify-between hover:border-[#7aa2f7] transition">\' +\n      \'<div>\' +\n        \'<div class="flex justify-between items-center mb-3">\' +\n          \'<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#7aa2f7]/15 text-[#7dcfff] border border-[#7aa2f7]/30">\' + item.badge + \'</span>\' +\n          \'<span class="text-xl font-black text-white font-mono">$\' + item.price.toFixed(2) + \'</span>\' +\n        \'</div>\' +\n        \'<h3 class="text-base font-bold text-white mb-1">\' + item.name + \'</h3>\' +\n        \'<p class="text-xs text-[#565f89] leading-relaxed mb-6">\' + item.desc + \'</p>\' +\n      \'</div>\' +\n      \'<button onclick="addToCart(\\\\\'\' + item.id + \'\\\\\')" class="w-full py-2.5 rounded-xl bg-[#7aa2f7] hover:bg-[#7dcfff] text-[#16161e] font-bold text-xs transition">\' +\n        \'Add to Cart\' +\n      \'</button>\' +\n    \'</div>\';\n  }).join("");\n}\n\nwindow.addToCart = function(id) {\n  var item = window.StoreCatalog.find(function(i) { return i.id === id; });\n  if (!item) return;\n  cart.push(item);\n  cartCountBadge.textContent = cart.length;\n  alert(\'Added "\' + item.name + \'" to cart!\');\n};\n\ncartBtn.addEventListener("click", function() {\n  if (cart.length === 0) {\n    alert("Your cart is currently empty!");\n    return;\n  }\n  var total = cart.reduce(function(sum, item) { return sum + item.price; }, 0);\n  alert("Cart total (" + cart.length + " items): $" + total.toFixed(2));\n});\n\nrenderCatalog();'
      },
      {
        name: 'README.md',
        folderId: 'root',
        content: '# ' + titleCased + '\n\nA modern digital storefront styled in Tokyo Night.\n\n## Architecture:\n- index.html: Responsive product showcase and cart badge.\n- src/styles/shop.css: Tokyo Night design tokens.\n- src/js/components/catalog.js: Product inventory models.\n- src/js/app.js: Reactive shopping cart and checkout calculation.\n'
      }
    ];
  }

  // ==========================================
  // ARCHETYPE 8: GENERAL BESPOKE APPLICATION
  // ==========================================
  else {
    filesToGenerate = [
      {
        name: 'index.html',
        folderId: 'root',
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + titleCased + ' | Official Experience</title>\n  <script src="https://cdn.tailwindcss.com"></script>\n  <link rel="stylesheet" href="src/styles/theme.css">\n</head>\n<body class="min-h-screen bg-[#1a1b26] text-[#c0caf5] antialiased font-sans p-6 sm:p-8">\n  <div class="max-w-5xl mx-auto">\n    <header class="flex justify-between items-center mb-8 pb-4 border-b border-[#292e42]">\n      <div class="flex items-center space-x-3">\n        <div class="w-10 h-10 rounded-xl bg-[#7aa2f7]/20 border border-[#7aa2f7]/40 flex items-center justify-center font-bold text-[#7dcfff] font-mono text-lg">\n          ' + titleCased.charAt(0) + '\n        </div>\n        <div>\n          <h1 class="text-xl font-extrabold text-white">' + titleCased + '</h1>\n          <p class="text-xs text-[#565f89] font-mono">Bespoke Multi-File Architecture</p>\n        </div>\n      </div>\n      <div class="flex items-center space-x-2">\n        <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#7aa2f7]/15 text-[#7dcfff] text-xs font-mono font-bold border border-[#7aa2f7]/30">\n          <span class="w-2 h-2 rounded-full bg-[#7dcfff] animate-pulse"></span>\n          <span>Online</span>\n        </span>\n      </div>\n    </header>\n\n    <section class="bg-[#16161e] border border-[#292e42] rounded-2xl p-8 mb-8 text-center relative overflow-hidden">\n      <div class="max-w-2xl mx-auto">\n        <h2 class="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">\n          ' + titleCased + '\n        </h2>\n        <p class="text-sm text-[#565f89] leading-relaxed mb-6">\n          Custom multi-file application engineered from first principles in the Tokyo Night design palette.\n        </p>\n        <div class="flex justify-center gap-3">\n          <button id="actionPrimary" class="px-6 py-2.5 rounded-xl bg-[#7aa2f7] hover:bg-[#7dcfff] text-[#16161e] font-bold text-xs uppercase tracking-wider font-mono transition shadow-lg">\n            Run Application\n          </button>\n          <button id="actionSecondary" class="px-6 py-2.5 rounded-xl bg-[#1f2335] hover:bg-[#292e42] border border-[#292e42] text-white font-bold text-xs uppercase tracking-wider font-mono transition">\n            Inspect State\n          </button>\n        </div>\n      </div>\n    </section>\n\n    <div id="featureGrid" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"></div>\n\n    <div class="bg-[#16161e] border border-[#292e42] rounded-2xl p-5">\n      <div class="flex justify-between items-center mb-3">\n        <span class="text-xs font-mono font-bold text-[#7dcfff] uppercase tracking-wider">Runtime Console</span>\n        <span class="text-[10px] font-mono text-[#565f89]">Interactive State</span>\n      </div>\n      <div id="consoleOutput" class="bg-[#1f2335] rounded-xl p-4 font-mono text-xs text-[#c0caf5] space-y-1 max-h-36 overflow-y-auto">\n        <div class="text-[#565f89]">// Ready to execute ' + titleCased + ' routines...</div>\n      </div>\n    </div>\n  </div>\n\n  <script src="src/js/components/data.js"></script>\n  <script src="src/js/main.js"></script>\n</body>\n</html>'
      },
      {
        name: 'theme.css',
        folderId: cssFolderId,
        content: '/* Tokyo Night Theme Tokens */\n:root {\n  --tokyo-bg: #1a1b26;\n  --tokyo-surface: #16161e;\n  --tokyo-card: #1f2335;\n  --tokyo-border: #292e42;\n  --tokyo-blue: #7aa2f7;\n  --tokyo-cyan: #7dcfff;\n  --tokyo-text: #c0caf5;\n}'
      },
      {
        name: 'data.js',
        folderId: componentsFolderId,
        content: '// Reactive Data Models for ' + titleCased + '\nwindow.AppData = {\n  pillars: [\n    { title: "Deterministic Performance", desc: "Zero bloat execution path ensuring ultra-responsive runtime feedback.", badge: "Fast" },\n    { title: "Tokyo Night Aesthetics", desc: "Crafted with clean 1px borders, deep contrast, and developer elegance.", badge: "Cursor" },\n    { title: "Modular Architecture", desc: "Decoupled components, state stores, and stylesheets across folders.", badge: "Clean" }\n  ]\n};'
      },
      {
        name: 'main.js',
        folderId: jsFolderId,
        content: '// Core Logic for ' + titleCased + '\nvar featureGrid = document.getElementById("featureGrid");\nvar consoleOutput = document.getElementById("consoleOutput");\nvar actionPrimary = document.getElementById("actionPrimary");\nvar actionSecondary = document.getElementById("actionSecondary");\n\nfunction renderPillars() {\n  featureGrid.innerHTML = window.AppData.pillars.map(function(p) {\n    return \'<div class="bg-[#16161e] border border-[#292e42] rounded-2xl p-6 hover:border-[#7aa2f7] transition">\' +\n      \'<span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#7aa2f7]/15 text-[#7dcfff] border border-[#7aa2f7]/30">\' + p.badge + \'</span>\' +\n      \'<h3 class="text-base font-bold text-white mt-3 mb-1">\' + p.title + \'</h3>\' +\n      \'<p class="text-xs text-[#565f89] leading-relaxed">\' + p.desc + \'</p>\' +\n    \'</div>\';\n  }).join("");\n}\n\nfunction log(msg) {\n  var line = document.createElement("div");\n  line.textContent = "[" + new Date().toLocaleTimeString() + "] " + msg;\n  consoleOutput.appendChild(line);\n  consoleOutput.scrollTop = consoleOutput.scrollHeight;\n}\n\nactionPrimary.addEventListener("click", function() {\n  log("Triggered execution routine for ' + titleCased + '");\n});\n\nactionSecondary.addEventListener("click", function() {\n  log("Inspecting active state store... All nodes nominal");\n});\n\nrenderPillars();\nlog("Application initialized successfully");'
      },
      {
        name: 'README.md',
        folderId: 'root',
        content: '# ' + titleCased + '\n\nA dynamic, bespoke multi-file project synthesized with Godfy Mind in Tokyo Night styling.\n\n## Directory Structure:\n- index.html: Semantic HTML5 application shell.\n- src/styles/theme.css: Tokyo Night custom styling and design tokens.\n- src/js/main.js: Core application logic and component mounting.\n- src/js/components/data.js: Data models and state definitions.\n'
      }
    ];
  }

  // Mount files into project
  filesToGenerate.forEach(f => {
    const parentFolder = proj.nodes.find(n => n.id === f.folderId) || root;
    const parentPath = parentFolder.id !== 'root' ? (parentFolder.path + '/') : '/';
    const newFile = {
      id: createNodeId(),
      name: f.name,
      type: 'file',
      parentId: parentFolder.id,
      path: parentPath + f.name,
      content: f.content,
      language: getLanguageFromFilename(f.name)
    };
    proj.nodes.push(newFile);
  });

  // Set default active file
  const indexFile = proj.nodes.find(n => n.name === 'index.html') || proj.nodes.find(n => n.type === 'file');
  if (indexFile) {
    proj.activeFileId = indexFile.id;
    proj.openTabIds = [indexFile.id];
  }

  return proj;
}

/**
 * Parses markdown code blocks into project files
 */
export function parseProjectFilesFromMarkdown(markdown = '', baseProject = null) {
  let proj = baseProject || createEmptyProject('Imported Project');
  const fenceRegex = /```([a-zA-Z0-9_\-\+]+)?(?::([^\n]+))?\n([\s\S]*?)```/g;
  let match;
  let count = 0;

  while ((match = fenceRegex.exec(markdown)) !== null) {
    const lang = match[1]?.trim() || 'javascript';
    const filePath = match[2]?.trim();
    const content = match[3]?.trim();

    if (filePath && content) {
      count++;
      const parts = filePath.split('/').filter(Boolean);
      const fileName = parts.pop();
      let parentId = 'root';

      // Ensure intermediate folders exist
      let currentPath = '';
      for (const folderName of parts) {
        currentPath += '/' + folderName;
        let folder = proj.nodes.find(n => n.type === 'folder' && n.path === currentPath);
        if (!folder) {
          proj = addFolderToProject(proj, parentId, folderName);
          folder = proj.nodes.find(n => n.type === 'folder' && n.path === currentPath);
        }
        if (folder) parentId = folder.id;
      }

      proj = addFileToProject(proj, parentId, fileName, content);
    }
  }

  return count > 0 ? proj : null;
}
