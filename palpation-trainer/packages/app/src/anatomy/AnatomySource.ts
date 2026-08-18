import { z } from "zod";
import {
  fmaIdSchema,
  structureCategorySchema,
  type FmaId,
} from "../types/anatomy.js";
import { OutOfScopeError } from "../facts/errors.js";

/** メッシュ1ファイルへの参照（座標系は BodyParts3D ネイティブ Z-up/mm。DECISIONS.md D-003） */
export const meshRefSchema = z.strictObject({
  file: z.string().min(1),
  bp3dConcept: z.string(),
  bp3dConceptName: z.string(),
  side: z.enum(["left", "right", "both"]),
});
export type MeshRef = z.infer<typeof meshRefSchema>;

export const manifestSchema = z.object({
  license: z.string(),
  attribution: z.string(),
  structures: z.record(
    z.string(),
    z.object({
      en: z.string(),
      category: structureCategorySchema,
      files: z.array(meshRefSchema),
    })
  ),
});
export type AnatomyManifest = z.infer<typeof manifestSchema>;

/**
 * データ層の抽象化（仕様 §2.1）。
 * アプリはこのインターフェース経由でのみメッシュを参照し、
 * 将来 BioDigital 等の商用データへ差し替え可能にする。
 */
export interface AnatomySource {
  /** 構造のメッシュ参照を返す。scope 外は OutOfScopeError */
  getMeshes(fmaId: FmaId): MeshRef[];
  /** メッシュファイルの取得先 URL を解決する */
  resolveUrl(file: string): string;
  /** メッシュを持つ構造の FMA ID 一覧（scope 内のみ） */
  listMeshStructures(): FmaId[];
  /** 帰属表示文（UI のクレジット表記に使用） */
  attributionText(): string;
}

/**
 * packages/anatomy-data の dist/manifest.json を実行時ロードするローカル実装。
 * manifest はビルドに同梱せず、コンストラクタで実行時に注入する（仕様 §2.1）。
 * scope 外の構造は manifest に含まれていてもロードしない（仕様 §3.1/§9）。
 */
export class Bp3dManifestSource implements AnatomySource {
  private readonly meshesById = new Map<FmaId, MeshRef[]>();
  private readonly manifest: AnatomyManifest;

  constructor(
    manifestJson: unknown,
    private readonly baseUrl: string,
    scopeIds: ReadonlySet<FmaId>
  ) {
    this.manifest = manifestSchema.parse(manifestJson);
    for (const [id, entry] of Object.entries(this.manifest.structures)) {
      const fmaId = fmaIdSchema.parse(id);
      if (!scopeIds.has(fmaId)) continue; // scope 外はロードしない
      this.meshesById.set(fmaId, entry.files);
    }
  }

  getMeshes(fmaId: FmaId): MeshRef[] {
    const meshes = this.meshesById.get(fmaId);
    if (meshes === undefined) throw new OutOfScopeError(fmaId);
    return meshes;
  }

  resolveUrl(file: string): string {
    return `${this.baseUrl.replace(/\/$/, "")}/${file}`;
  }

  listMeshStructures(): FmaId[] {
    return [...this.meshesById.keys()];
  }

  attributionText(): string {
    return `${this.manifest.attribution} (${this.manifest.license})`;
  }
}
