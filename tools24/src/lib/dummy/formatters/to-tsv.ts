export function toTsv(data: Record<string, string>[], headers: string[]): string {
  const escapeTsv = (val: string) => val.replace(/\t/g, " ").replace(/\n/g, " ");

  const lines: string[] = [];
  lines.push(headers.map(escapeTsv).join("\t"));
  for (const row of data) {
    lines.push(headers.map((h) => escapeTsv(row[h] ?? "")).join("\t"));
  }
  return lines.join("\n");
}
