import { estimateSessionCost } from "../src/llm/cost.js";
for (const id of ["case-01-supraspinatus-tendinopathy", "case-06-thrower-posterior"]) {
  const e = estimateSessionCost(id);
  console.log(
    id,
    "→ 患者", e.patientJpy.toFixed(2), "円 + 講評", e.debriefJpy.toFixed(2),
    "円 = 合計", e.totalJpy.toFixed(2), "円"
  );
  console.log("  detail:", JSON.stringify(e.detail));
}
