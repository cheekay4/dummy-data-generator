import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "Cron式の書き方完全ガイド——定期実行タスクを正確にスケジュールする方法",
  description:
    "Cron式（crontab）の5つのフィールド・特殊文字・実用パターン15選をわかりやすく解説。AWS・GCP・GitHub Actionsでの活用法やJST変換の注意点も網羅。",
  alternates: { canonical: "/guide/cron-guide" },
};

const faqs = [
  {
    question: "Cron式の最小実行間隔はどのくらいですか？",
    answer:
      "標準的なcronの最小単位は1分です。秒単位のスケジューリングが必要な場合は、Spring SchedulerやQuartzなど6フィールド対応のスケジューラーを使用します。クラウドサービスでも1分が最小間隔となるのが一般的です。",
  },
  {
    question: "「月末に実行」はCron式でどう書きますか？",
    answer:
      "標準のCron式には「月末」を直接指定する構文がありません。代替手段として、28〜31日を列挙する方法（28-31）や、スクリプト内で月末判定を行う方法があります。AWS EventBridgeなどクラウド固有のスケジューラーでは月末指定に対応している場合もあります。",
  },
  {
    question: "Cronのタイムゾーンはどうやって指定しますか？",
    answer:
      "従来のcrontabではサーバーのシステムタイムゾーンが使われます。環境変数CRON_TZやTZで変更可能です。Google Cloud SchedulerやGitHub Actionsではジョブ定義にtimezoneフィールドを指定できます。日本時間（JST）で動かしたい場合はAsia/Tokyoを指定してください。",
  },
  {
    question: "Cron式のテストはどうすればよいですか？",
    answer:
      "tools24.jpのCron式ビルダーを使えば、式を入力するだけで次回実行日時を即座にプレビューできます。crontab.guruなどのオンラインツールも便利です。本番環境に設定する前に、必ず次回実行タイミングを確認しましょう。",
  },
  {
    question: "曜日フィールドの0と7はどちらも日曜日ですか？",
    answer:
      "はい、0と7はどちらも日曜日を表します。これはPOSIX標準とVixie cron（Linux標準）の互換性のためです。混乱を避けるため、0=日曜日で統一するか、SUN/MONなどの英字表記を使うことを推奨します。",
  },
];

