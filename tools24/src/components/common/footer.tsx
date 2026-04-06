import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { ClearDataButton } from "@/components/common/clear-data-button";

const toolLinks = [
  { label: "JSON整形ツール", href: "/dev/json-formatter" },
  { label: "文字化け修正", href: "/mojibake-fixer" },
  { label: "画像圧縮・リサイズ", href: "/image-compressor" },
  { label: "文字数カウンター", href: "/character-counter" },
  { label: "ダミーデータ生成", href: "/dev/dummy-data-generator" },
  { label: "正規表現テスター", href: "/dev/regex-tester" },
  { label: "エンコード・デコード", href: "/dev/encode-decode" },
  { label: "すべてのツールを見る →", href: "/" },
];

const kakuteiLinks = [
  { label: "確定申告ツール一覧", href: "/kakutei" },
  { label: "所得税シミュレーター", href: "/kakutei/income-tax" },
  { label: "医療費控除", href: "/kakutei/medical" },
  { label: "ふるさと納税 控除上限", href: "/kakutei/furusato" },
  { label: "副業の確定申告ナビ", href: "/kakutei/side-job" },
  { label: "住宅ローン控除", href: "/kakutei/housing-loan" },
];

const siteLinks = [
  { label: "プライバシーポリシー", href: "/privacy" },
  { label: "運営者情報", href: "/about" },
  { label: "お問い合わせ", href: "/contact" },
  { label: "免責事項", href: "/terms" },
];

function FooterLinkList({ title, links }: { title: string; links: { label: string; href: string }[] }): React.ReactElement {
  return (
    <div>
      <h3 className="font-semibold text-sm mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer(): React.ReactElement {
  return (
    <footer className="border-t bg-muted/40 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <FooterLinkList title="ツール" links={toolLinks} />
          <FooterLinkList title="確定申告ツール" links={kakuteiLinks} />

          <div>
            <FooterLinkList title="サイト情報" links={siteLinks} />
            <div className="mt-6">
              <h3 className="font-semibold text-sm mb-2">ご注意</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                全ての処理はブラウザ内で完結します。入力データが外部に送信されることはありません。確定申告ツールの計算結果は概算です。正式な申告は国税庁の
                <a href="https://www.e-tax.nta.go.jp/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">e-Tax</a>
                をご利用ください。当サイトは税務・法務の専門的なアドバイスを提供するものではありません。
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <p>&copy; 2026 tools24.jp</p>
          <div className="flex items-center gap-4">
            <ClearDataButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
