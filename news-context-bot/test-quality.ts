import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { generateArticleFromTopic } from './lib/generation/article-generator';
import type { ExtractedTopic } from './lib/analysis/topic-extractor';

const envPath = resolve(__dirname, '.env.local');
readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...v] = trimmed.split('=');
    process.env[key.trim()] = v.join('=').trim();
  }
});

const topic: ExtractedTopic = {
  name: 'Black Hole',
  gapScore: 0.92,
  japanSentiment: '（なし）',
  overseasSentiment: '- NPR: NASA Crew-12 ISS到着\n- ScienceAlert: ブラックホールがデススターの100兆倍\n- Live Science: 暴走ブラックホール検出',
  articleIds: [],
  articles: [
    { title: "Four people on NASA'S Crew-12 arrive at the ISS", description: null, url: "https://npr.org/crew-12", source: 'newsapi', source_name: 'NPR', language: 'en', published_at: new Date(), category: 'science', keywords: ['nasa'] },
    { title: "Black Hole May Be '100 Trillion Times' More Powerful Than The Death Star", description: null, url: "https://sciencealert.com/black-hole", source: 'newsapi', source_name: 'ScienceAlert', language: 'en', published_at: new Date(), category: 'science', keywords: ['black', 'hole'] },
    { title: "'Runaway' black hole detected by the James Webb telescope", description: null, url: "https://livescience.com/runaway-bh", source: 'newsapi', source_name: 'Live Science', language: 'en', published_at: new Date(), category: 'science', keywords: ['black', 'hole'] },
  ],
};

async function main() {
  mkdirSync(resolve(__dirname, 'outputs'), { recursive: true });

  console.log('=== 平日モード生成中... ===\n');
  const wd = await generateArticleFromTopic(topic, 'weekday');
  writeFileSync(resolve(__dirname, 'outputs', 'test-weekday-v2.md'), wd.content, 'utf-8');

  console.log('\n=== 週末モード生成中... ===\n');
  const we = await generateArticleFromTopic(topic, 'weekend');
  writeFileSync(resolve(__dirname, 'outputs', 'test-weekend-v2.md'), we.content, 'utf-8');

  console.log(`\n平日: ${wd.content.length}文字\n週末: ${we.content.length}文字`);
}
main().catch(console.error);