export default function CronGuidePage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Cron式の書き方完全ガイド——定期実行タスクを正確にスケジュールする方法",
            description:
              "Cron式（crontab）の5つのフィールド・特殊文字・実用パターン15選をわかりやすく解説。AWS・GCP・GitHub Actionsでの活用法やJST変換の注意点も網羅。",
            datePublished: "2026-03-29",
            dateModified: "2026-03-29",
            author: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            publisher: { "@type": "Organization", name: "tools24.jp", url: "https://tools24.jp" },
            mainEntityOfPage: { "@type": "WebPage", "@id": "https://tools24.jp/guide/cron-guide" },
            inLanguage: "ja",
          }),
        }}
      />
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "ガイド記事", href: "/guide" },
          { label: "Cron式ガイド" },
        ]}
      />

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2">
          Cron式の書き方完全ガイド——定期実行タスクを正確にスケジュールする方法
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          最終更新: 2026年3月29日 ・ 読了時間: 約7分
        </p>

        <AdPlaceholder position="header" className="mb-8" />

        <p className="text-muted-foreground leading-relaxed text-lg">
          「毎日9時にバックアップを取りたい」「毎週月曜にレポートを送信したい」——サーバーやクラウド環境で定期実行タスクを設定するとき、避けて通れないのがCron式（クーロン式）です。
          このガイドでは、Cron式の基本構文から実用パターン、クラウド環境での活用法まで体系的に解説します。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">Cronとは</h2>
        <p className="text-muted-foreground leading-relaxed">
          CronはUNIX系OS（Linux・macOS）に標準搭載されている定期実行デーモンです。
          1975年にベル研究所で開発されて以来、50年以上にわたりサーバー管理の基盤として使われ続けています。
          crontabファイルにスケジュールとコマンドを記述するだけで、指定した日時に自動でタスクを実行できます。
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          現在ではLinuxサーバーだけでなく、AWS CloudWatch Events、Google Cloud Scheduler、GitHub Actions、Vercel Cron Jobsなど、多くのクラウドサービスがCron式の構文を採用しています。
          Cron式を覚えれば、あらゆる環境で定期実行タスクを設定できるようになります。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">Cron式の5つのフィールド</h2>
        <p className="text-muted-foreground leading-relaxed">
          標準的なCron式は、スペースで区切られた5つのフィールドで構成されます。
          左から「分・時・日・月・曜日」の順に並び、それぞれ指定可能な値の範囲が決まっています。
        </p>
        <div className="overflow-x-auto mt-4">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">フィールド</th>
                <th className="text-left py-2 pr-4">指定可能な値</th>
                <th className="text-left py-2">説明</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">分（Minute）</td>
                <td className="py-2 pr-4">0〜59</td>
                <td className="py-2">何分に実行するか</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">時（Hour）</td>
                <td className="py-2 pr-4">0〜23</td>
                <td className="py-2">何時に実行するか（24時間表記）</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">日（Day of Month）</td>
                <td className="py-2 pr-4">1〜31</td>
                <td className="py-2">何日に実行するか</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">月（Month）</td>
                <td className="py-2 pr-4">1〜12</td>
                <td className="py-2">何月に実行するか</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">曜日（Day of Week）</td>
                <td className="py-2 pr-4">0〜7（0と7は日曜）</td>
                <td className="py-2">何曜日に実行するか</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-4">
          例えば <code className="bg-muted px-1.5 py-0.5 rounded text-sm">30 9 * * *</code> は「毎日9時30分に実行」を意味します。
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm">*</code>は「すべての値」を表すワイルドカードです。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">特殊文字の意味</h2>
        <p className="text-muted-foreground leading-relaxed">
          Cron式では4つの特殊文字を使ってスケジュールを柔軟に指定できます。
          これらを組み合わせることで、複雑なスケジュールも1行で表現可能です。
        </p>
        <div className="overflow-x-auto mt-4">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">文字</th>
                <th className="text-left py-2 pr-4">名称</th>
                <th className="text-left py-2 pr-4">意味</th>
                <th className="text-left py-2">例</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">*</td>
                <td className="py-2 pr-4">アスタリスク</td>
                <td className="py-2 pr-4">すべての値にマッチ</td>
                <td className="py-2"><code className="bg-muted px-1 rounded">* * * * *</code>（毎分実行）</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">,</td>
                <td className="py-2 pr-4">カンマ</td>
                <td className="py-2 pr-4">複数の値をリスト指定</td>
                <td className="py-2"><code className="bg-muted px-1 rounded">0 9,18 * * *</code>（9時と18時）</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium text-foreground">-</td>
                <td className="py-2 pr-4">ハイフン</td>
                <td className="py-2 pr-4">値の範囲を指定</td>
                <td className="py-2"><code className="bg-muted px-1 rounded">0 9 * * 1-5</code>（月〜金の9時）</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-foreground">/</td>
                <td className="py-2 pr-4">スラッシュ</td>
                <td className="py-2 pr-4">間隔（ステップ値）を指定</td>
                <td className="py-2"><code className="bg-muted px-1 rounded">*/5 * * * *</code>（5分おき）</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">実用パターン15選</h2>
        <p className="text-muted-foreground leading-relaxed">
          実務でよく使うCron式のパターンをまとめました。コピーしてそのまま使えます。
        </p>
        <div className="overflow-x-auto mt-4">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">用途</th>
                <th className="text-left py-2 pr-4">Cron式</th>
                <th className="text-left py-2">説明</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">毎日9時</td>
                <td className="py-2 pr-4 font-mono text-foreground">0 9 * * *</td>
                <td className="py-2">朝の定時バッチに最適</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">毎週月曜9時</td>
                <td className="py-2 pr-4 font-mono text-foreground">0 9 * * 1</td>
                <td className="py-2">週次レポートの送信に</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">毎月1日の0時</td>
                <td className="py-2 pr-4 font-mono text-foreground">0 0 1 * *</td>
                <td className="py-2">月次集計・請求処理に</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">5分おき</td>
                <td className="py-2 pr-4 font-mono text-foreground">*/5 * * * *</td>
                <td className="py-2">死活監視・ヘルスチェック</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">1時間おき</td>
                <td className="py-2 pr-4 font-mono text-foreground">0 * * * *</td>
                <td className="py-2">データ同期・キャッシュ更新</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">営業日のみ9時</td>
                <td className="py-2 pr-4 font-mono text-foreground">0 9 * * 1-5</td>
                <td className="py-2">平日（月〜金）のみ実行</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">週末のみ10時</td>
                <td className="py-2 pr-4 font-mono text-foreground">0 10 * * 0,6</td>
                <td className="py-2">土日のみ実行</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">毎日深夜3時</td>
                <td className="py-2 pr-4 font-mono text-foreground">0 3 * * *</td>
                <td className="py-2">DBバックアップ・ログローテーション</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">15分おき</td>
                <td className="py-2 pr-4 font-mono text-foreground">*/15 * * * *</td>
                <td className="py-2">API ポーリング・メトリクス収集</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">毎年1月1日0時</td>
                <td className="py-2 pr-4 font-mono text-foreground">0 0 1 1 *</td>
                <td className="py-2">年次リセット・ライセンス更新</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">四半期初日</td>
                <td className="py-2 pr-4 font-mono text-foreground">0 0 1 1,4,7,10 *</td>
                <td className="py-2">四半期ごとのレポート生成</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">毎日9時と18時</td>
                <td className="py-2 pr-4 font-mono text-foreground">0 9,18 * * *</td>
                <td className="py-2">朝夕の通知配信に</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">30分おき（営業時間内）</td>
                <td className="py-2 pr-4 font-mono text-foreground">*/30 9-17 * * 1-5</td>
                <td className="py-2">業務時間中のみ定期チェック</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">毎月15日と末日</td>
                <td className="py-2 pr-4 font-mono text-foreground">0 0 15,28-31 * *</td>
                <td className="py-2">給与・経費の締め処理</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">毎分（テスト用）</td>
                <td className="py-2 pr-4 font-mono text-foreground">* * * * *</td>
                <td className="py-2">動作確認時のみ使用</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">クラウド環境でのCron</h2>
        <p className="text-muted-foreground leading-relaxed">
          主要なクラウドサービスはCron式の構文をサポートしており、サーバーレスで定期実行タスクを運用できます。
          それぞれのサービスには固有の拡張構文や制約があるため、移行時には注意が必要です。
        </p>
        <div className="space-y-4 not-prose mt-4">
          <div className="bg-muted/50 rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">AWS EventBridge（旧CloudWatch Events）</h3>
            <p className="text-muted-foreground text-sm">
              6フィールド形式（秒を含まない代わりに年フィールドが追加）を採用。<code className="bg-muted px-1 rounded">rate(5 minutes)</code>のような自然言語風の指定も可能です。
              Lambda関数やStep Functionsとの連携が容易で、サーバーレスアーキテクチャの定期実行に最適です。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">Google Cloud Scheduler</h3>
            <p className="text-muted-foreground text-sm">
              標準の5フィールドCron式をそのまま使用できます。タイムゾーン指定（<code className="bg-muted px-1 rounded">Asia/Tokyo</code>）に対応しており、JSTでの指定が直感的に行えます。
              HTTP・Pub/Sub・App Engineをターゲットに実行できます。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-5">
            <h3 className="font-semibold text-foreground mb-2">GitHub Actions</h3>
            <p className="text-muted-foreground text-sm">
              ワークフローファイルの<code className="bg-muted px-1 rounded">on.schedule</code>でCron式を指定します。
              タイムゾーンはUTC固定のため、JSTで設定したい場合は-9時間の変換が必要です。
              最短間隔は5分ですが、負荷状況により遅延が発生する場合があります。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">日本時間（JST）とUTCの注意点</h2>
        <p className="text-muted-foreground leading-relaxed">
          Cron式でもっとも多いミスが、タイムゾーンの変換間違いです。
          日本標準時（JST）はUTC+9のため、UTCベースのシステムで日本時間の9時に実行したい場合は、0時（UTC）を指定する必要があります。
        </p>
        <div className="overflow-x-auto mt-4">
          <table className="text-sm border-collapse w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">日本時間（JST）</th>
                <th className="text-left py-2 pr-4">UTC</th>
                <th className="text-left py-2">Cron式（UTC環境用）</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">毎日 9:00 JST</td>
                <td className="py-2 pr-4">毎日 0:00 UTC</td>
                <td className="py-2 font-mono text-foreground">0 0 * * *</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">毎日 12:00 JST</td>
                <td className="py-2 pr-4">毎日 3:00 UTC</td>
                <td className="py-2 font-mono text-foreground">0 3 * * *</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">毎日 18:00 JST</td>
                <td className="py-2 pr-4">毎日 9:00 UTC</td>
                <td className="py-2 font-mono text-foreground">0 9 * * *</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">毎日 0:00 JST</td>
                <td className="py-2 pr-4">前日 15:00 UTC</td>
                <td className="py-2 font-mono text-foreground">0 15 * * *</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-4">
          日付をまたぐ変換では曜日指定にも影響が出るため、特に注意が必要です。
          例えば「毎週月曜の朝2時（JST）」をUTCで表すと「日曜の17時」になり、曜日が1日ずれます。
          タイムゾーン指定に対応したサービス（Google Cloud Schedulerなど）では、<code className="bg-muted px-1.5 py-0.5 rounded text-sm">Asia/Tokyo</code>を直接指定することで変換ミスを防げます。
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">tools24.jpのCron式ビルダーで組み立てる</h2>
        <p className="text-muted-foreground leading-relaxed">
          Cron式を手書きすると、フィールドの順番を間違えたり、特殊文字の組み合わせでミスが発生しがちです。
          tools24.jpのCron式ビルダーを使えば、GUIで条件を選択するだけで正確なCron式を生成できます。
          次回実行日時のプレビュー機能もあるので、意図したスケジュール通りに動くかをその場で確認できます。
        </p>
        <p className="mt-4">
          <Link
            href="/dev/cron-expression-builder"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Cron式ビルダーを使う →
          </Link>
        </p>

        <h2 className="text-xl font-bold text-foreground mt-10 mb-4">関連ガイド</h2>
        <ul className="text-muted-foreground leading-relaxed space-y-1 list-disc list-inside">
          <li>
            <Link href="/guide/regex-beginners" className="text-primary hover:underline">
              正規表現の基本ガイド
            </Link>
            {" "}— 正規表現の構文と実用パターンを解説
          </li>
          <li>
            <Link href="/guide/dummy-data-testing" className="text-primary hover:underline">
              ダミーデータ活用ガイド
            </Link>
            {" "}— テスト用データの生成と活用法
          </li>
        </ul>
      </article>

      <AdPlaceholder position="content" className="mt-8" />
      <FAQSection faqs={faqs} />
    </>
  );
}
