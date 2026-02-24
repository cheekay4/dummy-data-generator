"use client";

type Props = {
  data: Record<string, string>[];
  headers: string[];
};

export function DataPreview({ data, headers }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        左のパネルで項目を選択し、「生成する」ボタンを押してください
      </div>
    );
  }

  const displayData = data.slice(0, 100);

  return (
    <div className="overflow-auto max-h-[600px] border rounded-md">
      <table className="w-full text-sm">
        <thead className="bg-muted sticky top-0">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">#</th>
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, i) => (
            <tr key={i} className="border-t hover:bg-muted/50">
              <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{i + 1}</td>
              {headers.map((h) => (
                <td key={h} className="px-3 py-2 whitespace-nowrap">
                  {row[h] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 100 && (
        <div className="p-3 text-center text-sm text-muted-foreground bg-muted">
          {data.length}件中100件を表示しています。全データはコピー・ダウンロードで取得できます。
        </div>
      )}
    </div>
  );
}
