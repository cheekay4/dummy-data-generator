#!/usr/bin/env node
/**
 * Wikidata SPARQL から解剖学用語（ja/en/la + FMA/TA98/TA2）を取得し
 * src/data/wikidata-terms.raw.json に保存する。Wikidata 構造化データは CC0。
 * structure-facts.json の nameJa/nameEn/nameLa の出典（provenance）として使う。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ENDPOINT = "https://query.wikidata.org/sparql";
const UA = "palpation-trainer/0.1 (educational anatomy tool; contact via repo)";

async function run(rqFile) {
  const query = readFileSync(join(HERE, rqFile), "utf8");
  const res = await fetch(`${ENDPOINT}?query=${encodeURIComponent(query)}&format=json`, {
    headers: { "User-Agent": UA, Accept: "application/sparql-results+json" },
  });
  if (!res.ok) throw new Error(`${rqFile}: HTTP ${res.status}`);
  const json = await res.json();
  return json.results.bindings.map((b) =>
    Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v.value]))
  );
}

const byFma = await run("terms-by-fma.rq");
const byLabel = await run("terms-by-label.rq");
const out = {
  fetchedAt: new Date().toISOString(),
  source: "Wikidata SPARQL (structured data: CC0)",
  byFma,
  byLabel,
};
const dest = join(HERE, "..", "src", "data", "wikidata-terms.raw.json");
writeFileSync(dest, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(`byFma: ${byFma.length} rows / byLabel: ${byLabel.length} rows -> ${dest}`);
