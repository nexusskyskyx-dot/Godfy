#!/usr/bin/env node

import { runGodfySynthesis } from '../src/engine/godfyMind.js';

const query = process.argv.slice(2).join(' ') || 'Make a landing page';

console.log('\n======================================================');
console.log('              GODFY AI ENGINE v1');
console.log('       Multi-AI Autonomous Consensus Engine');
console.log('======================================================\n');
console.log(`[Theme Colors] Main: White cream (#FAF7EE) | Secondary: White (#FFFFFF) | 2nd Secondary: Cyan light (#E0F7FA)`);
console.log(`[Version] v1`);
console.log(`\nUser: ${query}\n`);
console.log('godfy engine: Calling 5 Free AIs for answers...');
console.log('  → Sending identical question to: Llama 3.3, DeepSeek R1, Mistral Open, Qwen 2.5, Gemma 2');

runGodfySynthesis({
  query,
  onProgress: ({ stage, progress }) => {
    // optional progress trace
  }
}).then(res => {
  console.log(`\n[Godfy Mind Consensus Score]: ${res.consensusScore}%`);
  console.log(`[Divergences Adjudicated]: ${res.divergencesResolved}\n`);

  console.log('--- INDIVIDUAL FREE AI PROPOSALS ---');
  res.modelResponses.forEach(m => {
    console.log(`\n• ${m.modelName} [Confidence: ${m.confidence}%]`);
    console.log(`  Extracted by Godfy: ${m.keyContribution}`);
  });

  console.log('\n--- GODFY MIND MASTER SYNTHESIS ---');
  console.log(res.masterResponse.title);
  console.log('\nDecision:');
  console.log(res.masterResponse.mindTakeaway);
  console.log('\nSummary:');
  console.log(res.masterResponse.summary);

  if (res.previewCode) {
    console.log('\n[Artifact] Interactive Live HTML/Tailwind landing page generated successfully!');
  }
  console.log('\n======================================================\n');
}).catch(err => {
  console.error('Godfy Engine error:', err);
  process.exit(1);
});
