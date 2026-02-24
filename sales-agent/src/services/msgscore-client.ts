/**
 * MsgScore API クライアント（CLI 自己スコアリング用）
 * Add-B: 生成したメール件名を自動採点する
 */

const MSGSCORE_API_URL = process.env.MSGSCORE_API_URL ?? 'https://msgscore.jp';
export const MSGSCORE_LOW_SCORE_THRESHOLD = 70;

// B2B 営業メール想定のデフォルトオーディエンス
const B2B_AUDIENCE = {
  totalRecipients: 100,
  conversionGoal: 'inquiry' as const,
  gender: { female: 30, male: 70, other: 0 },
  ageDistribution: { '20s': 10, '30s': 30, '40s': 30, '50s': 20, 'others': 10 },
};

export interface MsgScoreResult {
  totalScore: number;
  detail: Record<string, unknown>;
  suggestions?: string[];
}

/**
 * メール件名を MsgScore API でスコアリングする
 * API が使えない場合は null を返す（スコアなしで続行）
 */
export async function scoreEmailSubject(subject: string): Promise<MsgScoreResult | null> {
  try {
    const res = await fetch(`${MSGSCORE_API_URL}/api/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        channel: 'email-subject',
        text: subject,
        audience: B2B_AUDIENCE,
      }),
      signal: AbortSignal.timeout(12_000),
    });

    if (!res.ok) return null;

    const data = (await res.json()) as Record<string, unknown>;
    const totalScore = (data.totalScore as number) ?? 0;

    // 改善提案を抽出（feedbackItems から suggestions 相当を取る）
    const suggestions: string[] = [];
    const feedbackItems = data.feedbackItems as Array<{ category: string; feedback: string }> | undefined;
    if (feedbackItems) {
      for (const item of feedbackItems.slice(0, 3)) {
        if (item.feedback) suggestions.push(`[${item.category}] ${item.feedback}`);
      }
    }

    return { totalScore, detail: data, suggestions };
  } catch {
    return null; // API 未設定や接続エラーは無視
  }
}
