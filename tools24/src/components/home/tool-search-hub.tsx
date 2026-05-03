"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  FileWarning,
  Globe,
  Circle,
  FileImage,
  FileCode,
  ArrowRightLeft,
  Braces,
  TextCursorInput,
  Dices,
  Clock,
  CalendarRange,
  ArrowLeftRight,
  Type,
  Languages,
  GitCompare,
  Workflow,
  Sigma,
  Calculator,
  Heart,
  Gift,
  Briefcase,
  Shield,
  Home,
  ListOrdered,
  ListChecks,
  FileText,
  PenLine,
  EyeOff,
  FileSearch,
  ImageDown,
  Smile,
  ExternalLink,
  ArrowRight,
  X,
  type LucideIcon,
} from "lucide-react";
import { useSearchStore } from "@/lib/stores/search-store";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/components/common/toast";

// ── Types ──

type CategoryKey = "tools" | "ai" | "tax";

interface Tool {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  category: CategoryKey;
  keywords: string[];
  external?: boolean;
  price?: string;
}

interface TagDef {
  key: CategoryKey | "all";
  label: string;
  count: number;
}

// ── Constants ──

const CATEGORY_CONFIG: Record<CategoryKey, {
  label: string;
  badgeClass: string;
  iconBgClass: string;
  iconColor: string;
  ctaBtnClass: string;
  cardGlowClass: string;
}> = {
  tools: {
    label: "ツール",
    badgeClass: "bg-blue-500/10 text-blue-400",
    iconBgClass: "bg-blue-500/10",
    iconColor: "text-blue-400",
    ctaBtnClass: "bg-blue-500",
    cardGlowClass: "tool-card-web",
  },
  ai: {
    label: "AIプロツール",
    badgeClass: "bg-violet-500/10 text-violet-400",
    iconBgClass: "bg-violet-500/10",
    iconColor: "text-violet-400",
    ctaBtnClass: "bg-violet-600",
    cardGlowClass: "tool-card-ai",
  },
  tax: {
    label: "確定申告",
    badgeClass: "bg-amber-500/10 text-amber-400",
    iconBgClass: "bg-amber-500/10",
    iconColor: "text-amber-400",
    ctaBtnClass: "bg-amber-600",
    cardGlowClass: "tool-card-tax",
  },
};

