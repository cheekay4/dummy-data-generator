"use client";
import Link from "next/link";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
          tools24.jp
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
