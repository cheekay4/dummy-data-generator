import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { Bp3dManifestSource } from "../src/anatomy/AnatomySource.js";
import { OutOfScopeError } from "../src/facts/errors.js";
import { getScopeIds, listScope } from "../src/facts/getStructureFacts.js";

const manifestPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..", "..", "anatomy-data", "dist", "manifest.json"
);

// dist は CI で `npm run data:download && npm run data:convert` により生成される
describe.skipIf(!existsSync(manifestPath))("Bp3dManifestSource（仕様 §2.1 / §9）", () => {
  const manifest: unknown = JSON.parse(readFileSync(manifestPath, "utf8"));
  const source = new Bp3dManifestSource(manifest, "/anatomy/", getScopeIds());

  it("hasMesh=true の全 scope 構造にメッシュがある", () => {
    for (const s of listScope().structures.filter((s) => s.hasMesh)) {
      const meshes = source.getMeshes(s.fmaId);
      expect(meshes.length, s.nameEn).toBeGreaterThan(0);
    }
  });

  it("ロードされた構造はすべて scope 内（scope 外はロードされない）", () => {
    const scopeIds = getScopeIds();
    for (const id of source.listMeshStructures()) {
      expect(scopeIds.has(id)).toBe(true);
    }
  });

  it("scope 外の構造をクエリすると OutOfScopeError", () => {
    expect(() => source.getMeshes("FMA22314")).toThrow(OutOfScopeError);
  });

  it("scope 外の構造が manifest にあってもロードしない", () => {
    const tampered = structuredClone(manifest) as {
      structures: Record<string, { en: string; category: string; files: unknown[] }>;
    };
    tampered.structures["FMA22314"] = { en: "gluteus maximus", category: "muscle", files: [] };
    const s2 = new Bp3dManifestSource(tampered, "/anatomy/", getScopeIds());
    expect(() => s2.getMeshes("FMA22314")).toThrow(OutOfScopeError);
  });

  it("帰属表示文に BodyParts3D と CC BY 4.0 を含む", () => {
    expect(source.attributionText()).toContain("BodyParts3D");
    expect(source.attributionText()).toContain("CC BY 4.0");
  });
});
