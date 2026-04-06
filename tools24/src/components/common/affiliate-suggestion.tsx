import { affiliateLinks } from "@/lib/affiliates";

interface AffiliateSuggestionProps {
  show: boolean;
  variant?: "compact" | "detailed";
}

const detailedItems = [
  {
    ...affiliateLinks.freee,
    features: [
      "スマホだけで確定申告が完結",
      "○×の質問に答えるだけで申告書を自動作成",
    ],
  },
  {
    ...affiliateLinks.moneyforward,
    features: [
      "銀行・クレジットカードと自動連携",
      "確定申告の手間を大幅に削減",
    ],
  },
  {
    ...affiliateLinks.yayoi,
    features: [
      "初年度無料で全機能利用可能",
      "業界最大手の安心サポート",
    ],
  },
];

export function AffiliateSuggestion({
  show,
  variant = "compact",
}: AffiliateSuggestionProps) {
  if (!show) return null;

  if (variant === "detailed") {
    return (
      <div className="mt-8 rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 print:hidden">
        <p className="text-base font-semibold mb-1">
          💡 もっと簡単に確定申告する方法
          <span className="ml-2 text-xs font-normal border rounded px-1 py-0.5 text-muted-foreground">PR</span>
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          「e-Taxの操作が大変そう…」と感じた方へ。クラウド会計ソフトなら、収支の自動入力から申告書作成、e-Tax送信までワンストップで完結します。
        </p>
        <div className="space-y-3">
          {detailedItems.map((item) => (
            <div
              key={item.name}
              className="rounded-md border bg-background p-4"
            >
              <p className="text-sm font-semibold">{item.name}</p>
              <ul className="mt-2 space-y-1">
                {item.features.map((f) => (
                  <li key={f} className="text-sm text-muted-foreground">
                    ✔ {f}
                  </li>
                ))}
              </ul>
              <a
                href={item.url}
                target="_blank"
                rel="nofollow noreferrer"
                className="mt-3 inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                無料で試してみる →
              </a>
              {/* A8.net インプレッション計測 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.impressionImg}
                alt=""
                width={1}
                height={1}
                style={{ display: "none" }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // compact variant
  return (
    <div className="rounded-lg border border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-4 print:hidden">
      <p className="text-sm font-semibold mb-1">
        📋 確定申告をもっと簡単に
        <span className="ml-2 text-xs font-normal border rounded px-1 py-0.5 text-muted-foreground">PR</span>
      </p>
      <p className="text-xs text-muted-foreground mb-3">
        クラウド会計ソフトなら、このツールで計算した結果の入力から申告書の提出までをオンラインで完結できます。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {detailedItems.map((item) => (
          <div key={item.name} className="rounded-md border bg-background p-3 space-y-1">
            <p className="text-xs font-semibold">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
            <a
              href={item.url}
              target="_blank"
              rel="nofollow noreferrer"
              className="block text-xs text-primary hover:underline"
            >
              詳しく →
            </a>
            {/* A8.net インプレッション計測 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.impressionImg}
              alt=""
              width={1}
              height={1}
              style={{ display: "none" }}
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
