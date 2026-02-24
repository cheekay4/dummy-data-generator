import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabaseクライアントのシングルトンインスタンス
// 型パラメータを外すことで、手動型定義との不整合を回避
let supabaseInstance: SupabaseClient | null = null;

export type NewsArticleInsert = {
  id?: string;
  title: string;
  description?: string | null;
  url: string;
  source: 'newsapi' | 'rss';
  source_name?: string | null;
  language: 'ja' | 'en';
  published_at: string;
  fetched_at?: string;
  category?: string | null;
  keywords?: string[] | null;
};

export type TopicInsert = {
  id?: string;
  name: string;
  gap_score: number;
  japan_sentiment?: string | null;
  overseas_sentiment?: string | null;
  article_ids?: string[] | null;
  created_at?: string;
};

export type GeneratedArticleInsert = {
  id?: string;
  topic_id?: string | null;
  title: string;
  content: string;
  tags?: string[] | null;
  gap_score?: number | null;
  published_to_note?: boolean;
  note_url?: string | null;
  created_at?: string;
};

/**
 * Supabaseクライアントを取得（シングルトンパターン）
 */
export function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase環境変数が設定されていません。.env.localを確認してください。\n' +
      '必要な変数: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  console.log('[Supabase] クライアント初期化完了');
  return supabaseInstance;
}

/**
 * ニュース記事をSupabaseに保存
 */
export async function saveNewsArticles(articles: NewsArticleInsert[]) {
  const supabase = getSupabaseClient();

  console.log(`[Supabase] ${articles.length}件のニュース記事を保存中...`);

  const { data, error } = await supabase
    .from('news_articles')
    .upsert(articles, {
      onConflict: 'url',
      ignoreDuplicates: true,
    })
    .select();

  if (error) {
    console.error('[Supabase] ニュース記事保存エラー:', error);
    throw error;
  }

  console.log(`[Supabase] ${data?.length || 0}件のニュース記事を保存しました`);
  return data as Array<NewsArticleInsert & { id: string }>;
}

/**
 * トピックをSupabaseに保存
 */
export async function saveTopics(topics: TopicInsert[]) {
  const supabase = getSupabaseClient();

  console.log(`[Supabase] ${topics.length}件のトピックを保存中...`);

  const { data, error } = await supabase
    .from('topics')
    .insert(topics)
    .select();

  if (error) {
    console.error('[Supabase] トピック保存エラー:', error);
    throw error;
  }

  console.log(`[Supabase] ${data.length}件のトピックを保存しました`);
  return data as Array<TopicInsert & { id: string }>;
}

/**
 * 生成した記事をSupabaseに保存
 */
export async function saveGeneratedArticles(articles: GeneratedArticleInsert[]) {
  const supabase = getSupabaseClient();

  console.log(`[Supabase] ${articles.length}件の生成記事を保存中...`);

  const { data, error } = await supabase
    .from('generated_articles')
    .insert(articles)
    .select();

  if (error) {
    console.error('[Supabase] 生成記事保存エラー:', error);
    throw error;
  }

  console.log(`[Supabase] ${data.length}件の生成記事を保存しました`);
  return data as Array<GeneratedArticleInsert & { id: string }>;
}

/**
 * 過去24時間のニュース記事を取得
 */
export async function getRecentNewsArticles(hours: number = 24) {
  const supabase = getSupabaseClient();

  const fromDate = new Date();
  fromDate.setHours(fromDate.getHours() - hours);

  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .gte('published_at', fromDate.toISOString())
    .order('published_at', { ascending: false });

  if (error) {
    console.error('[Supabase] ニュース記事取得エラー:', error);
    throw error;
  }

  console.log(`[Supabase] ${data.length}件の記事を取得しました（過去${hours}時間）`);
  return data;
}

/**
 * 最新のトピックを取得
 */
export async function getLatestTopics(limit: number = 10) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[Supabase] トピック取得エラー:', error);
    throw error;
  }

  return data;
}
