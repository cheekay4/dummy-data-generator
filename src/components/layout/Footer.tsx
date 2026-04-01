import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer(): JSX.Element {
  return (
    <footer className="border-t border-washi bg-kinari-warm py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="font-sora font-semibold text-[13px] text-sumi">
              agentjuku.com
            </p>
            <p className="mt-1 text-[11px] text-fude">
              A2A エコシステムの道具箱
            </p>
          </div>

          <div className="flex flex-col gap-1.5 text-[11px] text-fude">
            <div className="flex items-center gap-1.5">
              <Shield size={10} className="text-fude-muted" />
              <span>入力データはすべてブラウザ内で処理されます</span>
            </div>
            <span className="font-mono text-[10px] text-fude-muted">
              A2A Protocol v1.0
            </span>
          </div>

          <div className="flex flex-col gap-1.5 text-[11px]">
            <Link
              href="/tools/agent-card"
              className="text-fude hover:text-sumi transition-colors"
            >
              Generator
            </Link>
            <Link
              href="/blog"
              className="text-fude hover:text-sumi transition-colors"
            >
              Blog
            </Link>
            <Link
              href="https://tools24.jp"
              className="text-fude hover:text-sumi transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              tools24.jp &rarr;
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-washi text-[10px] text-fude-muted">
          &copy; {new Date().getFullYear()} agentjuku
        </div>
      </div>
    </footer>
  );
}
