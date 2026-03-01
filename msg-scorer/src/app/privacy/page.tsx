import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'MsgScore（AIメール・LINE配信文スコアリング）のプライバシーポリシー。',
  alternates: { canonical: 'https://msgscore.jp/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-16 py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-outfit font-bold text-3xl text-stone-900 mb-2">プライバシーポリシー</h1>
        <p className="text-stone-500 text-sm mb-10">最終更新日: 2026年3月1日</p>

        <div className="space-y-8 text-stone-600 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">1. はじめに</h2>
            <p>MsgScore（以下「本サービス」）は、tools24.jp が運営するメール・LINE配信文AIスコアリングサービスです。本プライバシーポリシーは、本サービスをご利用いただく際に収集する情報の種類、利用目的、管理方法について説明します。</p>
            <p className="mt-2">本サービスをご利用いただくことで、本ポリシーの内容に同意いただいたものとみなします。</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">2. 収集する情報</h2>

            <h3 className="text-base font-bold text-stone-700 mt-4 mb-2">2-1. ユーザーが直接提供する情報</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>スコアリング対象として入力されたメール・LINE配信文の件名・本文</li>
              <li>配信先セグメント情報（性別・年代・母数等の設定値）</li>
              <li>配信目的の設定（販促・告知・リテンション等）</li>
              <li>アカウント登録時のメールアドレス</li>
              <li>チーム機能で設定されたチーム名・招待メールアドレス</li>
            </ul>

            <h3 className="text-base font-bold text-stone-700 mt-4 mb-2">2-2. 自動的に収集する情報</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>アクセスログ（IPアドレス、ブラウザ種別、OS、参照元URL、アクセス日時）</li>
              <li>レート制限管理のためのIPアドレスハッシュ</li>
              <li>Google Analytics によるアクセス解析データ（匿名化された利用統計）</li>
              <li>Cookie 情報（認証セッション、解析、広告配信に使用）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">3. 情報の利用目的</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>AIによるメール・LINE配信文のスコアリング・改善案の生成（入力内容を Anthropic Claude API に送信）</li>
              <li>推定開封数・クリック数・CV数の算出</li>
              <li>無料利用回数の管理</li>
              <li>ユーザーアカウントの認証・管理（Google OAuth / マジックリンク）</li>
              <li>チーム機能の提供・管理</li>
              <li>サービスの改善・新機能の開発</li>
              <li>不正利用の検知・防止</li>
              <li>アクセス解析によるサービス品質の向上</li>
              <li>広告の配信・最適化（Google AdSense）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">4. 第三者への提供</h2>
            <p>収集した個人情報は、以下の場合を除き、第三者に提供・販売することはありません。</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Anthropic（Claude API）:</strong> 入力された配信文は、スコアリングのために Anthropic の API に送信されます。Anthropic のプライバシーポリシーが適用されます。</li>
              <li><strong>Google（Analytics / AdSense）:</strong> 匿名化されたアクセス解析データおよび広告配信のための Cookie 情報が Google に送信されます。</li>
              <li><strong>Supabase:</strong> ユーザーアカウント情報、スコアリング履歴はデータベースホスティングサービス Supabase 上に保存されます。</li>
              <li><strong>Stripe:</strong> 有料プランのお支払い情報は決済サービス Stripe が処理します。クレジットカード番号は本サービスのサーバーには保存されません。</li>
              <li><strong>法令に基づく場合:</strong> 法令に基づく開示要求があった場合。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">5. データの保存期間</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>入力された配信文（未ログインユーザー）:</strong> API 送信後、サーバーには保存しません</li>
              <li><strong>スコアリング履歴（ログインユーザー）:</strong> ユーザーが削除するまで保存</li>
              <li><strong>アクセスログ:</strong> 最大90日間保存後、自動削除</li>
              <li><strong>アカウント情報:</strong> ユーザーが退会するまで保存</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">6. Cookie・解析ツール・広告</h2>

            <h3 className="text-base font-bold text-stone-700 mt-4 mb-2">6-1. 必須 Cookie</h3>
            <p>ユーザー認証セッションの維持に使用します。これらの Cookie を無効にすると、ログイン機能が正常に動作しない場合があります。</p>

            <h3 className="text-base font-bold text-stone-700 mt-4 mb-2">6-2. Google Analytics</h3>
            <p>サービスの利用状況を把握し改善するため、Google Analytics を使用しています。Google Analytics は Cookie を使用して匿名の利用統計を収集します。</p>

            <h3 className="text-base font-bold text-stone-700 mt-4 mb-2">6-3. Google AdSense</h3>
            <p>本サービスでは、Google AdSense による広告を配信する場合があります。AdSense は Cookie を使用して、ユーザーの興味・関心に基づいた広告を表示する場合があります。パーソナライズド広告を無効にするには、<a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline">Google の広告設定</a>から変更できます。</p>

            <h3 className="text-base font-bold text-stone-700 mt-4 mb-2">6-4. Cookie の管理</h3>
            <p>ブラウザの設定により、Cookie の受け入れを拒否することができます。ただし、一部の機能が正常に動作しなくなる可能性があります。</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">7. ユーザーの権利</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>アクセス権:</strong> ご自身の個人データへのアクセスを要求できます</li>
              <li><strong>訂正権:</strong> 不正確な個人データの訂正を要求できます</li>
              <li><strong>削除権:</strong> マイページからアカウントおよび関連データの削除が可能です</li>
              <li><strong>データポータビリティ:</strong> ご自身のデータの提供を要求できます</li>
            </ul>
            <p className="mt-2">上記の権利行使については、<a href="/contact" className="text-indigo-600 hover:text-indigo-700 underline">お問い合わせページ</a>からご連絡ください。</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">8. セキュリティ</h2>
            <p>本サービスでは、個人情報の保護のために以下の対策を講じています。</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>SSL/TLS による通信の暗号化</li>
              <li>パスワードのハッシュ化保存（Supabase Auth による管理）</li>
              <li>アクセス制御の実装（管理者権限の分離）</li>
            </ul>
            <p className="mt-2">ただし、インターネット上の通信において完全なセキュリティを保証することはできません。</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">9. お問い合わせ</h2>
            <p>プライバシーに関するご質問・ご要望は、以下の連絡先までお問い合わせください。</p>
            <ul className="list-none mt-2 space-y-1">
              <li>運営: tools24.jp</li>
              <li>メール: <a href="mailto:tools24.riku@gmail.com" className="text-indigo-600 hover:text-indigo-700 underline">tools24.riku@gmail.com</a></li>
              <li>お問い合わせページ: <a href="/contact" className="text-indigo-600 hover:text-indigo-700 underline">https://msgscore.jp/contact</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-stone-800 mb-3">10. ポリシーの変更</h2>
            <p>本ポリシーは、法令の改正やサービス内容の変更に伴い、予告なく変更される場合があります。重要な変更がある場合はトップページまたはメールでお知らせします。</p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-200">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 text-sm">← トップページに戻る</Link>
        </div>
      </div>
    </main>
  );
}
