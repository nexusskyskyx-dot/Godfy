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

    // Keep at most 30 top memories
    const trimmed = memories.slice(0, 30);
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
 * Delete a specific memory
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
 */
export function extractAndSaveMemories(userText) {
  if (!userText) return [];
  const text = userText.trim();
  const lower = text.toLowerCase();
  const newlyLearned = [];

  // Name extraction: "My name is Carlos", "I am Carlos", "Call me Carlos"
  const nameMatch = text.match(/(?:my name is|i am|call me)\s+([A-Z][a-zA-Z0-9_-]+)/i);
  if (nameMatch && !/^(an?|the|working|building|coding|trying)\b/i.test(nameMatch[1])) {
    const name = nameMatch[1];
    saveMemory('User Name', name, 'identity');
    newlyLearned.push(`User Name is ${name}`);
  }

  // Active Project: "I am building a...", "My project is...", "building an AI SaaS app"
  const projectMatch = text.match(/(?:i am building an?|my project is an?|working on an?|building an?)\s+([a-zA-Z0-9_\-\.\s]{3,40})(?:\.|\,|$)/i);
  if (projectMatch) {
    const proj = projectMatch[1].trim();
    saveMemory('Current Project', proj, 'projects');
    newlyLearned.push(`Project: ${proj}`);
  }

  // Role / Profession: "I am a frontend developer", "I work as a..."
  const roleMatch = text.match(/i (?:work as an?|am an?)\s+([a-zA-Z\s]{3,30})(?:\.|\,|$)/i);
  if (roleMatch && !/^(here|there|not|using|trying)\b/i.test(roleMatch[1])) {
    const role = roleMatch[1].trim();
    saveMemory('User Role', role, 'identity');
    newlyLearned.push(`User Role is ${role}`);
  }

  // Preference: "I prefer Python", "I like Tailwind", "I use React"
  const prefMatch = text.match(/i (?:prefer|love|always use|mainly use)\s+([a-zA-Z0-9_\-\.\s]{2,25})(?:\.|\,|$)/i);
  if (prefMatch) {
    const pref = prefMatch[1].trim();
    saveMemory('Preference', pref, 'preferences');
    newlyLearned.push(`User prefers ${pref}`);
  }

  // Explicit "Remember that..." command
  const rememberMatch = text.match(/(?:remember that|note that|keep in mind that)\s+([\s\S]{3,80})/i);
  if (rememberMatch) {
    const fact = rememberMatch[1].trim();
    saveMemory('Note', fact, 'explicit');
    newlyLearned.push(`Note: ${fact}`);
  }

  return newlyLearned;
}

/**
 * Format active memories into a compact context block for the Brain & 5 Friends
 */
export function buildMemoryContextString() {
  const memories = getStoredMemories();
  if (!memories || memories.length === 0) return '';

  const lines = memories.map(m => `• ${m.key}: ${m.value}`).join('\n');
  return `[Godfy Brain Long-Term Memories]:\n${lines}`;
}
