export function EraTable() {
  const rows = [
    { era: '令和', start: '2019年5月1日', end: '現在', period: '継続中' },
    { era: '平成', start: '1989年1月8日', end: '2019年4月30日', period: '30年3ヶ月' },
    { era: '昭和', start: '1926年12月25日', end: '1989年1月7日', period: '64年' },
    { era: '大正', start: '1912年7月30日', end: '1926年12月24日', period: '15年' },
    { era: '明治', start: '1868年1月25日', end: '1912年7月29日', period: '45年' },
  ];

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-4">和暦早見表</h2>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">元号</th>
              <th className="px-4 py-3 text-left font-medium">開始</th>
              <th className="px-4 py-3 text-left font-medium">終了</th>
              <th className="px-4 py-3 text-left font-medium">期間</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.era} className="border-t hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-semibold">{row.era}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.start}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.end}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        ※ 昭和64年は1989年1月1日〜1月7日の7日間のみ。平成31年は2019年4月30日まで。
      </p>
    </section>
  );
}
