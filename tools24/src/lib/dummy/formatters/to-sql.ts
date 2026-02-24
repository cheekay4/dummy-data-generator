export function toSql(
  data: Record<string, string>[],
  headers: string[],
  tableName: string = "dummy_data"
): string {
  const escapeSql = (val: string) => val.replace(/'/g, "''");

  const sanitizedTable = tableName.replace(/[^a-zA-Z0-9_]/g, "_");

  const lines: string[] = [];

  // CREATE TABLE statement
  lines.push(`CREATE TABLE IF NOT EXISTS ${sanitizedTable} (`);
  lines.push(`  id SERIAL PRIMARY KEY,`);
  const colDefs = headers.map((h) => {
    const colName = h.replace(/[^a-zA-Z0-9_\u3000-\u9fff]/g, "_");
    return `  ${colName} TEXT`;
  });
  lines.push(colDefs.join(",\n"));
  lines.push(`);\n`);

  // INSERT statements
  const colNames = headers
    .map((h) => h.replace(/[^a-zA-Z0-9_\u3000-\u9fff]/g, "_"))
    .join(", ");

  for (const row of data) {
    const values = headers
      .map((h) => `'${escapeSql(row[h] ?? "")}'`)
      .join(", ");
    lines.push(`INSERT INTO ${sanitizedTable} (${colNames}) VALUES (${values});`);
  }

  return lines.join("\n");
}
