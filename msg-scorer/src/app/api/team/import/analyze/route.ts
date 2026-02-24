import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { getTeamByUserId } from '@/lib/db/teams';
import { getCampaignResults, saveOrganizationKnowledge } from '@/lib/db/campaign-results';
import type { CampaignResult } from '@/lib/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function formatRecordsForPrompt(records: CampaignResult[]): string {
  const emailRecs = records.filter(r => r.channel === 'email');
  const lineRecs  = records.filter(r => r.channel === 'line');

  const fmt = (r: CampaignResult) => {
    const parts = [];
    if (r.subject) parts.push(`件名: 「${r.subject}」`);
    if (r.body)    parts.push(`本文: 「${r.body.slice(0, 60)}」`);
    if (r.open_rate != null) parts.push(`開封率: ${r.open_rate}%`);
    if (r.ctr != null)       parts.push(`CTR: ${r.ctr}%`);
    if (r.recipients != null) parts.push(`配信数: ${r.recipients}件`);
    if (r.cv_count != null)  parts.push(`CV数: ${r.cv_count}件`);
    if (r.date)              parts.push(`日付: ${r.date}`);
    return parts.join(' / ');
  };

  const lines: string[] = [];
  if (emailRecs.length > 0) {
    lines.push('### メール配信');
    emailRecs.slice(0, 50).forEach((r, i) => lines.push(`${i + 1}. ${fmt(r)}`));
  }
  if (lineRecs.length > 0) {
    lines.push('', '### LINE配信');
    lineRecs.slice(0, 50).forEach((r, i) => lines.push(`${i + 1}. ${fmt(r)}`));
  }
  return lines.join('\n');
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const { team, myMember } = teamResult;
  if (myMember.role !== 'owner') return NextResponse.json({ error: '管理者のみ実行できます。' }, { status: 403 });

  let body: { batchId: string };
  try {
    body = await req.json() as { batchId: string };
  } catch {
    return NextResponse.json({ error: 'リクエスト形式が不正です。' }, { status: 400 });
  }

  const records = await getCampaignResults(team.id);
  if (records.length === 0) {
    return NextResponse.json({ error: '分析対象のデータがありません。' }, { status: 400 });
  }

  const formattedRecords = formatRecordsForPrompt(records);
  const count = records.length;

  const prompt = `以下は過去の配信実績データです。
配信文の傾向を分析し、今後のスコアリングに活かせるインサイトを抽出してください。

## 実績データ（${count}件）
${formattedRecords}

## 分析観点
- 件名/本文に含まれるキーワードと開封率の相関
- チャネル別の平均値と特徴
- 曜日・時期の傾向（dateがある場合）
- 高パフォーマンス配信の共通点
- 低パフォーマンス配信の共通点
- コンバージョンタイプ別の傾向

## 出力形式
箇条書きで、スコアリングプロンプトに注入できる形式にしてください。
具体的な数値（平均開封率、件数）を必ず含めてください。

【配信実績から得られたインサイト（${count}件の実績から）】
- インサイト1
- インサイト2
（以下同様に5〜10点のインサイトを列挙）`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      temperature: 0.2,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    await saveOrganizationKnowledge(
      team.id,
      content,
      'csv_import',
      body.batchId,
      user.id,
    );

    return NextResponse.json({ success: true, content });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `分析に失敗しました: ${msg}` }, { status: 500 });
  }
}
