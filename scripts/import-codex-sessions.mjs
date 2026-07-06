#!/usr/bin/env node
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CONTEXT_BLOCKS = [
  /# AGENTS\.md instructions[\s\S]*?<\/INSTRUCTIONS>/gi,
  /<environment_context>[\s\S]*?<\/environment_context>/gi,
  /<permissions instructions>[\s\S]*?<\/permissions instructions>/gi,
  /<skills_instructions>[\s\S]*?<\/skills_instructions>/gi,
  /<plugins_instructions>[\s\S]*?<\/plugins_instructions>/gi,
  /<apps_instructions>[\s\S]*?<\/apps_instructions>/gi,
  /<collaboration_mode>[\s\S]*?<\/collaboration_mode>/gi,
];

const APPROVAL_NOISE = [
  'TRANSCRIPT START',
  'TRANSCRIPT DELTA START',
  'APPROVAL REQUEST START',
  'The following is the Codex agent history',
  'Reviewed Codex session id',
  'sandbox_permissions=require_escalated',
];

const MOJIBAKE_PATTERN = /(锛|銆|鈥|€|涓|鏄|鐨|绋|閫|鎴|浠|瀹|濂|杩|鏉|牱|悊|厛|甯|姪|彲|犱|竴涓|瑙|嗛|椈|鍦|嬫|鎵|戜|傚|惧|叆|勭|悓|涔|紝|紱|[\uE000-\uF8FF])/g;

