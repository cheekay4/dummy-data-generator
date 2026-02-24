/**
 * Supabaseデータベースの型定義
 * supabase gen types typescript コマンドで自動生成される想定だが、
 * Phase 1では手動で定義
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      news_articles: {
        Row: {
          id: string
          title: string
          description: string | null
          url: string
          source: 'newsapi' | 'rss'
          source_name: string | null
          language: 'ja' | 'en'
          published_at: string
          fetched_at: string
          category: string | null
          keywords: string[] | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          url: string
          source: 'newsapi' | 'rss'
          source_name?: string | null
          language: 'ja' | 'en'
          published_at: string
          fetched_at?: string
          category?: string | null
          keywords?: string[] | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          url?: string
          source?: 'newsapi' | 'rss'
          source_name?: string | null
          language?: 'ja' | 'en'
          published_at?: string
          fetched_at?: string
          category?: string | null
          keywords?: string[] | null
        }
      }
      topics: {
        Row: {
          id: string
          name: string
          gap_score: number
          japan_sentiment: string | null
          overseas_sentiment: string | null
          article_ids: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          gap_score: number
          japan_sentiment?: string | null
          overseas_sentiment?: string | null
          article_ids?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          gap_score?: number
          japan_sentiment?: string | null
          overseas_sentiment?: string | null
          article_ids?: string[] | null
          created_at?: string
        }
      }
      generated_articles: {
        Row: {
          id: string
          topic_id: string | null
          title: string
          content: string
          tags: string[] | null
          gap_score: number | null
          published_to_note: boolean
          note_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          topic_id?: string | null
          title: string
          content: string
          tags?: string[] | null
          gap_score?: number | null
          published_to_note?: boolean
          note_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          topic_id?: string | null
          title?: string
          content?: string
          tags?: string[] | null
          gap_score?: number | null
          published_to_note?: boolean
          note_url?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
