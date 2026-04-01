import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "A2A\u30d7\u30ed\u30c8\u30b3\u30eb\u306e\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u30ab\u30fc\u30c9\uff08Agent Card\uff09\u3068\u306f",
  description:
    "A2A\u30d7\u30ed\u30c8\u30b3\u30eb v1.0\u306eAgent Card\u306e\u6982\u8981\u30fbJSON\u69cb\u9020\u30fb\u8a2d\u7f6e\u65b9\u6cd5\u3092\u89e3\u8aac\u3002MCP\u3068\u306e\u9055\u3044\u3082\u3002",
  openGraph: {
    title:
      "A2A\u30d7\u30ed\u30c8\u30b3\u30eb\u306e\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u30ab\u30fc\u30c9\uff08Agent Card\uff09\u3068\u306f",
    url: "https://agentjuku.com/blog/what-is-a2a-agent-card",
  },
  alternates: {
    canonical: "https://agentjuku.com/blog/what-is-a2a-agent-card",
  },
};

export default function WhatIsA2AAgentCard(): JSX.Element {
  return (
    <article className="max-w-[800px] mx-auto px-4 py-12">
      <time className="font-mono text-[10px] text-fude-muted">2026-03-30</time>
      <h1 className="mt-2 font-sora font-semibold text-[22px] text-sumi tracking-tight leading-snug">
        A2A{"\u30d7\u30ed\u30c8\u30b3\u30eb\u306e\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u30ab\u30fc\u30c9\uff08Agent Card\uff09\u3068\u306f"}
      </h1>

      <div className="mt-8 space-y-6 text-[13px] text-sumi leading-relaxed">
        <section>
          <h2 className="font-sora font-semibold text-[16px] mb-3">
            Agent Card{"\u306e\u6982\u8981"}
          </h2>
          <p>
            Agent Card{"\u306f\u3001"}A2A{"\uff08Agent-to-Agent\uff09\u30d7\u30ed\u30c8\u30b3\u30eb v1.0\u306e\u4e2d\u6838\u8981\u7d20\u3067\u3059\u3002AI\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u304c\u81ea\u8eab\u306e\u80fd\u529b\u30fb\u63a5\u7d9a\u5148\u30fb\u8a8d\u8a3c\u60c5\u5831\u3092JSON\u5f62\u5f0f\u3067\u5ba3\u8a00\u3059\u308b\u300c\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306e\u540d\u523a\u300d\u3068\u3057\u3066\u6a5f\u80fd\u3057\u307e\u3059\u3002"}
          </p>
          <p className="mt-2">
            {"\u4ed6\u306eAI\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u304c\u3042\u306a\u305f\u306e\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u767a\u898b\u3057\u3001\u305d\u306e\u80fd\u529b\u3092\u7406\u89e3\u3057\u3001\u30bf\u30b9\u30af\u3092\u59d4\u8b72\u3059\u308b\u305f\u3081\u306e\u57fa\u672c\u60c5\u5831\u6e90\u3068\u306a\u308a\u307e\u3059\u3002"}
          </p>
        </section>

        <section>
          <h2 className="font-sora font-semibold text-[16px] mb-3">
            JSON{"\u69cb\u9020"}
          </h2>
          <p>
            Agent Card{"\u306fJSON\u5f62\u5f0f\u3067\u8a18\u8ff0\u3055\u308c\u3001\u4ee5\u4e0b\u306e\u4e3b\u8981\u30d5\u30a3\u30fc\u30eb\u30c9\u3067\u69cb\u6210\u3055\u308c\u307e\u3059\u3002"}
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-[12px] border border-washi">
              <thead>
                <tr className="bg-kinari-warm">
                  <th className="text-left px-3 py-2 border-b border-washi font-mono text-[10px]">
                    {"\u30d5\u30a3\u30fc\u30eb\u30c9"}
                  </th>
                  <th className="text-left px-3 py-2 border-b border-washi font-mono text-[10px]">
                    {"\u5fc5\u9808"}
                  </th>
                  <th className="text-left px-3 py-2 border-b border-washi font-mono text-[10px]">
                    {"\u8aac\u660e"}
                  </th>
                </tr>
              </thead>
              <tbody className="text-fude">
                {[
                  ["name", "Yes", "\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u540d"],
                  ["description", "Yes", "\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u306e\u8aac\u660e"],
                  ["version", "Yes", "\u30bb\u30de\u30f3\u30c6\u30a3\u30c3\u30af\u30d0\u30fc\u30b8\u30e7\u30cb\u30f3\u30b0\uff08\u4f8b: 1.0.0\uff09"],
                  ["supportedInterfaces", "Yes", "\u63a5\u7d9a\u5148URL\u30fb\u30d7\u30ed\u30c8\u30b3\u30eb\u30d0\u30a4\u30f3\u30c7\u30a3\u30f3\u30b0"],
                  ["capabilities", "Yes", "\u30b9\u30c8\u30ea\u30fc\u30df\u30f3\u30b0\u30fb\u30d7\u30c3\u30b7\u30e5\u901a\u77e5\u306e\u5bfe\u5fdc\u72b6\u6cc1"],
                  ["skills", "Yes", "\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u304c\u63d0\u4f9b\u3059\u308b\u30b9\u30ad\u30eb\u4e00\u89a7"],
                  ["defaultInputModes", "Yes", "\u30c7\u30d5\u30a9\u30eb\u30c8\u5165\u529b\u5f62\u5f0f\uff08\u4f8b: text/plain\uff09"],
                  ["defaultOutputModes", "Yes", "\u30c7\u30d5\u30a9\u30eb\u30c8\u51fa\u529b\u5f62\u5f0f"],
                  ["provider", "No", "\u30d7\u30ed\u30d0\u30a4\u30c0\u30fc\u60c5\u5831\uff08\u7d44\u7e54\u540d\u30fbURL\uff09"],
                  ["documentationUrl", "No", "\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8URL"],
                  ["iconUrl", "No", "\u30a2\u30a4\u30b3\u30f3URL"],
                ].map(([field, required, desc]) => (
                  <tr key={field} className="border-b border-washi">
                    <td className="px-3 py-1.5 font-mono text-[11px] text-sumi">{field}</td>
                    <td className="px-3 py-1.5">{required}</td>
                    <td className="px-3 py-1.5">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-sora font-semibold text-[16px] mb-3">
            {"\u8a2d\u7f6e\u65b9\u6cd5"}
          </h2>
          <p>
            Agent Card{"\u306f\u3001Web\u30b5\u30fc\u30d0\u30fc\u306e"}
            <code className="font-mono text-[11px] bg-washi px-1 py-0.5 rounded-[2px]">
              /.well-known/agent-card.json
            </code>
            {"\u306b\u914d\u7f6e\u3057\u3066\u516c\u958b\u3057\u307e\u3059\u3002"}
          </p>
          <ol className="mt-3 space-y-2 list-decimal list-inside text-fude">
            <li>{"\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc\u3067Agent Card\u3092\u4f5c\u6210\u3057\u3001JSON\u30d5\u30a1\u30a4\u30eb\u3092\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9"}</li>
            <li>
              <code className="font-mono text-[11px] bg-washi px-1 py-0.5 rounded-[2px]">
                /.well-known/
              </code>
              {"\u30c7\u30a3\u30ec\u30af\u30c8\u30ea\u306b"}
              <code className="font-mono text-[11px] bg-washi px-1 py-0.5 rounded-[2px]">
                agent-card.json
              </code>
              {"\u3092\u914d\u7f6e"}
            </li>
            <li>
              Content-Type{"\u3092"}
              <code className="font-mono text-[11px] bg-washi px-1 py-0.5 rounded-[2px]">
                application/json
              </code>
              {"\u3067\u914d\u4fe1\u3055\u308c\u308b\u3088\u3046\u8a2d\u5b9a"}
            </li>
          </ol>
        </section>

        <section>
          <h2 className="font-sora font-semibold text-[16px] mb-3">
            A2A{"\u3068"}MCP{"\u306e\u9055\u3044"}
          </h2>
          <p>
            MCP{"\uff08Model Context Protocol\uff09\u306fLLM\u3068\u30c4\u30fc\u30eb/\u30c7\u30fc\u30bf\u30bd\u30fc\u30b9\u306e\u63a5\u7d9a\u306b\u7279\u5316\u3057\u305f\u30d7\u30ed\u30c8\u30b3\u30eb\u3067\u3059\u3002\u4e00\u65b9\u3001A2A\u306f\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u540c\u58eb\u306e\u5bfe\u7b49\u306a\u9023\u643a\u306b\u7126\u70b9\u3092\u5f53\u3066\u3066\u3044\u307e\u3059\u3002"}
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-[12px] border border-washi">
              <thead>
                <tr className="bg-kinari-warm">
                  <th className="text-left px-3 py-2 border-b border-washi font-mono text-[10px]" />
                  <th className="text-left px-3 py-2 border-b border-washi font-mono text-[10px]">A2A</th>
                  <th className="text-left px-3 py-2 border-b border-washi font-mono text-[10px]">MCP</th>
                </tr>
              </thead>
              <tbody className="text-fude">
                {[
                  ["\u76ee\u7684", "\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u9593\u9023\u643a", "LLM\u3068\u30c4\u30fc\u30eb\u63a5\u7d9a"],
                  ["\u95a2\u4fc2\u6027", "\u5bfe\u7b49\uff08Peer-to-Peer\uff09", "\u30db\u30b9\u30c8-\u30af\u30e9\u30a4\u30a2\u30f3\u30c8"],
                  ["\u767a\u898b", "Agent Card\u3067\u81ea\u5df1\u5ba3\u8a00", "\u30b5\u30fc\u30d0\u30fc\u304c\u30c4\u30fc\u30eb\u3092\u63d0\u4f9b"],
                  ["\u63d0\u5531\u8005", "Google", "Anthropic"],
                ].map(([label, a2a, mcp]) => (
                  <tr key={label} className="border-b border-washi">
                    <td className="px-3 py-1.5 font-medium text-sumi">{label}</td>
                    <td className="px-3 py-1.5">{a2a}</td>
                    <td className="px-3 py-1.5">{mcp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            {"\u4e21\u30d7\u30ed\u30c8\u30b3\u30eb\u306f\u76f8\u4e92\u88dc\u5b8c\u7684\u306a\u95a2\u4fc2\u306b\u3042\u308a\u3001\u4f75\u7528\u304c\u53ef\u80fd\u3067\u3059\u3002"}
          </p>
        </section>

        <div className="mt-8 p-4 bg-kinari-warm border border-washi rounded-[4px]">
          <p className="font-sora font-semibold text-[13px] text-sumi">
            {"\u4eca\u3059\u3050Agent Card\u3092\u4f5c\u6210"}
          </p>
          <p className="mt-1 text-[12px] text-fude">
            {"\u30d6\u30e9\u30a6\u30b6\u4e0a\u3067\u7c21\u5358\u306bAgent Card\u3092\u751f\u6210\u3067\u304d\u307e\u3059\u3002\u30c7\u30fc\u30bf\u5916\u90e8\u9001\u4fe1\u306a\u3057\u3002"}
          </p>
          <Link
            href="/tools/agent-card"
            className="inline-block mt-3 px-4 py-1.5 bg-shu text-kinari font-sora text-[12px] font-medium rounded-[4px] hover:opacity-90 transition-opacity"
          >
            {"\u30b8\u30a7\u30cd\u30ec\u30fc\u30bf\u30fc\u3092\u958b\u304f"} &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
