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
const scriptPath = path.join(repoRoot, 'scripts', 'import-codex-sessions.mjs');
const fixtureSource = path.join(repoRoot, 'tests', 'fixtures');

test('cleans Codex JSONL sessions into import-ready conversation files', async () => {
  const outDir = await mkdtemp(path.join(tmpdir(), 'aiden-memory-codex-import-'));

  try {
    await execFileAsync(process.execPath, [
      scriptPath,
      '--source',
      fixtureSource,
      '--start',
      '2026-07-06',
      '--end',
      '2026-07-06',
      '--out',
      outDir,
      '--no-copy-raw',
    ], { cwd: repoRoot });

    const clean = JSON.parse(await readFile(path.join(outDir, 'clean-conversations.json'), 'utf8'));
    const normalized = JSON.parse(await readFile(path.join(outDir, 'conversations.normalized.json'), 'utf8'));
    const rejected = JSON.parse(await readFile(path.join(outDir, 'rejected-messages.json'), 'utf8'));
    const manifest = JSON.parse(await readFile(path.join(outDir, 'manifest.json'), 'utf8'));
    const markdown = await readFile(path.join(outDir, 'clean-conversations.md'), 'utf8');

    assert.equal(manifest.requested_range.start, '2026-07-06');
    assert.equal(manifest.requested_range.end, '2026-07-06');
    assert.equal(manifest.observed_range.start, '2026-07-06');
    assert.equal(manifest.observed_range.end, '2026-07-06');
    assert.equal(manifest.session_count, 1);
    assert.equal(clean.sessions[0].messages.length, 2);
    assert.equal(clean.sessions[0].messages[0].role, 'user');
    assert.equal(clean.sessions[0].messages[0].text, 'I want to use Aiden Memory to help me make a study plan.');
    assert.equal(clean.sessions[0].messages[1].role, 'assistant');
    assert.match(markdown, /I want to use Aiden Memory/);
    assert.equal(normalized.length, 1);
    assert.equal(normalized[0].uuid, 'sample-session');
    assert.equal(normalized[0].source, 'codex');
    assert.equal(normalized[0].chat_messages.length, 2);
    assert.equal(normalized[0].chat_messages[0].sender, 'human');
    assert.equal(normalized[0].chat_messages[0].text, 'I want to use Aiden Memory to help me make a study plan.');
    assert.equal(normalized[0].chat_messages[1].sender, 'assistant');
    assert.doesNotMatch(markdown, /AGENTS\.md/);
    assert.doesNotMatch(markdown, /TRANSCRIPT START/);
    assert.ok(rejected.messages.some((message) => message.reason === 'approval_or_transcript_noise'));
    assert.ok(rejected.messages.some((message) => message.reason === 'unsupported_role'));
    assert.ok(rejected.messages.some((message) => message.reason === 'mojibake_like_text'));
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});
