import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'プライバシーポリシー | 引き継ぎAI',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-[22px] font-bold text-neutral-900 mb-8">プライバシーポリシー</h1>
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6 text-[14px] text-neutral-600 leading-[1.85]">
          <p>引き継ぎAI（以下「本サービス」）は、ユーザーの個人情報を適切に保護することを重要な責務と考えています。</p>

          <div>
            <h2 className="text-[16px] font-semibold text-neutral-800 mb-2">収集する情報</h2>
            <p>本サービスでは、以下の情報を収集する場合があります。</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>メールアドレス（アカウント登録時）</li>
              <li>業務内容（AIインタビュー中に入力された情報）</li>
              <li>アクセスログ（IPアドレス、ブラウザ情報等）</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[16px] font-semibold text-neutral-800 mb-2">情報の利用目的</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>サービスの提供・改善</li>
              <li>ユーザーサポート</li>
              <li>サービスに関する通知</li>
            </ul>
          </div>

          <div>
            <h2 className="text-[16px] font-semibold text-neutral-800 mb-2">第三者への提供</h2>
            <p>法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。</p>
          </div>

          <div>
            <h2 className="text-[16px] font-semibold text-neutral-800 mb-2">セキュリティ</h2>
            <p>収集した個人情報は、適切な安全管理措置を講じて保護します。通信はすべてHTTPS暗号化されています。</p>
          </div>

          <div>
            <h2 className="text-[16px] font-semibold text-neutral-800 mb-2">お問い合わせ</h2>
            <p>プライバシーポリシーに関するお問い合わせは、サービス内のお問い合わせフォームよりご連絡ください。</p>
          </div>

          <p className="text-[12px] text-neutral-400">最終更新: 2026年3月</p>
        </div>
      </div>
    </div>
  )
}
