"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Trash2, Pencil, Check, X, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  saveFurusatoDonations,
  loadFurusatoDonations,
  loadTaxData,
  type FurusatoDonation,
} from "@/lib/storage";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function fmt(n: number) {
  return n.toLocaleString("ja-JP");
}

const ONESTOP_LABELS = {
  applied: "✅ 申請済",
  not_applied: "❌ 未申請",
  not_needed: "— 不要",
} as const;

const CERTIFICATE_LABELS = {
  received: "✅ 受領済",
  not_received: "❌ 未受領",
} as const;

const DEFAULT_FORM: Omit<FurusatoDonation, "id"> = {
  date: new Date().toISOString().slice(0, 10),
  municipality: "",
  amount: 0,
  returnGift: "",
  onestop: "not_applied",
  certificate: "not_received",
};

export function FurusatoTracker() {
  const [donations, setDonations] = useState<FurusatoDonation[]>([]);
  const [furusatoLimit, setFurusatoLimit] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<Omit<FurusatoDonation, "id">>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<FurusatoDonation, "id">>(DEFAULT_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const stored = loadFurusatoDonations();
    setDonations(stored);
    const taxData = loadTaxData();
    if (taxData.furusatoLimit && taxData.furusatoLimit > 0) {
      setFurusatoLimit(taxData.furusatoLimit);
    }
  }, []);

  const save = (next: FurusatoDonation[]) => {
    setDonations(next);
    saveFurusatoDonations(next);
  };

  const handleAdd = () => {
    if (!form.municipality || form.amount <= 0) return;
    const next = [...donations, { ...form, id: generateId() }];
    save(next);
    setForm(DEFAULT_FORM);
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    save(donations.filter((d) => d.id !== id));
    setDeleteConfirmId(null);
  };

  const handleEditSave = (id: string) => {
    save(donations.map((d) => (d.id === id ? { ...editForm, id } : d)));
    setEditingId(null);
  };

  const totalAmount = useMemo(
    () => donations.reduce((sum, d) => sum + d.amount, 0),
    [donations]
  );

  const selfBurden = useMemo(() => {
    if (furusatoLimit === null) return null;
    return totalAmount <= furusatoLimit ? 2000 : totalAmount - furusatoLimit + 2000;
  }, [totalAmount, furusatoLimit]);

  const uniqueMunicipalities = useMemo(
    () => new Set(donations.map((d) => d.municipality)).size,
    [donations]
  );

  const appliedCount = donations.filter((d) => d.onestop === "applied").length;
  const receivedCount = donations.filter((d) => d.certificate === "received").length;
  const isOver6 = uniqueMunicipalities >= 6;

  // CSVダウンロード
  const handleCsvDownload = () => {
    const header = "寄附日,自治体名,金額,返礼品,ワンストップ,証明書\n";
    const rows = donations
      .map(
        (d) =>
          `${d.date},${d.municipality},${d.amount},${d.returnGift ?? ""},${d.onestop},${d.certificate}`
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "furusato-donations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // e-Tax転記用メモ
  const [showMemo, setShowMemo] = useState(false);

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      {/* 控除上限との比較 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">控除上限額との比較</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {furusatoLimit !== null ? (
            <>
              <div className="flex justify-between text-sm">
                <span>寄附合計: <strong className="tabular-nums">{fmt(totalAmount)}円</strong></span>
                <span>上限: <strong className="tabular-nums">{fmt(furusatoLimit)}円</strong></span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    totalAmount > furusatoLimit ? "bg-red-500" : "bg-primary"
                  }`}
                  style={{
                    width: furusatoLimit > 0
                      ? `${Math.min(100, (totalAmount / furusatoLimit) * 100)}%`
                      : "0%",
                  }}
                />
              </div>
              {totalAmount <= furusatoLimit ? (
                <p className="text-sm text-green-600 dark:text-green-400">
                  残り寄附可能額: <strong className="tabular-nums">{fmt(furusatoLimit - totalAmount)}円</strong>
                </p>
              ) : (
                <p className="text-sm text-red-600 dark:text-red-400">
                  上限を<strong className="tabular-nums">{fmt(totalAmount - furusatoLimit)}円</strong>超えています
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              控除上限額が未計算です。
              <Link href="/furusato" className="text-primary hover:underline ml-1">
                上限額を計算する →
              </Link>
            </p>
          )}
        </CardContent>
      </Card>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "寄附件数", value: `${donations.length}件` },
          { label: "寄附合計額", value: `${fmt(totalAmount)}円` },
          { label: "自己負担額（目安）", value: selfBurden !== null ? `${fmt(selfBurden)}円` : "—" },
          { label: "ワンストップ申請", value: `${appliedCount}/${donations.length}件` },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-lg font-bold tabular-nums mt-1">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 6自治体以上の警告 */}
      {isOver6 && (
        <div className="p-4 rounded-lg border-2 border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-950/30">
          <p className="text-sm font-bold text-orange-700 dark:text-orange-400">
            ⚠ ワンストップ特例は使えません
          </p>
          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            {uniqueMunicipalities}自治体に寄附しているため、全ての寄附分をまとめて確定申告する必要があります（ワンストップ申請済みの分も含む）。
          </p>
        </div>
      )}

      {/* 寄附一覧テーブル */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">寄附一覧</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCsvDownload} disabled={donations.length === 0}>
                CSVダウンロード
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowMemo((v) => !v)} disabled={donations.length === 0}>
                確定申告用メモ
              </Button>
              <Button size="sm" onClick={() => setShowAddForm((v) => !v)}>
                <Plus className="h-4 w-4 mr-1" />
                追加
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* e-Tax転記用メモ */}
          {showMemo && donations.length > 0 && (
            <div className="mb-4 p-3 rounded-md bg-muted text-xs font-mono space-y-1">
              <p className="font-semibold text-sm mb-2">e-Tax 寄附金控除 転記用メモ</p>
              {donations.map((d) => (
                <p key={d.id}>
                  {d.date} | {d.municipality} | {fmt(d.amount)}円
                </p>
              ))}
              <p className="mt-2 font-semibold">合計: {fmt(totalAmount)}円</p>
            </div>
          )}

          {/* 追加フォーム */}
          {showAddForm && (
            <div className="mb-4 p-4 border rounded-lg space-y-3 bg-muted/30">
              <p className="text-sm font-semibold">新規追加</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">寄附日</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">自治体名 *</Label>
                  <Input
                    placeholder="例: 北海道紋別市"
                    value={form.municipality}
                    onChange={(e) => setForm((f) => ({ ...f, municipality: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">寄附金額 *</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min={0}
                      value={form.amount || ""}
                      onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                      className="text-sm"
                      placeholder="10000"
                    />
                    <span className="text-sm text-muted-foreground">円</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">返礼品メモ</Label>
                  <Input
                    placeholder="例: ホタテ"
                    value={form.returnGift ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, returnGift: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">ワンストップ特例</Label>
                  <Select
                    value={form.onestop}
                    onValueChange={(v) => setForm((f) => ({ ...f, onestop: v as FurusatoDonation["onestop"] }))}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="applied">申請済</SelectItem>
                      <SelectItem value="not_applied">未申請</SelectItem>
                      <SelectItem value="not_needed">不要</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">証明書</Label>
                  <Select
                    value={form.certificate}
                    onValueChange={(v) => setForm((f) => ({ ...f, certificate: v as FurusatoDonation["certificate"] }))}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received">受領済</SelectItem>
                      <SelectItem value="not_received">未受領</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <Button size="sm" onClick={handleAdd} disabled={!form.municipality || form.amount <= 0}>
                  追加する
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
                  キャンセル
                </Button>
              </div>
            </div>
          )}

          {donations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              寄附記録がありません。「追加」ボタンから入力してください。
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground text-xs">
                    <th className="text-left py-2 pr-2">寄附日</th>
                    <th className="text-left py-2 pr-2">自治体名</th>
                    <th className="text-right py-2 pr-2">金額</th>
                    <th className="text-left py-2 pr-2 hidden md:table-cell">返礼品</th>
                    <th className="text-center py-2 pr-2">ワンストップ</th>
                    <th className="text-center py-2 pr-2">証明書</th>
                    <th className="text-center py-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) =>
                    editingId === d.id ? (
                      <tr key={d.id} className="border-b bg-muted/30">
                        <td className="py-2 pr-2">
                          <Input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                            className="text-xs h-7 w-28"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <Input
                            value={editForm.municipality}
                            onChange={(e) => setEditForm((f) => ({ ...f, municipality: e.target.value }))}
                            className="text-xs h-7"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <Input
                            type="number"
                            min={0}
                            value={editForm.amount}
                            onChange={(e) => setEditForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                            className="text-xs h-7 w-24 text-right"
                          />
                        </td>
                        <td className="py-2 pr-2 hidden md:table-cell">
                          <Input
                            value={editForm.returnGift ?? ""}
                            onChange={(e) => setEditForm((f) => ({ ...f, returnGift: e.target.value }))}
                            className="text-xs h-7"
                          />
                        </td>
                        <td className="py-2 pr-2">
                          <Select
                            value={editForm.onestop}
                            onValueChange={(v) => setEditForm((f) => ({ ...f, onestop: v as FurusatoDonation["onestop"] }))}
                          >
                            <SelectTrigger className="text-xs h-7 w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="applied">申請済</SelectItem>
                              <SelectItem value="not_applied">未申請</SelectItem>
                              <SelectItem value="not_needed">不要</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-2 pr-2">
                          <Select
                            value={editForm.certificate}
                            onValueChange={(v) => setEditForm((f) => ({ ...f, certificate: v as FurusatoDonation["certificate"] }))}
                          >
                            <SelectTrigger className="text-xs h-7 w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="received">受領済</SelectItem>
                              <SelectItem value="not_received">未受領</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-2 text-center">
                          <div className="flex gap-1 justify-center">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEditSave(d.id)}>
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setEditingId(null)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={d.id} className="border-b last:border-0">
                        <td className="py-2 pr-2 text-xs tabular-nums">{d.date}</td>
                        <td className="py-2 pr-2">{d.municipality}</td>
                        <td className="py-2 pr-2 text-right tabular-nums">{fmt(d.amount)}円</td>
                        <td className="py-2 pr-2 text-xs text-muted-foreground hidden md:table-cell">
                          {d.returnGift || "—"}
                        </td>
                        <td className="py-2 pr-2 text-center text-xs">{ONESTOP_LABELS[d.onestop]}</td>
                        <td className="py-2 pr-2 text-center text-xs">{CERTIFICATE_LABELS[d.certificate]}</td>
                        <td className="py-2 text-center">
                          <div className="flex gap-1 justify-center">
                            {deleteConfirmId === d.id ? (
                              <>
                                <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => handleDelete(d.id)}>
                                  <Check className="h-3 w-3" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setDeleteConfirmId(null)}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setEditingId(d.id);
                                    setEditForm({ date: d.date, municipality: d.municipality, amount: d.amount, returnGift: d.returnGift, onestop: d.onestop, certificate: d.certificate });
                                  }}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setDeleteConfirmId(d.id)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t font-semibold">
                    <td colSpan={2} className="py-2 pr-2">合計</td>
                    <td className="py-2 pr-2 text-right tabular-nums">{fmt(totalAmount)}円</td>
                    <td colSpan={4} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 証明書受領状況 */}
      {donations.length > 0 && (
        <div className="text-sm text-muted-foreground">
          証明書受領状況: {receivedCount}/{donations.length}件受領済
        </div>
      )}
    </div>
  );
}
