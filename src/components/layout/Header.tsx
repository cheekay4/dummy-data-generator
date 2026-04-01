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
      {/* Top accent bar with gradient */}
      <div className="h-[6px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D84835] via-[#D4AF37] to-[#1E4D7B]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
      </div>
      <header className="border-b border-[#e5e5e5] bg-[rgba(255,255,255,0.9)] backdrop-blur-xl shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-[74px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-[14px] blur-xl opacity-50"
                  style={{ background: "linear-gradient(135deg, #1E4D7B, #D84835)" }}
                />
                <div
                  className="relative flex items-center justify-center w-12 h-12 rounded-[14px] shadow-lg"
                  style={{ background: "linear-gradient(135deg, #1E4D7B, #D84835)" }}
                >
                  <span className="text-white text-lg font-bold">塾</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span
                    className="font-sora font-bold text-[20px] tracking-[-0.5px] bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(160deg, #171717, #004e89)" }}
                  >
                    agentjuku
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-lg text-white font-mono font-bold text-[9px] uppercase tracking-wider shadow-sm"
                    style={{ background: "linear-gradient(150deg, #ff6b35, #ffb627)" }}
                  >
                    BETA
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="text-[#737373]">Agent Card</span>
                  {breadcrumb && (
                    <>
                      <span className="text-[#d4d4d4]">/</span>
                      <span className="text-[#ff6b35] font-semibold">{breadcrumb}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-1 ml-6">
              <Link
                href="/tools/agent-card"
                className="px-3 py-1.5 font-sora text-[13px] font-semibold text-[#404040] rounded-lg hover:bg-[#f5f5f5] transition-colors"
              >
                Generator
              </Link>
              <Link
                href="/tools/agent-card"
                className="px-3 py-1.5 font-sora text-[13px] text-[#737373] rounded-lg hover:bg-[#f5f5f5] transition-colors"
              >
                Validator
              </Link>
              <Link
                href="/blog"
                className="px-3 py-1.5 font-sora text-[13px] text-[#737373] rounded-lg hover:bg-[#f5f5f5] transition-colors"
              >
                Docs
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-2 border border-[#d4d4d4] rounded-[10px] bg-[#fafafa] text-[#a3a3a3] text-[13px] font-mono cursor-default">
              <Search size={16} />
              <span>Search</span>
              <kbd className="ml-3 px-1.5 py-0.5 text-[10px] bg-white border border-[#e5e5e5] rounded font-mono font-semibold">
                ⌘K
              </kbd>
            </div>
            {actions}
          </div>
        </div>
      </header>
    </>
  );
}
