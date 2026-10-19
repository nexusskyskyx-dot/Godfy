// Template engines and intelligent dynamic generators for Godfy Engine v1

export function generateLandingPageCode({ 
  title = "Next-Gen AI Platform", 
  tagline = "Harness the power of multi-model consensus intelligence.", 
  cta = "Deploy Engine v1",
  theme = "default",
  includeTestimonials = false,
  includePricing = true
} = {}) {
  const isCoffee = theme === 'coffee';
  const displayTitle = isCoffee ? "Artisan Roast & Co." : title;
  const displayTagline = isCoffee 
    ? "Ethically sourced beans, precision roasted with multi-origin consensus." 
    : tagline;
  const displayCta = isCoffee ? "Order Fresh Roast" : cta;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${displayTitle} | Synthesized by Godfy v1</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            cream: { 50: '#FDFBF7', 100: '#FAF7EE', 200: '#F4ECE1', 300: '#E8DCC9' },
            cyanlight: { 50: '#F0FDFA', 100: '#E0F7FA', 200: '#A5F3FC', 400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2' },
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>
  <style>
    body { background-color: #FAF7EE; color: #1E293B; font-family: 'Inter', sans-serif; }
    .glow-cyan { box-shadow: 0 0 35px -5px rgba(34, 211, 238, 0.4); }
    .badge-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  </style>
</head>
<body class="min-h-screen bg-cream-100 text-slate-800 antialiased selection:bg-cyanlight-200 selection:text-cyan-900">

  <!-- Header / Navigation -->
  <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-cream-200/80">
    <div class="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyanlight-200 to-cyanlight-400 p-0.5 shadow-sm">
          <div class="w-full h-full bg-white rounded-[10px] flex items-center justify-center font-bold text-slate-900 text-lg">
            G
          </div>
        </div>
        <div class="flex items-baseline space-x-1.5">
          <span class="text-xl font-extrabold tracking-tight text-slate-900">${isCoffee ? 'Godfy Coffee' : 'Godfy'}</span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-cyanlight-100 text-cyan-800 font-semibold border border-cyanlight-200">v1</span>
        </div>
      </div>

      <nav class="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
        <a href="#features" class="hover:text-cyan-700 transition">${isCoffee ? 'Blends' : 'Engine Architecture'}</a>
        <a href="#consensus" class="hover:text-cyan-700 transition">${isCoffee ? 'Roast Consensus' : 'Mind Consensus'}</a>
        ${includeTestimonials ? '<a href="#testimonials" class="hover:text-cyan-700 transition">Testimonials</a>' : ''}
        ${includePricing ? '<a href="#pricing" class="hover:text-cyan-700 transition">Pricing</a>' : ''}
      </nav>

      <div class="flex items-center space-x-4">
        <button class="hidden sm:inline-flex text-sm font-medium text-slate-700 hover:text-slate-900 px-4 py-2">Docs</button>
        <button class="px-4 py-2 text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl hover:border-cyanlight-400 hover:shadow-sm transition">
          ${isCoffee ? 'Order Now' : 'Launch Console'}
        </button>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative pt-16 sm:pt-20 pb-20 sm:pb-24 overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(#22D3EE_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
    
    <div class="max-w-5xl mx-auto px-6 text-center relative z-10">
      <div class="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-cream-300/80 shadow-sm mb-6">
        <span class="w-2 h-2 rounded-full bg-cyan-400 badge-pulse"></span>
        <span class="text-xs font-semibold text-slate-700 tracking-wide uppercase">Godfy Mind Autonomous Synthesis v1</span>
      </div>

      <h1 class="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.15] mb-6">
        ${isCoffee ? 'Crafted Beans. Every Origin Mastered.' : 'Ask Once. <br class="hidden sm:inline" /><span class="bg-gradient-to-r from-slate-900 via-cyan-800 to-cyan-500 bg-clip-text text-transparent">Every Free AI Synthesized</span> Into Pure Mastery.'}
      </h1>

      <p class="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 mb-10 leading-relaxed font-normal">
        ${displayTagline}
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
        <button class="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-base shadow-lg hover:bg-slate-800 hover:shadow-cyanlight-200/50 hover:shadow-xl transition transform active:scale-[0.98]">
          ${displayCta}
        </button>
        <button class="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white text-slate-800 font-semibold text-base border border-slate-200/90 hover:bg-cream-50 hover:border-cyanlight-400 transition">
          Watch Mind in Action
        </button>
      </div>

      <!-- Live Interactive Terminal Preview -->
      <div class="bg-white rounded-2xl border border-cream-300 shadow-xl p-5 max-w-3xl mx-auto text-left glow-cyan">
        <div class="flex items-center justify-between pb-3 border-b border-cream-200 mb-4">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded-full bg-red-400"></div>
            <div class="w-3 h-3 rounded-full bg-amber-400"></div>
            <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
            <span class="ml-2 text-xs font-mono text-slate-400">godfy-mind://pipeline-consensus</span>
          </div>
          <span class="text-xs font-mono font-medium px-2 py-0.5 rounded bg-cyanlight-100 text-cyan-800">5 Models Connected</span>
        </div>

        <div class="space-y-3 font-mono text-xs sm:text-sm">
          <div class="flex items-start space-x-3 text-slate-600">
            <span class="text-slate-400 font-bold">$</span>
            <span><strong class="text-slate-900">User:</strong> "Make a landing page"</span>
          </div>
          <div class="pl-4 py-2 border-l-2 border-cyan-400 space-y-1 bg-cream-50/60 rounded-r-lg">
            <div class="text-cyan-800 font-semibold">⚡ Godfy Dispatcher: Fan-out to 5 Free Nodes in parallel</div>
            <div class="text-slate-600 text-xs">» Llama 3.3: Structured layout & visual hierarchy emitted (340ms)</div>
            <div class="text-slate-600 text-xs">» DeepSeek R1: Conversion psychology & social proof mechanics (410ms)</div>
            <div class="text-slate-600 text-xs">» Mistral 24B: Tailwind styling & responsive components (290ms)</div>
            <div class="text-slate-600 text-xs">» Qwen 2.5: High-converting hero copy & emotional hook (360ms)</div>
            <div class="text-slate-600 text-xs">» Gemma 2: Accessibility review & WCAG contrast audit (260ms)</div>
          </div>
          <div class="text-emerald-700 font-semibold pt-1">
            ✨ Godfy Mind Synthesis: Resolved conflicts. Blended 5 models into single unified artifact. Done in 410ms.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Feature Grid -->
  <section id="features" class="py-16 sm:py-20 bg-white border-y border-cream-200">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-xs uppercase tracking-widest font-bold text-cyan-700 mb-2">Architectural Superiority</h2>
        <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Why Single-AI Engines Fall Short
        </h3>
        <p class="text-slate-600 mt-4 text-base">
          Every model has blindspots. Godfy acts as the orchestrating brain that uses each open model where it shines most.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <div class="p-8 rounded-2xl bg-cream-100/50 border border-cream-200 hover:border-cyanlight-400 hover:shadow-card-subtle transition duration-200">
          <div class="w-12 h-12 rounded-xl bg-white border border-cream-200 flex items-center justify-center mb-6 text-cyan-600 shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h4 class="text-xl font-bold text-slate-900 mb-3">Parallel Model Fan-Out</h4>
          <p class="text-slate-600 text-sm leading-relaxed">
            One query is simultaneously streamed to Llama, DeepSeek, Mistral, Qwen, and Gemma with zero sequential delay.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="p-8 rounded-2xl bg-cream-100/50 border border-cream-200 hover:border-cyanlight-400 hover:shadow-card-subtle transition duration-200">
          <div class="w-12 h-12 rounded-xl bg-white border border-cream-200 flex items-center justify-center mb-6 text-cyan-600 shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <h4 class="text-xl font-bold text-slate-900 mb-3">Contradiction Adjudication</h4>
          <p class="text-slate-600 text-sm leading-relaxed">
            When models disagree on code syntax or factual claims, Godfy's Mind performs cross-verification to keep only verifiable truths.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="p-8 rounded-2xl bg-cream-100/50 border border-cream-200 hover:border-cyanlight-400 hover:shadow-card-subtle transition duration-200">
          <div class="w-12 h-12 rounded-xl bg-white border border-cream-200 flex items-center justify-center mb-6 text-cyan-600 shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          </div>
          <h4 class="text-xl font-bold text-slate-900 mb-3">Unified Artifact Generation</h4>
          <p class="text-slate-600 text-sm leading-relaxed">
            The final result is not a messy composite — it is a cohesive, polished production asset ready to deploy immediately.
          </p>
        </div>
      </div>
    </div>
  </section>

  ${includeTestimonials ? `
  <!-- Testimonials Section -->
  <section id="testimonials" class="py-16 sm:py-20 bg-cream-50 border-b border-cream-200">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="text-xs font-bold uppercase tracking-widest text-cyan-700">Customer Proof</span>
        <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">Loved by Builders Everywhere</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-2xl bg-white border border-cream-200 shadow-sm">
          <p class="text-slate-600 text-sm mb-4">"Godfy replaced 4 different AI subscriptions with one unified consensus mind. Unbelievable accuracy."</p>
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-full bg-cyanlight-200 flex items-center justify-center font-bold text-cyan-900 text-xs">EL</div>
            <div>
              <div class="text-sm font-bold text-slate-900">Elena Rostova</div>
              <div class="text-xs text-slate-500">CTO @ HyperScale</div>
            </div>
          </div>
        </div>
        <div class="p-6 rounded-2xl bg-white border border-cream-200 shadow-sm">
          <p class="text-slate-600 text-sm mb-4">"The landing pages Godfy synthesizes are ready to ship straight to Vercel without tweaking a line of code."</p>
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-full bg-cyanlight-200 flex items-center justify-center font-bold text-cyan-900 text-xs">MK</div>
            <div>
              <div class="text-sm font-bold text-slate-900">Marcus Kim</div>
              <div class="text-xs text-slate-500">Founder @ DevFlow</div>
            </div>
          </div>
        </div>
        <div class="p-6 rounded-2xl bg-white border border-cream-200 shadow-sm">
          <p class="text-slate-600 text-sm mb-4">"Having its own mind means it actually rejects hallucinated suggestions from weaker models. Pure genius."</p>
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 rounded-full bg-cyanlight-200 flex items-center justify-center font-bold text-cyan-900 text-xs">SR</div>
            <div>
              <div class="text-sm font-bold text-slate-900">Sophia Ruiz</div>
              <div class="text-xs text-slate-500">Design Lead @ StudioX</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>` : ''}

  ${includePricing ? `
  <!-- Pricing Section -->
  <section id="pricing" class="py-16 sm:py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="text-xs font-bold uppercase tracking-widest text-cyan-700">Open Access</span>
        <h3 class="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">Transparent, Open Power</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div class="p-6 rounded-2xl bg-cream-50 border border-cream-200 text-left">
          <h4 class="font-bold text-lg text-slate-900 mb-1">Starter Mind</h4>
          <p class="text-xs text-slate-500 mb-4">For individuals & rapid prototyping</p>
          <div class="text-3xl font-extrabold text-slate-900 mb-4">$0 <span class="text-xs font-normal text-slate-500">/ forever free</span></div>
          <ul class="text-xs text-slate-600 space-y-2 mb-6">
            <li>✓ 5 Free Models Consensus</li>
            <li>✓ Unlimited Landing Pages</li>
            <li>✓ Instant Vercel Deploy Ready</li>
          </ul>
          <button class="w-full py-2 rounded-xl bg-white border border-slate-300 font-semibold text-xs hover:border-cyan-400">Get Started</button>
        </div>
        <div class="p-6 rounded-2xl bg-slate-900 text-white border-2 border-cyan-400 shadow-xl text-left relative">
          <span class="absolute -top-3 right-4 bg-cyan-400 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">Most Popular</span>
          <h4 class="font-bold text-lg text-white mb-1">Engine Pro v1</h4>
          <p class="text-xs text-slate-400 mb-4">For growth teams and agencies</p>
          <div class="text-3xl font-extrabold text-white mb-4">$29 <span class="text-xs font-normal text-slate-400">/ month</span></div>
          <ul class="text-xs text-slate-300 space-y-2 mb-6">
            <li>✓ Prioritized Latency (<300ms)</li>
            <li>✓ Custom Model Weights & Fine-tuning</li>
            <li>✓ Autonomous Code Refactoring</li>
          </ul>
          <button class="w-full py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300">Launch Pro</button>
        </div>
        <div class="p-6 rounded-2xl bg-cream-50 border border-cream-200 text-left">
          <h4 class="font-bold text-lg text-slate-900 mb-1">Sovereign Cluster</h4>
          <p class="text-xs text-slate-500 mb-4">Dedicated enterprise nodes</p>
          <div class="text-3xl font-extrabold text-slate-900 mb-4">Custom</div>
          <ul class="text-xs text-slate-600 space-y-2 mb-6">
            <li>✓ On-Premises Open Weights</li>
            <li>✓ Custom SLA & Zero Retention</li>
            <li>✓ 24/7 Cognitive Mesh Support</li>
          </ul>
          <button class="w-full py-2 rounded-xl bg-white border border-slate-300 font-semibold text-xs hover:border-cyan-400">Contact Team</button>
        </div>
      </div>
    </div>
  </section>` : ''}

  <!-- Footer -->
  <footer class="bg-white border-t border-cream-200 py-12 text-center text-sm text-slate-500">
    <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center space-x-2">
        <span class="font-extrabold text-slate-900">${isCoffee ? 'Godfy Coffee' : 'Godfy'}</span>
        <span>• Autonomous AI Engine</span>
        <span class="px-2 py-0.5 rounded bg-cream-100 text-slate-700 text-xs font-mono font-medium">v1</span>
      </div>
      <div>
        Colors: Main White Cream (#FAF7EE) • White (#FFFFFF) • Cyan Light (#E0F7FA)
      </div>
      <div>
        &copy; 2026 Godfy Engine. Autonomous multi-model intelligence.
      </div>
    </div>
  </footer>

</body>
</html>`;
}

