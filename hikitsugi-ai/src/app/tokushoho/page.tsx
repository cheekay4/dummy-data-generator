import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | 引き継ぎAI',
}

const rows = [
  { label: '販売業者', value: 'tools24' },
  { label: '代表責任者', value: '非公開（請求があれば遅滞なく開示します）' },
  { label: '所在地', value: '非公開（請求があれば遅滞なく開示します）' },
  { label: '電話番号', value: '非公開（請求があれば遅滞なく開示します）' },
  { label: 'メールアドレス', value: 'support@tools24.jp' },
  { label: 'サービス名', value: '引き継ぎAI' },
  {
    label: '販売価格',
    value: `【無料プラン】¥0\n【Proプラン】¥1,980 / 月（税込）\n【Teamプラン】¥4,980 / 月（税込）`,
  },
  { label: '支払方法', value: 'クレジットカード決済（Stripe）' },
  { label: '支払時期', value: '月次自動更新（クレジットカード即時決済）' },
  { label: 'サービス提供時期', value: '決済完了後、即時利用可能' },
  {
    label: 'キャンセル・返金ポリシー',
    value:
      '月次サブスクリプションはいつでも解約できます。解約後は翌課金日以降の請求は発生しません。既払い分の返金はいたしかねます。',
  },
  {
    label: '動作環境',
    value:
      'Chrome / Edge / Safari 最新版推奨。音声チャット機能はFirefoxに非対応。',
  },
]

export default function TokushohoPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-[22px] font-bold text-neutral-900 mb-8">
          特定商取引法に基づく表記
        </h1>
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full text-[13px]">
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                  <td className="px-4 py-3 font-medium text-neutral-700 w-36 align-top border-b border-neutral-100">
                    {row.label}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 border-b border-neutral-100 leading-[1.85] whitespace-pre-line">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
