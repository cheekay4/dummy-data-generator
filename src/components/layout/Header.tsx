"use client";

import Link from "next/link";
import { Search } from "lucide-react";

interface HeaderProps {
  breadcrumb?: string;
  actions?: React.ReactNode;
}

export function Header({ breadcrumb, actions }: HeaderProps): JSX.Element {
  return (
    <>
      <div className="h-[2px] bg-shu" />
      <header className="border-b border-washi bg-kinari">
        <div className="max-w-[1400px] mx-auto px-4 h-11 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 font-sora font-semibold text-[13px] text-sumi tracking-tight"
            >
              <span className="text-fude text-[14px]">{"\u587E"}</span>
              <span>agentjuku</span>
            </Link>
            {breadcrumb && (
              <>
                <span className="text-fude-dim text-[11px]">/</span>
                <span className="font-sora text-[11px] text-fude">
                  {breadcrumb}
                </span>
              </>
            )}

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-3 ml-4">
              <Link
                href="/tools/agent-card"
                className="font-sora text-[11px] text-fude hover:text-sumi transition-colors"
              >
                Tools
              </Link>
              <Link
                href="/blog"
                className="font-sora text-[11px] text-fude hover:text-sumi transition-colors"
              >
                Blog
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 border border-washi rounded-[4px] bg-kinari-surface text-fude-light text-[11px] font-sora cursor-default">
              <Search size={12} />
              <span>search</span>
              <kbd className="ml-2 px-1 py-0.5 text-[9px] bg-washi-light border border-washi rounded-[2px] font-mono">
                Ctrl K
              </kbd>
            </div>
            {actions}
          </div>
        </div>
      </header>
    </>
  );
}