const ALL_TOOLS: Tool[] = [
  // ── ツール（利用頻度順） ──
  { title: "JSON整形ツール", href: "/dev/json-formatter", icon: Braces, description: "JSONの整形・検証・変換をブラウザで完結", category: "tools", keywords: ["JSON", "整形", "フォーマット", "バリデーション", "API"] },
  { title: "文字化け修正ツール", href: "/mojibake-fixer", icon: FileWarning, description: "エンコーディング自動判定で文字化けを修復", category: "tools", keywords: ["文字化け", "エンコーディング", "UTF-8", "Shift_JIS", "CSV"] },
  { title: "画像圧縮・リサイズ", href: "/image-compressor", icon: ImageDown, description: "画像の圧縮・リサイズをブラウザで完結", category: "tools", keywords: ["画像", "圧縮", "リサイズ", "トリミング", "crop", "resize", "compress"] },
  { title: "文字数カウンター", href: "/character-counter", icon: Type, description: "文字数・単語数・行数をリアルタイムカウント", category: "tools", keywords: ["文字数", "カウント", "単語", "行数", "バイト", "Twitter"] },
  { title: "全角・半角変換", href: "/zenkaku-hankaku", icon: ArrowRightLeft, description: "全角⇔半角・ひらがな⇔カタカナを一括変換", category: "tools", keywords: ["全角", "半角", "変換", "カタカナ", "ひらがな"] },
  { title: "ダミーデータ生成", href: "/dev/dummy-data-generator", icon: Dices, description: "22種のフィールドで日本語ダミーデータを一括生成", category: "tools", keywords: ["ダミー", "テストデータ", "モック", "CSV", "SQL"] },
  { title: "正規表現テスター", href: "/dev/regex-tester", icon: TextCursorInput, description: "正規表現のリアルタイムテスト・マッチ確認", category: "tools", keywords: ["正規表現", "regex", "マッチ", "置換", "パターン"] },
  { title: "エンコード・デコード", href: "/dev/encode-decode", icon: ArrowLeftRight, description: "Base64・URL・JWT・ハッシュを一括変換", category: "tools", keywords: ["Base64", "URL", "JWT", "ハッシュ", "エンコード"] },
  { title: "WebP変換ツール", href: "/webp-converter", icon: FileImage, description: "PNG・JPG⇔WebPをブラウザで一括変換", category: "tools", keywords: ["WebP", "画像変換", "PNG", "JPG", "圧縮"] },
  { title: "個人情報マスキング", href: "/dev/data-masking", icon: Shield, description: "テキスト中の個人情報を自動検出・マスク", category: "tools", keywords: ["個人情報", "マスキング", "匿名化", "PII", "マスク", "プライバシー"] },
  { title: "電子印鑑作成ツール", href: "/digital-stamp", icon: Circle, description: "名前を入力するだけで印影画像を作成", category: "tools", keywords: ["印鑑", "はんこ", "電子印", "PDF"] },
  { title: "Slack絵文字ジェネレーター", href: "/emoji-generator", icon: Smile, description: "テキスト・画像から128px絵文字を秒速生成。アニメGIF対応", category: "tools", keywords: ["slack", "絵文字", "emoji", "カスタム絵文字", "GIF", "アニメーション", "アイコン"] },
  { title: "コード差分比較（diff）", href: "/diff-checker", icon: GitCompare, description: "2つのコードを比較。関数変更を自動検出", category: "tools", keywords: ["diff", "差分", "比較", "コードレビュー", "関数", "unified"] },
  { title: "和暦・西暦変換", href: "/dev/wareki-converter", icon: CalendarRange, description: "和暦⇔西暦・UNIX時間・ISO8601を相互変換", category: "tools", keywords: ["和暦", "西暦", "令和", "平成", "UNIX"] },
  { title: "ふりがな変換", href: "/furigana-converter", icon: Languages, description: "漢字にふりがなを自動付与。ひらがな・カタカナ・ローマ字変換", category: "tools", keywords: ["ふりがな", "振り仮名", "漢字", "ひらがな", "カタカナ", "ローマ字"] },
  { title: "ファビコン生成ツール", href: "/favicon-generator", icon: Globe, description: "画像・絵文字からファビコン一式を一括生成", category: "tools", keywords: ["ファビコン", "favicon", "アイコン", "画像"] },
  { title: "Cron式ビルダー", href: "/dev/cron-expression-builder", icon: Clock, description: "Cron式を直感的に組み立て、次回実行時刻を確認", category: "tools", keywords: ["cron", "スケジュール", "定期実行", "タスク"] },
  { title: "HTML/CSS/JS 圧縮", href: "/minify-tools", icon: FileCode, description: "ソースコードを圧縮してサイズを最小化", category: "tools", keywords: ["圧縮", "minify", "HTML", "CSS", "JavaScript"] },
  { title: "Mermaidダイアグラム", href: "/mermaid-viewer", icon: Workflow, description: "テキストからフローチャート・シーケンス図を生成", category: "tools", keywords: ["mermaid", "フローチャート", "シーケンス図", "ER図", "ダイアグラム"] },
  { title: "LaTeX/TeX変換", href: "/tex-converter", icon: Sigma, description: "LaTeX数式プレビュー・Markdown相互変換", category: "tools", keywords: ["latex", "tex", "数式", "katex", "markdown", "変換"] },

  // ── AIプロツール ──
  { title: "敬語メールライター", href: "https://keigo-tools.vercel.app", icon: PenLine, description: "AIが敬語メールを自動生成。8テンプレート対応", category: "ai", keywords: ["敬語", "メール", "ビジネス", "AI"], external: true, price: "\u00A5290/月" },
  { title: "契約書チェッカー", href: "https://contract-tools-theta.vercel.app", icon: FileSearch, description: "AIが契約書を分析、12カテゴリのリスクを検出", category: "ai", keywords: ["契約書", "リスク", "チェック", "レビュー", "AI"], external: true, price: "\u00A5490/月" },

  // ── 確定申告ツール ──
  { title: "所得税シミュレーター", href: "/kakutei/income-tax", icon: Calculator, description: "給与・副業の所得税額をかんたん計算", category: "tax", keywords: ["所得税", "税金", "計算", "給与", "年収"] },
  { title: "医療費控除かんたん計算", href: "/kakutei/medical", icon: Heart, description: "医療費の合計から控除額を自動計算", category: "tax", keywords: ["医療費", "控除", "病院", "薬"] },
  { title: "ふるさと納税 控除上限", href: "/kakutei/furusato", icon: Gift, description: "年収から控除上限額の目安を算出", category: "tax", keywords: ["ふるさと納税", "寄附", "控除", "上限"] },
  { title: "副業の確定申告ナビ", href: "/kakutei/side-job", icon: Briefcase, description: "副業収入の申告が必要か判定", category: "tax", keywords: ["副業", "申告", "20万円", "判定"] },
  { title: "生命保険料控除", href: "/kakutei/life-insurance", icon: Shield, description: "保険料から控除額を自動計算", category: "tax", keywords: ["生命保険", "控除", "保険料"] },
  { title: "住宅ローン控除", href: "/kakutei/housing-loan", icon: Home, description: "ローン残高から控除額を計算", category: "tax", keywords: ["住宅ローン", "控除", "ローン", "マイホーム"] },
  { title: "ふるさと納税 管理", href: "/kakutei/furusato-tracker", icon: ListOrdered, description: "寄附先と金額を一覧管理", category: "tax", keywords: ["ふるさと納税", "管理", "寄附"] },
  { title: "必要書類チェックリスト", href: "/kakutei/checklist", icon: ListChecks, description: "あなたに必要な書類を確認", category: "tax", keywords: ["書類", "チェック", "源泉徴収"] },
  { title: "e-Tax入力ガイド", href: "/kakutei/etax-guide", icon: FileText, description: "計算結果をまとめてe-Taxに転記", category: "tax", keywords: ["e-Tax", "電子申告", "入力", "転記"] },
];

