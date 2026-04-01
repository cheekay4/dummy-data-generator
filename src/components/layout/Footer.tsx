import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.1)] bg-[#0A0A0A] py-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="font-sora font-bold text-[16px] text-white">
              agentjuku
            </p>
            <p className="mt-2 text-[13px] text-[rgba(255,255,255,0.5)]">
              A2A Agent Cardの作成と検証を、ブラウザで完結。
            </p>
          </div>

          <div className="flex flex-col gap-2 text-[13px] text-[rgba(255,255,255,0.5)]">
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-[rgba(255,255,255,0.3)]" />
              <span>入力データはすべてブラウザ内で処理されます</span>
            </div>
            <span className="font-mono text-[11px] text-[rgba(255,255,255,0.3)]">
              A2A Protocol v1.0
            </span>
          </div>

          <div className="flex gap-8 text-[13px]">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[rgba(255,255,255,0.3)] mb-1">
                Links
              </span>
              <Link
                href="/tools/agent-card"
                className="text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
              >
                Generator
              </Link>
              <Link
                href="/blog"
                className="text-[rgba(255,255,255,0.5)] hover:text-white transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[11px] text-[rgba(255,255,255,0.3)]">
            &copy; {new Date().getFullYear()} agentjuku. Open source and free to use.
          </span>
          <span className="text-[11px] text-[rgba(255,255,255,0.3)]">
            ❤ Made with care in Japan
          </span>
        </div>
      </div>
    </footer>
  );
}
