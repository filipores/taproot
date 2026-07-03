const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.join(__dirname, '..');

test('taproot skills have valid frontmatter', () => {
  for (const skill of ['taproot', 'taproot-loop']) {
    const body = fs.readFileSync(path.join(root, 'skills', skill, 'SKILL.md'), 'utf8');
    assert.match(body, new RegExp(`^---\\nname: ${skill}\\n`));
    assert.match(body, /description:/);
  }
});

test('taproot instructions include all root laws', () => {
  const { getTaprootInstructions } = require('../hooks/taproot-instructions');
  const text = getTaprootInstructions();
  for (const phrase of [
    'Evidence Law',
    'First-Wrong-State Law',
    'Owner Law',
    'Caller Law',
    'Overfit Law',
    'Patch-Shape Law',
    'State Law',
    'Contract Law',
  ]) {
    assert.match(text, new RegExp(phrase));
  }
});

test('taproot-loop defines loop stop criteria', () => {
  const body = fs.readFileSync(path.join(root, 'skills', 'taproot-loop', 'SKILL.md'), 'utf8');
  assert.match(body, /first wrong state/);
  assert.match(body, /failing-before regression/);
});

test('logo is an svg', () => {
  const body = fs.readFileSync(path.join(root, 'assets', 'logo.svg'), 'utf8');
  assert.match(body, /^<svg /);
  assert.match(body, /aria-label="Taproot"/);
});
