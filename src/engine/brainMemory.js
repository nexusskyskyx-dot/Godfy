// Godfy Brain Long-Term & Working Memory Engine v1
// Allows Godfy to remember user facts, preferences, project context, and multi-turn conversational history.

const MEMORY_STORAGE_KEY = 'godfy_brain_memory_v1';
let memoryCache = [];

/**
 * Retrieve all persistent memories from localStorage or memoryCache
 */
export function getStoredMemories() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          memoryCache = parsed;
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load brain memories:', err);
    }
  }
  return memoryCache;
}

/**
 * Save a new memory unit to persistent storage
 */
export function saveMemory(key, value, category = 'general') {
  try {
    const memories = [...getStoredMemories()];
    const existingIndex = memories.findIndex(m => m.key.toLowerCase() === key.toLowerCase());

    const newMemory = {
      id: `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      key: key.trim(),
      value: value.trim(),
      category,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      memories[existingIndex] = newMemory;
    } else {
      memories.unshift(newMemory);
    }

    // Keep at most 40 top memories
    const trimmed = memories.slice(0, 40);
    memoryCache = trimmed;

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(trimmed));
    }
    return trimmed;
  } catch (err) {
    console.warn('Failed to save brain memory:', err);
  }
}

/**
 * Delete a specific memory by ID
 */
export function deleteMemory(id) {
  const memories = getStoredMemories().filter(m => m.id !== id);
  memoryCache = memories;
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memories));
    } catch {}
  }
  return memories;
}

/**
 * Clear all long-term memories
 */
export function clearAllMemories() {
  memoryCache = [];
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(MEMORY_STORAGE_KEY);
    } catch {}
  }
}

/**
 * Autonomous Memory Extractor:
 * Analyzes the user's prompt to automatically extract and retain personal facts, names, preferences, and projects.
 * Supports contractions (I'm, im), location statements, tech stacks, explicit remember commands, etc.
 */
export function extractAndSaveMemories(userText) {
  if (!userText) return [];
  const text = userText.trim();
  const lower = text.toLowerCase();
  const newlyLearned = [];

  // 1. Explicit Remember Commands: "Remember that...", "Remember this:...", "Save to memory:..."
  const explicitMatch = text.match(/(?:remember\s+(?:that|this:?|me:?|my)?|note\s+(?:that|this:?)?|save\s+(?:this\s+)?to\s+memory:?|keep\s+in\s+mind\s+that|don't\s+forget\s+(?:that)?)\s+([\s\S]{3,120})/i);
  if (explicitMatch) {
    const rawFact = explicitMatch[1].trim().replace(/^[:,\s]+/, '').replace(/[\.\?!]+$/, '');
    if (rawFact && rawFact.length >= 3 && !/^(an?|the|what|how|why)\b/i.test(rawFact)) {
      saveMemory('Explicit Note', rawFact, 'explicit');
      newlyLearned.push(`Note: ${rawFact}`);
    }
  }

  // 2. Name extraction: "My name is Carlos", "I am Carlos", "I'm Carlos", "im Carlos", "Call me Carlos", "name's Carlos"
  const nameMatch = text.match(/(?:my name is|i am|i'm|im|call me|name's)\s+([A-Za-zÀ-ÿ]{2,18}(?:\s+[A-Za-zÀ-ÿ]{2,18})?)(?:\s+(?:and|but|who|from|with|in|at)\b|[\.,\?!]|$|\n)/i);
  if (nameMatch) {
    const candidate = nameMatch[1].trim();
    // Exclude verbs, state descriptions, and non-names
    const nonNames = /^(an?|the|working|building|coding|trying|testing|looking|here|there|not|using|ready|sorry|happy|developer|engineer|coder|programmer|student)\b/i;
    if (!nonNames.test(candidate) && candidate.length <= 36) {
      saveMemory('User Name', candidate, 'identity');
      newlyLearned.push(`User Name is ${candidate}`);
    }
  }

  // 3. Location extraction: "I live in Guatemala", "I'm located in Paris", "Based in Quetzaltenango"
  const locMatch = text.match(/(?:i live in|i'm located in|i am located in|i am based in|based in|my location is|from)\s+([A-Za-zÀ-ÿ\s,]{2,40})(?:\.|\,|$|\n)/i);
  if (locMatch) {
    const loc = locMatch[1].trim().replace(/[\.\?!]+$/, '');
    if (!/^(the|a|here|there|now|scratch)\b/i.test(loc) && loc.length >= 2) {
      saveMemory('Location', loc, 'identity');
      newlyLearned.push(`Location is ${loc}`);
    }
  }

  // 4. Tech Stack / Coding Languages: "My stack is React and Node", "I code in Python", "I develop in TypeScript"
  const stackMatch = text.match(/(?:my (?:tech )?stack is|i code in|i develop with|i program in|my primary language is)\s+([A-Za-z0-9_\-\.\s,\+]{2,50})(?:\.|\,|$|\n)/i);
  if (stackMatch) {
    const stack = stackMatch[1].trim().replace(/[\.\?!]+$/, '');
    saveMemory('Tech Stack', stack, 'preferences');
    newlyLearned.push(`Tech Stack: ${stack}`);
  }

  // 5. Active Project: "I am building a...", "My project is...", "building an AI SaaS app"
  const projectMatch = text.match(/(?:i am building an?|my project is an?|working on an?|building an?|developing an?)\s+([a-zA-Z0-9_\-\.\s]{3,45})(?:\.|\,|$|\n)/i);
  if (projectMatch) {
    const proj = projectMatch[1].trim().replace(/[\.\?!]+$/, '');
    saveMemory('Current Project', proj, 'projects');
    newlyLearned.push(`Project: ${proj}`);
  }

  // 6. Role / Profession: "I am a frontend developer", "I work as a software engineer"
  const roleMatch = text.match(/i (?:work as an?|am an?)\s+([a-zA-Z\s]{3,35})(?:\.|\,|$|\n)/i);
  if (roleMatch) {
    const candidateRole = roleMatch[1].trim().replace(/[\.\?!]+$/, '');
    if (!/^(here|there|not|using|trying|ready|sorry)\b/i.test(candidateRole)) {
      saveMemory('User Role', candidateRole, 'identity');
      newlyLearned.push(`User Role is ${candidateRole}`);
    }
  }

  // 7. General Preferences: "I prefer Python", "I like Tailwind", "I love dark mode", "I always use Next.js"
  const prefMatch = text.match(/i (?:prefer|love|like|always use|mainly use|enjoy using)\s+([a-zA-Z0-9_\-\.\s]{2,30})(?:\.|\,|$|\n)/i);
  if (prefMatch) {
    const pref = prefMatch[1].trim().replace(/[\.\?!]+$/, '');
    if (!/^(it|that|this|to|you|them|what|how)\b/i.test(pref) && pref.length >= 2) {
      saveMemory('Preference', pref, 'preferences');
      newlyLearned.push(`Preference: ${pref}`);
    }
  }

  return newlyLearned;
}

/**
 * Format active memories into a compact context block for the Brain & AI Council
 */
export function buildMemoryContextString() {
  const memories = getStoredMemories();
  if (!memories || memories.length === 0) return '';

  const lines = memories.map(m => `• ${m.key}: ${m.value}`).join('\n');
  return `[Godfy Brain Long-Term Memories]:\n${lines}`;
}

/**
 * Format active memories into a clean markdown summary for user inspection
 */
export function formatMemoriesSummary() {
  const memories = getStoredMemories();
  if (!memories || memories.length === 0) {
    return `### Godfy Persistent Memory Engine (\`v1\`)

My long-term memory store is initialized in browser storage (\`godfy_brain_memory_v1\`), but contains **0 saved records** right now.

**How to teach me:**
- **Identity:** *"My name is Carlos"* or *"I'm a frontend engineer from Guatemala"*
- **Tech Stack:** *"My stack is React, Node, and Tailwind"* or *"I code in Python"*
- **Preferences:** *"I prefer dark mode"* or *"I like clean minimal code"*
- **Projects:** *"I'm building an AI code editor"*
- **Rules & Notes:** *"Remember that I always write TypeScript"*

Anything you tell me is automatically extracted and retained across chats and browser reloads.`;
  }

  const lines = memories.map(m => `• **${m.key}:** ${m.value} *(${m.category})*`).join('\n');
  return `### Godfy Persistent Memory Engine (\`v1\`)

**Active Memory Records (${memories.length}):**
${lines}

*All memories persist locally in \`localStorage: godfy_brain_memory_v1\` across sessions.*`;
}
