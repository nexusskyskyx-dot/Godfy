export const FREE_AI_MODELS = [
  // LOBE 1: ANALYTICAL & FORMAL REASONING LOBE (IQ 185)
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 671B',
    provider: 'DeepSeek (Free Inference)',
    badge: 'Deep Reasoning',
    lobe: 'reasoning',
    color: 'from-emerald-500 to-teal-600',
    specialty: 'Chain-of-thought logic, recurrence relations & mathematical edge cases',
    latency: '380ms',
    defaultWeight: 0.98
  },
  {
    id: 'gemini-thinking',
    name: 'Gemini 2.0 Thinking',
    provider: 'Google DeepMind (Free Tier)',
    badge: 'Recursive ToT',
    lobe: 'reasoning',
    color: 'from-teal-500 to-cyan-600',
    specialty: 'Tree-of-thought hypothesis branching, causal graphs & multi-step deduction',
    latency: '340ms',
    defaultWeight: 0.96
  },
  {
    id: 'phi-4',
    name: 'Phi-4 Reasoning',
    provider: 'Microsoft (Free Open)',
    badge: 'Formal Logic',
    lobe: 'reasoning',
    color: 'from-teal-400 to-emerald-600',
    specialty: 'Dense deductive logic, formal mathematical proofs & compact token efficiency',
    latency: '240ms',
    defaultWeight: 0.93
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek V3 671B',
    provider: 'DeepSeek (Free Unturf)',
    badge: 'Master MoE',
    lobe: 'reasoning',
    color: 'from-emerald-400 to-teal-500',
    specialty: 'Mixture-of-Experts architecture, cross-disciplinary science & first principles',
    latency: '310ms',
    defaultWeight: 0.95
  },

  // LOBE 2: KERNEL, AST & SOFTWARE ARCHITECTURE
  {
    id: 'mistral-large',
    name: 'Qwen 2.5 Coder 32B',
    provider: 'Alibaba / Mistral (Free Tier)',
    badge: 'AST Code Engine',
    lobe: 'code',
    color: 'from-amber-500 to-orange-600',
    specialty: 'Production AST code generation, zero placeholders & runnable test assertions',
    latency: '270ms',
    defaultWeight: 0.97
  },
  {
    id: 'codestral',
    name: 'Codestral 22B',
    provider: 'Mistral AI (Free Tier)',
    badge: 'Kernel & Systems',
    lobe: 'code',
    color: 'from-orange-500 to-amber-600',
    specialty: 'Low-level systems programming, memory safety & concurrency primitives',
    latency: '290ms',
    defaultWeight: 0.92
  },
  {
    id: 'llama-3.3',
    name: 'Llama 3.3 70B',
    provider: 'Meta (Open Free)',
    badge: 'Systems Architect',
    lobe: 'code',
    color: 'from-blue-500 to-indigo-600',
    specialty: 'System scaffolding, interface boundaries & modular component hierarchy',
    latency: '310ms',
    defaultWeight: 0.90
  },
  {
    id: 'claude-hybrid',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic (Free Tier)',
    badge: 'Polish & Systems',
    lobe: 'code',
    color: 'from-violet-500 to-purple-600',
    specialty: 'Flawless prose, elegant systems synthesis & high-order coherence',
    latency: '390ms',
    defaultWeight: 0.95
  },

  // LOBE 3: ADVERSARIAL RED-TEAM & INVARIANT AUDIT
  {
    id: 'nemotron-70b',
    name: 'Nemotron 70B',
    provider: 'NVIDIA (Free Inference)',
    badge: 'Rigor & Guardrails',
    lobe: 'adversarial',
    color: 'from-lime-500 to-emerald-600',
    specialty: 'Technical precision, alignment verification & execution guardrails',
    latency: '350ms',
    defaultWeight: 0.94
  },
  {
    id: 'hermes-3',
    name: 'Hermes 3 70B',
    provider: 'Nous Research (Free Unturf)',
    badge: 'Lateral Critic',
    lobe: 'adversarial',
    color: 'from-rose-500 to-pink-600',
    specialty: 'Unfiltered lateral brainstorming, counter-argumentation & edge-case attacks',
    latency: '330ms',
    defaultWeight: 0.91
  },
  {
    id: 'command-r-plus',
    name: 'Command R+ 104B',
    provider: 'Cohere (Free Inference)',
    badge: 'Factual Red-Team',
    lobe: 'adversarial',
    color: 'from-pink-500 to-rose-600',
    specialty: 'Multi-hop factual verification, citation fidelity & enterprise truth grounding',
    latency: '370ms',
    defaultWeight: 0.92
  },
  {
    id: 'gemma-2',
    name: 'Gemma 2 27B',
    provider: 'Google (Open Free)',
    badge: 'Audit & Precision',
    lobe: 'adversarial',
    color: 'from-cyan-500 to-blue-500',
    specialty: 'Objective fact-checking, accessibility standards & conciseness audits',
    latency: '250ms',
    defaultWeight: 0.88
  },

  // LOBE 4: HIGH-VELOCITY SYNTHESIS & SPEED
  {
    id: 'qwen-2.5',
    name: 'Qwen 2.5 72B',
    provider: 'Alibaba (Free Open)',
    badge: 'Nuance & Copy',
    lobe: 'synthesis',
    color: 'from-purple-500 to-fuchsia-600',
    specialty: 'Persuasive copywriting, intuitive analogies & user psychology',
    latency: '340ms',
    defaultWeight: 0.89
  },
  {
    id: 'gemini-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google (Free Tier)',
    badge: 'Real-Time Speed',
    lobe: 'synthesis',
    color: 'from-sky-400 to-blue-600',
    specialty: 'Ultra-fast synthesis, real-time facts & action-oriented checklists',
    latency: '220ms',
    defaultWeight: 0.90
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI (Free Puter Tier)',
    badge: 'Rapid Logic',
    lobe: 'synthesis',
    color: 'from-green-500 to-emerald-600',
    specialty: 'Deterministic instruction following, high-speed parsing & boundary tests',
    latency: '230ms',
    defaultWeight: 0.91
  },
  {
    id: 'godfy-cortex',
    name: 'Godfy Master Mind',
    provider: 'Autonomous Core v1',
    badge: 'Executive IQ',
    lobe: 'synthesis',
    color: 'from-cyan-500 to-slate-900',
    specialty: 'Multi-model conflict resolution, self-correction & punchy deliverable synthesis',
    latency: '180ms',
    defaultWeight: 1.00
  }
];

export const MIND_PRESETS = [
  {
    id: 'genius',
    name: 'IQ 185 Genius Cortex',
    description: 'Maximal depth: Tree-of-Thought branching, formal proofs, and adversarial red-teaming.'
  },
  {
    id: 'coding',
    name: 'IQ 175 Code & AST Engine',
    description: 'Zero placeholders, typed signatures, Big-O bounds, and runnable test suites.'
  },
  {
    id: 'architect',
    name: 'IQ 170 Systems Architect',
    description: 'Scalable architecture, fault tolerance, component hierarchy, and design tokens.'
  },
  {
    id: 'balanced',
    name: 'Harmonic 16-Neuron Cortex',
    description: 'Even distribution across all 4 brain lobes for balanced analytical brilliance.'
  },
  {
    id: 'creative',
    name: 'Creative Alchemist',
    description: 'Lateral innovation, Hermes 3 counter-angles, and high-converting copy.'
  }
];
