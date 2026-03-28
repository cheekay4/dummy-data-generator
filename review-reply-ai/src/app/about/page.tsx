import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '運営者情報 | MyReplyTone',
  description: 'MyReplyTone（AI口コミ返信ジェネレーター）の運営者情報、サービスの背景、開発チームについてご紹介します。',
  alternates: { canonical: 'https://myreplytone.com/about' },
  openGraph: {
    title: '運営者情報 | MyReplyTone',
    description: 'MyReplyTone（AI口コミ返信ジェネレーター）の運営者情報',
    url: 'https://myreplytone.com/about',
  },
}

export default function AboutPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '運営者情報 | MyReplyTone',
    description: 'MyReplyTone（AI口コミ返信ジェネレーター）の運営者情報、サービスの背景、開発チームについてご紹介します。',
    author: { '@type': 'Organization', name: 'tools24.jp', url: 'https://tools24.jp' },
    publisher: { '@type': 'Organization', name: 'MyReplyTone', url: 'https://myreplytone.com' },
    datePublished: '2026-03-29',
    dateModified: '2026-03-29',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://myreplytone.com/about' },
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-sm text-stone-400 hover:text-stone-600">
            ← トップページに戻る
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-stone-800 mt-3 mb-2">運営者情報</h1>
        <p className="text-stone-500 mb-10">MyReplyToneの運営元・サービス概要・お問い合わせ先</p>

        <div className="space-y-10 text-stone-600 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              MyReplyToneについて
            </h2>
            <p>
              MyReplyToneは、<strong>AIを活用した口コミ返信ジェネレーター</strong>です。飲食店・美容室・クリニック・ホテルなど、さまざまな業種の店舗オーナー様が、Googleマップや食べログ、ホットペッパービューティーなどに寄せられる口コミに対して、心のこもった返信文を素早く作成できるツールとして開発しました。
            </p>
            <p className="mt-3">
              開発のきっかけは、多くの店舗オーナー様から「口コミへの返信に毎日30分以上かけている」「何を書いたらいいかわからず、結局放置してしまう」という声を繰り返しお聞きしたことでした。特に個人経営の飲食店や美容室では、営業時間外に口コミ返信の時間を確保することが大きな負担になっていました。
            </p>
            <p className="mt-3">
              MyReplyToneのミッションは、<strong>テンプレ感のない、オーナーらしい返信を誰でも簡単に作れる</strong>ようにすることです。性格診断や過去のテキスト学習を通じて、機械的ではなくオーナー様の人柄が伝わる返信文を自動生成します。口コミ対応の負担を減らしながら、お店の評判向上とリピーター獲得を支援します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              運営者プロフィール
            </h2>
            <div className="bg-stone-50 rounded-xl p-5 space-y-3">
              <div className="flex gap-3">
                <span className="font-medium text-stone-700 w-24 flex-shrink-0">運営</span>
                <span>tools24.jp</span>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-stone-700 w-24 flex-shrink-0">所在地</span>
                <span>東京都</span>
              </div>
            </div>
            <p className="mt-4">
              tools24.jpは、日本の中小企業やスモールビジネスのオーナー様に向けたWebアプリケーションの企画・開発を行っています。主な技術スタックはNext.js / TypeScript / AI API連携で、使いやすさと実用性を最優先にしたプロダクト設計を心がけています。
            </p>
            <p className="mt-3">
              SMB（中小規模ビジネス）向けSaaS開発の経験を活かし、「専門知識がなくても業務をラクにするツール」を目指しています。大企業向けの高機能ツールではなく、個人店や小規模チームが毎日の業務で無理なく使い続けられるシンプルさを大切にしています。
            </p>
            <div className="mt-4">
              <p className="font-medium text-stone-700 mb-2">運営ツール一覧</p>
              <div className="space-y-2">
                <div className="flex gap-3 items-start">
                  <span className="text-amber-500 flex-shrink-0">▸</span>
                  <div>
                    <p className="font-medium text-stone-700">tools24.jp</p>
                    <p className="text-stone-500">開発者・ビジネスオーナー向けの無料ツール集</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-amber-500 flex-shrink-0">▸</span>
                  <div>
                    <p className="font-medium text-stone-700">MyReplyTone</p>
                    <p className="text-stone-500">AI口コミ返信ジェネレーター（本サービス）</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-amber-500 flex-shrink-0">▸</span>
                  <div>
                    <p className="font-medium text-stone-700">MsgScore</p>
                    <p className="text-stone-500">メッセージスコアリングツール</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              サービスの特徴
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-amber-500 text-lg flex-shrink-0">✓</span>
                <div>
                  <p className="font-medium text-stone-700 mb-0.5">性格診断・テキスト学習によるパーソナライズ</p>
                  <p className="text-stone-500">オーナー様の文章のクセや口調をAIが学習し、「本人が書いたような」自然な返信文を生成します。テンプレートの一括返信ではなく、お店ごとの個性が反映されます。</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-500 text-lg flex-shrink-0">✓</span>
                <div>
                  <p className="font-medium text-stone-700 mb-0.5">8業種対応</p>
                  <p className="text-stone-500">飲食店、美容院、クリニック、ホテル、整体院、不動産、カフェ、ネイルサロンの8業種に特化したプロンプトを用意。業界特有の表現やマナーを反映した返信文を生成します。</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-500 text-lg flex-shrink-0">✓</span>
                <div>
                  <p className="font-medium text-stone-700 mb-0.5">4言語対応（日英中韓）</p>
                  <p className="text-stone-500">日本語・英語・中国語・韓国語の口コミに対応。インバウンド観光客からの口コミにも、適切な言語で返信文を生成できます。</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-500 text-lg flex-shrink-0">✓</span>
                <div>
                  <p className="font-medium text-stone-700 mb-0.5">プライバシー重視</p>
                  <p className="text-stone-500">入力された口コミデータはAI処理後に保存せず、第三者への共有も一切行いません。安心してご利用いただける設計を徹底しています。</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              お問い合わせ
            </h2>
            <p className="mb-4">
              サービスに関するご質問・ご要望・不具合のご報告は、以下の方法でお気軽にご連絡ください。通常2営業日以内にご返信いたします。
            </p>
            <div className="bg-stone-50 rounded-xl p-5 space-y-3">
              <div className="flex gap-3">
                <span className="font-medium text-stone-700 w-32 flex-shrink-0">メール</span>
                <a href="mailto:tools24.riku@gmail.com" className="text-amber-600 hover:text-amber-700 underline">tools24.riku@gmail.com</a>
              </div>
              <div className="flex gap-3">
                <span className="font-medium text-stone-700 w-32 flex-shrink-0">お問い合わせ</span>
                <Link href="/contact" className="text-amber-600 hover:text-amber-700 underline">お問い合わせページ</Link>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              関連ページ
            </h2>
            <div className="space-y-3">
              <Link href="/guide" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <p className="font-medium text-stone-700">口コミ返信ガイド一覧</p>
                <p className="text-stone-500 text-xs mt-1">業種別・プラットフォーム別の返信ガイドをまとめています</p>
              </Link>
              <Link href="/privacy" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <p className="font-medium text-stone-700">プライバシーポリシー</p>
                <p className="text-stone-500 text-xs mt-1">個人情報の取り扱いについて</p>
              </Link>
              <Link href="/terms" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <p className="font-medium text-stone-700">利用規約</p>
                <p className="text-stone-500 text-xs mt-1">サービスのご利用条件について</p>
              </Link>
              <Link href="/tokushoho" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <p className="font-medium text-stone-700">特定商取引法に基づく表記</p>
                <p className="text-stone-500 text-xs mt-1">法令に基づく事業者情報の表示</p>
              </Link>
              <Link href="/security-policy" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <p className="font-medium text-stone-700">セキュリティポリシー</p>
                <p className="text-stone-500 text-xs mt-1">データ保護とセキュリティに関する方針</p>
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
