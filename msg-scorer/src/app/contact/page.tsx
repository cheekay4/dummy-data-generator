import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'MsgScore（AIメール・LINE配信文スコアリング）へのお問い合わせはこちらから。',
  alternates: { canonical: 'https://msgscore.jp/contact' },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-16 py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-outfit font-bold text-3xl text-stone-900 mb-2">お問い合わせ</h1>
        <p className="text-stone-500 text-sm mb-10">
          MsgScore に関するご質問・ご要望・不具合のご報告など、お気軽にお問い合わせください。
        </p>

        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-6">
            <h2 className="font-bold text-stone-800 mb-1">メールでのお問い合わせ</h2>
            <p className="text-xs text-stone-400 mb-4">一般的なご質問・ご要望</p>
            <p className="text-sm text-stone-600 mb-4">
              以下のメールアドレスまでお問い合わせください。件名に「MsgScore」と記載いただけるとスムーズです。
            </p>
            <a
              href="mailto:tools24.riku@gmail.com"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
            >
              tools24.riku@gmail.com
            </a>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6">
            <h2 className="font-bold text-stone-800 mb-1">回答までの目安</h2>
            <p className="text-xs text-stone-400 mb-4">通常2営業日以内</p>
            <ul className="text-sm text-stone-600 space-y-2">
              <li>通常のお問い合わせ：<span className="font-medium text-stone-800">2営業日以内</span>にご返信</li>
              <li>不具合・緊急のご報告：<span className="font-medium text-stone-800">1営業日以内</span>に確認</li>
              <li>土日祝日のお問い合わせは、翌営業日以降の対応となります</li>
            </ul>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6">
            <h2 className="font-bold text-stone-800 mb-3">お問い合わせ時にご記載いただきたい内容</h2>
            <ul className="text-sm text-stone-600 space-y-1.5 list-disc pl-5">
              <li>ご利用中のプラン（Free / Pro / Team）</li>
              <li>お使いのブラウザ・端末（例: Chrome / iPhone）</li>
              <li>不具合の場合：発生した画面と操作の手順</li>
              <li>スクリーンショット（あれば）</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-200">
          <h3 className="font-bold text-stone-700 text-sm mb-3">運営情報</h3>
          <dl className="text-sm text-stone-600 space-y-1">
            <div className="flex gap-4">
              <dt className="text-stone-400 w-24 flex-shrink-0">サービス名</dt>
              <dd>MsgScore（AIメール・LINE配信文スコアリング）</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-stone-400 w-24 flex-shrink-0">運営</dt>
              <dd>tools24.jp</dd>
            </div>
            <div className="flex gap-4">
              <dt className="text-stone-400 w-24 flex-shrink-0">メール</dt>
              <dd><a href="mailto:tools24.riku@gmail.com" className="text-indigo-600 hover:text-indigo-700">tools24.riku@gmail.com</a></dd>
            </div>
          </dl>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 text-sm">← トップページに戻る</Link>
        </div>
      </div>
    </main>
  );
}
