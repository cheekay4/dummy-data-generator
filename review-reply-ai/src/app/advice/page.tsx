import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'クチコミ返信の手直しガイド — AI返信をあなたらしく | 口コミ返信AI',
  description: 'AI生成の口コミ返信をもっとあなたらしくするコツを解説。業種別ポイント、NG表現集、ネガティブ口コミへの黄金テンプレートを無料公開。',
  keywords: '口コミ 返信 コツ, 口コミ 返信 例文, ネガティブ 口コミ 対応, クチコミ 返信 テンプレ',
}

export default function AdvicePage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/generator" className="text-sm text-stone-400 hover:text-stone-600">
            ← 口コミ返信ジェネレーターに戻る
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-stone-800 mb-2">クチコミ返信の手直しガイド</h1>
        <p className="text-stone-500 mb-10">AI生成の返信をもっと「あなたらしく」するコツ</p>

        <div className="space-y-10">
          {/* なぜ手直しが大切？ */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              なぜ手直しが大切？
            </h2>
            <p className="text-stone-600 leading-relaxed">
              AI返信はそのままでも十分使えますが、<strong>一手間加えるだけで「テンプレ感」がゼロ</strong>になります。
              お客様はオーナーの言葉として読むので、少しでも個性が入ると信頼感が大きく変わります。
            </p>
          </section>

          {/* 基本3ステップ */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">
              基本の3ステップ
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: '固有名詞を入れる',
                  desc: '「○○様」「△△をお褒めいただき」のようにお客様の口コミに出てきた具体的な言葉を使う。固有名詞があるだけで「ちゃんと読んでくれた」という印象に。',
                  example: 'NG: 「こちらのメニューをお楽しみいただけたようで…」\nOK: 「パスタカルボナーラをお楽しみいただけたようで…」',
                },
                {
                  step: '2',
                  title: 'あなたの言葉に置き換える',
                  desc: 'いつも自分が使う表現に差し替えるだけ。「ありがとうございます」を「嬉しいです！」に変えるだけでも、一気に人間味が出ます。',
                  example: 'NG: 「貴重なご意見をいただきありがとうございます」\nOK: 「正直なご意見、本当にありがたいです」',
                },
                {
                  step: '3',
                  title: '1つだけオリジナル情報を追加',
                  desc: 'AIには知りえない情報（季節メニュー・最近の変更・スタッフの話）を1文追加するだけで完全オリジナルに。',
                  example: '「来月から新メニューも始まりますので、ぜひまたいらしてください！」',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800 mb-1">{item.title}</h3>
                    <p className="text-stone-600 text-sm mb-2">{item.desc}</p>
                    <div className="bg-stone-50 rounded-lg px-3 py-2 text-xs text-stone-500 whitespace-pre-line">{item.example}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 業種別ポイント */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">
              業種別のポイント
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: '🍽️', type: '飲食店', tip: 'メニュー名や季節の情報を入れると効果的。「旬の食材を使った〇〇」など具体性がお客様の期待を高めます。' },
                { icon: '✂️', type: '美容院', tip: '担当スタイリスト名を入れると親近感UP。「〇〇担当させていただきました」だけで一気にリアルに。' },
                { icon: '🏥', type: 'クリニック', tip: '医療広告ガイドラインに注意。「効果がある」「治る」という表現はNG。「丁寧な対応を心がけています」などに留める。' },
                { icon: '🏨', type: 'ホテル・旅館', tip: '季節イベントや周辺観光情報への言及が効果的。「また〇〇の季節にもぜひ」など再来訪を自然に促せます。' },
                { icon: '💆', type: '整体・サロン', tip: '体の悩みに寄り添う表現を。「〇〇のお悩みが少しでも和らいでいれば」という共感ベースが刺さります。' },
                { icon: '🏠', type: '不動産', tip: '信頼・長期関係を強調する。「今後もご相談いただければ」という継続的なサポート姿勢をアピールして。' },
              ].map((item) => (
                <div key={item.type} className="border border-stone-100 rounded-xl p-4">
                  <p className="font-medium text-stone-800 mb-1">{item.icon} {item.type}</p>
                  <p className="text-xs text-stone-500">{item.tip}</p>
                </div>
              ))}
            </div>
          </section>

          {/* NG表現集 */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">
              NG表現集
            </h2>
            <div className="space-y-3">
              {[
                { ng: '「必ず改善します」', ok: '「改善に努めます」', reason: '「必ず」は約束になりNG。誠実に「努める」姿勢を伝えれば十分。' },
                { ng: '口コミ投稿者の名前（本名）を返信に書く', ok: '「お客様」と表記', reason: '個人情報の公開になる可能性。Googleも名前の使用を推奨していません。' },
                { ng: '他のお店との比較', ok: '自店の良さを淡々と伝える', reason: '競合批判は炎上リスク大。「当店では〜を大切にしています」で十分。' },
                { ng: '感情的な反論・言い訳', ok: '事実の確認＋改善の姿勢', reason: '低評価への反論は逆効果。読む人への印象が一番大事。' },
                { ng: '「ご来店いただけますよう」（二重敬語）', ok: '「またお越しいただければ」', reason: '日本語として不自然。シンプルな敬語が一番きれい。' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-red-400 text-lg">❌</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-700 mb-0.5">{item.ng}</p>
                    <p className="text-xs text-stone-400">{item.reason}</p>
                    <p className="text-xs text-emerald-600 mt-1">✅ {item.ok}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ネガティブ口コミの黄金テンプレート */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">
              ネガティブ口コミの黄金テンプレート
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-sm font-medium text-stone-700 mb-3">4ステップ構成で書く</p>
              <div className="space-y-3">
                {[
                  { step: '① 謝意', desc: 'まず正直に受け止めて、ご意見への感謝を伝える。反論はしない。' },
                  { step: '② 事実確認（任意）', desc: '誤解がある場合は穏やかに事実を補足。「〇〇については〜という状況でした」' },
                  { step: '③ 具体的改善', desc: '「今後このように改善します」と具体性を持たせる。曖昧な「検討します」は避ける。' },
                  { step: '④ 再来店の願い', desc: '「改善した姿をご確認いただけると幸いです」など、前向きに締める。' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="text-xs font-bold text-amber-700 w-20 flex-shrink-0">{item.step}</span>
                    <p className="text-xs text-stone-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="border border-amber-200 bg-amber-50 rounded-2xl p-6 text-center">
            <p className="font-medium text-stone-800 mb-2">プロファイルを作って、あなたらしい返信を自動化しよう</p>
            <p className="text-sm text-stone-500 mb-4">5つのスライダーを設定するだけで、AIがあなたの言葉遣いを学習します</p>
            <Link
              href="/generator"
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm"
            >
              ✨ 返信を生成してみる →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
