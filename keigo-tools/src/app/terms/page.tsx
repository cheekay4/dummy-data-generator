import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約',
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 text-sm">
      <h1 className="text-xl font-bold">利用規約</h1>

      <p className="text-muted-foreground">最終更新日: 2026年2月21日</p>

      <section className="space-y-2">
        <h2 className="font-semibold">第1条（適用）</h2>
        <p className="text-muted-foreground">
          本規約は、当サービス「敬語メールライター」（以下「本サービス」）の利用条件を定めるものです。
          本サービスを利用することで、本規約に同意したものとみなします。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">第2条（利用登録）</h2>
        <p className="text-muted-foreground">
          無料プランは登録不要でご利用いただけます。Proプランのご利用にはStripeによる決済が必要です。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">第3条（禁止事項）</h2>
        <ul className="text-muted-foreground list-disc ml-4 space-y-1">
          <li>法令または公序良俗に違反する行為</li>
          <li>本サービスの運営を妨げる行為</li>
          <li>他のユーザーまたは第三者を害する行為</li>
          <li>不正アクセスやリバースエンジニアリング</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">第4条（サービスの変更・停止）</h2>
        <p className="text-muted-foreground">
          当サービスは予告なくサービスの内容を変更または停止する場合があります。
          これによりユーザーに生じた損害について責任を負いません。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">第5条（免責事項）</h2>
        <p className="text-muted-foreground">
          本サービスが生成するメール文章はAIによるものであり、内容の正確性・適切性を保証しません。
          生成されたメールの送信前にご自身で内容をご確認ください。
          本サービスの利用によって生じた損害について、当方は責任を負いません。
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">第6条（準拠法・管轄）</h2>
        <p className="text-muted-foreground">
          本規約は日本法に準拠し、紛争が生じた場合は東京地方裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </section>
    </div>
  );
}
