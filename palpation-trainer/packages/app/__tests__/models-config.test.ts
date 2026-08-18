import { describe, expect, it } from "vitest";
import { MODEL_ROLES } from "../src/config/models.js";

describe("モデル設定（仕様 §2.5）", () => {
  it("実行時パス（patientActor / examiner）に Fable / Opus を使わない", () => {
    expect(MODEL_ROLES.patientActor).not.toMatch(/fable|opus/i);
    expect(MODEL_ROLES.examiner).not.toMatch(/fable|opus/i);
  });

  it("全ロールが環境変数で上書き可能な形で定義されている", () => {
    expect(MODEL_ROLES.patientActor).toBeTruthy();
    expect(MODEL_ROLES.examiner).toBeTruthy();
    expect(MODEL_ROLES.contentGeneration).toBeTruthy();
  });
});
