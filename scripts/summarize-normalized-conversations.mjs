#!/usr/bin/env node
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DOMAINS = [
  {
    id: 'study_exam',
    title: 'Study / Exam',
    keywords: ['study', 'exam', 'plan', 'algorithms', 'computer systems', 'review', 'practice', '考研', '408', '数学', '数一', '英语', '复习', '刷题', '专业课'],
    weight: 3,
  },
  {
    id: 'aiden_memory',
    title: 'Aiden Memory',
    keywords: ['Aiden Memory', 'memory', 'profile', 'deep profile', 'card', 'cards', 'skill', 'import', 'chat history', '导入', '聊天记录', '记忆'],
    weight: 3,
  },
  {
    id: 'ai_tools_workflow',
    title: 'AI Tools / Workflow',
    keywords: ['Codex', 'Claude', 'MCP', 'Agent', 'sandbox', 'prompt', 'script', 'tool', '沙盒', '提示词', '脚本'],
    weight: 2,
  },
  {
    id: 'programming_projects',
    title: 'Programming / Projects',
    keywords: ['project', 'code', 'README', 'GitHub', 'git', 'test', 'file', 'script', 'docs', '项目', '代码', '测试', '文件', '脚本'],
    weight: 2,
  },
  {
    id: 'health_fitness',
    title: 'Health / Fitness',
    keywords: ['health', 'fitness', 'exercise', 'gym', 'protein', 'diet', 'calories', 'weight', '健身', '健身房', '蛋白', '饮食', '热量', '体重'],
    weight: 2,
  },
  {
    id: 'life_logistics',
    title: 'Life / Logistics',
    keywords: ['budget', 'rent', 'meal', 'archive', 'documents', 'logistics', 'schedule', '预算', '生活费', '吃饭', '档案', '户籍', '安排'],
    weight: 1,
  },
  {
    id: 'social_cultural',
    title: 'Social / Cultural',
    keywords: ['society', 'culture', 'institution', 'politics', 'film', 'narrative', 'public opinion', 'structure', '社会', '文化', '制度', '政治', '电影', '叙事', '舆论', '结构'],
    weight: 2,
  },
  {
    id: 'relationships_emotional',
    title: 'Relationships / Emotional',
    keywords: ['emotion', 'relationship', 'friend', 'breakup', 'anxiety', 'hurt', 'comfort', 'boundary', '情绪', '关系', '朋友', '分手', '焦虑', '难受', '安慰', '边界'],
    weight: 2,
  },
];

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--input') args.input = argv[++i];
    else if (arg === '--out') args.out = argv[++i];
    else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!args.input) throw new Error('Missing required argument: --input');
  if (!args.out) throw new Error('Missing required argument: --out');
  args.input = path.resolve(args.input);
  args.out = path.resolve(args.out);
  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/summarize-normalized-conversations.mjs --input <conversations.normalized.json> --out <dir>