const TAGS: TagDef[] = [
  { key: "all", label: "すべて", count: ALL_TOOLS.length },
  { key: "tools", label: "ツール", count: ALL_TOOLS.filter((t) => t.category === "tools").length },
  { key: "ai", label: "AIプロツール", count: ALL_TOOLS.filter((t) => t.category === "ai").length },
  { key: "tax", label: "確定申告", count: ALL_TOOLS.filter((t) => t.category === "tax").length },
];

// ── Helpers ──

function normalizeForSearch(str: string): string {
  return str
    .toLowerCase()
    .replace(/[\u30A1-\u30F6]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
}

// ── Sub-components ──

function HeroSearch(): React.ReactElement {
  const { query, setQuery } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        useSearchStore.getState().setHeroVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return (): void => observer.disconnect();
  }, []);

  return (
    <div className="relative max-w-[560px] mx-auto mt-8">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ツール名や用途で検索..."
        className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500/50 focus:ring-[3px] focus:ring-blue-500/15 transition-all font-[inherit]"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="検索クリア"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function FilterTags({
  activeTag,
  onTagClick,
}: {
  activeTag: CategoryKey | "all";
  onTagClick: (key: CategoryKey | "all") => void;
}): React.ReactElement {
  return (
    <div className="flex justify-center gap-2 flex-wrap mt-6">
      {TAGS.map((tag) => (
        <button
          key={tag.key}
          onClick={() => onTagClick(tag.key)}
          className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-all whitespace-nowrap ${
            activeTag === tag.key
              ? "bg-foreground text-background"
              : "bg-[var(--surface)] text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {tag.label} {tag.count}
        </button>
      ))}
    </div>
  );
}

function FilterResultBar({
  count,
  label,
  onClear,
}: {
  count: number;
  label: string;
  onClear: () => void;
}): React.ReactElement {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
      <span>{count}件のツール — {label}</span>
      <button
        onClick={onClear}
        className="px-2 py-0.5 rounded-md bg-[var(--surface)] text-muted-foreground hover:bg-muted hover:text-foreground text-xs transition-all"
      >
        <X className="inline h-3 w-3 mr-0.5 -mt-px" />
        クリア
      </button>
    </div>
  );
}

