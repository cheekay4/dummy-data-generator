interface ToolHeroProps {
  title: string;
  tagline: string;
  description: string;
}

export function ToolHero({ title, tagline, description }: ToolHeroProps): React.ReactElement {
  return (
    <div className="mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
      <p className="text-base text-blue-600 dark:text-blue-400 font-medium mt-1">{tagline}</p>
      <p className="text-sm text-muted-foreground mt-2">{description}</p>
      <p className="text-xs text-muted-foreground mt-2">
        登録不要 · 完全無料 · データ送信なし
      </p>
    </div>
  );
}
