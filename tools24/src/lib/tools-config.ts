import type { LucideIcon } from "lucide-react";
import {
  Image,
  Type,
  Languages,
  ArrowRightLeft,
  FileWarning,
  Stamp,
  ImageIcon,
  FileImage,
  Minimize2,
  Braces,
  Code,
  LayoutGrid,
  Clock,
  Calendar,
  Lock,
  Shield,
  FileSearch,
  Mail,
  DollarSign,
  Activity,
  Home,
  Briefcase,
  Heart,
  Building,
  ListChecks,
  ClipboardCheck,
  FileText,
} from "lucide-react";

export interface ToolDef {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  category: "tools" | "ai" | "kakutei";
  subgroup?: "web" | "dev";
  status: "live" | "coming-soon";
  external?: boolean;
  keywords: string[];
}

export const allTools: ToolDef[] = [
  // ── ツール > Web系 ──
  {
    id: "image-compressor",
    title: "画像圧縮・リサイズ",
    description: "PNG/JPG/WebP画像をブラウザで圧縮・リサイズ",
    href: "/image-compressor",
    icon: Image,
    category: "tools",
    subgroup: "web",
    status: "live",
    keywords: ["画像", "圧縮", "リサイズ", "png", "jpg", "webp", "image", "compress"],
  },
  {
    id: "character-counter",
    title: "文字数カウンター",
    description: "文字数・単語数・行数をリアルタイムカウント",
    href: "/character-counter",
    icon: Type,
    category: "tools",
    subgroup: "web",
    status: "live",
    keywords: ["文字数", "カウント", "単語", "行数", "バイト", "character", "count"],
  },
  {
    id: "furigana-converter",
    title: "ふりがな変換",
    description: "漢字にふりがなを自動付与。ひらがな・カタカナ・ローマ字変換",
    href: "/furigana-converter",
    icon: Languages,
    category: "tools",
    subgroup: "web",
    status: "live",
    keywords: ["ふりがな", "振り仮名", "漢字", "ひらがな", "カタカナ", "ローマ字", "furigana"],
  },
  {
    id: "zenkaku-hankaku",
    title: "全角・半角変換",
    description: "全角⇔半角を一括変換",
    href: "/zenkaku-hankaku",
    icon: ArrowRightLeft,
    category: "tools",
    subgroup: "web",
    status: "coming-soon",
    keywords: ["全角", "半角", "変換", "zenkaku", "hankaku"],
  },
  {
    id: "mojibake-fixer",
    title: "文字化け修正ツール",
    description: "文字化けしたテキストを自動修復",
    href: "/mojibake-fixer",
    icon: FileWarning,
    category: "tools",
    subgroup: "web",
    status: "coming-soon",
    keywords: ["文字化け", "修復", "エンコーディング", "mojibake"],
  },
  {
    id: "digital-stamp",
    title: "電子印鑑作成ツール",
    description: "ビジネス用の電子印鑑をブラウザで作成",
    href: "/digital-stamp",
    icon: Stamp,
    category: "tools",
    subgroup: "web",
    status: "coming-soon",
    keywords: ["印鑑", "電子印鑑", "ハンコ", "stamp"],
  },
  {
    id: "favicon-generator",
    title: "ファビコン一括生成",
    description: "画像からファビコンを一括生成",
    href: "/favicon-generator",
    icon: ImageIcon,
    category: "tools",
    subgroup: "web",
    status: "coming-soon",
    keywords: ["ファビコン", "favicon", "アイコン", "icon"],
  },
  {
    id: "webp-converter",
    title: "WebP変換ツール",
    description: "画像をWebP形式に変換",
    href: "/webp-converter",
    icon: FileImage,
    category: "tools",
    subgroup: "web",
    status: "coming-soon",
    keywords: ["webp", "変換", "画像", "convert"],
  },
  {
    id: "minify-tools",
    title: "HTML/CSS/JS 圧縮",
    description: "HTML・CSS・JavaScriptのコードを圧縮",
    href: "/minify-tools",
    icon: Minimize2,
    category: "tools",
    subgroup: "web",
    status: "coming-soon",
    keywords: ["圧縮", "minify", "html", "css", "javascript", "js"],
  },

  // ── ツール > 開発者系 ──
  {
    id: "json-formatter",
    title: "JSON整形ツール",
    description: "JSONの整形・圧縮・変換をブラウザだけで",
    href: "/json-formatter",
    icon: Braces,
    category: "tools",
    subgroup: "dev",
    status: "live",
    keywords: ["json", "整形", "フォーマット", "圧縮", "変換", "formatter"],
  },
  {
    id: "regex-tester",
    title: "正規表現テスター",
    description: "正規表現をリアルタイムでテスト・解説",
    href: "/regex-tester",
    icon: Code,
    category: "tools",
    subgroup: "dev",
    status: "live",
    keywords: ["正規表現", "regex", "テスト", "マッチ", "pattern"],
  },
  {
    id: "dummy-data-generator",
    title: "ダミーデータ生成",
    description: "日本のリアルなテストデータを瞬時に生成",
    href: "/dummy-data-generator",
    icon: LayoutGrid,
    category: "tools",
    subgroup: "dev",
    status: "live",
    keywords: ["ダミー", "テストデータ", "生成", "dummy", "data", "generator"],
  },
  {
    id: "cron-expression-builder",
    title: "Cron式ビルダー",
    description: "Cron式を日本語で組み立て・解説",
    href: "/cron-expression-builder",
    icon: Clock,
    category: "tools",
    subgroup: "dev",
    status: "live",
    keywords: ["cron", "クーロン", "スケジュール", "定期実行"],
  },
  {
    id: "wareki-converter",
    title: "和暦・西暦変換",
    description: "令和・平成・昭和と西暦・UNIX時間を一括変換",
    href: "/wareki-converter",
    icon: Calendar,
    category: "tools",
    subgroup: "dev",
    status: "live",
    keywords: ["和暦", "西暦", "令和", "平成", "昭和", "変換", "wareki"],
  },
  {
    id: "encode-decode",
    title: "エンコード・デコード",
    description: "Base64・URL・JWT・ハッシュ・Unicode変換",
    href: "/encode-decode",
    icon: Lock,
    category: "tools",
    subgroup: "dev",
    status: "live",
    keywords: ["エンコード", "デコード", "base64", "url", "jwt", "hash", "unicode"],
  },
  {
    id: "data-masking",
    title: "個人情報マスキング",
    description: "個人情報を安全にマスキング・匿名化",
    href: "/dev/data-masking",
    icon: Shield,
    category: "tools",
    subgroup: "dev",
    status: "live",
    keywords: ["マスキング", "個人情報", "匿名化", "masking", "privacy"],
  },

  // ── AIツール（外部リンク） ──
  {
    id: "contract-checker",
    title: "契約書チェッカー",
    description: "AIが契約書のリスクを自動分析",
    href: "https://contract.tools24.jp",
    icon: FileSearch,
    category: "ai",
    status: "live",
    external: true,
    keywords: ["契約書", "チェック", "リスク", "AI", "contract"],
  },
  {
    id: "keigo-writer",
    title: "敬語メールライター",
    description: "AIが敬語メールを自動生成",
    href: "https://keigo.tools24.jp",
    icon: Mail,
    category: "ai",
    status: "live",
    external: true,
    keywords: ["敬語", "メール", "ビジネス", "AI", "keigo"],
  },
  {
    id: "masking-ai",
    title: "個人情報マスキング AI",
    description: "AIで個人情報を検出・マスキング",
    href: "https://masking.tools24.jp",
    icon: Shield,
    category: "ai",
    status: "live",
    external: true,
    keywords: ["マスキング", "AI", "個人情報", "検出"],
  },

  // ── 確定申告ツール ──
  {
    id: "income-tax",
    title: "所得税シミュレーター",
    description: "年収から所得税・住民税を試算",
    href: "/kakutei/income-tax",
    icon: DollarSign,
    category: "kakutei",
    status: "live",
    keywords: ["所得税", "住民税", "税金", "シミュレーター", "年収"],
  },
  {
    id: "medical",
    title: "医療費控除かんたん計算",
    description: "医療費控除の対象額と還付金を計算",
    href: "/kakutei/medical",
    icon: Activity,
    category: "kakutei",
    status: "live",
    keywords: ["医療費", "控除", "還付金", "確定申告"],
  },
  {
    id: "furusato",
    title: "ふるさと納税 控除上限",
    description: "ふるさと納税の控除上限額を計算",
    href: "/kakutei/furusato",
    icon: Home,
    category: "kakutei",
    status: "live",
    keywords: ["ふるさと納税", "控除", "上限", "寄附"],
  },
  {
    id: "side-job",
    title: "副業の確定申告ナビ",
    description: "副業収入の申告方法をナビゲート",
    href: "/kakutei/side-job",
    icon: Briefcase,
    category: "kakutei",
    status: "live",
    keywords: ["副業", "確定申告", "申告", "収入"],
  },
  {
    id: "life-insurance",
    title: "生命保険料控除",
    description: "生命保険料の控除額を計算",
    href: "/kakutei/life-insurance",
    icon: Heart,
    category: "kakutei",
    status: "live",
    keywords: ["生命保険", "控除", "保険料"],
  },
  {
    id: "housing-loan",
    title: "住宅ローン控除",
    description: "住宅ローン控除の対象額を計算",
    href: "/kakutei/housing-loan",
    icon: Building,
    category: "kakutei",
    status: "live",
    keywords: ["住宅ローン", "控除", "住宅"],
  },
  {
    id: "furusato-tracker",
    title: "ふるさと納税 管理",
    description: "ふるさと納税の寄附先・金額を管理",
    href: "/kakutei/furusato-tracker",
    icon: ListChecks,
    category: "kakutei",
    status: "live",
    keywords: ["ふるさと納税", "管理", "寄附", "トラッカー"],
  },
  {
    id: "checklist",
    title: "必要書類チェックリスト",
    description: "確定申告に必要な書類をチェック",
    href: "/kakutei/checklist",
    icon: ClipboardCheck,
    category: "kakutei",
    status: "live",
    keywords: ["書類", "チェックリスト", "確定申告", "必要書類"],
  },
  {
    id: "etax-guide",
    title: "e-Tax入力ガイド",
    description: "e-Taxの入力手順をステップごとにガイド",
    href: "/kakutei/etax-guide",
    icon: FileText,
    category: "kakutei",
    status: "live",
    keywords: ["e-tax", "入力", "ガイド", "電子申告"],
  },
];

export function getToolsByCategory(category: ToolDef["category"]): ToolDef[] {
  return allTools.filter((t) => t.category === category);
}

export function getToolsBySubgroup(subgroup: "web" | "dev"): ToolDef[] {
  return allTools.filter((t) => t.subgroup === subgroup);
}

export function getLiveInternalTools(): ToolDef[] {
  return allTools.filter((t) => t.status === "live" && !t.external);
}

export function searchTools(query: string): ToolDef[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return allTools.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
  );
}
