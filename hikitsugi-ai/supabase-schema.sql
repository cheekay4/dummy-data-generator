-- hikitsugi-ai Supabase Schema
-- Run this in the Supabase SQL Editor

-- ユーザープロファイル
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  company_name TEXT,
  business_type TEXT,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'team')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- マニュアルプロジェクト
CREATE TABLE IF NOT EXISTS manuals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT '無題のマニュアル',
  business_type TEXT NOT NULL DEFAULT 'general',
  template_key TEXT,
  status TEXT NOT NULL DEFAULT 'interviewing' CHECK (status IN ('interviewing', 'generating', 'completed', 'archived')),
  conversation JSONB NOT NULL DEFAULT '[]',
  input_method TEXT NOT NULL DEFAULT 'text' CHECK (input_method IN ('text', 'voice_chat', 'voice_upload', 'mixed')),
  content_markdown TEXT,
  content_version INTEGER NOT NULL DEFAULT 1,
  section_count INTEGER DEFAULT 0,
  word_count INTEGER DEFAULT 0,
  estimated_read_minutes INTEGER DEFAULT 0,
  share_token TEXT UNIQUE,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stripeサブスクリプション
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_price_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- profiles ポリシー
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- manuals ポリシー
CREATE POLICY "manuals_select_own" ON manuals FOR SELECT USING (
  user_id = auth.uid() OR is_public = TRUE
);
CREATE POLICY "manuals_insert_own" ON manuals FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "manuals_update_own" ON manuals FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "manuals_delete_own" ON manuals FOR DELETE USING (user_id = auth.uid());

-- subscriptions ポリシー
CREATE POLICY "subscriptions_select_own" ON subscriptions FOR SELECT USING (user_id = auth.uid());

-- 新規ユーザー登録時に profiles を自動作成するトリガー
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- updated_at 自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_manuals_updated_at BEFORE UPDATE ON manuals
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