function ToolCard({
  tool,
  index,
  isFav,
  onToggleFav,
}: {
  tool: Tool;
  index: number;
  isFav?: boolean;
  onToggleFav?: (id: string) => void;
}): React.ReactElement {
  const config = CATEGORY_CONFIG[tool.category];
  const Icon = tool.icon;
  const isTax = tool.category === "tax";

  const cardContent = (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[var(--surface-hover)] hover:border-[var(--surface-border-hover)] hover:-translate-y-0.5 tool-card-animated h-full flex flex-col ${config.cardGlowClass} ${isTax ? "opacity-70 hover:opacity-100" : ""}`}
      style={{
        animation: `fadeInUp 0.5s ease forwards`,
        animationDelay: `${index * 60}ms`,
        opacity: 0,
      }}
    >
      {/* Top: Icon + Badge + Favorite */}
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.iconBgClass}`}>
          <Icon className={`h-[22px] w-[22px] ${config.iconColor}`} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${config.badgeClass}`}>
            {config.label}
          </span>
          {onToggleFav && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFav(tool.title);
              }}
              className="p-1 rounded-lg transition-transform duration-100 hover:scale-110"
              aria-label={isFav ? "お気に入りから削除" : "お気に入りに追加"}
            >
              <Heart
                className={`h-3.5 w-3.5 transition-colors ${
                  isFav ? "fill-red-500 text-red-500" : "text-muted-foreground/30 hover:text-red-400"
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold mt-4 text-foreground flex items-center gap-1.5">
        {tool.title}
        {tool.external && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
      </h3>

      {/* Description */}
      <p className="text-[13px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">
        {tool.description}
      </p>

      {/* Price (AI tools only) */}
      {tool.price && (
        <p className="text-xs text-violet-400 font-medium mt-2">{tool.price}</p>
      )}

      {/* CTA */}
      <div className="mt-auto pt-4 relative h-9">
        <span className="tool-card-cta-text absolute top-1/2 -translate-y-1/2 text-[13px] font-medium text-blue-400 flex items-center gap-1">
          {tool.external ? "無料で試す" : "使ってみる"}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
        <div className={`tool-card-cta-btn absolute inset-0 rounded-[10px] ${config.ctaBtnClass} text-white text-[13px] font-medium flex items-center justify-center`}>
          {tool.external ? "無料で試す" : "使ってみる"}
        </div>
      </div>
    </div>
  );

  if (tool.external) {
    return (
      <a href={tool.href} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={tool.href} className="block h-full">
      {cardContent}
    </Link>
  );
}

// ── Main Component ──

export function ToolSearchHub(): React.ReactElement {
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const [activeTag, setActiveTag] = useState<CategoryKey | "all">("all");
  const { favorites, toggle: toggleFav, isFavorite, clear: clearFavs } = useFavorites();
  const { show: showToast } = useToast();

  const handleToggleFav = useCallback(
    (id: string): void => {
      const wasFav = isFavorite(id);
      toggleFav(id);
      showToast(wasFav ? "お気に入りを解除しました" : "お気に入りに追加しました");
    },
    [toggleFav, isFavorite, showToast]
  );

  const favTools = useMemo(
    () => ALL_TOOLS.filter((t) => favorites.includes(t.title)),
    [favorites]
  );

  const handleTagClick = useCallback(
    (key: CategoryKey | "all"): void => {
      setActiveTag((prev) => (prev === key ? "all" : key));
      setQuery("");
    },
    [setQuery]
  );

  const handleClear = useCallback((): void => {
    setActiveTag("all");
    setQuery("");
  }, [setQuery]);

  // When user types search, reset tag to "all"
  const effectiveTag = query.trim() ? "all" : activeTag;

  const filtered = useMemo((): Tool[] => {
    const q = query.trim();
    if (q) {
      const normalized = normalizeForSearch(q);
      return ALL_TOOLS.filter((t) => {
        const haystack = normalizeForSearch(
          [t.title, t.description, ...t.keywords].join(" ")
        );
        return haystack.includes(normalized);
      });
    }
    if (activeTag === "all") return ALL_TOOLS;
    return ALL_TOOLS.filter((t) => t.category === activeTag);
  }, [query, activeTag]);

  const resultLabel = useMemo((): string => {
    if (query.trim()) return `「${query}」`;
    if (activeTag !== "all") {
      const tag = TAGS.find((t) => t.key === activeTag);
      return tag ? `#${tag.label}` : "";
    }
    return "";
  }, [query, activeTag]);

  const showResult = query.trim() !== "" || activeTag !== "all";

  return (
    <>
      {/* Hero Search */}
      <HeroSearch />

      {/* Filter Tags */}
      <FilterTags
        activeTag={query.trim() ? "all" : activeTag}
        onTagClick={handleTagClick}
      />

      {/* Favorites Section */}
      {favTools.length > 0 && !query.trim() && activeTag === "all" && (
        <div className="mt-6 max-w-[1024px] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
              よく使うツール
            </h2>
            <button
              onClick={clearFavs}
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              クリア
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favTools.map((tool, i) => (
              <ToolCard key={`fav-${tool.title}`} tool={tool} index={i} isFav onToggleFav={handleToggleFav} />
            ))}
          </div>
        </div>
      )}

      {/* Result Count */}
      {showResult && (
        <FilterResultBar
          count={filtered.length}
          label={resultLabel}
          onClear={handleClear}
        />
      )}

      {/* Tool Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 max-w-[1024px] mx-auto">
        {filtered.map((tool, i) => (
          <ToolCard key={tool.title} tool={tool} index={i} isFav={isFavorite(tool.title)} onToggleFav={handleToggleFav} />
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            「{query}」に一致するツールが見つかりませんでした
          </p>
          <button
            onClick={handleClear}
            className="mt-3 text-sm text-blue-400 hover:underline"
          >
            全ツールを表示
          </button>
        </div>
      )}
    </>
  );
}
