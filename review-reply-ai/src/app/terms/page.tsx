import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '利用規約 | MyReplyTone',
  description: 'MyReplyTone（AI口コミ返信ジェネレーター）の利用規約。サービス内容、料金プラン、禁止事項、免責事項、知的財産権について。',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">利用規約</h1>
      <p className="text-stone-400 text-sm mb-10">最終更新: 2026年3月1日</p>

      <div className="space-y-8 text-stone-600 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第1条（適用）</h2>
          <p>本規約は、tools24.jp（以下「運営者」）が提供する MyReplyTone（以下「本サービス」）の利用条件を定めるものです。ユーザーは本規約に同意した上で本サービスをご利用ください。</p>
          <p className="mt-2">本規約に同意いただけない場合は、本サービスをご利用いただくことはできません。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第2条（サービスの内容）</h2>
          <p>本サービスは、ユーザーが入力した口コミ情報および返信プロファイルをもとに、AIが返信文案を生成するWebアプリケーションです。</p>

          <h3 className="text-base font-bold text-stone-700 mt-4 mb-2">2-1. 提供する機能</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>口コミ返信文の自動生成（AI による2パターンの返信案）</li>
            <li>性格診断による返信プロファイルの作成（Big Five モデル）</li>
            <li>テキスト学習による返信トーンの分析</li>
            <li>客層分析（口コミからの顧客属性推定）</li>
            <li>手直しアドバイス（生成された返信の改善提案）</li>
          </ul>

          <h3 className="text-base font-bold text-stone-700 mt-4 mb-2">2-2. 料金プラン</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>お試し:</strong> ログイン不要。1日3回まで無料で利用可能</li>
            <li><strong>Free:</strong> ログイン必要。1日5回まで無料。返信プロファイル1名分、客層分析、手直しアドバイス付き</li>
            <li><strong>Pro:</strong> 月額390円（税込）。返信無制限、プロファイル5名分、補助スタイル5種、返信履歴90日保存、多言語返信（日英中韓）、広告非表示</li>
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
            <li>不正な手段によるレート制限の回避（複数アカウントの作成、VPN等による IP 偽装を含む）</li>
            <li>本サービスへの不正アクセス・クローリング・スクレイピング・リバースエンジニアリング</li>
            <li>虚偽の口コミを作成する目的での利用</li>
            <li>他者の名誉・信用を毀損する目的での利用</li>
            <li>医療・法的アドバイスとしての生成結果の利用</li>
            <li>生成された返信文を第三者に有償で提供する行為（代行業としての利用）</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>その他、法令または公序良俗に違反する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第5条（免責事項）</h2>
          <p>本サービスはAIが生成した返信文案を提供するものであり、その内容の正確性・適切性・完全性を保証するものではありません。</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>生成された返信文をそのまま使用することによる損害について、運営者は一切の責任を負いません。投稿前に必ず内容をご確認ください</li>
            <li>クリニック・歯科・医療機関の方は、医療広告ガイドラインに照らし合わせて必ずご確認ください</li>
            <li>AIの特性上、事実と異なる内容が生成される可能性があります。特に固有名詞や数値の正確性にご注意ください</li>
            <li>サービスの停止・変更・廃止による損害について、運営者は責任を負いません</li>
            <li>天災・サーバー障害・第三者サービスの障害等、運営者の責に帰さない事由による損害について、責任を負いません</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第6条（知的財産権）</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>本サービスのシステム・デザイン・コード・ロゴ・コンテンツは運営者に帰属します</li>
            <li>ユーザーが入力した口コミ文の著作権はユーザー（または原著作者）に帰属します</li>
            <li>AIが生成した返信文については、ユーザーが自由に使用・編集・公開できます</li>
            <li>本サービスの名称・ロゴ等を無断で使用することを禁止します</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第7条（有料プランの取り扱い）</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>有料プラン（Pro）の決済は Stripe を通じて行われます</li>
            <li>月額料金は契約日を基準に毎月自動課金されます</li>
            <li>プランの解約はマイページからいつでも可能です。解約後は次の課金日をもって Free プランに移行します</li>
            <li>日割り計算による返金は行いません</li>
            <li>料金の改定は1か月前までにメールまたはサービス内で通知します</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第8条（サービスの変更・停止）</h2>
          <p>運営者は、以下の場合にサービスの内容を変更・停止・終了することができます。</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>システムの保守・更新が必要な場合</li>
            <li>天災・事故・その他不可抗力により提供が困難な場合</li>
            <li>第三者サービス（API・ホスティング等）の停止・変更があった場合</li>
            <li>その他、運営者が必要と判断した場合</li>
          </ul>
          <p className="mt-2">重要な変更については、可能な限り事前にお知らせします。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第9条（退会）</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>ユーザーはマイページからいつでも退会（アカウント削除）できます</li>
            <li>退会により、返信プロファイル・生成履歴・客層分析結果は全て削除されます</li>
            <li>有料プラン契約中の退会は、Stripe の自動課金停止を伴います</li>
            <li>退会後のデータ復旧はできません</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第10条（お問い合わせ）</h2>
          <p>本規約に関するお問い合わせは、以下の連絡先までお願いいたします。</p>
          <ul className="list-none mt-2 space-y-1">
            <li>運営: tools24.jp</li>
            <li>メール: <a href="mailto:support@tools24.jp" className="text-amber-600 hover:text-amber-700 underline">support@tools24.jp</a></li>
            <li>お問い合わせページ: <a href="/contact" className="text-amber-600 hover:text-amber-700 underline">https://myreplytone.com/contact</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第11条（規約の変更）</h2>
          <p>運営者は、必要に応じて本規約を変更できます。重要な変更がある場合はサービス内またはメールで通知します。変更後も本サービスを継続してご利用いただいた場合、変更後の規約に同意いただいたものとみなします。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-3">第12条（準拠法・裁判管轄）</h2>
          <p>本規約は日本法に準拠し、日本法に従って解釈されます。本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
        </section>

      </div>

      <div className="mt-12 pt-6 border-t border-stone-200">
        <Link href="/" className="text-amber-600 hover:text-amber-700 text-sm">← トップページに戻る</Link>
      </div>
    </div>
  )
}
