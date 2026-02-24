export function toCsv(data: Record<string, string>[], headers: string[]): string {
  const escapeCsv = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const lines: string[] = [];
  lines.push(headers.map(escapeCsv).join(","));
  for (const row of data) {
    lines.push(headers.map((h) => escapeCsv(row[h] ?? "")).join(","));
  }
  return lines.join("\n");
}
