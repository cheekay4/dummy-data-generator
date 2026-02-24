export function TrustBadges() {
  const badges = [
    { icon: "🔒", label: "サーバー送信なし" },
    { icon: "💻", label: "ブラウザ内で完結" },
    { icon: "✨", label: "登録不要で使える" },
  ];
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {badges.map((b) => (
        <span
          key={b.label}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs font-medium border border-green-200 dark:border-green-800"
        >
          {b.icon} {b.label}
        </span>
      ))}
    </div>
  );
}
