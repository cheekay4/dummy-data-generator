"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef, useCallback } from "react";
import { Sun, Moon, Menu, Search, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSearchStore } from "@/lib/stores/search-store";

// ── Types ──

interface NavItem {
  label: string;
  href: string;
  description?: string;
}

interface NavGroup {
  label: string;
  href: string;
  items: NavItem[];
}

// ── Data ──

const navGroups: NavGroup[] = [
  {
    label: "ツール",
    href: "/",
    items: [
      { label: "JSON整形ツール", href: "/dev/json-formatter", description: "JSONの整形・検証・変換" },
      { label: "文字化け修正", href: "/mojibake-fixer", description: "エンコーディング自動判定で修復" },
      { label: "画像圧縮・リサイズ", href: "/image-compressor", description: "画像の圧縮・リサイズ" },
      { label: "文字数カウンター", href: "/character-counter", description: "文字数・単語数を計測" },
      { label: "全角・半角変換", href: "/zenkaku-hankaku", description: "全角⇔半角を一括変換" },
      { label: "ダミーデータ生成", href: "/dev/dummy-data-generator", description: "日本語テストデータを生成" },
      { label: "正規表現テスター", href: "/dev/regex-tester", description: "正規表現をリアルタイムテスト" },
      { label: "エンコード・デコード", href: "/dev/encode-decode", description: "Base64・URL・JWT変換" },
      { label: "個人情報マスキング", href: "/dev/data-masking", description: "個人情報を自動マスク" },
      { label: "コード差分比較（diff）", href: "/diff-checker", description: "2つのコードを比較" },
      { label: "すべてのツールを見る →", href: "/", description: "全ツール一覧" },
    ],
  },
  {
    label: "AIプロツール",
    href: "/#pro-tools",
    items: [
      { label: "敬語メールライター", href: "https://keigo-tools.vercel.app", description: "AIが敬語メールを自動生成" },
      { label: "契約書チェッカー", href: "https://contract-tools-theta.vercel.app", description: "契約リスクをAI分析" },
    ],
  },
  {
    label: "確定申告ツール",
    href: "/kakutei",
    items: [
      { label: "所得税シミュレーター", href: "/kakutei/income-tax" },
      { label: "医療費控除", href: "/kakutei/medical" },
      { label: "ふるさと納税 控除上限", href: "/kakutei/furusato" },
      { label: "副業の確定申告ナビ", href: "/kakutei/side-job" },
      { label: "生命保険料控除", href: "/kakutei/life-insurance" },
      { label: "住宅ローン控除", href: "/kakutei/housing-loan" },
      { label: "ふるさと納税 管理", href: "/kakutei/furusato-tracker" },
      { label: "必要書類チェックリスト", href: "/kakutei/checklist" },
      { label: "e-Tax入力ガイド", href: "/kakutei/etax-guide" },
    ],
  },
];

// ── Sub-components ──

function MegaMenuItem({ item }: { item: NavItem }): React.ReactElement {
  const isExternal = item.href.startsWith("http");
  const Comp = isExternal ? "a" : Link;
  const extraProps = isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Comp
      href={item.href}
      {...extraProps}
      className="flex flex-col gap-0.5 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
    >
      <span className="text-[13px] font-semibold text-foreground">{item.label}</span>
      {item.description && (
        <span className="text-[11px] text-muted-foreground">{item.description}</span>
      )}
    </Comp>
  );
}

function MegaMenu({ group }: { group: NavGroup }): React.ReactElement {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((): void => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const hideDelayed = useCallback((): void => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hideDelayed}
    >
      <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
        {group.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div
        className={`mega-menu-panel absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-popover border border-border rounded-2xl shadow-2xl p-4 z-[200] min-w-[400px] ${open ? "visible" : ""}`}
        onMouseEnter={show}
        onMouseLeave={hideDelayed}
      >
        <div className={`grid gap-1 ${group.items.length <= 3 ? "grid-cols-1" : "grid-cols-2"}`}>
          {group.items.map((item) => (
            <MegaMenuItem key={item.href} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function HeaderSearch(): React.ReactElement {
  const { query, setQuery, heroVisible } = useSearchStore();

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${
        heroVisible ? "max-h-0 opacity-0" : "max-h-10 opacity-100"
      }`}
    >
      <div className="relative flex items-center">
        <Search className="absolute left-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ツールを検索..."
          className="h-8 w-60 rounded-lg bg-muted border border-border text-foreground text-[13px] pl-8 pr-3 outline-none font-[inherit] transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15"
        />
      </div>
    </div>
  );
}

const mobileNavItems = [
  { label: "ツール一覧", href: "/", icon: "🛠️" },
  { label: "確定申告ツール", href: "/kakutei", icon: "📝" },
  { label: "ガイド記事", href: "/guide", icon: "📖" },
  { label: "開発者ノート", href: "/blog", icon: "💻" },
];

function MobileNav(): React.ReactElement {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="メニュー">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle className="text-lg font-bold">メニュー</SheetTitle>
        <nav className="flex flex-col gap-1 mt-6">
          {mobileNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSheetOpen(false)}
              className="flex items-center gap-3 px-3 py-4 text-lg font-medium text-foreground border-b border-border/50 transition-colors hover:bg-accent"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          {/* AI tools */}
          <div className="mt-4 px-3">
            <p className="text-xs text-muted-foreground mb-2">AIプロツール</p>
            <a
              href="https://keigo-tools.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setSheetOpen(false)}
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              敬語メールライター
            </a>
            <a
              href="https://contract-tools-theta.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setSheetOpen(false)}
              className="block py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              契約書チェッカー
            </a>
          </div>
        </nav>
        <div className="mt-6 pt-4 border-t">
          <span className="text-sm text-muted-foreground">tools24.jp</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Main ──

export function Header(): React.ReactElement {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback((): void => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <header className="sticky top-0 z-50 w-full h-14 backdrop-blur-xl bg-background/80 border-b border-border/50 flex items-center px-6">
      <div className="max-w-[1200px] w-full mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-foreground shrink-0">
          tools24.jp
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navGroups.map((group) => (
            <MegaMenu key={group.label} group={group} />
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <HeaderSearch />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="テーマ切替"
            className="h-8 w-8"
          >
            {mounted && (theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            ))}
          </Button>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
