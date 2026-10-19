#!/usr/bin/env node

import { processChatWithGodfy } from '../src/engine/godfyMind.js';

const query = process.argv.slice(2).join(' ') || 'Make a landing page';

console.log('\n======================================================');
console.log('              GODFY AI CHAT ENGINE v1');
console.log('       Multi-AI Autonomous Consensus Engine');
console.log('======================================================\n');
console.log(`[Theme Colors] Main: White cream (#FAF7EE) | Secondary: White (#FFFFFF) | 2nd Secondary: Cyan light (#E0F7FA)`);
console.log(`[Version Updates] v1\n`);
console.log(`User: ${query}\n`);
console.log('godfy engine: Calling 5 Free AIs for answers...');
console.log('  → Sending the exact same question to: Llama 3.3, DeepSeek R1, Mistral Open, Qwen 2.5, Gemma 2\n');

processChatWithGodfy({
  prompt: query,
  onStreamStep: ({ step, message }) => {
    if (step === 'search' || step === 'search_done') {
      console.log(`[Web Search]: ${message}`);
    }
  }
}).then(res => {
  if (res.searchedWeb && res.webSources) {
    console.log(`\n[Godfy Autonomous Web Search]: Consulted ${res.webSources.length} live sources:`);
    res.webSources.forEach(s => {
      console.log(`  • [${s.source}] ${s.title} (${s.url})`);
    });
  }

  console.log(`\n[Godfy Mind Consensus]: ${res.consensusScore}`);
  console.log('\n--- 5 FREE AI ANSWERS RECEIVED ---');
  res.modelProposals.forEach(m => {
    console.log(`\n• ${m.modelName} (${m.badge})`);
    console.log(`  Extracted by Godfy: ${m.keyExtracted}`);
  });

  console.log('\n--- GODFY MIND MASTER SYNTHESIS ---');
  console.log(res.masterText);

  if (res.codeArtifact) {
    console.log('\n[Artifact] Code generated and ready to run in Live Preview Sandbox!');
  }
  console.log('\n======================================================\n');
}).catch(err => {
  console.error('Godfy Chat Engine error:', err);
  process.exit(1);
});
