import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | MyReplyTone',
  robots: { index: false },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">プライバシーポリシー</h1>
      <p className="text-stone-400 text-sm mb-10">最終更新: 2026年2月23日</p>

      <div className="prose prose-stone max-w-none space-y-8 text-stone-600 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">1. 収集する情報</h2>
          <p>本サービス（MyReplyTone）は、以下の情報を収集する場合があります。</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>入力された口コミ本文・星評価・業種・プラットフォーム・トーン設定</li>
            <li>任意入力のお店名・お店の特徴</li>
            <li>アクセスログ（IPアドレス、ブラウザ種別、参照元URL、アクセス日時）</li>
            <li>レート制限管理のためのIPアドレス（サーバーメモリ上で当日のみ保持）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">2. 情報の利用目的</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>AIによる口コミ返信文の生成（Anthropic Claude APIに送信）</li>
            <li>無料利用回数の管理（1日3回制限）</li>
            <li>サービスの改善・不正利用の防止</li>
            <li>アクセス解析（Google Analyticsを利用予定）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">3. 第三者への提供</h2>
          <p>入力内容はAI返信生成のためAnthropicのAPIに送信されます。Anthropicのプライバシーポリシーが適用されます。それ以外の第三者への販売・提供は行いません。</p>
          <p className="mt-2">ただし、法令に基づく開示要求があった場合はこの限りではありません。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">4. データの保存期間</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>入力された口コミ内容：当サービスのサーバーには保存しません（APIに送信後、即座に破棄）</li>
            <li>IPアドレス（レート制限用）：当日23:59に自動消去</li>
            <li>アクセスログ：最大90日間</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">5. Cookie・解析ツール</h2>
          <p>本サービスは、Google Analytics等の解析ツールを使用する場合があります。これらのツールはCookieを使用して匿名の利用統計を収集します。ブラウザの設定でCookieを無効化することができます。</p>
          <p className="mt-2">また、Google AdSenseによる広告配信を行う場合があります。AdSenseはCookieを使用して、ユーザーの興味に基づいた広告を表示します。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">6. お問い合わせ</h2>
          <p>プライバシーに関するご質問は、下記の連絡先までお問い合わせください。</p>
          <p className="mt-2">運営者連絡先：本サービスのフッターまたはGitHubのIssueからご連絡ください。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">7. ポリシーの変更</h2>
          <p>本ポリシーは予告なく変更される場合があります。重要な変更がある場合はトップページでお知らせします。</p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-stone-200">
        <Link href="/" className="text-amber-600 hover:text-amber-700 text-sm">← トップページに戻る</Link>
      </div>
    </div>
  )
}
