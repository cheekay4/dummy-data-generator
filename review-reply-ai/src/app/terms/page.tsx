import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '利用規約 | MyReplyTone',
  robots: { index: false },
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">利用規約</h1>
      <p className="text-stone-400 text-sm mb-10">最終更新: 2026年2月23日</p>

      <div className="space-y-8 text-stone-600 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第1条（適用）</h2>
          <p>本規約は、MyReplyTone（以下「本サービス」）の利用条件を定めるものです。ユーザーは本規約に同意した上で本サービスをご利用ください。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第2条（サービスの内容）</h2>
          <p>本サービスは、ユーザーが入力した口コミ情報をもとに、AIが返信文案を生成するWebツールです。</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>無料プラン：1日3回まで利用可能（ログイン不要）</li>
            <li>Proプラン：月額390円（準備中）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第3条（禁止事項）</h2>
          <p>以下の行為を禁止します。</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>不正な手段によるレート制限の回避</li>
            <li>本サービスへの不正アクセス・クローリング・スクレイピング</li>
            <li>虚偽の情報を入力し、他者を欺く目的での利用</li>
            <li>医療・法的アドバイスとしての生成結果の利用</li>
            <li>本サービスの妨害となる行為</li>
            <li>その他、法令または公序良俗に違反する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第4条（免責事項）</h2>
          <p>本サービスはAIが生成した返信文案を提供するものであり、その内容の正確性・適切性・完全性を保証するものではありません。</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>生成された返信文をそのまま使用することによる損害について、運営者は一切の責任を負いません</li>
            <li>クリニック・医療機関の方は、医療広告ガイドラインに照らし合わせて必ずご確認ください</li>
            <li>サービスの停止・変更・廃止による損害について、運営者は責任を負いません</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第5条（知的財産権）</h2>
          <p>本サービスのシステム・デザイン・コードは運営者に帰属します。ユーザーが入力した口コミ文・生成された返信文についての著作権はユーザーに帰属します。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第6条（サービスの変更・停止）</h2>
          <p>運営者は、ユーザーへの事前通知なしに、サービスの内容を変更・停止・終了することができます。これによってユーザーに生じた損害について、運営者は責任を負いません。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第7条（準拠法・裁判管轄）</h2>
          <p>本規約は日本法に準拠します。本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-stone-200">
        <Link href="/" className="text-amber-600 hover:text-amber-700 text-sm">← トップページに戻る</Link>
      </div>
    </div>
  )
}
