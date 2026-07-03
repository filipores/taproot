#!/usr/bin/env node
// Shared Taproot instruction builder for Claude/Codex hooks and Pi extension.

const fs = require('fs');
const path = require('path');

const SKILL_PATH = path.join(__dirname, '..', 'skills', 'taproot', 'SKILL.md');

function stripFrontmatter(body) {
  return String(body || '').replace(/^---[\s\S]*?---\s*/, '');
}

function getFallbackInstructions() {
  return 'TAPROOT MODE ACTIVE\n\n' +
    'You are the taproot under the tree. Leaves show symptoms; the first wrong state is underground. ' +
    'Ask: what broke first?\n\n' +
    'Root laws: 1 No edit from vibes. 2 Fix the first wrong state, not the crash site. ' +
    '3 Fix at the invariant owner; no copied guards. 4 Grep callers before shared edits. ' +
    '5 Regression must fail before and pass after. 6 Guards, deletions, early returns, broad catches, ' +
    'relaxed validation, sleeps, retries, and fallbacks are suspect until proven. ' +
    '7 Stateful fixes need old-data, partial-success, idempotency, dedupe, retry, and audit checks. ' +
    '8 Contract changes update generated/client contracts or rule them out.\n\n' +
    'If blocked, report the symptom leaf, missing root, patch smell, and smallest safe move.';
}

function getTaprootInstructions() {
  try {
    return 'TAPROOT MODE ACTIVE\n\n' + stripFrontmatter(fs.readFileSync(SKILL_PATH, 'utf8'));
  } catch (_e) {
    return getFallbackInstructions();
  }
}

module.exports = {
  getFallbackInstructions,
  getTaprootInstructions,
  stripFrontmatter,
};