Outputs:
  conversation-summaries.json
  conversation-summaries.md
  high-signal-conversations.md`);
}

function compact(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim();
}

function cleanUserText(text) {
  return String(text ?? '')
    .replace(/^# Files mentioned by the user:[\s\S]*?## My request for Codex:\s*/i, '')
    .replace(/<image\b[\s\S]*?<\/image>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function truncate(text, max = 280) {
  const clean = compact(text);
  return clean.length > max ? `${clean.slice(0, max)}...` : clean;
}

function keywordHits(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.filter((keyword) => lower.includes(keyword.toLowerCase()));
}

function messageSignal(text) {
  const clean = compact(text);
  if (/^\[\$[\w-]+\]/.test(clean)) return 0;
  if (clean.length < 20) return 1;

  let score = Math.min(clean.length / 80, 10);
  for (const domain of DOMAINS) {
    score += keywordHits(clean, domain.keywords).length * domain.weight;
  }
  return score;
}

function summarizeConversation(conversation) {
  const messages = Array.isArray(conversation.chat_messages) ? conversation.chat_messages : [];
  const humanMessages = messages.filter((message) => message.sender === 'human');
  const assistantMessages = messages.filter((message) => message.sender === 'assistant');
  const cleanedHumanMessages = humanMessages
    .map((message) => ({
      ...message,
      text: cleanUserText(message.text),
    }))
    .filter((message) => compact(message.text).length > 0);
  const humanText = cleanedHumanMessages.map((message) => message.text).join('\n');

  const domainHits = DOMAINS
    .map((domain) => {
      const hits = keywordHits(humanText, domain.keywords);
      return {
        id: domain.id,
        title: domain.title,
        hits,
        score: hits.length * domain.weight,
      };
    })
    .filter((domain) => domain.hits.length > 0);

  const representativeUserMessages = cleanedHumanMessages
    .filter((message) => compact(message.text).length > 0)
    .sort((a, b) => messageSignal(b.text) - messageSignal(a.text))
    .slice(0, 5)
    .map((message) => ({
      created_at: message.created_at ?? null,
      text: truncate(message.text, 500),
    }));

  const signalScore = domainHits.reduce((sum, domain) => sum + domain.score, 0)
    + Math.min(humanMessages.length, 10)
    + (humanText.length > 2500 ? 3 : 0)
    + (humanText.length > 8000 ? 5 : 0);

  return {
    uuid: conversation.uuid,
    source: conversation.source ?? null,
    name: conversation.name ?? '',
    created_at: conversation.created_at ?? null,
    updated_at: conversation.updated_at ?? null,
    source_metadata: conversation.source_metadata ?? {},
    message_count: messages.length,
    human_message_count: humanMessages.length,
    assistant_message_count: assistantMessages.length,
    domains: domainHits.map((domain) => domain.id),
    domain_hits: Object.fromEntries(domainHits.map((domain) => [domain.id, domain.hits])),
    signal_score: signalScore,
    gist: representativeUserMessages[0]?.text ?? '',
    representative_user_messages: representativeUserMessages,
  };
}

function summariesMarkdown(summaries) {
  const lines = ['# Conversation Summaries', ''];
  lines.push(`Conversations: ${summaries.length}`, '');

  for (const summary of summaries) {
    lines.push(`## ${summary.created_at ?? 'no date'} - ${summary.uuid}`, '');
    lines.push(`- Name: ${summary.name || 'n/a'}`);
    lines.push(`- Messages: ${summary.message_count} (${summary.human_message_count} human, ${summary.assistant_message_count} assistant)`);
    lines.push(`- Domains: ${summary.domains.length ? summary.domains.join(', ') : 'none'}`);
    lines.push(`- Signal score: ${summary.signal_score}`);
    lines.push(`- Gist: ${summary.gist || 'n/a'}`);
    lines.push('');
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

function highSignalMarkdown(summaries) {
  const sorted = [...summaries]
    .filter((summary) => summary.signal_score > 0)
    .sort((a, b) => b.signal_score - a.signal_score || String(a.created_at).localeCompare(String(b.created_at)))
    .slice(0, 30);

  const lines = ['# High-Signal Conversations', ''];
  lines.push('Ranked by deterministic domain hits, human message count, and source length. This is a routing aid, not a final profile.', '');

  for (const [index, summary] of sorted.entries()) {
    lines.push(`## ${index + 1}. ${summary.uuid}`, '');
    lines.push(`- Date: ${summary.created_at ?? 'n/a'}`);
    lines.push(`- Score: ${summary.signal_score}`);
    lines.push(`- Domains: ${summary.domains.join(', ') || 'none'}`);
    lines.push(`- Gist: ${summary.gist || 'n/a'}`);
    lines.push('- Representative user messages:');
    for (const message of summary.representative_user_messages.slice(0, 3)) {
      lines.push(`  - ${message.created_at ?? 'n/a'}: ${message.text}`);
    }
    lines.push('');
  }

  return `${lines.join('\n').trimEnd()}\n`;
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const conversations = JSON.parse(await readFile(args.input, 'utf8'));
  if (!Array.isArray(conversations)) {
    throw new Error('Input must be a JSON array of normalized conversations');
  }

  const summaries = conversations.map(summarizeConversation);
  await mkdir(args.out, { recursive: true });
  await writeFile(path.join(args.out, 'conversation-summaries.json'), `${JSON.stringify(summaries, null, 2)}\n`, 'utf8');
  await writeFile(path.join(args.out, 'conversation-summaries.md'), summariesMarkdown(summaries), 'utf8');
  await writeFile(path.join(args.out, 'high-signal-conversations.md'), highSignalMarkdown(summaries), 'utf8');
  console.log(`Wrote ${summaries.length} conversation summaries to ${args.out}`);
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
