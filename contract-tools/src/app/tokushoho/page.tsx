import type { Metadata } from 'next';

export const metadata: Metadata = { title: '特定商取引法に基づく表記' };

const ITEMS = [
  { label: '販売事業者名', value: '（個人名）' },
  { label: '運営責任者', value: '（個人名）' },
  { label: '所在地', value: '請求があったら遅滞なく開示します' },
  { label: '電話番号', value: '請求があったら遅滞なく開示します' },
  { label: 'メールアドレス', value: 'お問い合わせフォームよりご連絡ください' },
  { label: '販売価格', value: 'Proプラン 月額490円（税込）' },
  { label: '支払方法', value: 'クレジットカード（Stripe経由）' },
  { label: '支払時期', value: '申込時に即時決済。以降は毎月同日に自動更新' },
  { label: 'サービス提供時期', value: '決済完了後、即時ご利用いただけます' },
  { label: '解約方法', value: 'マイページ（料金ページ）からいつでも解約可能' },
  { label: '返金ポリシー', value: 'デジタルサービスの性質上、原則として返金はお受けしておりません。ご不明な点はお問い合わせください。' },
  { label: '動作環境', value: '最新版のChrome、Firefox、Safari、Edge（インターネット接続必須）' },
];

export default function TokushohoPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">特定商取引法に基づく表記</h1>
      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {ITEMS.map((item, i) => (
              <tr key={item.label} className={i > 0 ? 'border-t' : ''}>
                <th className="px-4 py-3 text-left font-medium bg-muted/40 align-top whitespace-nowrap w-40">{item.label}</th>
                <td className="px-4 py-3 text-muted-foreground">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
