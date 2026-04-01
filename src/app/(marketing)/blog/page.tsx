import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "\u30d6\u30ed\u30b0",
  description: "A2A\u30d7\u30ed\u30c8\u30b3\u30eb\u3068\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u958b\u767a\u306b\u95a2\u3059\u308b\u8a18\u4e8b",
};

const articles = [
  {
    slug: "what-is-a2a-agent-card",
    title: "A2A\u30d7\u30ed\u30c8\u30b3\u30eb\u306e\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u30ab\u30fc\u30c9\uff08Agent Card\uff09\u3068\u306f",
    description:
      "Agent Card\u306e\u6982\u8981\u30fb\u69cb\u9020\u30fb\u8a2d\u7f6e\u65b9\u6cd5\u3092\u89e3\u8aac\u3002A2A\u3068MCP\u306e\u9055\u3044\u3082\u3002",
    date: "2026-03-30",
  },
];

export default function BlogIndex(): JSX.Element {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-12">
      <h1 className="font-sora font-semibold text-[22px] text-sumi tracking-tight">
        {"\u30d6\u30ed\u30b0"}
      </h1>
      <div className="mt-6 space-y-4">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="block border border-washi rounded-[4px] p-4 hover:bg-washi-light transition-colors"
          >
            <time className="font-mono text-[10px] text-fude-muted">
              {article.date}
            </time>
            <h2 className="mt-1 font-sora font-semibold text-[14px] text-sumi">
              {article.title}
            </h2>
            <p className="mt-1 text-[12px] text-fude">{article.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
