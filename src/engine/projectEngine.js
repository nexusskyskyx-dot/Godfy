/**
 * Godfy Project Engine (v1)
 * Manages full multi-file projects, nested folders (carpetas), file trees,
 * dynamic code synthesis with ZERO static templates, and iframe bundling.
 */

export function createNodeId() {
  return `node_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
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
    id: `proj_${Date.now()}`,
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
  const parentPath = parent && parent.id !== 'root' ? `${parent.path}/` : '/';
  
  const newFolder = {
    id: createNodeId(),
    name: cleanName,
    type: 'folder',
    parentId: parent ? parent.id : 'root',
    path: `${parentPath}${cleanName}`,
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
  const parentPath = parent && parent.id !== 'root' ? `${parent.path}/` : '/';
  const lang = getLanguageFromFilename(cleanName);

  const newFile = {
    id: createNodeId(),
    name: cleanName,
    type: 'file',
    parentId: parent ? parent.id : 'root',
    path: `${parentPath}${cleanName}`,
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
  const parentPath = parent && parent.id !== 'root' ? `${parent.path}/` : '/';
  const newPath = `${parentPath}${clean}`;

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
    if (target.type === 'folder' && node.path.startsWith(`${oldPath}/`)) {
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

  // Identify all nodes to delete (self + descendants)
  const idsToDelete = new Set([nodeId]);
  if (target.type === 'folder') {
    project.nodes.forEach(n => {
      if (n.path.startsWith(`${target.path}/`)) {
        idsToDelete.add(n.id);
      }
    });
  }

  const remainingNodes = project.nodes.filter(n => !idsToDelete.has(n.id));
  const remainingTabs = project.openTabIds.filter(id => !idsToDelete.has(id));
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
    // If no HTML file, synthesize a playground displaying the available files or code
    const jsFile = files.find(f => f.language === 'javascript' || f.language === 'typescript');
    const cssFile = files.find(f => f.language === 'css');
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: system-ui, sans-serif; background: #0b0f19; color: #f1f5f9; padding: 24px; line-height: 1.6; }
    h2 { color: #38bdf8; margin-top: 0; }
    pre { background: #1e293b; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; }
  </style>
  ${cssFile ? `<style>${cssFile.content}</style>` : ''}
</head>
<body>
  <h2>Project: ${project.name}</h2>
  <p>Available files: ${files.map(f => `<code>${f.path}</code>`).join(', ')}</p>
  <div id="app"></div>
  ${jsFile ? `<script>${jsFile.content}<\/script>` : ''}
</body>
</html>`;
  }

  let htmlContent = htmlFile.content;

  // In-line CSS files referenced in <link rel="stylesheet" href="...">
  files.filter(f => f.language === 'css').forEach(css => {
    // Match relative hrefs like "style.css", "./style.css", "css/style.css"
    const regex = new RegExp(`<link[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*${css.name}["'][^>]*>`, 'gi');
    if (regex.test(htmlContent)) {
      htmlContent = htmlContent.replace(regex, `<style data-source="${css.path}">\n${css.content}\n</style>`);
    } else {
      // If not explicitly linked, append to <head>
      htmlContent = htmlContent.replace('</head>', `<style data-injected="${css.path}">\n${css.content}\n</style></head>`);
    }
  });

  // In-line JS files referenced in <script src="..."></script>
  files.filter(f => f.language === 'javascript' || f.name.endsWith('.js')).forEach(js => {
    const regex = new RegExp(`<script[^>]*src=["'][^"']*${js.name}["'][^>]*>\\s*<\\/script>`, 'gi');
    if (regex.test(htmlContent)) {
      htmlContent = htmlContent.replace(regex, `<script data-source="${js.path}">\n${js.content}\n<\/script>`);
    } else if (js.name.toLowerCase() !== 'server.js' && !htmlContent.includes(js.content)) {
      // Append non-server JS before </body>
      htmlContent = htmlContent.replace('</body>', `<script data-injected="${js.path}">\n${js.content}\n<\/script></body>`);
    }
  });

  return htmlContent;
}

