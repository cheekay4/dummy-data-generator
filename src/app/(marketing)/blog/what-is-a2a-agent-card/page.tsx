import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Info, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "A2Aエージェントカードとは？ 完全ガイド",
  description:
    "A2Aプロトコル v1.0のAgent Cardの概要・JSON構造・設置方法を解説。MCPとの違いも。",
  openGraph: {
    title: "A2Aエージェントカードとは？ 完全ガイド",
    url: "https://agentjuku.com/blog/what-is-a2a-agent-card",
  },
  alternates: {
    canonical: "https://agentjuku.com/blog/what-is-a2a-agent-card",
  },
};

export default function WhatIsA2AAgentCard(): JSX.Element {
  return (
    <article className="max-w-[900px] mx-auto px-4 md:px-8 py-16">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-[14px] text-[rgba(255,255,255,0.4)] hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        記事一覧に戻る
      </Link>

      {/* Category badge */}
      <div className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full overflow-hidden shadow-lg mb-6"
        style={{ background: 'linear-gradient(170deg, #D84835, #D4AF37)' }}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
        <Sparkles size={14} className="text-white relative z-10" />
        <span className="relative z-10 font-mono text-[11px] font-bold text-white tracking-[2.2px] uppercase">
          Technical Guide
        </span>
      </div>

      <h1 className="font-sora font-black text-[36px] md:text-[48px] text-white tracking-[-0.04em] leading-tight">
        A2Aエージェントカードとは？
        <br />
        完全ガイド
      </h1>

      <div className="mt-4 flex items-center gap-6 text-[14px] text-[rgba(255,255,255,0.4)]">
        <span className="flex items-center gap-2">
          <Calendar size={14} />
          2026年3月30日
        </span>
        <span className="w-1 h-1 rounded-full bg-[#4a5565]" />
        <span className="flex items-center gap-2">
          <Clock size={14} />
          読了時間 8分
        </span>
      </div>

      <div className="mt-12 space-y-10 text-[16px] text-[rgba(255,255,255,0.7)] leading-[1.8]">
        <section>
          <p>
            A2A（Agent-to-Agent）プロトコルは、AIエージェント間の相互運用性を実現するためのオープン標準です。Agent Cardは、このプロトコルの中核となる概念で、エージェントの能力、インターフェース、メタデータを記述する標準化されたJSON文書です。
          </p>
          <p className="mt-4">
            他のAIエージェントがあなたのエージェントを発見し、その能力を理解し、タスクを委譲するための基本情報源となります。
          </p>
        </section>

        <section>
          <h2 className="font-sora font-bold text-[32px] text-white tracking-tight border-b border-[rgba(255,255,255,0.1)] pb-4 mb-6">
            Agent Cardの構造
          </h2>
          <p>
            Agent Cardは以下のような構成を持つJSON文書です。各フィールドは2種類の位置付け、エージェントの基本情報と操作可能なスキル一覧を含みます。
          </p>

          {/* Code block */}
          <div className="mt-6 bg-[rgba(17,24,39,0.6)] border-2 border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3 px-6 py-3 bg-[rgba(31,41,55,0.8)] border-b border-[rgba(255,255,255,0.1)]">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <div className="w-3 h-3 rounded-full bg-[#10b981]" />
              <span className="ml-3 font-mono text-[12px] font-semibold text-[rgba(255,255,255,0.6)]">
                agent-card.json
              </span>
            </div>
            <div className="relative">
              <div
                className="absolute -inset-1 opacity-30 blur-xl rounded-2xl pointer-events-none"
                style={{ background: 'linear-gradient(160deg, #1E4D7B, #D84835)' }}
              />
              <pre className="relative bg-[rgba(17,24,39,0.9)] p-6 font-mono text-[15px] leading-[1.8] text-[#e5e7eb] overflow-x-auto">
{`{
  "name": "email_agent",
  "version": "1.0.0",
  "description": "メール操作を処理するエージェント",
  "provider": {
    "organization": "Example Corp"
  },
  "supportedInterfaces": [...],
  "capabilities": { "streaming": true },
  "defaultInputModes": ["text/plain"],
  "defaultOutputModes": ["text/plain"],
  "skills": [...]
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Table section */}
        <section>
          <div className="mt-6 bg-[rgba(20,20,20,0.6)] border-2 border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden">
            <table className="w-full text-[15px]">
              <thead>
                <tr style={{ background: 'linear-gradient(175deg, rgba(76,29,149,0.3), rgba(219,39,119,0.3))' }}>
                  <th className="text-left px-6 py-4 border-b border-[rgba(255,255,255,0.1)] font-mono text-[11px] font-bold tracking-[1.65px] uppercase text-[rgba(255,255,255,0.7)]">
                    フィールド名
                  </th>
                  <th className="text-left px-6 py-4 border-b border-[rgba(255,255,255,0.1)] font-mono text-[11px] font-bold tracking-[1.65px] uppercase text-[rgba(255,255,255,0.7)]">
                    型
                  </th>
                  <th className="text-left px-6 py-4 border-b border-[rgba(255,255,255,0.1)] font-mono text-[11px] font-bold tracking-[1.65px] uppercase text-[rgba(255,255,255,0.7)]">
                    必須
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["name", "string", true],
                  ["version", "string", false],
                  ["description", "string", true],
                  ["provider", "object", false],
                  ["skills", "array", true],
                ].map(([field, type, required]) => (
                  <tr key={field as string} className="border-t border-[rgba(255,255,255,0.05)]">
                    <td className="px-6 py-4 font-mono text-[15px] font-bold text-[#60a5fa]">{field as string}</td>
                    <td className="px-6 py-4 font-mono text-[15px] text-[rgba(255,255,255,0.6)]">{type as string}</td>
                    <td className="px-6 py-4">
                      {required ? (
                        <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[1.5px] bg-[rgba(251,44,54,0.1)] border border-[rgba(251,44,54,0.3)] text-[#ef4444] rounded-[10px]">
                          必須
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[1.5px] bg-[rgba(106,114,130,0.1)] border border-[rgba(106,114,130,0.3)] text-[rgba(255,255,255,0.5)] rounded-[10px]">
                          任意
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-bold text-[32px] text-white tracking-tight border-b border-[rgba(255,255,255,0.1)] pb-4 mb-6">
            設置方法
          </h2>
          <p>
            Agent Cardは、Webサーバーの
            <code className="font-mono text-[14px] bg-[rgba(17,24,39,0.6)] px-2 py-0.5 rounded-lg border border-[rgba(255,255,255,0.1)]">
              /.well-known/agent-card.json
            </code>
            に配置して公開します。
          </p>
          <ol className="mt-4 space-y-3 list-decimal list-inside text-[rgba(255,255,255,0.6)]">
            <li>ジェネレーターでAgent Cardを作成し、JSONファイルをダウンロード</li>
            <li>/.well-known/ ディレクトリに agent-card.json を配置</li>
            <li>Content-Typeを application/json で配信されるよう設定</li>
          </ol>
        </section>

        <section>
          <h2 className="font-sora font-bold text-[32px] text-white tracking-tight border-b border-[rgba(255,255,255,0.1)] pb-4 mb-6">
            A2A vs MCP 比較
          </h2>
          <p>
            MCP（Model Context Protocol）はAnthropicが提唱するLLMとツール/データソースの接続に特化したプロトコルです。A2Aはエージェント間の対等な連携に焦点を当てています。
          </p>
          <div className="mt-6 bg-[rgba(20,20,20,0.6)] border-2 border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden">
            <table className="w-full text-[15px]">
              <thead>
                <tr style={{ background: 'linear-gradient(175deg, rgba(76,29,149,0.3), rgba(219,39,119,0.3))' }}>
                  <th className="text-left px-6 py-4 border-b border-[rgba(255,255,255,0.1)] font-mono text-[11px] font-bold tracking-[1.65px] uppercase text-[rgba(255,255,255,0.7)]" />
                  <th className="text-left px-6 py-4 border-b border-[rgba(255,255,255,0.1)] font-mono text-[11px] font-bold tracking-[1.65px] uppercase text-[rgba(255,255,255,0.7)]">A2A</th>
                  <th className="text-left px-6 py-4 border-b border-[rgba(255,255,255,0.1)] font-mono text-[11px] font-bold tracking-[1.65px] uppercase text-[rgba(255,255,255,0.7)]">MCP</th>
                </tr>
              </thead>
              <tbody className="text-[rgba(255,255,255,0.6)]">
                {[
                  ["主な目的", "エージェント間の相互運用性", "モデルコンテキスト管理"],
                  ["提唱者", "Google", "Anthropic"],
                  ["公開年", "2025年", "2024年"],
                  ["通信方式", "HTTP API / WebSocket", "stdio/HTTP+SSE"],
                  ["ユースケース", "マルチエージェント連携", "ツール・データソース統合"],
                ].map(([label, a2a, mcp]) => (
                  <tr key={label} className="border-t border-[rgba(255,255,255,0.05)]">
                    <td className="px-6 py-4 font-semibold text-white">{label}</td>
                    <td className="px-6 py-4">{a2a}</td>
                    <td className="px-6 py-4">{mcp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            両プロトコルは相互補完的な関係にあり、コミュニティのフィードバックを得ながら仕様の改善が続けられています。
          </p>
        </section>

        {/* Info Callout */}
        <div className="border-2 border-[rgba(59,130,246,0.3)] rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(170deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1))' }}
        >
          <div className="absolute -inset-1 opacity-20 blur-xl rounded-2xl pointer-events-none"
            style={{ background: 'linear-gradient(170deg, #3b82f6, #9333ea)' }}
          />
          <div className="relative p-8 flex gap-5">
            <div className="flex-shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #9333ea)' }}
            >
              <Info size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-sora font-bold text-[18px] text-[#60a5fa]">重要な情報</h4>
              <p className="mt-2 text-[16px] text-[rgba(96,165,250,0.9)] leading-[1.8]">
                A2Aプロトコルは2025年にGoogleが発表したオープン標準です。現在も仕様の改善が続けられています。
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 p-8 rounded-2xl"
          style={{ background: 'linear-gradient(170deg, rgba(30,77,123,0.2), rgba(216,72,53,0.2))' }}
        >
          <p className="font-sora font-bold text-[18px] text-white">
            今すぐAgent Cardを作成
          </p>
          <p className="mt-2 text-[15px] text-[rgba(255,255,255,0.6)]">
            ブラウザ上で簡単にAgent Cardを生成できます。データ外部送信なし。
          </p>
          <Link
            href="/tools/agent-card"
            className="group relative overflow-hidden inline-flex items-center gap-2 mt-5 px-8 py-4 rounded-2xl text-[15px] font-bold text-white transition-all duration-300 hover:scale-105"
            style={{ background: 'linear-gradient(165deg, #D84835, #D4AF37)' }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10 inline-flex items-center gap-2">
              Agent Card Generatorを開く
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