function parseArgs(argv) {
  const args = {
    copyRaw: true,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--source') args.source = argv[++i];
    else if (arg === '--start') args.start = argv[++i];
    else if (arg === '--end') args.end = argv[++i];
    else if (arg === '--out') args.out = argv[++i];
    else if (arg === '--no-copy-raw') args.copyRaw = false;
    else if (arg === '--copy-raw') args.copyRaw = true;
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  for (const key of ['source', 'start', 'end', 'out']) {
    if (!args[key]) throw new Error(`Missing required argument: --${key}`);
  }

  if (!isIsoDate(args.start) || !isIsoDate(args.end)) {
    throw new Error('--start and --end must use YYYY-MM-DD');
  }

  if (args.start > args.end) {
    throw new Error('--start must be earlier than or equal to --end');
  }

  args.source = path.resolve(args.source);
  args.out = path.resolve(args.out);
  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/import-codex-sessions.mjs --source <dir> --start YYYY-MM-DD --end YYYY-MM-DD --out <dir> [--no-copy-raw]

Outputs:
  manifest.json / manifest.md
  conversations.normalized.json
  clean-conversations.json / clean-conversations.md
  rejected-messages.json / rejected-messages.md
  raw/ copied source files unless --no-copy-raw is used`);
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

async function findJsonlFiles(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...await findJsonlFiles(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.jsonl')) {
      files.push(fullPath);
    }
  }

  return files.sort((a, b) => a.localeCompare(b));
}

function dateFromFile(filePath) {
  const normalized = filePath.replaceAll('\\', '/');
  const rolloutMatch = normalized.match(/rollout-(\d{4}-\d{2}-\d{2})T/i);
  if (rolloutMatch) return rolloutMatch[1];

  const pathMatch = normalized.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (pathMatch) return `${pathMatch[1]}-${pathMatch[2]}-${pathMatch[3]}`;

  const nameMatch = normalized.match(/(\d{4}-\d{2}-\d{2})/);
  if (nameMatch) return nameMatch[1];

  return null;
}

function parseJsonl(text, filePath) {
  const records = [];
  const lines = text.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (!line) continue;

    try {
      records.push(JSON.parse(line));
    } catch (error) {
      records.push({
        timestamp: null,
        type: 'parse_error',
        payload: {
          message: error.message,
          file: filePath,
          line: index + 1,
        },
      });
    }
  }

  return records;
}

function textFromContent(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';

  return content
    .map((part) => {
      if (!part || typeof part !== 'object') return '';
      return part.text ?? part.content ?? '';
    })
    .filter(Boolean)
    .join('\n');
}

function stripInjectedContext(text) {
  let cleaned = text;
  for (const pattern of CONTEXT_BLOCKS) {
    cleaned = cleaned.replace(pattern, '');
  }
  return cleaned
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function classifyMessage(record) {
  if (record.type !== 'response_item') {
    return { keep: false, reason: 'unsupported_record_type' };
  }

  const payload = record.payload ?? {};
  if (payload.type !== 'message') {
    return { keep: false, reason: 'unsupported_payload_type' };
  }

  const role = payload.role;
  if (role !== 'user' && role !== 'assistant') {
    return { keep: false, reason: 'unsupported_role', role };
  }

  const rawText = textFromContent(payload.content);
  const cleanedText = stripInjectedContext(rawText);
  if (!cleanedText) {
    return { keep: false, reason: 'empty_after_cleaning', role };
  }

  if (APPROVAL_NOISE.some((marker) => cleanedText.includes(marker))) {
    return { keep: false, reason: 'approval_or_transcript_noise', role, text: cleanedText };
  }

  if (/^\s*\{[\s\S]*"outcome"\s*:\s*"(allow|deny)"[\s\S]*\}\s*$/i.test(cleanedText)
    && /"risk_level"|"user_authorization"|"rationale"/i.test(cleanedText)) {
    return { keep: false, reason: 'approval_or_transcript_noise', role, text: cleanedText };
  }

  const mojibakeHits = cleanedText.match(MOJIBAKE_PATTERN)?.length ?? 0;
  if (mojibakeHits >= 8) {
    return { keep: false, reason: 'mojibake_like_text', role, text: cleanedText };
  }

  if (cleanedText.length > 12000 && /tool|sandbox|approval|<[^>]+>/i.test(cleanedText)) {
    return { keep: false, reason: 'oversized_log_like_text', role, text: cleanedText };
  }

  return {
    keep: true,
    message: {
      timestamp: record.timestamp ?? null,
      role,
      text: cleanedText,
    },
  };
}

function sessionIdFromFile(filePath) {
  const name = path.basename(filePath, '.jsonl');
  const match = name.match(/rollout-.+-(.+)$/);
  return match?.[1] ?? name;
}

function summarizeReasons(messages) {
  return messages.reduce((acc, message) => {
    acc[message.reason] = (acc[message.reason] ?? 0) + 1;
    return acc;
  }, {});
}

function preview(text) {
  return (text ?? '').replace(/\s+/g, ' ').slice(0, 500);
}

function toMarkdownConversation(clean) {
  const lines = [
    '# Clean Codex Conversations',
    '',
    `Requested range: ${clean.manifest.requested_range.start} to ${clean.manifest.requested_range.end}`,
    `Observed range: ${clean.manifest.observed_range.start ?? 'n/a'} to ${clean.manifest.observed_range.end ?? 'n/a'}`,
    `Sessions: ${clean.manifest.session_count}`,
    `Clean messages: ${clean.manifest.clean_message_count}`,
    '',
  ];

  for (const session of clean.sessions) {
    lines.push(`## ${session.file_date} - ${session.session_id}`, '');
    for (const message of session.messages) {
      lines.push(`### ${message.role}${message.timestamp ? ` - ${message.timestamp}` : ''}`, '');
      lines.push(message.text, '');
    }
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

function toMarkdownManifest(manifest) {
  const lines = [
    '# Codex Import Manifest',
    '',
    `- Source: ${manifest.source}`,
    `- Requested range: ${manifest.requested_range.start} to ${manifest.requested_range.end}`,
    `- Observed range: ${manifest.observed_range.start ?? 'n/a'} to ${manifest.observed_range.end ?? 'n/a'}`,
    `- Generated at: ${manifest.generated_at}`,
    `- Sessions: ${manifest.session_count}`,
    `- Clean messages: ${manifest.clean_message_count}`,
    `- Rejected messages: ${manifest.rejected_message_count}`,
    '',
    '## Rejection Reasons',
    '',
  ];

  for (const [reason, count] of Object.entries(manifest.rejection_reasons)) {
    lines.push(`- ${reason}: ${count}`);
  }

  lines.push('', '## Sessions', '');
  for (const session of manifest.sessions) {
    lines.push(`- ${session.file_date} ${session.session_id}: ${session.clean_message_count} clean, ${session.rejected_message_count} rejected`);
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

function toMarkdownRejected(rejected) {
  const lines = [
    '# Rejected Codex Messages',
    '',
    `Rejected messages: ${rejected.messages.length}`,
    '',
  ];

  for (const message of rejected.messages) {
    lines.push(`## ${message.reason}`, '');
    lines.push(`- Session: ${message.session_id}`);
    lines.push(`- Timestamp: ${message.timestamp ?? 'n/a'}`);
    lines.push(`- Role: ${message.role ?? 'n/a'}`);
    lines.push('');
    lines.push('```text');
    lines.push(message.text_preview);
    lines.push('```');
    lines.push('');
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

function toNormalizedConversation(session) {
  const firstMessage = session.messages[0] ?? null;
  const lastMessage = session.messages.at(-1) ?? null;

  return {
    uuid: session.session_id,
    source: 'codex',
    name: `Codex session ${session.file_date}`,
    summary: '',
    created_at: firstMessage?.timestamp ?? session.started_at,
    updated_at: lastMessage?.timestamp ?? session.started_at,
    source_metadata: {
      file_date: session.file_date,
      cwd: session.cwd,
      relative_path: session.relative_path,
      original_message_count: session.message_count,
      clean_message_count: session.clean_message_count,
      rejected_message_count: session.rejected_message_count,
    },
    chat_messages: session.messages.map((message, index) => ({
      uuid: `${session.session_id}-${String(index + 1).padStart(5, '0')}`,
      text: message.text,
      sender: message.role === 'user' ? 'human' : 'assistant',
      created_at: message.timestamp,
      source_role: message.role,
      attachments: [],
      files: [],
    })),
  };
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const files = (await findJsonlFiles(args.source))
    .map((filePath) => ({ filePath, fileDate: dateFromFile(filePath) }))
    .filter((file) => file.fileDate && file.fileDate >= args.start && file.fileDate <= args.end);

  await mkdir(args.out, { recursive: true });
  if (args.copyRaw) await mkdir(path.join(args.out, 'raw'), { recursive: true });

  const sessions = [];
  const rejectedMessages = [];
  const sessionManifests = [];

  for (const file of files) {
    const relativePath = path.relative(args.source, file.filePath);
    const text = await readFile(file.filePath, 'utf8');
    const records = parseJsonl(text, file.filePath);
    const meta = records.find((record) => record.type === 'session_meta')?.payload ?? {};
    const sessionId = meta.id ?? sessionIdFromFile(file.filePath);
    const messages = [];
    const rejectedForSession = [];

    for (const record of records) {
      const classification = classifyMessage(record);
      if (classification.keep) {
        messages.push(classification.message);
      } else if (classification.reason !== 'unsupported_record_type' && classification.reason !== 'unsupported_payload_type') {
        const payload = record.payload ?? {};
        const textForPreview = classification.text ?? textFromContent(payload.content);
        const rejected = {
          session_id: sessionId,
          file_date: file.fileDate,
          timestamp: record.timestamp ?? null,
          role: classification.role ?? payload.role ?? null,
          reason: classification.reason,
          text_preview: preview(textForPreview),
        };
        rejectedMessages.push(rejected);
        rejectedForSession.push(rejected);
      }
    }

    const session = {
      session_id: sessionId,
      file_date: file.fileDate,
      started_at: records[0]?.timestamp ?? null,
      cwd: meta.cwd ?? null,
      relative_path: relativePath,
      message_count: records.length,
      clean_message_count: messages.length,
      rejected_message_count: rejectedForSession.length,
      messages,
    };

    sessions.push(session);
    sessionManifests.push({
      session_id: sessionId,
      file_date: file.fileDate,
      started_at: session.started_at,
      cwd: session.cwd,
      relative_path: relativePath,
      message_count: session.message_count,
      clean_message_count: session.clean_message_count,
      rejected_message_count: session.rejected_message_count,
    });

    if (args.copyRaw) {
      const rawTarget = path.join(args.out, 'raw', relativePath);
      await mkdir(path.dirname(rawTarget), { recursive: true });
      await copyFile(file.filePath, rawTarget);
    }
  }

  const observedDates = sessions.map((session) => session.file_date).sort();
  const manifest = {
    source: args.source,
    generated_at: new Date().toISOString(),
    requested_range: {
      start: args.start,
      end: args.end,
    },
    observed_range: {
      start: observedDates[0] ?? null,
      end: observedDates.at(-1) ?? null,
    },
    session_count: sessions.length,
    clean_message_count: sessions.reduce((sum, session) => sum + session.clean_message_count, 0),
    rejected_message_count: rejectedMessages.length,
    rejection_reasons: summarizeReasons(rejectedMessages),
    sessions: sessionManifests,
  };

  const clean = { manifest, sessions };
  const normalized = sessions.map(toNormalizedConversation);
  const rejected = {
    generated_at: manifest.generated_at,
    messages: rejectedMessages,
  };

  await writeFile(path.join(args.out, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await writeFile(path.join(args.out, 'manifest.md'), toMarkdownManifest(manifest), 'utf8');
  await writeFile(path.join(args.out, 'conversations.normalized.json'), `${JSON.stringify(normalized, null, 2)}\n`, 'utf8');
  await writeFile(path.join(args.out, 'clean-conversations.json'), `${JSON.stringify(clean, null, 2)}\n`, 'utf8');
  await writeFile(path.join(args.out, 'clean-conversations.md'), toMarkdownConversation(clean), 'utf8');
  await writeFile(path.join(args.out, 'rejected-messages.json'), `${JSON.stringify(rejected, null, 2)}\n`, 'utf8');
  await writeFile(path.join(args.out, 'rejected-messages.md'), toMarkdownRejected(rejected), 'utf8');

  console.log(`Wrote ${manifest.clean_message_count} clean messages from ${manifest.session_count} sessions to ${args.out}`);
  console.log(`Rejected ${manifest.rejected_message_count} messages`);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
