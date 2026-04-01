import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Zap, Code, ArrowRight, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "agentjuku - A2A Agent Card Generator & Validator",
  description:
    "AIエージェントの名刺（Agent Card）をブラウザ上で作成・検証。A2Aプロトコル v1.0準拠。ログイン不要、データ外部送信なし。",
};

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-20">
        {/* Badge */}
        <div className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full overflow-hidden shadow-lg mb-8"
          style={{ background: 'linear-gradient(170deg, #D84835, #D4AF37)' }}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
          <Sparkles size={16} className="text-white relative z-10" />
          <span className="relative z-10 font-mono text-[11px] font-bold text-white tracking-[2.2px] uppercase">
            A2A Agent Card Builder
          </span>
        </div>

        <h1 className="text-center font-sora font-black text-[48px] md:text-[72px] lg:text-[80px] text-white tracking-[-0.04em] leading-[1.05]">
          エージェント開発の
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(165deg, #1E4D7B, #D84835)',
              filter: 'drop-shadow(0 4px 24px rgba(216, 72, 53, 0.3))',
            }}
          >
            新しい標準
          </span>
        </h1>

        <p className="mt-6 text-center text-[17px] md:text-[18px] text-[rgba(255,255,255,0.6)] leading-relaxed max-w-[480px]">
          A2A Agent Cardをブラウザで作成・検証。
          <br />
          ログイン不要、データ送信なし、完全無料。
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/tools/agent-card"
            className="group relative overflow-hidden inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-[17px] font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ background: 'linear-gradient(165deg, #1E4D7B, #D84835)' }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10 inline-flex items-center gap-3">
              Generator を開く
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            href="/tools/agent-card"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-[17px] font-bold text-white bg-[rgba(20,20,20,0.6)] border-2 border-[rgba(255,255,255,0.2)] backdrop-blur-xl hover:bg-[rgba(40,40,40,0.8)] hover:border-[rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300"
          >
            Validator を試す
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[13px] text-[rgba(255,255,255,0.4)]">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
            ブラウザで完結
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D84835]" />
            完全無料
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E4D7B]" />
            ログイン不要
          </span>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-4 md:px-8 pb-24">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "高速な開発体験",
              desc: "ステップバイステップのガイド付きフォームで、複雑なAgent Cardを素早く作成できます。",
              features: ["直感的GUI", "リアルタイムプレビュー", "JSONエクスポート"],
            },
            {
              icon: Shield,
              title: "プライバシー保護",
              desc: "すべての処理はブラウザ内で完結。データは一切サーバーに送信されません。",
              features: ["ログイン不要", "データ送信なし", "オフライン対応"],
            },
            {
              icon: Code,
              title: "仕様準拠検証",
              desc: "A2A仕様に準拠しているか自動検証。エラーや警告を即座に確認できます。",
              features: ["スキーマ検証", "詳細なエラー表示", "ベストプラクティス"],
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-[rgba(20,20,20,0.6)] border-2 border-[rgba(255,255,255,0.1)] rounded-3xl p-10 backdrop-blur-xl hover:border-[rgba(255,255,255,0.2)] transition-all duration-500 group"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
                style={{ background: 'linear-gradient(135deg, #1E4D7B, #D84835)' }}
              >
                <f.icon size={32} className="text-white" />
              </div>
              <h3 className="font-sora font-bold text-[24px] text-white tracking-[-0.01em]">
                {f.title}
              </h3>
              <p className="mt-3 text-[16px] text-[rgba(255,255,255,0.6)] leading-[1.8]">
                {f.desc}
              </p>
              <ul className="mt-5 space-y-2">
                {f.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-[14px] text-[rgba(255,255,255,0.5)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D84835]" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 md:px-8 pb-24">
        <div className="max-w-[800px] mx-auto">
          <div
            className="relative overflow-hidden rounded-3xl p-12 md:p-16 text-center"
            style={{ background: 'linear-gradient(170deg, rgba(30,77,123,0.3), rgba(216,72,53,0.3))' }}
          >
            <div
              className="absolute -inset-4 opacity-20 blur-3xl rounded-3xl pointer-events-none"
              style={{ background: 'linear-gradient(170deg, #1E4D7B, #D84835)' }}
            />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg, #1E4D7B, #D84835)' }}
              >
                <Sparkles size={28} className="text-white" />
              </div>
              <h2 className="font-sora font-black text-[32px] md:text-[40px] text-white tracking-tight">
                今すぐ始めましょう
              </h2>
              <p className="mt-4 text-[16px] text-[rgba(255,255,255,0.6)]">
                A2A Agent Cardの作成から検証まで、すべてがブラウザで完結。
                <br />
                今すぐ無料で始められます。
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/tools/agent-card"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#1E4D7B] font-bold text-[16px] hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Generator を開く
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/blog/what-is-a2a-agent-card"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[rgba(20,20,20,0.6)] border-2 border-[rgba(255,255,255,0.2)] text-white font-bold text-[16px] backdrop-blur-xl hover:bg-[rgba(40,40,40,0.8)] transition-all duration-300"
                >
                  ドキュメントを読む
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
