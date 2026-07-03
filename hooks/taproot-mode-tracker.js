#!/usr/bin/env node
// taproot — UserPromptSubmit hook to track active mode

const { getDefaultMode, normalizeMode } = require('./taproot-config');
const { clearMode, setMode, writeHookOutput } = require('./taproot-runtime');

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input.replace(/^\uFEFF/, ''));
    const prompt = String(data.prompt || '').trim();
    const lower = prompt.toLowerCase();

    if (/^[/@$]taproot(\s|$|:)/.test(lower)) {
      const parts = lower.split(/\s+/);
      const cmd = parts[0].replace(/^[@$]/, '/');
      const arg = parts[1] || '';

      if (cmd === '/taproot' || cmd === '/taproot:taproot') {
        const mode = normalizeMode(arg) || getDefaultMode();
        if (mode === 'off') {
          clearMode();
          writeHookOutput('UserPromptSubmit', 'off', 'TAPROOT MODE OFF');
        } else {
          setMode('on');
          writeHookOutput('UserPromptSubmit', 'on', 'TAPROOT MODE ON');
        }
      }
    }

    if (/\b(stop taproot|normal mode)\b/i.test(prompt)) {
      clearMode();
      writeHookOutput('UserPromptSubmit', 'off', 'TAPROOT MODE OFF');
    }
  } catch (_e) {}
});
