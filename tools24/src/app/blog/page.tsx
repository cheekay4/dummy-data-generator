import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { AdPlaceholder } from "@/components/common/ad-placeholder";

export const metadata: Metadata = {
  title: "開発者ノート — Web開発・業務効率化のTips | tools24.jp",
  description:
    "tools24.jpの開発者が、Web開発のTips、業務効率化のノウハウ、確定申告の豆知識を発信するブログです。",
  alternates: { canonical: "/blog" },
};

const articles = [
  {
    title: "ブラウザ完結ツール vs デスクトップアプリ",
    href: "/blog/browser-tools-vs-desktop",
    description:
      "個人開発者が「ブラウザ完結」を選ぶ理由と、その技術的なメリット・デメリットを解説。",
    badge: "開発裏話",
    date: "2026-03-29",
  },
  {
    title: "フリーランス1年目の確定申告でやりがちな5つのミス",
    href: "/blog/freelance-kakutei-tips",
    description:
      "経費の保管漏れ・青色申告の届出忘れなど、フリーランス初心者がやりがちなミスと対策。",
    badge: "確定申告",
    date: "2026-03-29",
  },
  {
    title: "tools24.jp開発ストーリー",
    href: "/blog/tools24-dev-story",
    description:
      "24本のツールを個人で作って学んだこと。技術スタック選定から設計判断まで。",
    badge: "開発裏話",
    date: "2026-03-29",
  },
];

export default function BlogPage(): React.JSX.Element {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "開発者ノート" },
        ]}
      />

      <section className="text-center py-12 md:py-20">
        <Newspaper className="h-12 w-12 mx-auto text-primary mb-4" />
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          開発者ノート
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Web開発・業務効率化・確定申告のTipsをお届けします
        </p>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link key={article.href} href={article.href}>
              <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{article.badge}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {article.date}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {article.description}
                  </p>
                  <p className="mt-3 text-sm text-primary flex items-center gap-1">
                    記事を読む <ChevronRight className="h-4 w-4" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <AdPlaceholder position="content" className="mt-12" />
    </>
  );
}
