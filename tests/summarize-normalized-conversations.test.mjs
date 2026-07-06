import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scriptPath = path.join(repoRoot, 'scripts', 'summarize-normalized-conversations.mjs');
const fixturePath = path.join(repoRoot, 'tests', 'fixtures', 'normalized-conversations-sample.json');

test('summarizes normalized conversations and ranks high-signal sessions', async () => {
  const outDir = await mkdtemp(path.join(tmpdir(), 'aiden-memory-summary-'));

  try {
    await execFileAsync(process.execPath, [
      scriptPath,
      '--input',
      fixturePath,
      '--out',
      outDir,
    ], { cwd: repoRoot });

    const summaries = JSON.parse(await readFile(path.join(outDir, 'conversation-summaries.json'), 'utf8'));
    const highSignal = await readFile(path.join(outDir, 'high-signal-conversations.md'), 'utf8');

    assert.equal(summaries.length, 2);
    assert.equal(summaries[0].uuid, 'study-session');
    assert.deepEqual(summaries[0].domains.sort(), ['health_fitness', 'study_exam']);
    assert.equal(summaries[0].message_count, 3);
    assert.equal(summaries[0].human_message_count, 2);
    assert.match(summaries[0].gist, /realistic study plan/);
    assert.ok(summaries[0].signal_score > 0);
    assert.match(highSignal, /study-session/);
    assert.match(highSignal, /memory-session/);
    assert.match(highSignal, /Aiden Memory/);
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});
