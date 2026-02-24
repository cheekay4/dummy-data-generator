import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'プライバシーポリシー' };

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-sm">
      <h1 className="text-xl font-bold">プライバシーポリシー</h1>
      <p className="text-muted-foreground">最終更新日: 2026年2月21日</p>

      <section className="space-y-2">
        <h2 className="font-semibold">1. 収集する情報</h2>
        <p className="text-muted-foreground">
          当サービスでは、決済処理のためにStripeを通じてお支払い情報を収集します。
          入力された契約書テキストはAI分析処理にのみ使用し、サーバーに保存しません。
          利用回数はお客様のブラウザのlocalStorageに保存されます。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">2. 情報の利用目的</h2>
        <ul className="text-muted-foreground list-disc ml-4 space-y-1">
          <li>サービスの提供・改善</li>
          <li>サブスクリプション管理（Stripe経由）</li>
          <li>お問い合わせへの対応</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">3. 第三者への提供</h2>
        <p className="text-muted-foreground">
          法令に基づく場合を除き、収集した情報を第三者に提供することはありません。
          ただし、AI分析のためにAnthropic Inc.に契約書テキストを送信します。送信されたデータはAI処理後に破棄されます。
          また、決済処理のためにStripe Inc.に必要な情報を提供します。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">4. 個人情報の管理</h2>
        <p className="text-muted-foreground">
          お客様の個人情報を適切に管理し、漏洩・紛失・不正アクセスの防止に努めます。
          契約書に含まれる個人情報については、分析後にサーバー側では一切保持しません。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">5. お問い合わせ</h2>
        <p className="text-muted-foreground">プライバシーに関するお問い合わせは、お問い合わせフォームよりご連絡ください。</p>
      </section>
    </div>
  );
}