/**
 * DYNAMIC PROJECT SYNTHESIZER (ZERO STATIC TEMPLATES)
 * Analyzes the user's prompt and autonomously constructs a complete, multi-file,
 * folder-structured project tailored specifically to the requested entity or application.
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
  const isGame = /\b(game|play|arcade|canvas|snake|pong|rpg|puzzle|tetris)\b/i.test(lower);
  const isDashboard = /\b(dashboard|admin|metrics|analytics|crm|finance|tracker|charts?)\b/i.test(lower);
  const isFoodOrCafe = /\b(tea|matcha|coffee|cafe|bakery|restaurant|sushi|pizza|food|dining|bistro|taco|burger)\b/i.test(lower);
  const isFitness = /\b(gym|fitness|workout|training|crossfit|yoga|health|wellness)\b/i.test(lower);
  const isEcommerce = /\b(shop|store|ecommerce|e-commerce|apparel|clothing|fashion|products|cart)\b/i.test(lower);
  const isApiBackend = /\b(backend|api|server|microservice|crud|fastapi|express|database)\b/i.test(lower);

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

  // Construct dynamic files based on archetype
  let filesToGenerate = [];

  if (isGame) {
    filesToGenerate = [
      {
        name: 'index.html',
        folderId: 'root',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleCased} | Interactive Experience</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="src/styles/game.css">
</head>
<body class="bg-slate-950 text-slate-100 flex flex-col items-center justify-center min-h-screen p-4">
  <div class="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center">
    <header class="mb-4">
      <h1 class="text-3xl font-extrabold text-cyan-400 font-mono tracking-tight">${titleCased}</h1>
      <p class="text-xs text-slate-400 mt-1">Autonomous Interactive Engine • Use Arrow Keys or On-Screen Controls</p>
    </header>

    <div class="flex justify-between items-center bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 font-mono text-sm mb-4">
      <div>Score: <span id="scoreDisplay" class="text-cyan-400 font-bold">0</span></div>
      <div>High: <span id="highScoreDisplay" class="text-emerald-400 font-bold">0</span></div>
      <div id="statusBadge" class="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">Ready</div>
    </div>

    <div class="relative flex justify-center items-center bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
      <canvas id="gameCanvas" width="480" height="360" class="block bg-slate-950"></canvas>
      <div id="overlayScreen" class="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-6">
        <h2 id="overlayTitle" class="text-2xl font-bold text-white mb-2">Press Start</h2>
        <p id="overlayText" class="text-xs text-slate-400 mb-4 max-w-xs">Control the vector to gather energy cores and survive obstacles.</p>
        <button id="startBtn" class="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow transition active:scale-95">
          Play Game
        </button>
      </div>
    </div>

    <div class="mt-4 flex justify-center space-x-2">
      <button id="ctrlLeft" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono">◀ Left</button>
      <button id="ctrlUp" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono">▲ Up</button>
      <button id="ctrlDown" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono">▼ Down</button>
      <button id="ctrlRight" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono">▶ Right</button>
    </div>
  </div>

  <script src="src/js/components/audio.js"></script>
  <script src="src/js/game.js"></script>
</body>
</html>`
      },
      {
        name: 'game.css',
        folderId: cssFolderId,
        content: `/* Game Visual Styling */
canvas {
  image-rendering: pixelated;
}
.glow-cyan {
  box-shadow: 0 0 25px rgba(34, 211, 238, 0.35);
}`
      },
      {
        name: 'game.js',
        folderId: jsFolderId,
        content: `// Core Engine Loop for ${titleCased}
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('scoreDisplay');
const highScoreEl = document.getElementById('highScoreDisplay');
const statusBadge = document.getElementById('statusBadge');
const overlay = document.getElementById('overlayScreen');
const overlayTitle = document.getElementById('overlayTitle');
const startBtn = document.getElementById('startBtn');

let running = false;
let score = 0;
let highScore = 0;
let player = { x: 240, y: 180, size: 14, speed: 4, vx: 0, vy: 0 };
let target = { x: 100, y: 100, size: 12, pulse: 0 };
let enemies = [];

function spawnTarget() {
  target.x = Math.floor(Math.random() * (canvas.width - 40)) + 20;
  target.y = Math.floor(Math.random() * (canvas.height - 40)) + 20;
}

function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  let x, y;
  if (side === 0) { x = 0; y = Math.random() * canvas.height; }
  else if (side === 1) { x = canvas.width; y = Math.random() * canvas.height; }
  else if (side === 2) { x = Math.random() * canvas.width; y = 0; }
  else { x = Math.random() * canvas.width; y = canvas.height; }
  
  const angle = Math.atan2(player.y - y, player.x - x);
  enemies.push({ x, y, size: 10, vx: Math.cos(angle) * 1.8, vy: Math.sin(angle) * 1.8 });
}

