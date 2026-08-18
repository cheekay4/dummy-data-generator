import { z } from "zod";
import {
  scopeSchema,
  structureFactsSchema,
  type FmaId,
  type Scope,
  type StructureFacts,
} from "../types/anatomy.js";
import { DataIntegrityError, OutOfScopeError } from "./errors.js";
// JSON は静的インポート（ブラウザ = Vite バンドル / Node = import attributes）。
// メッシュ（anatomy-data）と異なり、層B はアプリ自身の資産なので同梱してよい。
import scopeJson from "../config/scope.json" with { type: "json" };
import musclesJson from "../data/facts/muscles.json" with { type: "json" };
import nervesJson from "../data/facts/nerves.json" with { type: "json" };
import landmarksJson from "../data/facts/landmarks.json" with { type: "json" };
import skeletonJson from "../data/facts/skeleton.json" with { type: "json" };

const scope: Scope = scopeSchema.parse(scopeJson);

const factsList: StructureFacts[] = z
  .array(structureFactsSchema)
  .parse([...musclesJson, ...nervesJson, ...landmarksJson, ...skeletonJson]);

const scopeIds: ReadonlySet<FmaId> = new Set(scope.structures.map((s) => s.fmaId));
const factsById: ReadonlyMap<FmaId, StructureFacts> = new Map(
  factsList.map((f) => [f.fmaId, f])
);

// 起動時整合性チェック: scope ⊆ facts かつ facts ⊆ scope（仕様 §3.1/§9）
for (const id of scopeIds) {
  if (!factsById.has(id))
    throw new DataIntegrityError(`scope.json の ${id} に対応する層B レコードがありません`);
}
for (const f of factsList) {
  if (!scopeIds.has(f.fmaId))
    throw new DataIntegrityError(`層B の ${f.fmaId} が scope.json に含まれていません`);
}

/**
 * 層B 構造事実テーブルの参照（仕様 §2.2）。
 * LLM が出力してよい解剖学的事実は、この関数の返り値からの引用に限る。
 * scope 外の FMA ID は OutOfScopeError を投げる。
 */
export function getStructureFacts(fmaId: FmaId): StructureFacts {
  if (!scopeIds.has(fmaId)) throw new OutOfScopeError(fmaId);
  const facts = factsById.get(fmaId);
  if (facts === undefined) throw new DataIntegrityError(`層B レコード欠落: ${fmaId}`);
  return facts;
}

/** scope の全エントリ（読み取り専用） */
export function listScope(): Scope {
  return scope;
}

/** scope 内の FMA ID 集合（AnatomySource の初期化などに使う） */
export function getScopeIds(): ReadonlySet<FmaId> {
  return scopeIds;
}
