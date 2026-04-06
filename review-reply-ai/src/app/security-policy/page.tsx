import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '情報セキュリティ基本方針 | MyReplyTone',
  description: 'MyReplyTone（AI口コミ返信ジェネレーター）の情報セキュリティ基本方針。IPA SECURITY ACTION 二つ星宣言に基づく情報セキュリティへの取り組みについて。',
  alternates: {
    canonical: 'https://myreplytone.com/security-policy',
  },
}

export default function SecurityPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">情報セキュリティ基本方針</h1>
      <p className="text-stone-400 text-sm mb-10">制定日: 2026年3月2日</p>

      <div className="prose prose-stone max-w-none space-y-8 text-stone-600 text-sm leading-relaxed">

        {/* SECURITY ACTION バッジ */}
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <svg className="w-8 h-8 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="font-bold text-blue-800 text-sm">IPA SECURITY ACTION 二つ星 宣言</p>
            <p className="text-xs text-blue-600 mt-0.5">独立行政法人 情報処理推進機構（IPA）の制度に基づき、情報セキュリティ対策に取り組むことを宣言しています。</p>
          </div>
        </div>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">基本方針</h2>
          <p>
            当事業（屋号: tools24.jp、以下「当事業」）は、AI口コミ返信ジェネレーター「MyReplyTone」をはじめとするWebサービスの運営において、お客様からお預かりする情報資産を事故・災害・犯罪などの脅威から守り、お客様ならびに社会の信頼に応えるべく、以下の方針に基づき情報セキュリティ対策に全力で取り組みます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">1. 情報セキュリティの取り組み</h2>
          <p>当事業は、情報セキュリティに関する法令、規制、規範、契約上の義務を遵守するとともに、お客様の期待に応えうる情報セキュリティ体制を確立し、維持・改善してまいります。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">2. 情報資産の管理</h2>
          <p>当事業が取り扱う情報資産に対して、適切な安全対策を実施し、機密性・完全性・可用性を確保します。具体的には以下の対策を講じています。</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>全通信のSSL/TLS暗号化（HTTPS）</li>
            <li>データベースの行レベルセキュリティ（RLS）による利用者間のデータ隔離</li>
            <li>Content Security Policy（CSP）をはじめとするセキュリティヘッダーの設定</li>
            <li>HSTS（HTTP Strict Transport Security）によるHTTPS強制</li>
            <li>決済情報の非保持（PCI DSS Level 1 準拠の Stripe に委託）</li>
            <li>パスワード・認証情報のハッシュ化保存</li>
            <li>外部AIサービスへの送信データの最小化（個人識別情報を含めない設計）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">3. 法令・規範の遵守</h2>
          <p>当事業は、情報セキュリティに関連する法令（個人情報保護法、不正アクセス禁止法等）、その他の規範を遵守します。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">4. 利用する外部サービスの管理</h2>
          <p>当事業が利用する外部サービス（クラウドインフラ、決済、AI API等）については、各サービス提供者のセキュリティ方針を確認し、適切なサービスを選定しています。</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Supabase:</strong> データベース・認証基盤。SOC 2 Type II 取得済み</li>
            <li><strong>Vercel:</strong> ホスティング・デプロイ基盤。SOC 2 Type II 取得済み</li>
            <li><strong>Stripe:</strong> 決済処理。PCI DSS Level 1 準拠</li>
            <li><strong>Anthropic（Claude API）:</strong> AI処理。API経由のデータはモデル学習に使用されない方針</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">5. 違反および事故への対応</h2>
          <p>万一、情報セキュリティに関する事故が発生した場合は、速やかに原因を究明し、被害の拡大防止に努めるとともに、再発防止策を講じます。必要に応じて、関係機関への報告および影響を受けるお客様への通知を行います。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">6. 継続的な見直し・改善</h2>
          <p>当事業は、情報セキュリティに関する取り組みを定期的に見直し、技術の変化やサービスの拡大に合わせて継続的に改善してまいります。IPAの「5分でできる！情報セキュリティ自社診断」を定期的に実施し、対策の実効性を確認します。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">7. 情報セキュリティ5か条</h2>
          <p>当事業は、IPAが推奨する「情報セキュリティ5か条」を実践しています。</p>
          <ol className="list-decimal pl-5 mt-2 space-y-2">
            <li><strong>OSやソフトウェアは常に最新の状態にする</strong><br /><span className="text-stone-500">フレームワーク（Next.js）やライブラリの依存関係を定期的に更新しています。</span></li>
            <li><strong>ウイルス対策ソフトを導入する</strong><br /><span className="text-stone-500">開発環境にはウイルス対策ソフトを導入し、定義ファイルを自動更新しています。</span></li>
            <li><strong>パスワードを強化する</strong><br /><span className="text-stone-500">各種サービスのアカウントには強固なパスワードと二要素認証を設定しています。</span></li>
            <li><strong>共有設定を見直す</strong><br /><span className="text-stone-500">データベースのRLS設定、APIキーの権限、リポジトリのアクセス制御を適切に管理しています。</span></li>
            <li><strong>脅威や攻撃の手口を知る</strong><br /><span className="text-stone-500">IPAのセキュリティ情報やCVEデータベースを定期的に確認し、最新の脅威情報を把握しています。</span></li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">8. お問い合わせ</h2>
          <p>本方針に関するご質問は、以下の連絡先までお問い合わせください。</p>
          <ul className="list-none mt-2 space-y-1">
            <li>運営: tools24.jp</li>
            <li>メール: <a href="mailto:tools24.riku@gmail.com" className="text-amber-600 hover:text-amber-700 underline">tools24.riku@gmail.com</a></li>
            <li>お問い合わせページ: <a href="/contact" className="text-amber-600 hover:text-amber-700 underline">https://myreplytone.com/contact</a></li>
          </ul>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-stone-200">
        <Link href="/" className="text-amber-600 hover:text-amber-700 text-sm">← トップページに戻る</Link>
      </div>
    </div>
  )
}
