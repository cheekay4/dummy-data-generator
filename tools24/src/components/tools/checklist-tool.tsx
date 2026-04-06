"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { documents, type DocumentItem } from "@/lib/data/documents";
import { loadTaxData, loadFurusatoDonations } from "@/lib/storage";

const CHECKLIST_STORAGE_KEY = "kakutei-tools-checklist";
const SITUATIONS_STORAGE_KEY = "kakutei-tools-situations";

const SITUATION_OPTIONS = [
  { id: "employee", label: "会社員・公務員である" },
  { id: "part_time", label: "パート・アルバイトの収入がある" },
  { id: "side_job", label: "副業の収入がある" },
  { id: "medical", label: "医療費控除を受ける" },
  { id: "furusato", label: "ふるさと納税をした" },
  { id: "life_insurance", label: "生命保険料控除を受ける" },
  { id: "housing_loan", label: "住宅ローン控除を受ける（1年目）" },
  { id: "retired", label: "年の途中で退職した" },
];

interface StoredData {
  situations: string[];
  checked: Record<string, boolean>;
}

function loadStoredData(): StoredData {
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { situations: [], checked: {} };
}

function saveStoredData(data: StoredData) {
  try {
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function detectSituationsFromStorage(): { situations: string[]; detected: boolean } {
  const data = loadTaxData();
  const donations = loadFurusatoDonations();
  const situations: string[] = [];

  if (data.salary && data.salary > 0) {
    situations.push("employee");
  }
  if (data.needsFiling) {
    if (data.sideJobIncome && data.sideJobIncome > 0) {
      situations.push("side_job");
    } else {
      situations.push("retired");
    }
  }
  if (data.medicalDeduction && data.medicalDeduction > 0) {
    situations.push("medical");
  }
  if ((data.furusatoLimit && data.furusatoLimit > 0) || donations.length > 0) {
    situations.push("furusato");
  }
  if (data.lifeInsuranceDeduction && data.lifeInsuranceDeduction > 0) {
    situations.push("life_insurance");
  }
  if (data.housingLoanDeduction && data.housingLoanDeduction > 0) {
    situations.push("housing_loan");
  }

  return { situations, detected: situations.length > 0 };
}

function getSituationLabel(id: string): string {
  return SITUATION_OPTIONS.find((s) => s.id === id)?.label ?? id;
}

function getSituationSummary(id: string): string {
  const data = loadTaxData();
  if (id === "employee" && data.salary) {
    return `年収: ${Math.round(data.salary / 10000)}万円`;
  }
  if (id === "medical" && data.medicalDeduction !== undefined) {
    return `控除額: ${data.medicalDeduction.toLocaleString()}円`;
  }
  return "";
}

const CATEGORY_LABELS: Record<DocumentItem["category"], string> = {
  basic: "基本書類（全員必要）",
  income: "収入に関する書類",
  deduction: "控除に関する書類",
  other: "その他",
};

const CATEGORY_ORDER: DocumentItem["category"][] = ["basic", "income", "deduction", "other"];

export function ChecklistTool() {
  const [situations, setSituations] = useState<string[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [detectedSituations, setDetectedSituations] = useState<string[]>([]);
  const [isDetected, setIsDetected] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = loadStoredData();
    const { situations: detected, detected: hasDetected } = detectSituationsFromStorage();

    if (stored.situations.length > 0) {
      setSituations(stored.situations);
      setChecked(stored.checked);
    } else if (hasDetected) {
      setSituations(detected);
      setIsDetected(true);
      setDetectedSituations(detected);
    }
  }, []);

  const toggleSituation = (id: string) => {
    setSituations((prev) => {
      const next = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id];
      const newData = { situations: next, checked };
      saveStoredData(newData);
      return next;
    });
  };

  const toggleChecked = (docId: string) => {
    setChecked((prev) => {
      const next = { ...prev, [docId]: !prev[docId] };
      saveStoredData({ situations, checked: next });
      return next;
    });
  };

  // 状況に応じて表示する書類をフィルタリング
  const filteredDocs = useMemo(() => {
    if (situations.length === 0) return [];
    return documents.filter(
      (doc) =>
        doc.requiredFor.includes("all") ||
        doc.requiredFor.some((r) => situations.includes(r))
    );
  }, [situations]);

  // カテゴリ別にグループ化
  const grouped = useMemo(() => {
    const map: Record<string, DocumentItem[]> = {};
    for (const cat of CATEGORY_ORDER) {
      const items = filteredDocs.filter((d) => d.category === cat);
      if (items.length > 0) map[cat] = items;
    }
    return map;
  }, [filteredDocs]);

  const totalCount = filteredDocs.length;
  const checkedCount = filteredDocs.filter((d) => checked[d.id]).length;

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      {/* ステップ1: 状況選択 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ステップ1: あなたの状況を選択</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isDetected && detectedSituations.length > 0 && (
            <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-sm">
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-2">
                入力済みのデータから、以下の状況を検出しました
              </p>
              <ul className="space-y-1">
                {detectedSituations.map((id) => {
                  const summary = getSituationSummary(id);
                  return (
                    <li key={id} className="text-blue-600 dark:text-blue-400">
                      ✅ {getSituationLabel(id)}
                      {summary && <span className="text-xs ml-1">（{summary}）</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SITUATION_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors ${
                  situations.includes(opt.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={situations.includes(opt.id)}
                  onChange={() => toggleSituation(opt.id)}
                  className="accent-primary"
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ステップ2: チェックリスト */}
      {filteredDocs.length > 0 && (
        <div className="space-y-6">
          {/* プログレスバー */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">準備できた書類</span>
              <span className="text-muted-foreground">
                {checkedCount} / {totalCount}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all"
                style={{
                  width: totalCount > 0 ? `${(checkedCount / totalCount) * 100}%` : "0%",
                }}
              />
            </div>
          </div>

          {/* カテゴリ別書類リスト */}
          {CATEGORY_ORDER.filter((cat) => grouped[cat]).map((cat) => (
            <Card key={cat}>
              <CardHeader>
                <CardTitle className="text-base">{CATEGORY_LABELS[cat]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {grouped[cat].map((doc) => (
                  <label
                    key={doc.id}
                    className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                      checked[doc.id]
                        ? "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checked[doc.id]}
                      onChange={() => toggleChecked(doc.id)}
                      className="accent-primary mt-0.5 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className={`text-sm font-medium ${checked[doc.id] ? "line-through text-muted-foreground" : ""}`}>
                        {doc.name}
                        {doc.important && (
                          <span className="ml-1 text-xs text-red-500">必須</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {doc.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        📍 {doc.howToGet}
                      </p>
                    </div>
                  </label>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {situations.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center text-muted-foreground text-sm py-12">
            状況を選択すると、必要な書類が表示されます
          </CardContent>
        </Card>
      )}
    </div>
  );
}