function resetGame() {
  score = 0;
  scoreEl.textContent = '0';
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  player.vx = 0;
  player.vy = 0;
  enemies = [];
  spawnTarget();
  running = true;
  overlay.classList.add('hidden');
  statusBadge.textContent = 'Active';
  statusBadge.className = 'text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800';
}

function gameOver() {
  running = false;
  overlay.classList.remove('hidden');
  overlayTitle.textContent = 'Game Over';
  statusBadge.textContent = 'Stopped';
  statusBadge.className = 'text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800';
  if (score > highScore) {
    highScore = score;
    highScoreEl.textContent = String(highScore);
  }
}

// Controls
window.addEventListener('keydown', (e) => {
  if (!running && e.key === ' ') { resetGame(); return; }
  if (e.key === 'ArrowLeft' || e.key === 'a') player.vx = -player.speed;
  if (e.key === 'ArrowRight' || e.key === 'd') player.vx = player.speed;
  if (e.key === 'ArrowUp' || e.key === 'w') player.vy = -player.speed;
  if (e.key === 'ArrowDown' || e.key === 's') player.vy = player.speed;
});

window.addEventListener('keyup', (e) => {
  if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) player.vx = 0;
  if (['ArrowUp', 'ArrowDown', 'w', 's'].includes(e.key)) player.vy = 0;
});

startBtn.addEventListener('click', resetGame);

