export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  readingTime: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-review-reply-matters-2026',
    title: '【2026年最新】口コミ返信をやるべき5つの理由——放置コストは月○万円？',
    description: '口コミ返信の重要性が増している背景とデータ。Googleマップ順位への影響、見込み客の来店判断、悪い口コミの中和効果まで徹底解説。',
    publishedAt: '2026-03-29',
    updatedAt: '2026-03-29',
    tags: ['口コミ管理', 'MEO'],
    readingTime: '6分',
  },
  {
    slug: 'ai-review-reply-comparison',
    title: 'AI口コミ返信ツール比較——ChatGPT・Gemini・専用ツールの使い分け',
    description: '口コミ返信にAIを使う選択肢を徹底比較。汎用AI vs 専用ツールのメリット・デメリット、手書きとの使い分け方を解説。',
    publishedAt: '2026-03-29',
    updatedAt: '2026-03-29',
    tags: ['AI活用', 'ツール比較'],
    readingTime: '7分',
  },
  {
    slug: 'google-review-increase-tips',
    title: 'Google口コミを自然に増やす7つの方法——ガイドライン違反にならない正しいやり方',
    description: 'Google口コミを増やすための7つの施策。ガイドライン違反にならない正しい方法と、やりがちなNG例を解説。',
    publishedAt: '2026-03-29',
    updatedAt: '2026-03-29',
    tags: ['Google口コミ', '集客'],
    readingTime: '8分',
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug)
}

export function getRelatedPosts(currentSlug: string, count: number = 2): BlogPost[] {
  return blogPosts.filter(p => p.slug !== currentSlug).slice(0, count)
}
