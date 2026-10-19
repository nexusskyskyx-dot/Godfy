# Godfy AI Chat Engine `v1`

> **An AI Chatting Engine with its own autonomous mind.**  
> Built strictly as a multi-model conversational intelligence platform. When you ask Godfy a question (e.g. *"Make a landing page"*, *"Explain quantum computing"*, *"Write an API in Go"*), Godfy calls 5 Free open-weight AIs simultaneously, sends the exact same prompt to all of them, and synthesizes the optimal master response combining all their answers through its own mind.

---

## 🎨 Official Color Identity

Strictly designed with the user-specified design system:
- **Main Color:** White Cream (`#FAF7EE` / `cream-100`)
- **Secondary Color:** Pure White (`#FFFFFF`)
- **2nd Secondary Color:** Cyan Light (`#E0F7FA` / `cyanlight-brand` / `#22D3EE` glows)
- **Text:** High-contrast Slate (`#0F172A` / `#1E293B`) exceeding WCAG AAA standards

---

## 🧠 How the Chat Engine Works

```
                     User Chat Input
                 "Make a landing page"
                           │
                           ▼
     ┌──────────────────────────────────────────────┐
     │      Godfy Parallel Multi-AI Fan-Out        │
     └─────────────────────┬────────────────────────┘
                           │
    ┌──────────┬───────────┼───────────┬──────────┐
    ▼          ▼           ▼           ▼          ▼
Llama 3.3  DeepSeek R1 Mistral 24B  Qwen 2.5   Gemma 2
 (Meta)    (DeepSeek)  (Mistral AI) (Alibaba)  (Google)
    │          │           │           │          │
    └──────────┴───────────┼───────────┴──────────┘
                           │
                           ▼
     ┌──────────────────────────────────────────────┐
     │              GODFY'S OWN MIND                │
     │ • Cross-verification & truth adjudication    │
     │ • Redundancy pruning & conflict resolution   │
     │ • Synthesizes the single best combined reply │
     └─────────────────────┬────────────────────────┘
                           │
                           ▼
             [ Master Synthesized Message ]
            + Compare the 5 AI Answers Drawer
            + Live Interactive Preview Sandbox
```

### Example Flow:
- **User:** *"Make a landing page"*
- **Godfy Engine:**
  1. Calls 5 Free AIs in parallel (Llama 3.3, DeepSeek R1, Mistral Open, Qwen 2.5, Gemma 2).
  2. Sends the exact same prompt to all models.
  3. Reconciles structural, logic, styling, and copy differences.
  4. Returns the single best master response combining all AI answers, with an inline **Live Preview Sandbox** to interact with the page!

---

## 🚀 Key Chat Features

1. **Dedicated Chat Mode:** Clean, distraction-free conversational UI built for both mobile and desktop.
2. **Mobile Drawer Sidebar:** Tap hamburger (`☰`) on mobile to open chat history, start new chats, and check live telemetry for the 5 AI nodes.
3. **Compare the 5 Free AI Answers:** Under any response, click the accordion to see what each individual model (Llama, DeepSeek, Mistral, Qwen, Gemma) independently answered.
4. **Godfy Mind Reasoning Trace:** Expand the `<think>` block to read Godfy's autonomous internal monologue.
5. **Interactive Live Sandbox:** When code or landing pages are generated, tap **Live Preview Sandbox** to test in Desktop, Tablet, and Mobile viewports.
6. **Updates Lifecycle:** Versioned as **`v1`**.

---

## 💻 CLI & Local Development

```bash
# Run local dev server (port 3000)
npm run dev

# Run Godfy Chat Engine in terminal
node bin/godfy.js "Make a landing page"
```