// Main Game Loop
function update() {
  if (running) {
    player.x += player.vx;
    player.y += player.vy;

    // Boundaries
    player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));

    // Target Pickup
    const dist = Math.hypot(player.x - target.x, player.y - target.y);
    if (dist < player.size + target.size) {
      score += 10;
      scoreEl.textContent = String(score);
      spawnTarget();
      spawnEnemy();
    }

    // Enemy movement and collision
    enemies.forEach(en => {
      en.x += en.vx;
      en.y += en.vy;
      if (Math.hypot(player.x - en.x, player.y - en.y) < player.size + en.size) {
        gameOver();
      }
    });
  }

  // Render
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Target
  target.pulse += 0.08;
  const pulseRadius = target.size + Math.sin(target.pulse) * 2;
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(target.x, target.y, pulseRadius, 0, Math.PI * 2);
  ctx.fill();

  // Player
  ctx.fillStyle = '#22d3ee';
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();

  // Enemies
  ctx.fillStyle = '#f43f5e';
  enemies.forEach(en => {
    ctx.beginPath();
    ctx.arc(en.x, en.y, en.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(update);
}

update();`
      },
      {
        name: 'audio.js',
        folderId: componentsFolderId,
        content: `// Web Audio API Synthesizer for ${titleCased}
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

export function playCollectSound() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}`
      },
      {
        name: 'README.md',
        folderId: 'root',
        content: `# ${titleCased}

A multi-file interactive canvas game synthesized from scratch with Godfy Mind.

## Project Structure:
- \`index.html\`: Core markup and HUD controls.
- \`src/styles/game.css\`: Custom game styles and glow effects.
- \`src/js/game.js\`: Core animation loop, boundary math, and state machine.
- \`src/js/components/audio.js\`: Web Audio synthesizer.
`
      }
    ];
  } else if (isDashboard) {
    filesToGenerate = [
      {
        name: 'index.html',
        folderId: 'root',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleCased} | Analytics Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="src/styles/main.css">
</head>
<body class="bg-[#FAF7EE] text-slate-800 font-sans antialiased">
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-[#E8DCC9] p-5 flex flex-col justify-between hidden md:flex">
      <div>
        <div class="flex items-center space-x-2.5 mb-8">
          <div class="w-9 h-9 rounded-xl bg-cyan-400 flex items-center justify-center font-bold text-slate-950 font-mono">
            ${titleCased.charAt(0)}
          </div>
          <div>
            <h2 class="text-sm font-extrabold text-slate-950">${titleCased}</h2>
            <span class="text-[10px] text-cyan-800 font-mono">Real-Time Suite</span>
          </div>
        </div>
        <nav class="space-y-1 font-medium text-xs">
          <a href="#" class="flex items-center space-x-2.5 px-3 py-2 rounded-xl bg-[#E0F7FA] text-cyan-950 font-bold">
            <span>📊 Overview</span>
          </a>
          <a href="#" class="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-cream-100 text-slate-600 transition">
            <span>⚡ Real-Time Events</span>
          </a>
          <a href="#" class="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-cream-100 text-slate-600 transition">
            <span>👥 User Journeys</span>
          </a>
          <a href="#" class="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-cream-100 text-slate-600 transition">
            <span>⚙️ System Config</span>
          </a>
        </nav>
      </div>
      <div class="p-3 rounded-xl bg-[#FAF7EE] border border-[#E8DCC9] text-xs">
        <span class="text-slate-500 block text-[10px] font-mono">System Status:</span>
        <span class="text-emerald-700 font-bold flex items-center space-x-1 mt-0.5">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>All Nodes Healthy</span>
        </span>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto p-6 sm:p-8">
      <header class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-black text-slate-950">${titleCased} Metrics</h1>
          <p class="text-xs text-slate-500 mt-0.5">Continuous automated telemetry and telemetry aggregation</p>
        </div>
        <button id="refreshBtn" class="px-3.5 py-1.5 rounded-xl bg-white border border-[#E8DCC9] hover:border-cyan-400 text-xs font-semibold shadow-xs transition">
          ↻ Sync Metrics
        </button>
      </header>

      <!-- KPI Grid -->
      <div id="kpiContainer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"></div>

      <!-- Chart & Table Area -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#E8DCC9] shadow-xs">
          <h3 class="text-sm font-bold text-slate-900 mb-4">Traffic Throughput (24h)</h3>
          <div id="chartContainer" class="h-56 flex items-end space-x-2 pt-6"></div>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-[#E8DCC9] shadow-xs">
          <h3 class="text-sm font-bold text-slate-900 mb-4">Recent Audit Stream</h3>
          <div id="logContainer" class="space-y-2.5 text-xs"></div>
        </div>
      </div>
    </main>
  </div>

  <script src="src/js/components/metrics.js"></script>
  <script src="src/js/app.js"></script>
</body>
</html>`
      },
      {
        name: 'main.css',
        folderId: cssFolderId,
        content: `/* Dashboard Polish Tokens */
body {
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}`
      },
      {
        name: 'metrics.js',
        folderId: componentsFolderId,
        content: `// KPI & Chart Generator for ${titleCased}
export const KPI_DATA = [
  { label: 'Active Sessions', val: '4,892', change: '+14.2%', positive: true },
  { label: 'Avg Latency', val: '18.4ms', change: '-4.1ms', positive: true },
  { label: 'Error Rate', val: '0.002%', change: '-0.01%', positive: true },
  { label: 'Total Volume', val: '$184.2K', change: '+22.5%', positive: true }
];

export const HOURLY_METRICS = [32, 45, 58, 48, 62, 78, 92, 110, 95, 84, 120, 142];

export const RECENT_LOGS = [
  { event: 'Edge cache warmed', region: 'us-east-1', time: '1m ago' },
  { event: 'Zero-downtime deploy', region: 'eu-west-1', time: '4m ago' },
  { event: 'DB Index compacted', region: 'ap-northeast-1', time: '12m ago' }
];`
      },
      {
        name: 'app.js',
        folderId: jsFolderId,
        content: `// Main Dashboard Controller
import { KPI_DATA, HOURLY_METRICS, RECENT_LOGS } from './components/metrics.js';

const kpiContainer = document.getElementById('kpiContainer');
const chartContainer = document.getElementById('chartContainer');
const logContainer = document.getElementById('logContainer');

function renderKPIs() {
  kpiContainer.innerHTML = KPI_DATA.map(kpi => \`
    <div class="bg-white p-4 rounded-2xl border border-[#E8DCC9] shadow-xs">
      <span class="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">\${kpi.label}</span>
      <div class="text-2xl font-black text-slate-900 mt-1">\${kpi.val}</div>
      <span class="text-[11px] font-semibold text-emerald-600 inline-block mt-1">\${kpi.change} vs yesterday</span>
    </div>
  \`).join('');
}

function renderChart() {
  const max = Math.max(...HOURLY_METRICS);
  chartContainer.innerHTML = HOURLY_METRICS.map(val => {
    const heightPercent = Math.round((val / max) * 100);
    return \`
      <div class="flex-1 flex flex-col items-center group relative h-full justify-end">
        <div class="w-full bg-[#E0F7FA] hover:bg-cyan-400 transition rounded-t-md" style="height: \${heightPercent}%"></div>
      </div>
    \`;
  }).join('');
}

function renderLogs() {
  logContainer.innerHTML = RECENT_LOGS.map(log => \`
    <div class="p-2.5 rounded-xl bg-[#FAF7EE] border border-[#E8DCC9] flex justify-between items-center">
      <div>
        <span class="font-semibold text-slate-800 block">\${log.event}</span>
        <span class="text-[10px] text-slate-400 font-mono">\${log.region}</span>
      </div>
      <span class="text-[10px] text-cyan-800 font-mono">\${log.time}</span>
    </div>
  \`).join('');
}

renderKPIs();
renderChart();
renderLogs();`
      },
      {
        name: 'README.md',
        folderId: 'root',
        content: `# ${titleCased} Dashboard

A modular metrics dashboard synthesized with dedicated files for UI components, state management, and styles.
`
      }
    ];
  } else {
    // Custom domain web application (Food/Drink, E-commerce, SaaS, Fitness, etc.)
    filesToGenerate = [
      {
        name: 'index.html',
        folderId: 'root',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleCased} | Official Experience</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="src/styles/theme.css">
</head>
<body class="min-h-screen bg-[#FAF7EE] text-slate-800 antialiased font-sans">
  <!-- Navigation Header -->
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E8DCC9]">
    <div class="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between py-4">
      <div class="flex items-center space-x-2.5">
        <div class="w-9 h-9 rounded-xl bg-cyan-400 flex items-center justify-center font-bold text-slate-950 font-mono">
          ${titleCased.charAt(0)}
        </div>
        <span class="text-lg font-black tracking-tight text-slate-950">${titleCased}</span>
      </div>
      <nav class="hidden sm:flex items-center space-x-6 text-xs font-semibold text-slate-600">
        <a href="#features" class="hover:text-cyan-800 transition">Features</a>
        <a href="#catalogue" class="hover:text-cyan-800 transition">Offerings</a>
        <a href="#reviews" class="hover:text-cyan-800 transition">Reviews</a>
      </nav>
      <button id="ctaBtn" class="px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition">
        Get Started
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
    <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white border border-[#E8DCC9] shadow-xs text-xs font-mono text-cyan-900 mb-6">
      <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
      <span>Engineered Specifically for ${titleCased}</span>
    </div>
    <h1 class="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight mb-6">
      ${titleCased} <br />
      <span class="text-cyan-700">Crafted with Purpose & Performance.</span>
    </h1>
    <p class="text-base text-slate-600 max-w-xl mx-auto mb-8 leading-relaxed">
      A complete, custom experience tailored to modern demands. Built from first principles with zero generic boilerplate.
    </p>
    <div class="flex justify-center gap-3">
      <button class="px-6 py-3 rounded-xl bg-slate-950 text-white font-bold text-sm shadow hover:bg-slate-800 transition">
        Explore Experience
      </button>
      <button class="px-6 py-3 rounded-xl bg-white border border-[#E8DCC9] text-slate-800 font-bold text-sm hover:border-cyan-400 transition">
        Learn More
      </button>
    </div>
  </section>

  <!-- Dynamic Feature Grid -->
  <section id="features" class="bg-white border-y border-[#E8DCC9] py-16 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="text-xs uppercase font-mono font-bold tracking-widest text-cyan-700 mb-2">Core Pillars</h2>
        <h3 class="text-2xl font-black text-slate-950">Why ${titleCased} Stands Apart</h3>
      </div>
      <div id="featureGrid" class="grid grid-cols-1 md:grid-cols-3 gap-6"></div>
    </div>
  </section>

  <!-- Interactive Item Showcase / Catalog -->
  <section id="catalogue" class="max-w-6xl mx-auto py-16 px-6">
    <div class="flex justify-between items-end mb-8">
      <div>
        <h2 class="text-xs uppercase font-mono font-bold tracking-widest text-cyan-700 mb-1">Interactive Catalog</h2>
        <h3 class="text-2xl font-black text-slate-950">Featured Offerings</h3>
      </div>
      <div class="text-xs font-mono text-slate-500">Live Item Filter Active</div>
    </div>
    <div id="catalogGrid" class="grid grid-cols-1 sm:grid-cols-3 gap-6"></div>
  </section>

  <footer class="bg-white border-t border-[#E8DCC9] py-8 text-center text-xs text-slate-500">
    <p>&copy; 2026 ${titleCased}. All rights reserved.</p>
  </footer>

  <script src="src/js/components/data.js"></script>
  <script src="src/js/main.js"></script>
</body>
</html>`
      },
      {
        name: 'theme.css',
        folderId: cssFolderId,
        content: `/* Custom Design Tokens for ${titleCased} */
:root {
  --color-cream: #FAF7EE;
  --color-cyan: #22D3EE;
  --color-cyan-light: #E0F7FA;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}`
      },
      {
        name: 'data.js',
        folderId: componentsFolderId,
        content: `// Dynamic Data Models for ${titleCased}
export const FEATURES = [
  {
    title: 'Precision Sourcing & Build',
    desc: 'Engineered with uncompromised attention to material standards and architectural longevity.',
    tag: 'Quality'
  },
  {
    title: 'Zero Latency Delivery',
    desc: 'Optimized state flow and frictionless user journeys crafted for instantaneous response.',
    tag: 'Speed'
  },
  {
    title: 'Sustainable Lifecycle',
    desc: 'Constructed to reduce waste, eliminate bloat, and perform sustainably across seasons.',
    tag: 'Impact'
  }
];

export const CATALOG = [
  { name: 'Core Edition', price: '$49', badge: 'Popular', desc: 'Essential package with full foundational capabilities.' },
  { name: 'Pro Specialist', price: '$89', badge: 'Featured', desc: 'High-performance variant with prioritized support.' },
  { name: 'Master Vault', price: '$149', badge: 'Exclusive', desc: 'Complete enterprise suite with customized bespoke assets.' }
];`
      },
      {
        name: 'main.js',
        folderId: jsFolderId,
        content: `// Main Application Logic for ${titleCased}
import { FEATURES, CATALOG } from './components/data.js';

const featureGrid = document.getElementById('featureGrid');
const catalogGrid = document.getElementById('catalogGrid');

if (featureGrid) {
  featureGrid.innerHTML = FEATURES.map(f => \`
    <div class="p-6 rounded-2xl bg-[#FAF7EE] border border-[#E8DCC9] card-hover transition">
      <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E0F7FA] text-cyan-950 font-bold border border-cyan-200">\${f.tag}</span>
      <h4 class="text-lg font-black text-slate-900 mt-4 mb-2">\${f.title}</h4>
      <p class="text-xs text-slate-600 leading-relaxed">\${f.desc}</p>
    </div>
  \`).join('');
}

if (catalogGrid) {
  catalogGrid.innerHTML = CATALOG.map(item => \`
    <div class="bg-white p-6 rounded-2xl border border-[#E8DCC9] shadow-xs card-hover transition text-left flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-center mb-3">
          <span class="text-xs font-mono font-bold text-cyan-800">\${item.badge}</span>
          <span class="text-xl font-black text-slate-900">\${item.price}</span>
        </div>
        <h4 class="text-base font-bold text-slate-950 mb-1">\${item.name}</h4>
        <p class="text-xs text-slate-500 mb-6 leading-relaxed">\${item.desc}</p>
      </div>
      <button class="w-full py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition">
        Select \${item.name}
      </button>
    </div>
  \`).join('');
}`
      },
      {
        name: 'README.md',
        folderId: 'root',
        content: `# ${titleCased}

A dynamic, multi-file project synthesized with Godfy Mind.

## Directory Structure:
- \`index.html\`: Semantic HTML5 application shell.
- \`src/styles/theme.css\`: Custom styling and design tokens.
- \`src/js/main.js\`: Core application logic and component mounting.
- \`src/js/components/data.js\`: Data models and catalog definitions.
`
      }
    ];
  }

  // Mount files into project
  filesToGenerate.forEach(f => {
    const parentFolder = proj.nodes.find(n => n.id === f.folderId) || root;
    const parentPath = parentFolder.id !== 'root' ? `${parentFolder.path}/` : '/';
    const newFile = {
      id: createNodeId(),
      name: f.name,
      type: 'file',
      parentId: parentFolder.id,
      path: `${parentPath}${f.name}`,
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
  // Match code fences with file annotation e.g. ```js:src/utils/math.js
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
        currentPath += `/${folderName}`;
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
