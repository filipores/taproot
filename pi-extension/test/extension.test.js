import assert from 'node:assert/strict';
import test from 'node:test';
import { parseTaprootCommand, resolveSessionMode } from '../index.js';

test('parse taproot commands', () => {
  assert.deepEqual(parseTaprootCommand(''), { type: 'set-mode', mode: 'on' });
  assert.deepEqual(parseTaprootCommand('off'), { type: 'set-mode', mode: 'off' });
  assert.deepEqual(parseTaprootCommand('status'), { type: 'status' });
  assert.deepEqual(parseTaprootCommand('default off'), { type: 'set-default', mode: 'off' });
  assert.equal(parseTaprootCommand('maybe').type, 'invalid');
});

test('resolve session mode from latest entry', () => {
  const entries = [
    { type: 'custom', customType: 'taproot-mode', data: { mode: 'on' } },
    { type: 'custom', customType: 'taproot-mode', data: { mode: 'off' } },
  ];
  assert.equal(resolveSessionMode(entries), 'off');
  assert.equal(resolveSessionMode([], 'on'), 'on');
});
