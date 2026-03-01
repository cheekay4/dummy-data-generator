import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, Clock, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'お問い合わせ | MyReplyTone',
  description: 'MyReplyTone（AI口コミ返信ジェネレーター）へのお問い合わせはこちらから。機能に関するご質問、不具合のご報告、ご要望などお気軽にどうぞ。',
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">お問い合わせ</h1>
      <p className="text-stone-500 text-sm mb-10">
        MyReplyTone に関するご質問・ご要望・不具合のご報告など、お気軽にお問い合わせください。
      </p>

      <div className="space-y-6">
        {/* メールでのお問い合わせ */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="font-bold text-stone-800">メールでのお問い合わせ</h2>
              <p className="text-xs text-stone-400">一般的なご質問・ご要望</p>
            </div>
          </div>
          <p className="text-sm text-stone-600 mb-4">
            以下のメールアドレスまでお問い合わせください。件名に「MyReplyTone」と記載いただけるとスムーズです。
          </p>
          <a
            href="mailto:support@tools24.jp"
            className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
          >
            <Mail className="w-4 h-4" />
            support@tools24.jp
          </a>
        </div>

        {/* 回答目安 */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="font-bold text-stone-800">回答までの目安</h2>
              <p className="text-xs text-stone-400">通常2営業日以内</p>
            </div>
          </div>
          <ul className="text-sm text-stone-600 space-y-2">
            <li>通常のお問い合わせ：<span className="font-medium text-stone-800">2営業日以内</span>にご返信</li>
            <li>不具合・緊急のご報告：<span className="font-medium text-stone-800">1営業日以内</span>に確認</li>
            <li>土日祝日のお問い合わせは、翌営業日以降の対応となります</li>
          </ul>
        </div>

        {/* よくあるお問い合わせ */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="font-bold text-stone-800">お問い合わせの前に</h2>
              <p className="text-xs text-stone-400">よくある質問をご確認ください</p>
            </div>
          </div>
          <p className="text-sm text-stone-600 mb-3">
            多くのご質問は FAQ ページで解決できます。お問い合わせの前にぜひご覧ください。
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/#faq"
              className="text-sm text-amber-600 hover:text-amber-700 underline underline-offset-4 decoration-amber-200 transition-colors"
            >
              よくある質問を見る
            </a>
            <a
              href="/pricing"
              className="text-sm text-amber-600 hover:text-amber-700 underline underline-offset-4 decoration-amber-200 transition-colors"
            >
              料金プランを確認する
            </a>
          </div>
        </div>

        {/* お問い合わせ時のお願い */}
        <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6">
          <h3 className="font-bold text-stone-700 text-sm mb-3">お問い合わせ時にご記載いただきたい内容</h3>
          <ul className="text-sm text-stone-600 space-y-1.5 list-disc pl-5">
            <li>ご利用中のプラン（お試し / Free / Pro）</li>
            <li>お使いのブラウザ・端末（例: Chrome / iPhone）</li>
            <li>不具合の場合：発生した画面と操作の手順</li>
            <li>スクリーンショット（あれば）</li>
          </ul>
        </div>
      </div>

      {/* 運営情報 */}
      <div className="mt-12 pt-6 border-t border-stone-200">
        <h3 className="font-bold text-stone-700 text-sm mb-3">運営情報</h3>
        <dl className="text-sm text-stone-600 space-y-1">
          <div className="flex gap-4">
            <dt className="text-stone-400 w-24 flex-shrink-0">サービス名</dt>
            <dd>MyReplyTone（AI口コミ返信ジェネレーター）</dd>
          </div>
          <div className="flex gap-4">
            <dt className="text-stone-400 w-24 flex-shrink-0">運営</dt>
            <dd>tools24.jp</dd>
          </div>
          <div className="flex gap-4">
            <dt className="text-stone-400 w-24 flex-shrink-0">メール</dt>
            <dd><a href="mailto:support@tools24.jp" className="text-amber-600 hover:text-amber-700">support@tools24.jp</a></dd>
          </div>
        </dl>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-amber-600 hover:text-amber-700 text-sm">← トップページに戻る</Link>
      </div>
    </div>
  )
}
