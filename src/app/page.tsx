import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Zap, CheckCircle, ArrowRight, FileJson, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "agentjuku - A2A Agent Card Generator & Validator",
  description:
    "AIエージェントの名刺（Agent Card）をブラウザ上で作成・検証。A2Aプロトコル v1.0準拠。ログイン不要、データ外部送信なし。",
};

export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-kinari">
      <Header />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-16">
        <span className="inline-block px-2.5 py-0.5 border border-washi rounded-[4px] font-mono text-[10px] text-fude tracking-wide">
          A2A Protocol v1.0
        </span>

        <h1 className="mt-6 text-center font-sora font-semibold text-[28px] md:text-[36px] text-sumi tracking-tight leading-snug">
          Agent Card を、
          <br className="hidden md:block" />
          ブラウザだけで。
        </h1>

        <p className="mt-4 text-center text-[13px] md:text-[14px] text-fude leading-relaxed max-w-[420px]">
          ログイン不要。データ外部送信なし。
          <br />
          A2Aエージェントの名刺を今すぐ作成・検証できます。
        </p>

        <Link
          href="/tools/agent-card"
          className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 bg-sumi text-kinari font-sora text-[13px] font-medium rounded-[4px] hover:bg-sumi-light transition-colors"
        >
          はじめる
          <ArrowRight size={14} />
        </Link>
        <p className="mt-2.5 text-[10px] text-fude-muted">
          アカウント登録は不要です
        </p>
      </section>

      {/* Tool Cards */}
      <section className="px-4 pb-16">
        <div className="max-w-[640px] mx-auto grid md:grid-cols-2 gap-4">
          <Link
            href="/tools/agent-card"
            className="group border border-washi rounded-[4px] p-5 bg-kinari-surface hover:bg-washi-light transition-colors"
          >
            <div className="w-8 h-8 flex items-center justify-center border border-washi rounded-[4px] bg-kinari">
              <FileJson size={16} className="text-sumi" />
            </div>
            <h2 className="mt-3 font-sora font-semibold text-[14px] text-sumi">
              Generator
            </h2>
            <p className="mt-1.5 text-[12px] text-fude leading-relaxed">
              ガイド付きフォームで新しいAgent Cardを作成。5つのプリセットテンプレート付き。
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] text-fude group-hover:text-sumi transition-colors">
              作成する <ArrowRight size={11} />
            </span>
          </Link>

          <Link
            href="/tools/agent-card"
            className="group border border-washi rounded-[4px] p-5 bg-kinari-surface hover:bg-washi-light transition-colors"
          >
            <div className="w-8 h-8 flex items-center justify-center border border-washi rounded-[4px] bg-kinari">
              <Search size={16} className="text-sumi" />
            </div>
            <h2 className="mt-3 font-sora font-semibold text-[14px] text-sumi">
              Validator
            </h2>
            <p className="mt-1.5 text-[12px] text-fude leading-relaxed">
              既存のAgent CardをA2A v1.0仕様に照合。エラー・警告・推奨事項を即座に表示。
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] text-fude group-hover:text-sumi transition-colors">
              検証する <ArrowRight size={11} />
            </span>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-16">
        <div className="max-w-[720px] mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "完全プライベート",
              desc: "全処理がブラウザ内で完結。サーバーへのデータ送信ゼロ。",
            },
            {
              icon: Zap,
              title: "即座に開始",
              desc: "アカウント登録もログインも不要。開いた瞬間から使える。",
            },
            {
              icon: CheckCircle,
              title: "A2A v1.0 準拠",
              desc: "Google提唱のA2Aプロトコル最新仕様に完全対応。",
            },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <div className="mx-auto w-9 h-9 flex items-center justify-center border border-washi rounded-[4px] bg-kinari-surface">
                <f.icon size={16} className="text-sumi" />
              </div>
              <h3 className="mt-3 font-sora font-semibold text-[13px] text-sumi">
                {f.title}
              </h3>
              <p className="mt-1.5 text-[11px] text-fude leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What is Agent Card */}
      <section className="px-4 pb-20">
        <div className="max-w-[560px] mx-auto border-t border-washi pt-10">
          <h2 className="font-sora font-semibold text-[16px] text-sumi tracking-tight">
            Agent Card とは
          </h2>
          <p className="mt-3 text-[12px] text-fude leading-relaxed">
            Agent Card は A2A（Agent-to-Agent）プロトコルの中核要素です。
            AIエージェントが自身の能力・接続先・スキルをJSON形式で宣言する「エージェントの名刺」として機能し、
            他のエージェントからの発見と連携を可能にします。
          </p>
          <Link
            href="/blog/what-is-a2a-agent-card"
            className="mt-4 inline-flex items-center gap-1 text-[11px] text-fude hover:text-sumi transition-colors"
          >
            詳しく読む <ArrowRight size={11} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
