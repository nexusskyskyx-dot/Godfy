export const FREE_AI_MODELS = [
  {
    id: 'llama-3.3',
    name: 'Llama 3.3 70B',
    provider: 'Meta (Open Free)',
    badge: 'Architecture',
    color: 'from-blue-500 to-indigo-600',
    specialty: 'System structure, hierarchy, and component scaffolding',
    latency: '310ms',
    defaultWeight: 0.85
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek (Free Inference)',
    badge: 'Deep Reasoning',
    color: 'from-emerald-500 to-teal-600',
    specialty: 'Algorithmic logic, chain-of-thought analysis & conversion optimization',
    latency: '380ms',
    defaultWeight: 0.95
  },
  {
    id: 'mistral-large',
    name: 'Mistral Open 24B',
    provider: 'Mistral / Qwen (Free Tier)',
    badge: 'Code Engine',
    color: 'from-amber-500 to-orange-600',
    specialty: 'Production code syntax, algorithms & clean software architecture',
    latency: '270ms',
    defaultWeight: 0.92
  },
  {
    id: 'qwen-2.5',
    name: 'Qwen 2.5 72B',
    provider: 'Alibaba (Free Open)',
    badge: 'Copy & Tone',
    color: 'from-purple-500 to-fuchsia-600',
    specialty: 'Persuasive copywriting, storytelling & customer psychology',
    latency: '340ms',
    defaultWeight: 0.84
  },
  {
    id: 'gemma-2',
    name: 'Gemma 2 27B',
    provider: 'Google (Open Free)',
    badge: 'Fact & Audit',
    color: 'from-cyan-500 to-blue-500',
    specialty: 'Precision, accessibility standards & conciseness',
    latency: '250ms',
    defaultWeight: 0.82
  },
  {
    id: 'hermes-3',
    name: 'Hermes 3 70B',
    provider: 'Nous Research (Free Unturf)',
    badge: 'Lateral Thinking',
    color: 'from-rose-500 to-pink-600',
    specialty: 'Unfiltered creative brainstorming, synthesis of opposing views & novel angles',
    latency: '330ms',
    defaultWeight: 0.87
  },
  {
    id: 'gemini-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google (Free Tier)',
    badge: 'Real-Time Speed',
    color: 'from-sky-400 to-blue-600',
    specialty: 'Ultra-fast synthesis, real-time facts & action-oriented checklists',
    latency: '220ms',
    defaultWeight: 0.88
  },
  {
    id: 'phi-4',
    name: 'Phi-4 Reasoning',
    provider: 'Microsoft (Free Open)',
    badge: 'Logic Compression',
    color: 'from-teal-400 to-cyan-600',
    specialty: 'Dense deductive logic, mathematical proofs & step-by-step reasoning',
    latency: '240ms',
    defaultWeight: 0.89
  },
  {
    id: 'nemotron-70b',
    name: 'Nemotron 70B',
    provider: 'NVIDIA (Free Inference)',
    badge: 'Rigor & Guardrails',
    color: 'from-lime-500 to-emerald-600',
    specialty: 'Technical precision, alignment verification & execution guardrails',
    latency: '350ms',
    defaultWeight: 0.90
  },
  {
    id: 'claude-hybrid',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic (Free Tier)',
    badge: 'Polish & Systems',
    color: 'from-violet-500 to-purple-600',
    specialty: 'Flawless prose, elegant systems synthesis & high-order coherence',
    latency: '390ms',
    defaultWeight: 0.94
  }
];

export const MIND_PRESETS = [
  {
    id: 'balanced',
    name: 'Harmonic Mind',
    description: 'Even distribution across all 10 neural pathways for balanced clarity.'
  },
  {
    id: 'architect',
    name: 'Master Architect',
    description: 'Prioritizes robust component hierarchy, Llama 3.3, and Claude systems.'
  },
  {
    id: 'creative',
    name: 'Creative Alchemist',
    description: 'Maximal aesthetic flair, Hermes 3 lateral thinking, and Qwen copy.'
  },
  {
    id: 'critic',
    name: 'Ruthless Synthesizer',
    description: 'DeepSeek R1, Phi-4, and Nemotron mathematical logic and rigor.'
  },
  {
    id: 'coding',
    name: 'Code Synthesizer',
    description: 'Mistral/Qwen-Coder, DeepSeek R1, and Nemotron guardrails.'
  }
];
