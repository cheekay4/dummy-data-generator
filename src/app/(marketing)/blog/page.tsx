import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "ブログ",
  description: "A2Aプロトコルとエージェント開発に関する記事",
};

const articles = [
  {
    slug: "what-is-a2a-agent-card",
    title: "A2Aエージェントカードとは？ 完全ガイド",
    description:
      "A2A（Agent-to-Agent）プロトコルは、AIエージェント間の相互運用性を実現するためのオープン標準です。Agent Cardは、このプロトコルの中核となる概念で、エージェントの能力、インターフェース、メタデータを記述する標準化されたJSON文書です。",
    date: "2026年3月30日",
    readTime: "8分",
    category: "TECHNICAL GUIDE",
  },
  {
    slug: "what-is-a2a-agent-card",
    title: "Agent CardのJSON構造を理解する",
    description:
      "Agent Cardの各フィールドの役割と必須要件を詳しく解説します。nameやversionといった基本フィールドから、skillsやcapabilitiesのような複雑なネストされたオブジェクトまで、実例を交えながら説明します。",
    date: "2026年3月28日",
    readTime: "6分",
    category: "TECHNICAL GUIDE",
  },
  {
    slug: "what-is-a2a-agent-card",
    title: "A2A vs MCP: プロトコル比較",
    description:
      "GoogleのA2AプロトコルとAnthropicのMCP（Model Context Protocol）は、どちらもエージェント間通信を扱いますが、異なる目的と設計思想を持っています。それぞれの特徴、ユースケース、技術的な違いを比較します。",
    date: "2026年3月25日",
    readTime: "10分",
    category: "TECHNICAL GUIDE",
  },
];

export default function BlogIndex(): JSX.Element {
  return (
    <div className="max-w-[900px] mx-auto px-4 md:px-8 py-16">
      {/* Hero */}
      <div className="mb-12">
        <div className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full overflow-hidden shadow-lg mb-6"
          style={{ background: 'linear-gradient(170deg, #D84835, #D4AF37)' }}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
          <span className="relative z-10 font-mono text-[11px] font-bold text-white tracking-[2.2px] uppercase">
            Technical Articles
          </span>
        </div>
        <h1 className="font-sora font-black text-[48px] md:text-[64px] text-white tracking-[-0.04em] leading-tight">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(165deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))' }}
          >
            Articles
          </span>
        </h1>
        <p className="mt-3 text-[16px] text-[rgba(255,255,255,0.5)]">
          A2Aプロトコルとエージェント開発の最前線を学ぶ
        </p>
      </div>

      {/* Articles */}
      <div className="space-y-6">
        {articles.map((article, index) => (
          <Link
            key={index}
            href={`/blog/${article.slug}`}
            className="group block bg-[rgba(20,20,20,0.6)] border-2 border-[rgba(255,255,255,0.1)] rounded-3xl p-8 md:p-10 backdrop-blur-xl hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(30,30,30,0.6)] transition-all duration-500"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Category badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D84835] opacity-90" />
                  <span className="font-mono text-[11px] font-bold text-[#D84835] tracking-[1.1px] uppercase">
                    {article.category}
                  </span>
                </div>

                <h2 className="font-sora font-bold text-[24px] md:text-[36px] text-white tracking-[-0.72px] leading-tight group-hover:text-[rgba(255,255,255,0.9)]">
                  {article.title}
                </h2>

                <p className="mt-4 text-[17px] text-[rgba(255,255,255,0.6)] leading-relaxed line-clamp-2">
                  {article.description}
                </p>

                <div className="mt-5 flex items-center gap-6 text-[14px] text-[rgba(255,255,255,0.4)]">
                  <span className="flex items-center gap-2">
                    <Calendar size={14} />
                    {article.date}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#4a5565]" />
                  <span className="flex items-center gap-2">
                    <Clock size={14} />
                    読了時間 {article.readTime}
                  </span>
                </div>
              </div>

              {/* Arrow icon */}
              <div
                className="flex-shrink-0 ml-6 w-16 h-16 rounded-2xl flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #1E4D7B, #D84835)' }}
              >
                <ArrowRight size={24} className="text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16">
        <div
          className="relative overflow-hidden rounded-3xl p-12 text-center"
          style={{ background: 'linear-gradient(170deg, rgba(30,77,123,0.3), rgba(216,72,53,0.3))' }}
        >
          <div
            className="absolute -inset-4 opacity-20 blur-3xl rounded-3xl pointer-events-none"
            style={{ background: 'linear-gradient(170deg, #1E4D7B, #D84835)' }}
          />
          <div className="relative z-10">
            <h2 className="font-sora font-black text-[32px] text-white tracking-tight">
              Agent Cardを作成する
            </h2>
            <p className="mt-3 text-[16px] text-[rgba(255,255,255,0.6)]">
              ブラウザで完結、無料、ログイン不要
            </p>
            <Link
              href="/tools/agent-card"
              className="group relative overflow-hidden inline-flex items-center gap-3 mt-6 px-10 py-5 rounded-2xl text-[17px] font-bold text-white transition-all duration-300 hover:scale-105"
              style={{ background: 'linear-gradient(165deg, #1E4D7B, #D84835)' }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10 inline-flex items-center gap-3">
                Generator を開く
                <ArrowRight size={18} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
