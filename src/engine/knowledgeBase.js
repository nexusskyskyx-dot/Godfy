// Comprehensive Knowledge Base & Semantic Synthesizer for Godfy v1
// Ensures that Godfy and its 5 friends provide accurate, factual, and substantive answers
// for any concept, programming problem, science, math, or history question.

export const TOPIC_KNOWLEDGE = {
  // Science & Nature
  'photosynthesis': {
    title: 'Photosynthesis',
    summary: 'Photosynthesis is the biological process by which green plants, algae, and certain bacteria convert sunlight, water ($H_2O$), and carbon dioxide ($CO_2$) into chemical energy (glucose, $C_6H_{12}O_6$) and oxygen ($O_2$).',
    formula: '6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂',
    keyPoints: [
      '**Light Reactions (Thylakoids):** Chlorophyll captures photons, splitting water molecules (photolysis) to release oxygen and charge ATP and NADPH.',
      '**Calvin Cycle (Stroma):** Uses ATP and NADPH to fix atmospheric carbon dioxide into 3-carbon sugars, eventually forming glucose.',
      '**Ecological Impact:** Fuels the global food chain and produces nearly all the breathable oxygen in Earth\'s atmosphere.'
    ],
    analogy: 'Think of a plant leaf as a solar-powered bakery: sunlight is the power grid, CO₂ and water are the raw ingredients, and glucose is the baked loaf powering the plant.'
  },
  'gravity': {
    title: 'Gravity',
    summary: 'Gravity is the fundamental natural phenomenon by which all things with mass or energy are attracted toward one another.',
    keyPoints: [
      '**Newtonian View:** Gravity is an attractive inverse-square force ($F = G \\frac{m_1 m_2}{r^2}$) between two masses.',
      '**General Relativity (Einstein):** Mass and energy warp the spacetime fabric itself; objects follow straight paths (geodesics) through this curved space.',
      '**Significance:** Keeps planets in orbit, governs the tides, and dictates the expansion and fate of the universe.'
    ],
    analogy: 'Imagine placing a heavy bowling ball on a rubber trampoline: smaller marbles roll toward the depression created by the heavy ball.'
  },
  'dna': {
    title: 'DNA (Deoxyribonucleic Acid)',
    summary: 'DNA is the double-stranded helical polymer carrying genetic instructions for the development, functioning, and reproduction of all known living organisms.',
    keyPoints: [
      '**Double Helix:** Composed of two sugar-phosphate backbones intertwined with complementary nitrogenous base pairs: Adenine (A) pairs with Thymine (T), and Guanine (G) pairs with Cytosine (C).',
      '**Transcription & Translation:** DNA is transcribed into messenger RNA (mRNA), which ribosomes translate into amino acid chains that fold into functional proteins.',
      '**Replication:** DNA polymerase copies both strands with extreme fidelity during cell division.'
    ],
    analogy: 'DNA is the master blueprint and source code of biological software.'
  },
  'quantum': {
    title: 'Quantum Computing',
    summary: 'Quantum computing leverages the bizarre principles of quantum mechanics—superposition, entanglement, and interference—to perform complex computations exponentially faster than classical supercomputers for certain problem classes.',
    keyPoints: [
      '**Qubits vs Bits:** Classical bits must be 0 or 1. Qubits exist on the Bloch sphere in a linear combination of states (superposition: $\\alpha|0\\rangle + \\beta|1\\rangle$).',
      '**Entanglement:** Qubits can become mutually correlated such that measuring one instantly determines the state of another, enabling massive parallel computational state spaces ($2^n$).',
      '**Practical Domains:** Shor\'s algorithm (factoring/cryptography), Grover\'s algorithm (search speedup), and molecular quantum chemistry simulations for pharmaceuticals.'
    ],
    analogy: 'A classical computer tests each path of a maze sequentially; a quantum wave packet flows through every path simultaneously to discover the exit.'
  },
  'black hole': {
    title: 'Black Holes',
    summary: 'A black hole is a region of spacetime where gravity is so strong that nothing—not even light or electromagnetic waves—can escape its gravitational pull.',
    keyPoints: [
      '**Event Horizon:** The mathematical boundary of no return. The radius is given by the Schwarzschild radius: $r_s = \\frac{2GM}{c^2}$.',
      '**Singularity:** At the center lies an infinitely dense point where general relativity breaks down and quantum gravity is required.',
      '**Hawking Radiation:** Due to quantum fluctuations near the event horizon, black holes very slowly emit thermal radiation and lose mass over cosmological timescales.'
    ],
    analogy: 'It is a cosmic waterfall where the speed of the falling water exceeds the maximum swimming speed of fish (light).'
  },
  'relativity': {
    title: 'Theory of Relativity',
    summary: 'Albert Einstein\'s twin theories of Special Relativity (1905) and General Relativity (1915) fundamentally revolutionized our understanding of space, time, mass, and gravitation.',
    keyPoints: [
      '**Special Relativity:** The speed of light ($c \\approx 3 \\times 10^8$ m/s) is invariant for all observers in vacuum. Moving clocks tick slower (time dilation) and moving rulers contract (length contraction). Mass and energy are equivalent ($E = mc^2$).',
      '**General Relativity:** Gravity is not an invisible pulling force, but rather the curvature of 4D spacetime caused by mass and energy.',
      '**Experimental Confirmation:** Gravitational lensing, gravitational redshift, Mercury\'s orbital perihelion precession, and LIGO gravitational wave detection.'
    ],
    analogy: 'Time and space are not rigid, independent stages, but a flexible fabric woven together.'
  },

  // Technology & Programming
  'react': {
    title: 'React',
    summary: 'React is a declarative, component-based JavaScript library for building interactive user interfaces developed by Meta.',
    keyPoints: [
      '**Component Architecture:** Encapsulates state and UI logic into self-contained, reusable building blocks.',
      '**Virtual DOM & Reconciliation:** Diffing algorithm identifies minimal DOM mutations needed, batching updates for high performance.',
      '**Modern Hooks:** `useState`, `useEffect`, `useMemo`, and `useCallback` manage state and lifecycle without legacy class components.'
    ],
    codeSnippet: `import React, { useState } from 'react';\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button \n      onClick={() => setCount(c => c + 1)}\n      className="px-4 py-2 bg-cyan-500 text-white font-bold rounded-lg shadow hover:bg-cyan-600 transition"\n    >\n      Count: {count}\n    </button>\n  );\n}`,
    codeLanguage: 'javascript'
  },
  'docker': {
    title: 'Docker & Containerization',
    summary: 'Docker is an open-source platform that packages applications and their dependencies into lightweight, standalone containers that run consistently across any environment.',
    keyPoints: [
      '**Containers vs VMs:** Containers share the host OS kernel and isolate user space via Linux namespaces and cgroups, making them start in milliseconds with minimal memory footprint.',
      '**Dockerfile & Images:** Immutable, layered snapshots created from declarative Dockerfiles.',
      '**Portability:** Solves the classic "it works on my machine" problem across local development, CI/CD, and cloud Kubernetes clusters.'
    ],
    codeSnippet: `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nCMD ["node", "server.js"]`,
    codeLanguage: 'dockerfile'
  },
  'git': {
    title: 'Git Version Control',
    summary: 'Git is a distributed version control system designed to handle everything from small to very large projects with speed and data integrity.',
    keyPoints: [
      '**Directed Acyclic Graph (DAG):** Commits are cryptographically hashed (SHA-1/SHA-256) snapshots pointing to parent commits.',
      '**Branching & Merging:** Branches are lightweight pointers (just a 41-byte text file) allowing fast, isolated feature workflows.',
      '**Staging Area (Index):** Intermediate cache allowing developers to craft clean, atomic commits.'
    ],
    codeSnippet: `# Common Git commands\ngit checkout -b feature/cool-feature\ngit add -A\ngit commit -m "feat: implement consensus engine"\ngit push -u origin feature/cool-feature`,
    codeLanguage: 'bash'
  },
  'rest api': {
    title: 'RESTful API Architecture',
    summary: 'Representational State Transfer (REST) is an architectural style for designing networked applications using stateless HTTP methods.',
    keyPoints: [
      '**HTTP Verbs:** GET (read), POST (create), PUT/PATCH (update), DELETE (remove).',
      '**Statelessness:** Each request from client to server must contain all information required to understand and process the request.',
      '**Standard Status Codes:** 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error).'
    ],
    codeSnippet: `import express from 'express';\nconst app = express();\napp.use(express.json());\n\nconst items = [{ id: 1, name: 'Item 1' }];\n\napp.get('/api/items', (req, res) => res.json(items));\napp.post('/api/items', (req, res) => {\n  const newItem = { id: items.length + 1, ...req.body };\n  items.push(newItem);\n  res.status(201).json(newItem);\n});\n\napp.listen(3000, () => console.log('API listening on :3000'));`,
    codeLanguage: 'javascript'
  },
  'database': {
    title: 'SQL vs NoSQL Databases',
    summary: 'Databases store and manage structured or unstructured data, split broadly between relational SQL databases and non-relational NoSQL stores.',
    keyPoints: [
      '**Relational (SQL - Postgres, MySQL):** Strict schema, ACID guarantees (Atomicity, Consistency, Isolation, Durability), normalized tables with foreign key joins.',
      '**Document/Key-Value (NoSQL - MongoDB, Redis):** Flexible JSON-like schemas, horizontal partitioning (sharding), optimized for high write throughput and hierarchical objects.',
      '**CAP Theorem:** Distributed databases can guarantee at most two out of three: Consistency, Availability, and Partition Tolerance.'
    ]
  },
  'einstein': {
    title: 'Albert Einstein',
    summary: 'Albert Einstein (1879–1955) was a German-born theoretical physicist universally recognized as one of the greatest scientists of all time, best known for formulating the theories of Special and General Relativity and winning the 1921 Nobel Prize in Physics for explaining the photoelectric effect.',
    keyPoints: [
      '**Miracle Year (1905):** Published four revolutionary papers explaining the photoelectric effect ($E = h\\nu$), Brownian motion (proving atoms exist), special relativity ($E = mc^2$), and mass-energy equivalence.',
      '**General Relativity (1915):** Showed that gravity is not a pulling force, but rather the geometric curvature of 4D spacetime caused by mass and energy.',
      '**Cosmic Legacy:** Predicted gravitational lensing, black holes, time dilation, and gravitational waves—all empirically confirmed by modern astrophysics.'
    ],
    analogy: 'Einstein saw what everyone else saw, but thought what no one else had thought: that space and time are not fixed stages, but dynamic participants in the universe.'
  },
  'sky blue': {
    title: 'Why the Sky is Blue (Rayleigh Scattering)',
    summary: 'The sky is blue because Earth\'s atmospheric molecules scatter sunlight in all directions, and shorter wavelengths (blue and violet) scatter far more efficiently than longer wavelengths (red and yellow).',
    keyPoints: [
      '**Rayleigh Scattering Law:** Scattering intensity is inversely proportional to the fourth power of wavelength ($I \\propto 1/\\lambda^4$). Because blue light has a short wavelength (~400–450 nm), it is scattered roughly 10 times more than red light (~700 nm).',
      '**Human Vision Factor:** Sunlight actually scatters violet light even more than blue, but the Sun emits more blue photons, and human eye cone receptors are substantially more sensitive to blue wavelengths than violet.',
      '**Sunsets & Sunrises:** When the sun is low on the horizon, sunlight travels through a much thicker slice of atmosphere. The blue light scatters away before reaching our eyes, leaving warm oranges and reds.'
    ],
    analogy: 'Imagine sunlight as a handful of colored marbles thrown at a chain-link fence: large red marbles sail straight through, while tiny blue marbles bounce off every link in every direction.'
  },
  'machine learning': {
    title: 'Machine Learning & AI',
    summary: 'Machine Learning (ML) is a branch of artificial intelligence where computer systems learn from empirical data and experience to improve task performance without being explicitly programmed.',
    keyPoints: [
      '**Supervised Learning:** Models train on labeled input-output pairs (e.g. classification, linear regression, transformers).',
      '**Unsupervised & Self-Supervised:** Systems uncover hidden latent patterns, clusters, or representations in unlabeled data.',
      '**Deep Learning & Neural Networks:** Multi-layered artificial neural networks compute hierarchical abstractions through forward propagation, loss calculation, and backpropagation via gradient descent.'
    ],
    analogy: 'Traditional programming is giving a chef a rigid recipe; machine learning is letting the chef taste 10,000 dishes until they learn what makes the best recipe on their own.'
  },
  'algorithm': {
    title: 'Algorithms & Computational Complexity',
    summary: 'An algorithm is an unambiguous, finite sequence of rigorous instructions designed to solve a class of specific problems or perform a computation.',
    keyPoints: [
      '**Big-O Notation:** Classifies computational complexity according to how runtime ($T(n)$) or memory ($S(n)$) scales with input size $n$ ($O(1)$, $O(\\log n)$, $O(n)$, $O(n \\log n)$, $O(n^2)$).',
      '**Core Paradigms:** Divide-and-conquer (MergeSort), greedy approaches (Dijkstra), dynamic programming (memoization/tabulation), and graph traversals (BFS/DFS).',
      '**Determinism & Verification:** Formal proof of termination, correctness invariants, and worst-case bounds.'
    ]
  },
  'ai in 2026': {
    title: 'Artificial Intelligence Landscape in 2026',
    summary: 'In 2026, the artificial intelligence landscape is defined by autonomous agentic architectures, open-weight reasoning breakthroughs (DeepSeek-R1, Qwen 2.5), hybrid reasoning frontier models (Claude 3.7 Sonnet, OpenAI o3), and multi-model consensus engines.',
    keyPoints: [
      '**Open-Weight Reasoning Revolution:** DeepSeek-R1 transformed the ecosystem by matching frontier proprietary reasoning benchmarks with open weights, setting a new standard for transparent and low-cost reasoning.',
      '**Frontier Hybrid Thinking & Coding:** Claude 3.7 Sonnet and OpenAI o3/o3-mini lead in multi-step engineering, tool use, and long-horizon autonomous tasks.',
      '**Consensus Architectures (like Godfy):** Instead of relying on any single model with potential blindspots or cutoff limitations, systems orchestrate specialized open models in parallel to achieve higher accuracy and cross-verification.'
    ],
    analogy: 'AI transitioned from an isolated single-model chatbot into an orchestrated council of specialized autonomous agents.'
  },
  'best ai model': {
    title: 'Top AI Models by Use Case (2026)',
    summary: 'In 2026, no single model dominates every domain. Selection depends on the specific workload: reasoning, coding, conversational nuance, or open deployment.',
    keyPoints: [
      '**Deep Reasoning & Logic:** DeepSeek-R1 (open-weight) and OpenAI o3 lead in autonomous mathematical and algorithmic reasoning.',
      '**Full-Stack Coding & Agent Execution:** Claude 3.7 Sonnet and Claude 3.5 Sonnet remain the gold standard for software engineering and complex tool workflows.',
      '**Open-Weight Production:** DeepSeek-R1 (for reasoning), Qwen 2.5 72B (for conversational nuance and international languages), and Llama 3.3 70B (for reliable architectural scaffolding).'
    ],
    analogy: 'Choosing an AI model in 2026 is like drafting a sports team: you pair DeepSeek for rigorous logic, Claude for coding execution, and Llama/Qwen for structured systems.'
  },

  // Historical Pioneers & Figures
  'turing': {
    title: 'Alan Turing',
    summary: 'Alan Turing (1912–1954) was a British mathematician, logician, and cryptanalyst widely recognized as the father of modern theoretical computer science and artificial intelligence.',
    keyPoints: [
      '**Universal Turing Machine (1936):** Formulated the mathematical blueprint of modern general-purpose computing and proved the undecidability of the Halting Problem.',
      '**Enigma Decryption & Bletchley Park:** Designed the electromechanical "Bombe" machine that broke Nazi naval Enigma ciphers, fundamentally shortening World War II and saving millions of lives.',
      '**The Turing Test & AI (1950):** Published "Computing Machinery and Intelligence", introducing the imitation game (Turing Test) as a foundational metric for machine cognition.',
      '**ACE (Automatic Computing Engine):** Designed one of the very first stored-program computers.'
    ],
    analogy: 'Before Turing, calculating machines were built for single tasks like calculating artillery tables; Turing realized that one machine could simulate any other machine using stored symbolic instructions.'
  },
  'alan turing': {
    title: 'Alan Turing',
    summary: 'Alan Turing (1912–1954) was a British mathematician, logician, and cryptanalyst widely recognized as the father of modern theoretical computer science and artificial intelligence.',
    keyPoints: [
      '**Universal Turing Machine (1936):** Formulated the mathematical blueprint of modern general-purpose computing and proved the undecidability of the Halting Problem.',
      '**Enigma Decryption & Bletchley Park:** Designed the electromechanical "Bombe" machine that broke Nazi naval Enigma ciphers, fundamentally shortening World War II and saving millions of lives.',
      '**The Turing Test & AI (1950):** Published "Computing Machinery and Intelligence", introducing the imitation game (Turing Test) as a foundational metric for machine cognition.',
      '**ACE (Automatic Computing Engine):** Designed one of the very first stored-program computers.'
    ],
    analogy: 'Turing realized that software and hardware could be unified: a universal machine executing symbolic programs could simulate any mechanical thought process.'
  },
  'lovelace': {
    title: 'Ada Lovelace',
    summary: 'Ada Lovelace (1815–1852) was an English mathematician and writer universally regarded as the world\'s first computer programmer.',
    keyPoints: [
      '**First Computer Algorithm (1843):** Translated Luigi Menabrea\'s memoir on Babbage\'s Analytical Engine, appending "Note G"—the first complete algorithm intended for machine execution (computing Bernoulli numbers).',
      '**Poetical Science & Generalized Computing:** Foresee that computing engines could manipulate symbols, music, and art beyond pure numerical arithmetic.'
    ]
  },
  'tesla': {
    title: 'Nikola Tesla',
    summary: 'Nikola Tesla (1856–1943) was a Serbian-American inventor, electrical engineer, and futurist who developed the alternating current (AC) electricity supply system that powers the modern world.',
    keyPoints: [
      '**AC Induction Motor & Polyphase Power:** Patented the polyphase AC electrical distribution system and the brushless AC induction motor, winning the "War of the Currents" against Edison\'s DC.',
      '**Tesla Coil & Resonant Circuits:** Pioneered high-voltage, high-frequency electrical transmission, paving the way for wireless radio communication and X-ray technology.',
      '**Remote Control & Robotics:** Demonstrated the first radio-controlled teleautomaton boat in 1898.'
    ]
  },
  'von neumann': {
    title: 'John von Neumann',
    summary: 'John von Neumann (1903–1957) was a Hungarian-American mathematician and physicist whose contributions spanned computer architecture, quantum mechanics, game theory, and nuclear physics.',
    keyPoints: [
      '**Von Neumann Architecture:** Formalized the CPU, Arithmetic Logic Unit (ALU), Registers, Memory, and Input/Output bus, which remains the blueprint of nearly all computers today.',
      '**Game Theory:** Proved the minimax theorem and established modern mathematical game theory with Oskar Morgenstern.',
      '**Cellular Automata:** Created the first mathematical proof of self-replicating machines.'
    ]
  },
  'shannon': {
    title: 'Claude Shannon',
    summary: 'Claude Shannon (1916–2001) was an American mathematician and electrical engineer known as the "Father of Information Theory".',
    keyPoints: [
      '**A Mathematical Theory of Communication (1948):** Defined the fundamental unit of information (the bit), channel capacity, and Shannon entropy ($H(X) = -\\sum p(x) \\log_2 p(x)$).',
      '**Digital Circuit Design (1937):** Proved in his master\'s thesis that electrical switches (Boolean algebra) could solve any logical or numerical calculation, inventing modern digital computing hardware.'
    ]
  },
  'torvalds': {
    title: 'Linus Torvalds',
    summary: 'Linus Torvalds is a Finnish-American software engineer who created the Linux operating system kernel (1991) and the Git distributed version control system (2005).',
    keyPoints: [
      '**Linux Kernel:** Powers the vast majority of cloud servers, Android smartphones, supercomputers, and modern internet infrastructure.',
      '**Git:** Revolutionized global software collaboration by creating a lightning-fast, cryptographically verified DAG-based version control system.'
    ]
  },

  // Systems & Architecture
  'kubernetes': {
    title: 'Kubernetes (K8s)',
    summary: 'Kubernetes is an open-source container orchestration engine originally developed by Google for automating the deployment, scaling, self-healing, and networking of containerized workloads.',
    keyPoints: [
      '**Control Plane & Worker Nodes:** API server, etcd (distributed key-value state), kube-scheduler, and controller-manager coordinate pods running on kubelet worker nodes.',
      '**Declarative Infrastructure:** Define target state in YAML manifests; K8s continuously reconciles the actual cluster state to match desired state.',
      '**Core Primitives:** Pods (smallest deployable unit), Services (stable networking endpoint/load balancing), Deployments (declarative rolling upgrades), and Ingress.'
    ]
  },
  'tcp': {
    title: 'TCP/IP & 3-Way Handshake',
    summary: 'Transmission Control Protocol (TCP) is a connection-oriented, reliable transport layer protocol that provides ordered, error-checked delivery of a stream of octets between networked applications.',
    keyPoints: [
      '**3-Way Handshake (Connection Establishment):** Client sends SYN (synchronize with initial seq number $x$); Server responds with SYN-ACK ($y$, ack $x+1$); Client responds with ACK ($y+1$). Connection state transitions to ESTABLISHED.',
      '**Reliability & Congestion Control:** Implements sequence numbering, acknowledgment packets, sliding window flow control, and adaptive congestion avoidance (Slow Start, Congestion Avoidance via AIMD).',
      '**Teardown (4-Way Handshake):** FIN from sender, ACK from receiver; FIN from receiver, ACK from sender, followed by TIME_WAIT state.'
    ]
  },
  'jwt': {
    title: 'JSON Web Tokens (JWT)',
    summary: 'JSON Web Token (RFC 7519) is a compact, URL-safe means of representing claims securely between two parties, commonly used for stateless stateless authentication and authorization.',
    keyPoints: [
      '**Three Components:** Separated by periods: `Header.Payload.Signature`. Header defines signing algorithm (e.g. HS256, RS256); Payload contains claims (`sub`, `exp`, `role`); Signature verifies integrity.',
      '**Statelessness:** Servers verify token validity using a secret or public key without querying a session database on every request.',
      '**Security Best Practices:** Store in HTTP-only, secure cookies to prevent XSS attacks; keep token expiration windows short and use refresh tokens.'
    ]
  }
};

/**
 * Match a query to known encyclopedic concepts
 */
export function lookupKnowledge(query) {
  if (!query) return null;
  const lower = query.toLowerCase();

  // Match AI model recommendation or landscape inquiries
  if (/\b(best ai|best model|recommend a model|which model|which ai|what model|top model|recommend an ai|ai models?)\b/i.test(lower)) {
    return TOPIC_KNOWLEDGE['best ai model'];
  }

  // Special match for current 2026 AI landscape
  if ((lower.includes('ai') || lower.includes('artificial intelligence')) && (lower.includes('2026') || lower.includes('news') || lower.includes('latest'))) {
    return TOPIC_KNOWLEDGE['ai in 2026'];
  }

  for (const [key, item] of Object.entries(TOPIC_KNOWLEDGE)) {
    if (lower.includes(key)) {
      return item;
    }
  }

  // Check individual words
  const words = lower.split(/[^a-zA-Z0-9_-]+/);
  for (const word of words) {
    if (word.length >= 3 && TOPIC_KNOWLEDGE[word]) {
      return TOPIC_KNOWLEDGE[word];
    }
  }

  return null;
}
