#!/usr/bin/env node
// taproot — Claude/Codex SessionStart activation hook

const { getDefaultMode } = require('./taproot-config');
const { getTaprootInstructions } = require('./taproot-instructions');
const { clearMode, isCodex, setMode, writeHookOutput } = require('./taproot-runtime');

const mode = getDefaultMode();

if (mode === 'off') {
  clearMode();
  writeHookOutput('SessionStart', 'off', isCodex ? '' : 'OK');
  process.exit(0);
}

try { setMode('on'); } catch (_e) {}
writeHookOutput('SessionStart', 'on', getTaprootInstructions());
