import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '利用規約',
  description: 'MsgScore（AIメール・LINE配信文スコアリング）の利用規約。',
  alternates: { canonical: 'https://msgscore.jp/terms' },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-16 py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-outfit font-bold text-3xl text-stone-900 mb-2">利用規約</h1>
        <p className="text-stone-500 text-sm mb-10">最終更新日: 2026年3月1日</p>

        <div className="space-y-8 text-stone-600 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">第1条（適用）</h2>
            <p>本規約は、tools24.jp（以下「運営者」）が提供する MsgScore（以下「本サービス」）の利用条件を定めるものです。ユーザーは本規約に同意した上で本サービスをご利用ください。</p>
            <p className="mt-2">本規約に同意いただけない場合は、本サービスをご利用いただくことはできません。</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">第2条（サービスの内容）</h2>
            <p>本サービスは、ユーザーが入力したメール・LINE配信文を、AIがセグメント×目的別に5軸で評価し、改善案・推定開封数・推定CV数を提示するWebアプリケーションです。</p>

            <h3 className="text-base font-bold text-stone-700 mt-4 mb-2">2-1. 提供する機能</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>メール・LINE配信文の5軸AIスコアリング（件名力・本文力・CTA力・セグメント適合・目的達成度）</li>
              <li>改善案の提示</li>
              <li>推定開封数・クリック数・CV数の算出</li>
              <li>スコアリング履歴の保存・比較</li>
              <li>チーム機能（共有・コラボレーション）</li>
            </ul>

            <h3 className="text-base font-bold text-stone-700 mt-4 mb-2">2-2. 料金プラン</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Free:</strong> 1日3回まで無料。履歴保存7日間</li>
              <li><strong>Pro:</strong> 月額980円（税込）。スコアリング無制限、履歴無制限、高度な改善案</li>
              <li><strong>Team:</strong> 月額2,980円〜。チーム共有、メンバー管理、一括分析</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">第3条（アカウント）</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>アカウント登録は Google OAuth またはメールアドレスによるマジックリンク認証で行います</li>
              <li>ユーザーは自身のアカウント情報を適切に管理する責任を負います</li>
              <li>アカウントの第三者への貸与・譲渡・売買は禁止します</li>
              <li>不正利用が確認された場合、運営者はアカウントを停止・削除する権利を有します</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">第4条（禁止事項）</h2>
            <p>以下の行為を禁止します。</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>不正な手段によるレート制限の回避</li>
              <li>本サービスへの不正アクセス・クローリング・スクレイピング・リバースエンジニアリング</li>
              <li>スパムメールの作成・最適化を目的とした利用</li>
              <li>虚偽の情報を入力し、他者を欺く目的での利用</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>その他、法令または公序良俗に違反する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">第5条（免責事項）</h2>
            <p>本サービスはAIが予測したスコア・改善案を提供するものであり、その内容の正確性・適切性・完全性を保証するものではありません。</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>スコアリング結果はあくまで参考値です。実際の配信結果を保証するものではありません</li>
              <li>推定開封数・CV数は統計的な予測であり、実際の数値と異なる場合があります</li>
              <li>AIの改善案をそのまま採用することによる損害について、運営者は一切の責任を負いません</li>
              <li>サービスの停止・変更・廃止による損害について、運営者は責任を負いません</li>
              <li>天災・サーバー障害等、運営者の責に帰さない事由による損害について、責任を負いません</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">第6条（知的財産権）</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>本サービスのシステム・デザイン・コード・ロゴ・コンテンツは運営者に帰属します</li>
              <li>ユーザーが入力した配信文の著作権はユーザーに帰属します</li>
              <li>AIが生成した改善案については、ユーザーが自由に使用・編集できます</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">第7条（有料プランの取り扱い）</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>有料プランの決済は Stripe を通じて行われます</li>
              <li>月額料金は契約日を基準に毎月自動課金されます</li>
              <li>プランの解約はマイページからいつでも可能です。解約後は次の課金日をもって Free プランに移行します</li>
              <li>日割り計算による返金は行いません</li>
              <li>料金の改定は1か月前までにメールまたはサービス内で通知します</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">第8条（チーム機能）</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>チームプランでは、チームオーナーがメンバーを招待・管理できます</li>
              <li>チームオーナーは、チーム内のスコアリング履歴にアクセスできます</li>
              <li>チームメンバーの追加・削除はチームオーナーが行います</li>
              <li>チーム解散時は、チーム共有データは削除されます。個人のデータは維持されます</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">第9条（サービスの変更・停止）</h2>
            <p>運営者は、システムの保守・更新、不可抗力、第三者サービスの停止等の事由により、サービスの内容を変更・停止・終了することができます。重要な変更については、可能な限り事前にお知らせします。</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">第10条（お問い合わせ）</h2>
            <p>本規約に関するお問い合わせは、以下の連絡先までお願いいたします。</p>
            <ul className="list-none mt-2 space-y-1">
              <li>運営: tools24.jp</li>
              <li>メール: <a href="mailto:tools24.riku@gmail.com" className="text-indigo-600 hover:text-indigo-700 underline">tools24.riku@gmail.com</a></li>
              <li>お問い合わせページ: <a href="/contact" className="text-indigo-600 hover:text-indigo-700 underline">https://msgscore.jp/contact</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">第11条（準拠法・裁判管轄）</h2>
            <p>本規約は日本法に準拠し、日本法に従って解釈されます。本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-stone-200">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 text-sm">← トップページに戻る</Link>
        </div>
      </div>
    </main>
  );
}
