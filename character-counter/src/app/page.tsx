import { CharacterCounter } from "@/components/character-counter";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">文字数カウンター</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            リアルタイムで文字数・単語数・行数をカウント
          </p>
        </div>
        <ThemeToggle />
      </header>

      <main>
        <CharacterCounter />
      </main>

      <footer className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
        <p>無料オンライン文字数カウントツール</p>
      </footer>
    </div>
  );
}
